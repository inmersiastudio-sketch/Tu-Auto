/**
 * Contratos Oficiales del Motor OBD2 (Real BLE + Simulador Interactivo)
 * Ticket: TUA-007
 */

export type ScenarioId =
  | 'NORMAL'
  | 'OVERHEATING_WATER'
  | 'DEAD_BATTERY_CRANK'
  | 'ALTERNATOR_FAIL'
  | 'CYLINDER_MISFIRE_P0302'
  | 'USED_CAR_FRAUD';

export interface LiveTelemetryFrame {
  timestamp: number;
  connectionStatus: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED_REAL' | 'CONNECTED_SIMULATOR';
  activeScenario: ScenarioId;
  rpm: number;                     // PID 010C (0 = Motor apagado en contacto)
  speedKmh: number;                // PID 010D
  coolantTempC: number;            // PID 0105 (Temperatura del líquido refrigerante "Agua")
  coolantSlopeCPerMin: number;     // Derivada térmica (°C/min) para detectar manguera rota / sin agua
  voltageInstantV: number;         // AT RV / PID 0142 (Voltaje actual del sistema eléctrico)
  restingVoltageV: number;         // Voltaje medido con motor apagado antes de arrancar
  lastCrankingMinV: number;        // Mínimo voltaje registrado en el milisegundo del giro de arranque
  distanceSinceResetKm: number;    // PID 0131 (Km recorridos desde el último borrado de fallas con escáner)
  odometerKm: number;              // Kilometraje actual del vehículo
  idleTrafficHours: number;        // Horas acumuladas de motor encendido en embotellamiento (<15 km/h)
  lastOilChangeKm: number;         // Kilometraje en el que se hizo el último cambio de aceite
  activeDTCs: string[];            // Modo 03 (Fallas confirmadas con luz de Check Engine encendida)
  pendingDTCs: string[];           // Modo 07 (Fallas preventivas silenciosas antes del Check Engine)
}

export interface DiagnosticScanResult {
  active: string[];
  pending: string[];
  kmSinceClear: number;
  scannedAt: number;
}

export interface IOBD2DataSource {
  connect(deviceId?: string): Promise<boolean>;
  disconnect(): Promise<void>;
  runFullDiagnosticScan(): Promise<DiagnosticScanResult>;
  subscribeTelemetry(callback: (frame: LiveTelemetryFrame) => void): () => void;
  triggerSimulatedScenario(scenario: ScenarioId): void;
}
