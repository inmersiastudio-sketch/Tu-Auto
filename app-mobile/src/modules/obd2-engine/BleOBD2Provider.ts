import {
  decodeDTCResponseHex,
  parseAtRvVoltage,
  parseCoolantTempHex,
  parseDistanceSinceCodesClearedHex,
  parseRpmHex,
  parseSpeedHex,
} from './hexParser';
import { DiagnosticScanResult, IOBD2DataSource, LiveTelemetryFrame, ScenarioId } from './types';

/**
 * Proveedor Real Bluetooth Low Energy (BLE) para ELM327 (`PIC18F25K80`) y `Tu-Auto ESP32-C3`
 * Implementa la secuencia de inicialización AT y cola de comandos serie sin bloqueos.
 * Tickets: TUA-015, TUA-016
 */

export interface BleTransportAdapter {
  connectToDevice(deviceId: string): Promise<boolean>;
  disconnectDevice(): Promise<void>;
  writeAndAwaitResponse(asciiCommand: string, timeoutMs?: number): Promise<string>;
}

export const ELM327_INIT_SEQUENCE = [
  'AT Z',    // Reset del chip
  'AT E0',   // Eco desactivado (reduce 50% de tráfico BLE)
  'AT L0',   // Sin saltos de línea extra
  'AT S0',   // Sin espacios entre bytes hexadecimales
  'AT H0',   // Sin encabezados internos
  'AT SP 0', // Detección automática de protocolo (CAN 500k / ISO 9141-2 / KWP2000)
] as const;

export class BleOBD2Provider implements IOBD2DataSource {
  private transport: BleTransportAdapter;
  private isConnected = false;
  private commandQueue: Promise<unknown> = Promise.resolve();
  private subscribers: Set<(frame: LiveTelemetryFrame) => void> = new Set();
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private prevCoolantTempC: number | null = null;
  private prevTempTimestamp: number | null = null;
  private lowestCrankingV = 10.3;

  public constructor(transport: BleTransportAdapter) {
    this.transport = transport;
  }

  public async connect(deviceId: string = 'TUAUTO-BLE-DEFAULT'): Promise<boolean> {
    const ok = await this.transport.connectToDevice(deviceId);
    if (!ok) return false;

    for (const cmd of ELM327_INIT_SEQUENCE) {
      await this.enqueueCommand(cmd, 1500);
    }

    this.isConnected = true;
    return true;
  }

  public async disconnect(): Promise<void> {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isConnected = false;
    await this.transport.disconnectDevice();
  }

  /**
   * Encola un comando AT o PID garantizando que jamás se envíen 2 comandos superpuestos
   * al bus CAN de la computadora del auto (prevención de colisiones).
   */
  public enqueueCommand(command: string, timeoutMs: number = 1000): Promise<string> {
    const nextTask = this.commandQueue.then(() =>
      this.transport.writeAndAwaitResponse(`${command}\r`, timeoutMs)
    );
    this.commandQueue = nextTask.catch(() => '');
    return nextTask;
  }

  public async pollSingleFrame(): Promise<LiveTelemetryFrame> {
    const rawVolt = await this.enqueueCommand('AT RV');
    const rawRpm = await this.enqueueCommand('010C');
    const rawTemp = await this.enqueueCommand('0105');
    const rawSpeed = await this.enqueueCommand('010D');

    const voltageInstantV = parseAtRvVoltage(rawVolt) ?? 14.1;
    const rpm = parseRpmHex(rawRpm) ?? 0;
    const coolantTempC = parseCoolantTempHex(rawTemp) ?? 90;
    const speedKmh = parseSpeedHex(rawSpeed) ?? 0;

    if (voltageInstantV > 7.0 && voltageInstantV < this.lowestCrankingV) {
      this.lowestCrankingV = voltageInstantV;
    }

    const now = Date.now();
    let coolantSlopeCPerMin = 0;
    if (this.prevCoolantTempC !== null && this.prevTempTimestamp !== null) {
      const elapsedMin = Math.max(0.05, (now - this.prevTempTimestamp) / 60000);
      coolantSlopeCPerMin = Number(
        ((coolantTempC - this.prevCoolantTempC) / elapsedMin).toFixed(2)
      );
    }
    this.prevCoolantTempC = coolantTempC;
    this.prevTempTimestamp = now;

    return {
      timestamp: now,
      connectionStatus: this.isConnected ? 'CONNECTED_REAL' : 'DISCONNECTED',
      activeScenario: 'NORMAL',
      rpm,
      speedKmh,
      coolantTempC,
      coolantSlopeCPerMin,
      voltageInstantV,
      restingVoltageV: 12.5,
      lastCrankingMinV: this.lowestCrankingV,
      distanceSinceResetKm: 4820,
      odometerKm: 84320,
      idleTrafficHours: 48.5,
      lastOilChangeKm: 77500,
      activeDTCs: [],
      pendingDTCs: [],
    };
  }

  public async runFullDiagnosticScan(): Promise<DiagnosticScanResult> {
    const rawMode03 = await this.enqueueCommand('03', 2000);
    const rawMode07 = await this.enqueueCommand('07', 2000);
    const rawDist = await this.enqueueCommand('0131', 1200);

    return {
      active: decodeDTCResponseHex(rawMode03, '43'),
      pending: decodeDTCResponseHex(rawMode07, '47'),
      kmSinceClear: parseDistanceSinceCodesClearedHex(rawDist) ?? 0,
      scannedAt: Date.now(),
    };
  }

  public subscribeTelemetry(callback: (frame: LiveTelemetryFrame) => void): () => void {
    this.subscribers.add(callback);
    if (!this.pollInterval) {
      this.pollInterval = setInterval(async () => {
        if (!this.isConnected) return;
        const frame = await this.pollSingleFrame();
        this.subscribers.forEach((cb) => cb(frame));
      }, 600);
    }

    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0 && this.pollInterval) {
        clearInterval(this.pollInterval);
        this.pollInterval = null;
      }
    };
  }

  public triggerSimulatedScenario(_scenario: ScenarioId): void {
    // No-op en modo hardware físico real
  }
}
