import { LiveTelemetryFrame } from '../obd2-engine/types';

/**
 * Motor Predictivo del Sistema Eléctrico (`electrical-guard`)
 * Evalúa Salud de Batería en Arranque (Cranking Drop) y Carga de Alternador.
 * Ticket: TUA-008
 */

export interface ElectricalHealthReport {
  batterySohPercent: number;           // 0 a 100%
  batteryStatus: 'VERDE' | 'AMARILLO' | 'ROJO';
  batteryHeadline: string;
  batteryExplanation: string;
  estimatedDaysUntilFailure: number | null;
  alternatorStatus: 'OK' | 'BAJA_CARGA' | 'SOBRECARGA_PELIGROSA' | 'MOTOR_APAGADO';
  alternatorSeverity: 'VERDE' | 'AMARILLO' | 'ROJO';
  alternatorHeadline: string;
  replacementCostUsd: { min: number; max: number };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function evaluateElectricalSystem(frame: LiveTelemetryFrame): ElectricalHealthReport {
  // 1. Cálculo de Salud de Batería (SOH %) basado en la caída de tensión en el arranque (8.5V = 0%, 10.4V = 100%)
  const crankRatio = ((frame.lastCrankingMinV - 8.5) / (10.4 - 8.5)) * 100;
  const restingRatio = ((frame.restingVoltageV - 11.6) / (12.65 - 11.6)) * 100;
  const batterySohPercent = Math.round(clamp(crankRatio * 0.75 + restingRatio * 0.25, 5, 100));

  let batteryStatus: 'VERDE' | 'AMARILLO' | 'ROJO' = 'VERDE';
  let batteryHeadline = 'Batería firme en el arranque';
  let batteryExplanation = `En el último arranque el voltaje se mantuvo en ${frame.lastCrankingMinV.toFixed(2)}V (óptimo > 9.8V).`;
  let estimatedDaysUntilFailure: number | null = null;

  if (frame.lastCrankingMinV < 9.3 || batterySohPercent < 38) {
    batteryStatus = 'ROJO';
    batteryHeadline = '¡Batería al límite! Riesgo alto de no arrancar';
    batteryExplanation = `Al girar el burro de arranque el voltaje cayó a ${frame.lastCrankingMinV.toFixed(2)}V. En la próxima mañana fría te puede dejar a pata.`;
    estimatedDaysUntilFailure = 12;
  } else if (frame.lastCrankingMinV < 9.75 || batterySohPercent < 65) {
    batteryStatus = 'AMARILLO';
    batteryHeadline = 'Batería con desgaste moderado';
    batteryExplanation = `Cayó a ${frame.lastCrankingMinV.toFixed(2)}V al arrancar. Todavía tira bien, pero andá previendo el cambio antes del invierno.`;
    estimatedDaysUntilFailure = 45;
  }

  // 2. Evaluación del Alternador y Regulador de Voltaje (con motor en marcha RPM > 500)
  let alternatorStatus: ElectricalHealthReport['alternatorStatus'] = 'OK';
  let alternatorSeverity: 'VERDE' | 'AMARILLO' | 'ROJO' = 'VERDE';
  let alternatorHeadline = `Alternador cargando perfecto (${frame.voltageInstantV.toFixed(2)}V)`;

  if (frame.rpm <= 500) {
    alternatorStatus = 'MOTOR_APAGADO';
    alternatorSeverity = 'VERDE';
    alternatorHeadline = `Motor detenido (${frame.voltageInstantV.toFixed(2)}V en contacto)`;
  } else if (frame.voltageInstantV < 13.2) {
    alternatorStatus = 'BAJA_CARGA';
    alternatorSeverity = 'ROJO';
    alternatorHeadline = `¡PELIGRO! El Alternador NO carga (${frame.voltageInstantV.toFixed(2)}V). Estás andando solo con la batería; el auto se va a apagar en ~30 min.`;
  } else if (frame.voltageInstantV > 14.8) {
    alternatorStatus = 'SOBRECARGA_PELIGROSA';
    alternatorSeverity = 'ROJO';
    alternatorHeadline = `¡SOBRECARGA! Regulador en corto (${frame.voltageInstantV.toFixed(2)}V). Riesgo de quemar la computadora o hervir la batería.`;
  } else if (frame.voltageInstantV < 13.6) {
    alternatorStatus = 'BAJA_CARGA';
    alternatorSeverity = 'AMARILLO';
    alternatorHeadline = `Carga de alternador algo débil (${frame.voltageInstantV.toFixed(2)}V). Revisar correa o carbones.`;
  }

  return {
    batterySohPercent,
    batteryStatus,
    batteryHeadline,
    batteryExplanation,
    estimatedDaysUntilFailure,
    alternatorStatus,
    alternatorSeverity,
    alternatorHeadline,
    replacementCostUsd: alternatorStatus !== 'OK' && alternatorStatus !== 'MOTOR_APAGADO'
      ? { min: 65, max: 125 } // Reparación de alternador
      : { min: 85, max: 135 }, // Batería nueva 12x65
  };
}
