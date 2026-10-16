import { DiagnosticScanResult, IOBD2DataSource, LiveTelemetryFrame, ScenarioId } from './types';

/**
 * Motor Simulador Interactivo en Tiempo Real (`MockOBD2Provider`)
 * Permite demostrar en vivo a clientes, talleres e inversores los 6 escenarios
 * críticos del vehículo sin estar enchufado a un auto físico.
 * Ticket: TUA-007, TUA-014
 */
export class MockOBD2Provider implements IOBD2DataSource {
  private scenario: ScenarioId = 'NORMAL';
  private subscribers: Set<(frame: LiveTelemetryFrame) => void> = new Set();
  private timer: ReturnType<typeof setInterval> | null = null;
  private tickCount = 0;

  private baseState: LiveTelemetryFrame = {
    timestamp: Date.now(),
    connectionStatus: 'CONNECTED_SIMULATOR',
    activeScenario: 'NORMAL',
    rpm: 840,
    speedKmh: 42,
    coolantTempC: 90,
    coolantSlopeCPerMin: 0.2,
    voltageInstantV: 14.15,
    restingVoltageV: 12.6,
    lastCrankingMinV: 10.35,
    distanceSinceResetKm: 4820,
    odometerKm: 84320,
    idleTrafficHours: 48.5,
    lastOilChangeKm: 77500, // Hizo 6.820 km reales, pero muchas horas de tráfico
    activeDTCs: [],
    pendingDTCs: [],
  };

  public async connect(): Promise<boolean> {
    this.startLoop();
    return true;
  }

  public async disconnect(): Promise<void> {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public async runFullDiagnosticScan(): Promise<DiagnosticScanResult> {
    const frame = this.computeNextFrame();
    return {
      active: [...frame.activeDTCs],
      pending: [...frame.pendingDTCs],
      kmSinceClear: frame.distanceSinceResetKm,
      scannedAt: Date.now(),
    };
  }

  public subscribeTelemetry(callback: (frame: LiveTelemetryFrame) => void): () => void {
    this.subscribers.add(callback);
    callback(this.computeNextFrame());
    this.startLoop();

    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };
  }

  public triggerSimulatedScenario(scenario: ScenarioId): void {
    this.scenario = scenario;
    this.tickCount = 0;
    this.broadcast();
  }

  public getCurrentScenario(): ScenarioId {
    return this.scenario;
  }

  private startLoop(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.tickCount += 1;
      this.broadcast();
    }, 600);
  }

  private broadcast(): void {
    const frame = this.computeNextFrame();
    this.subscribers.forEach((cb) => cb(frame));
  }

  public computeNextFrame(): LiveTelemetryFrame {
    const jitterRpm = Math.round(Math.sin(this.tickCount * 0.7) * 18);
    const jitterVolt = Number((Math.cos(this.tickCount * 0.5) * 0.03).toFixed(2));

    switch (this.scenario) {
      case 'NORMAL':
        return {
          ...this.baseState,
          timestamp: Date.now(),
          activeScenario: 'NORMAL',
          rpm: 850 + jitterRpm,
          speedKmh: 45,
          coolantTempC: 90,
          coolantSlopeCPerMin: 0.1,
          voltageInstantV: Number((14.12 + jitterVolt).toFixed(2)),
          restingVoltageV: 12.62,
          lastCrankingMinV: 10.4,
          distanceSinceResetKm: 4820,
          activeDTCs: [],
          pendingDTCs: [],
        };

      case 'OVERHEATING_WATER': {
        // Sube rápidamente de 98°C hasta 107°C simulando manguera rota o electroventilador muerto
        const extraTemp = Math.min(9, Math.floor(this.tickCount * 1.2));
        return {
          ...this.baseState,
          timestamp: Date.now(),
          activeScenario: 'OVERHEATING_WATER',
          rpm: 2100 + jitterRpm,
          speedKmh: 65,
          coolantTempC: 98 + extraTemp,
          coolantSlopeCPerMin: 9.4, // +9.4°C por minuto -> Dispara alerta de falta de agua
          voltageInstantV: Number((14.05 + jitterVolt).toFixed(2)),
          restingVoltageV: 12.55,
          lastCrankingMinV: 10.2,
          distanceSinceResetKm: 4820,
          activeDTCs: ['P0115'],
          pendingDTCs: [],
        };
      }

      case 'DEAD_BATTERY_CRANK':
        return {
          ...this.baseState,
          timestamp: Date.now(),
          activeScenario: 'DEAD_BATTERY_CRANK',
          rpm: 820 + jitterRpm,
          speedKmh: 0,
          coolantTempC: 88,
          coolantSlopeCPerMin: 0.2,
          voltageInstantV: Number((13.95 + jitterVolt).toFixed(2)),
          restingVoltageV: 11.85,    // Baja tensión en reposo
          lastCrankingMinV: 9.05,    // Cayó a 9.05V en el giro del burro -> Riesgo inminente de no arrancar
          distanceSinceResetKm: 4820,
          activeDTCs: [],
          pendingDTCs: [],
        };

      case 'ALTERNATOR_FAIL':
        return {
          ...this.baseState,
          timestamp: Date.now(),
          activeScenario: 'ALTERNATOR_FAIL',
          rpm: 1850 + jitterRpm,
          speedKmh: 55,
          coolantTempC: 92,
          coolantSlopeCPerMin: 0.3,
          voltageInstantV: Number((12.15 + jitterVolt).toFixed(2)), // Motor en marcha pero a 12.1V (No carga!)
          restingVoltageV: 12.4,
          lastCrankingMinV: 9.9,
          distanceSinceResetKm: 4820,
          activeDTCs: ['P0562'],
          pendingDTCs: [],
        };

      case 'CYLINDER_MISFIRE_P0302':
        return {
          ...this.baseState,
          timestamp: Date.now(),
          activeScenario: 'CYLINDER_MISFIRE_P0302',
          rpm: 760 + jitterRpm * 2, // Ralentí inestable por falla en cilindro 2
          speedKmh: 28,
          coolantTempC: 91,
          coolantSlopeCPerMin: 0.2,
          voltageInstantV: Number((14.1 + jitterVolt).toFixed(2)),
          restingVoltageV: 12.58,
          lastCrankingMinV: 10.25,
          distanceSinceResetKm: 4820,
          activeDTCs: [],
          pendingDTCs: ['P0302', 'P0420'], // Detectado en Modo 07 antes de prender luz o iniciando
        };

      case 'USED_CAR_FRAUD':
        return {
          ...this.baseState,
          timestamp: Date.now(),
          activeScenario: 'USED_CAR_FRAUD',
          rpm: 880 + jitterRpm,
          speedKmh: 0,
          coolantTempC: 90,
          coolantSlopeCPerMin: 0.1,
          voltageInstantV: 14.08,
          restingVoltageV: 12.35,
          lastCrankingMinV: 9.75,
          distanceSinceResetKm: 9, // ¡Borraron las fallas hace apenas 9 kilómetros!
          activeDTCs: [],
          pendingDTCs: ['P0171', 'P0420'],
        };
    }
  }
}

export const sharedOBD2Provider = new MockOBD2Provider();
