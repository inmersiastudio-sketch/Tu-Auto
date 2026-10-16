import { LiveTelemetryFrame } from '../obd2-engine/types';

/**
 * Calculador Inteligente de Vida Útil de Aceite y Refrigerante (`oil-tracker`)
 * Cruza kilómetros reales de odómetro con horas de motor encendido en tráfico pesado.
 * Ticket: TUA-010
 */

export interface OilAndFluidReport {
  realKmSinceChange: number;
  trafficPenaltyKm: number;
  equivalentWearKm: number;
  intervalTargetKm: number;
  oilLifeRemainingPercent: number;
  estimatedDaysRemaining: number;
  severity: 'VERDE' | 'AMARILLO' | 'ROJO';
  headline: string;
  humanExplanation: string;
  serviceEstimatedCostUsd: number;
}

export function evaluateOilAndFluids(
  frame: LiveTelemetryFrame,
  intervalTargetKm: number = 10000
): OilAndFluidReport {
  const realKmSinceChange = Math.max(0, frame.odometerKm - frame.lastOilChangeKm);

  // Regla de ingeniería Tu-Auto: 1 hora de motor regulando en embotellamiento (<15 km/h)
  // degrada el aceite igual que 45 km de ruta.
  const trafficPenaltyKm = Math.round(frame.idleTrafficHours * 45);
  const equivalentWearKm = realKmSinceChange + trafficPenaltyKm;

  const remainingKm = Math.max(0, intervalTargetKm - equivalentWearKm);
  const oilLifeRemainingPercent = Math.max(
    0,
    Math.min(100, Math.round((remainingKm / intervalTargetKm) * 100))
  );

  // Asumiendo un uso promedio de 45 km equivalentes por día
  const estimatedDaysRemaining = Math.max(0, Math.round(remainingKm / 45));

  let severity: 'VERDE' | 'AMARILLO' | 'ROJO' = 'VERDE';
  let headline = `Aceite al ${oilLifeRemainingPercent}% de vida útil`;

  if (oilLifeRemainingPercent <= 12) {
    severity = 'ROJO';
    headline = `¡Cambio de Aceite Urgente! (${oilLifeRemainingPercent}% restante)`;
  } else if (oilLifeRemainingPercent <= 25) {
    severity = 'AMARILLO';
    headline = `Programar cambio de aceite pronto (${oilLifeRemainingPercent}% restante)`;
  }

  const humanExplanation =
    `Desde el último cambio tu odómetro sumó ${realKmSinceChange.toLocaleString('es-AR')} km reales, ` +
    `pero estuviste ${frame.idleTrafficHours.toFixed(0)} hs en tránsito pesado (lo que suma +${trafficPenaltyKm.toLocaleString('es-AR')} km de desgaste oculto al motor). ` +
    `Desgaste real total: ${equivalentWearKm.toLocaleString('es-AR')} / ${intervalTargetKm.toLocaleString('es-AR')} km.`;

  return {
    realKmSinceChange,
    trafficPenaltyKm,
    equivalentWearKm,
    intervalTargetKm,
    oilLifeRemainingPercent,
    estimatedDaysRemaining,
    severity,
    headline,
    humanExplanation,
    serviceEstimatedCostUsd: 58, // Aceite sintético + Filtro de aceite y aire
  };
}
