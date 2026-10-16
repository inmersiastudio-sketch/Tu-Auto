import { evaluateElectricalSystem } from '../electrical-guard/electricalEngine';
import { LiveTelemetryFrame } from '../obd2-engine/types';
import { evaluateOilAndFluids } from '../oil-tracker/oilEngine';
import { evaluateThermalSystem } from '../thermal-shield/thermalEngine';

/**
 * Traductor de Roturas a Lenguaje Humano y "Escudo Anti-Estafas" (`fault-translator`)
 * Cumple la Regla de Oro de AGENTS.md: Cero jerga mecánica + Doble Precio (Arreglar hoy vs Ignorar).
 * Ticket: TUA-011
 */

export interface TranslatedFaultCard {
  code: string;
  detectionType: 'ACTIVA_TABLERO' | 'PREVENTIVA_SILENCIOSA';
  systemCategory: 'ELECTRICO' | 'AGUA_TEMPERATURA' | 'MOTOR_ENCENDIDO' | 'ESCAPE_CONSUMO';
  severity: 'VERDE' | 'AMARILLO' | 'ROJO';
  humanTitle: string;
  plainExplanation: string;
  canKeepDriving: boolean;
  drivingInstruction: string;
  partsInvolved: string;
  fixTodayCostUsd: { min: number; max: number };
  ignoreConsequence: string;
  ignoreDamageCostUsd: number;
}

const LOCAL_DTC_DICTIONARY: Record<string, Omit<TranslatedFaultCard, 'code' | 'detectionType'>> = {
  P0115: {
    systemCategory: 'AGUA_TEMPERATURA',
    severity: 'ROJO',
    humanTitle: 'Falla en el bulbo/sensor de temperatura de agua o recalentamiento',
    plainExplanation:
      'La computadora recibe una lectura crítica del circuito de agua. Puede haberse roto una manguera, trabado el termostato o fallado el bulbo que prende el electroventilador.',
    canKeepDriving: false,
    drivingInstruction: '🛑 Frená en un lugar seguro ahora mismo y apagá el motor.',
    partsInvolved: 'Bulbo de temperatura / Termostato + Purga de líquido refrigerante',
    fixTodayCostUsd: { min: 45, max: 75 },
    ignoreConsequence: 'Soplar la junta de tapa de cilindros y doblar la tapa por recalentamiento.',
    ignoreDamageCostUsd: 950,
  },
  P0562: {
    systemCategory: 'ELECTRICO',
    severity: 'ROJO',
    humanTitle: 'El Alternador dejó de cargar la batería',
    plainExplanation:
      'El motor está en marcha pero el sistema eléctrico cayó por debajo de 13.0V. Se cortó la correa auxiliar o se gastaron los carbones/regulador del alternador.',
    canKeepDriving: false,
    drivingInstruction: '🛑 No apagues el auto en medio del tránsito; llevá el auto directo a un taller cercano antes de que se agote la batería (quedan ~25 min de autonomía).',
    partsInvolved: 'Regulador de voltaje / Carbones de alternador o Correa Poli-V',
    fixTodayCostUsd: { min: 70, max: 130 },
    ignoreConsequence: 'Quedarte tirado en la calle sin dirección asistida ni luces + arruinar la batería + costo de grúa.',
    ignoreDamageCostUsd: 340,
  },
  P0302: {
    systemCategory: 'MOTOR_ENCENDIDO',
    severity: 'AMARILLO',
    humanTitle: 'Falla de chispa en el Cilindro 2 (Bujía o Bobina)',
    plainExplanation:
      'Uno de los cilindros del motor no está quemando bien la nafta. Por eso sentís que el auto tironea al acelerar, tiembla en los semáforos y gasta un 15% más de combustible.',
    canKeepDriving: true,
    drivingInstruction: '⚠️ Podés volver tranquilo a tu casa sin pisar el acelerador a fondo. Pedí turno esta semana.',
    partsInvolved: 'Juego de bujías nuevas o bobina de encendido + 40 min de mano de obra',
    fixTodayCostUsd: { min: 55, max: 95 },
    ignoreConsequence: 'La nafta cruda sin quemar pasa al escape y derrite el Catalizador.',
    ignoreDamageCostUsd: 580,
  },
  P0420: {
    systemCategory: 'ESCAPE_CONSUMO',
    severity: 'AMARILLO',
    humanTitle: 'Desgaste en Catalizador o Sonda Lambda sucia',
    plainExplanation:
      'El sensor del caño de escape detecta que los gases salen menos filtrados. Muy común después de cargar nafta de mala calidad o tener bujías viejas.',
    canKeepDriving: true,
    drivingInstruction: '✅ Podés usar el auto normalmente. No te va a dejar a pata, pero hacelo revisar antes de la VTV.',
    partsInvolved: 'Limpieza/cambio de Sonda Lambda trasera o revisión de catalizador',
    fixTodayCostUsd: { min: 65, max: 140 },
    ignoreConsequence: 'Aumento de consumo de nafta, pérdida de potencia en ruta y rebote en la VTV.',
    ignoreDamageCostUsd: 460,
  },
  P0171: {
    systemCategory: 'MOTOR_ENCENDIDO',
    severity: 'AMARILLO',
    humanTitle: 'Chupada de aire en admisión o inyectores sucios (Mezcla pobre)',
    plainExplanation:
      'Al motor le está entrando aire de más por alguna manguerita reseca o la bomba/inyectores mandan poca nafta.',
    canKeepDriving: true,
    drivingInstruction: '⚠️ Podés circular con cuidado, pero el motor trabaja más caliente de lo normal.',
    partsInvolved: 'Manguera de vacío / Limpieza de inyectores por ultrasonido',
    fixTodayCostUsd: { min: 45, max: 85 },
    ignoreConsequence: 'Recalentamiento interno en válvulas y tironeos fuertes al pasar camiones en ruta.',
    ignoreDamageCostUsd: 520,
  },
};

export function translateVehicleFaults(frame: LiveTelemetryFrame): TranslatedFaultCard[] {
  const results: TranslatedFaultCard[] = [];

  for (const code of frame.activeDTCs) {
    const entry = LOCAL_DTC_DICTIONARY[code] ?? {
      systemCategory: 'MOTOR_ENCENDIDO',
      severity: 'AMARILLO',
      humanTitle: `Anomalía detectada en módulo de motor (${code})`,
      plainExplanation: 'La computadora registró un valor fuera de rango en un sensor del motor.',
      canKeepDriving: true,
      drivingInstruction: 'Podés circular con precaución hasta realizar un chequeo en taller.',
      partsInvolved: 'Sensor electrónico / Conector de motor',
      fixTodayCostUsd: { min: 40, max: 90 },
      ignoreConsequence: 'Mayor consumo de combustible y desgaste prematuro.',
      ignoreDamageCostUsd: 350,
    };
    results.push({ code, detectionType: 'ACTIVA_TABLERO', ...entry });
  }

  for (const code of frame.pendingDTCs) {
    if (frame.activeDTCs.includes(code)) continue;
    const entry = LOCAL_DTC_DICTIONARY[code];
    if (entry) {
      results.push({
        code,
        detectionType: 'PREVENTIVA_SILENCIOSA',
        ...entry,
      });
    }
  }

  return results;
}

/**
 * Calcula el Índice General de Salud del Auto (0% a 100%)
 * combinando Sistema Eléctrico, Agua/Temperatura, Aceite y Fallas Activas/Preventivas.
 */
export function computeOverallHealthScore(frame: LiveTelemetryFrame): {
  score: number;
  statusColor: 'VERDE' | 'AMARILLO' | 'ROJO';
  statusLabel: string;
} {
  let score = 100;
  const elec = evaluateElectricalSystem(frame);
  const thermal = evaluateThermalSystem(frame);
  const oil = evaluateOilAndFluids(frame);
  const faults = translateVehicleFaults(frame);

  if (thermal.severity === 'ROJO') score -= 55;
  else if (thermal.severity === 'AMARILLO') score -= 15;

  if (elec.alternatorSeverity === 'ROJO') score -= 50;
  if (elec.batteryStatus === 'ROJO') score -= 32;
  else if (elec.batteryStatus === 'AMARILLO') score -= 12;

  if (oil.severity === 'ROJO') score -= 18;
  else if (oil.severity === 'AMARILLO') score -= 8;

  for (const f of faults) {
    if (f.severity === 'ROJO') score -= 25;
    else if (f.severity === 'AMARILLO') score -= 14;
  }

  const clamped = Math.max(12, Math.min(100, score));
  if (clamped < 55 || thermal.severity === 'ROJO' || elec.alternatorSeverity === 'ROJO') {
    return { score: clamped, statusColor: 'ROJO', statusLabel: 'Atención Urgente — Riesgo de Rotura Cara' };
  }
  if (clamped < 82) {
    return { score: clamped, statusColor: 'AMARILLO', statusLabel: 'Desgaste Preventivo Detectado' };
  }
  return { score: clamped, statusColor: 'VERDE', statusLabel: 'Excelente Estado Mecánico y Eléctrico' };
}
