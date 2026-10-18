import { FreezeFrameSnapshot } from '../obd2-engine/freezeFrameParser';

/**
 * Motor de Telemetría Histórica y Grabación de Viajes ("Caja Negra")
 * Permite registrar y analizar la salud del vehículo a lo largo del tiempo.
 * Ticket: TUA-030
 */

export interface TelemetrySample {
  timeOffsetSec: number; // Segundos transcurridos desde el inicio del viaje
  coolantTempC: number;  // Temperatura de agua (°C)
  voltageV: number;      // Tensión del sistema eléctrico (V)
  speedKmh: number;      // Velocidad (km/h)
  rpm: number;           // Revoluciones por minuto
}

export interface TripSession {
  id: string;
  title: string;
  dateStr: string;
  durationMinutes: number;
  distanceKm: number;
  maxCoolantTempC: number;
  minCrankingVoltV: number;
  avgVoltageV: number;
  avgSpeedKmh: number;
  healthGrade: 'EXCELENTE' | 'PRECAUCION' | 'CRITICO';
  healthSummary: string;
  samples: TelemetrySample[];
  freezeFrame?: FreezeFrameSnapshot;
}

/**
 * Viajes precargados de ejemplo para visualización inmediata en demostraciones
 */
export const VIAJES_HISTORICOS_DEMO: TripSession[] = [
  {
    id: 'trip-001',
    title: 'Viaje Hoy: Autopista y Tránsito Urbano',
    dateStr: 'Hoy, 17:45 hs',
    durationMinutes: 34,
    distanceKm: 26.4,
    maxCoolantTempC: 91,
    minCrankingVoltV: 10.35,
    avgVoltageV: 14.18,
    avgSpeedKmh: 46.5,
    healthGrade: 'EXCELENTE',
    healthSummary: 'Temperatura óptima y alternador cargando perfecto (14.18V). Arranque firme.',
    samples: [
      { timeOffsetSec: 0, coolantTempC: 45, voltageV: 12.5, speedKmh: 0, rpm: 850 },
      { timeOffsetSec: 240, coolantTempC: 72, voltageV: 14.2, speedKmh: 35, rpm: 1950 },
      { timeOffsetSec: 600, coolantTempC: 86, voltageV: 14.15, speedKmh: 68, rpm: 2400 },
      { timeOffsetSec: 1000, coolantTempC: 90, voltageV: 14.18, speedKmh: 85, rpm: 2650 },
      { timeOffsetSec: 1400, coolantTempC: 91, voltageV: 14.2, speedKmh: 52, rpm: 1800 },
      { timeOffsetSec: 1800, coolantTempC: 89, voltageV: 14.16, speedKmh: 20, rpm: 1100 },
      { timeOffsetSec: 2040, coolantTempC: 90, voltageV: 14.15, speedKmh: 0, rpm: 840 },
    ],
  },
  {
    id: 'trip-002',
    title: 'Viaje Ayer: Tráfico Pesado en Hora Pico',
    dateStr: 'Ayer, 18:20 hs',
    durationMinutes: 52,
    distanceKm: 14.2,
    maxCoolantTempC: 99,
    minCrankingVoltV: 9.85,
    avgVoltageV: 13.92,
    avgSpeedKmh: 16.3,
    healthGrade: 'PRECAUCION',
    healthSummary: 'Temperatura rozó los 99°C por embotellamiento prolongado. La batería cayó a 9.85V en arranque.',
    samples: [
      { timeOffsetSec: 0, coolantTempC: 50, voltageV: 12.3, speedKmh: 0, rpm: 850 },
      { timeOffsetSec: 300, coolantTempC: 82, voltageV: 14.05, speedKmh: 22, rpm: 1500 },
      { timeOffsetSec: 900, coolantTempC: 92, voltageV: 13.95, speedKmh: 8, rpm: 950 },
      { timeOffsetSec: 1800, coolantTempC: 97, voltageV: 13.88, speedKmh: 5, rpm: 900 },
      { timeOffsetSec: 2400, coolantTempC: 99, voltageV: 13.85, speedKmh: 12, rpm: 1200 },
      { timeOffsetSec: 2800, coolantTempC: 95, voltageV: 14.0, speedKmh: 35, rpm: 1800 },
      { timeOffsetSec: 3120, coolantTempC: 92, voltageV: 14.1, speedKmh: 0, rpm: 840 },
    ],
  },
  {
    id: 'trip-003',
    title: 'Viaje Hace 4 Días: Incidente Térmico (Check Engine)',
    dateStr: '14 Octubre, 14:15 hs',
    durationMinutes: 19,
    distanceKm: 9.8,
    maxCoolantTempC: 104,
    minCrankingVoltV: 10.1,
    avgVoltageV: 14.05,
    avgSpeedKmh: 31.0,
    healthGrade: 'CRITICO',
    healthSummary: 'Se disparó alerta de recalentamiento a 104°C. Se capturó Freeze Frame del sensor P0115.',
    freezeFrame: {
      causingDTC: 'P0115',
      coolantTempC: 104,
      engineRpm: 2350,
      vehicleSpeedKmh: 68,
      calculatedLoadPercent: 74,
      controlVoltageV: 14.05,
      timestamp: Date.now() - 4 * 86400000,
      contextExplanation:
        'La falla P0115 se grabó mientras el auto estaba circulando en avenida a 68 km/h, a 2.350 RPM con temperatura crítica de 104°C.',
    },
    samples: [
      { timeOffsetSec: 0, coolantTempC: 60, voltageV: 12.6, speedKmh: 0, rpm: 850 },
      { timeOffsetSec: 200, coolantTempC: 84, voltageV: 14.1, speedKmh: 45, rpm: 2000 },
      { timeOffsetSec: 500, coolantTempC: 94, voltageV: 14.08, speedKmh: 65, rpm: 2200 },
      { timeOffsetSec: 800, coolantTempC: 102, voltageV: 14.05, speedKmh: 70, rpm: 2350 },
      { timeOffsetSec: 950, coolantTempC: 104, voltageV: 14.02, speedKmh: 68, rpm: 2350 },
      { timeOffsetSec: 1140, coolantTempC: 101, voltageV: 14.0, speedKmh: 0, rpm: 850 },
    ],
  },
];

export class TripLoggerEngine {
  private activeTrip: TripSession | null = null;
  private tripHistory: TripSession[] = [...VIAJES_HISTORICOS_DEMO];

  public startTrip(title: string = 'Viaje en Curso'): TripSession {
    this.activeTrip = {
      id: `trip-${Date.now()}`,
      title,
      dateStr: 'En progreso...',
      durationMinutes: 0,
      distanceKm: 0,
      maxCoolantTempC: 0,
      minCrankingVoltV: 14.0,
      avgVoltageV: 14.1,
      avgSpeedKmh: 0,
      healthGrade: 'EXCELENTE',
      healthSummary: 'Grabando parámetros en tiempo real...',
      samples: [],
    };
    return this.activeTrip;
  }

  public recordSample(sample: TelemetrySample): void {
    if (!this.activeTrip) {
      this.startTrip();
    }
    const trip = this.activeTrip!;
    trip.samples.push(sample);

    if (sample.coolantTempC > trip.maxCoolantTempC) {
      trip.maxCoolantTempC = sample.coolantTempC;
    }
    if (sample.voltageV > 7.0 && sample.voltageV < trip.minCrankingVoltV) {
      trip.minCrankingVoltV = sample.voltageV;
    }

    if (trip.maxCoolantTempC >= 102) {
      trip.healthGrade = 'CRITICO';
      trip.healthSummary = `Recalentamiento detectado (${trip.maxCoolantTempC}°C). Riesgo de soplar junta.`;
    } else if (trip.maxCoolantTempC >= 98 || trip.minCrankingVoltV < 9.6) {
      trip.healthGrade = 'PRECAUCION';
      trip.healthSummary = `Temperatura elevada (${trip.maxCoolantTempC}°C) o arranque forzado.`;
    }
  }

  public attachFreezeFrame(freezeFrame: FreezeFrameSnapshot): void {
    if (this.activeTrip) {
      this.activeTrip.freezeFrame = freezeFrame;
      this.activeTrip.healthGrade = 'CRITICO';
      this.activeTrip.healthSummary = `Falla capturada: ${freezeFrame.causingDTC} a ${freezeFrame.coolantTempC}°C`;
    }
  }

  public getHistory(): TripSession[] {
    return this.tripHistory;
  }

  public getActiveTrip(): TripSession | null {
    return this.activeTrip;
  }
}

export const sharedTripLogger = new TripLoggerEngine();
