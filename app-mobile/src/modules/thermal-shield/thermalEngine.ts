import { LiveTelemetryFrame } from '../obd2-engine/types';

/**
 * Escudo Térmico y Vigía de "Agua" (`thermal-shield`)
 * Detecta recalentamiento real grado por grado y pérdida súbita de agua por pendiente térmica.
 * Ticket: TUA-009
 */

export interface ThermalHealthReport {
  tempC: number;
  slopeCPerMin: number;
  zone: 'AZUL_FRIO' | 'VERDE_NORMAL' | 'AMARILLO_ELECTRO' | 'ROJO_RECALENTAMIENTO';
  severity: 'VERDE' | 'AMARILLO' | 'ROJO';
  shouldTriggerSiren: boolean;
  suspectedWaterLoss: boolean;
  headline: string;
  humanAdvice: string;
  potentialDamageIfIgnoredUsd: number;
}

export function evaluateThermalSystem(frame: LiveTelemetryFrame): ThermalHealthReport {
  const temp = frame.coolantTempC;
  const slope = frame.coolantSlopeCPerMin;

  // Detector de pérdida de agua / manguera rota: sube a más de 6°C por minuto estando ya caliente (>88°C)
  const suspectedWaterLoss = temp >= 88 && slope >= 6.0;

  if (temp >= 102 || suspectedWaterLoss) {
    return {
      tempC: temp,
      slopeCPerMin: slope,
      zone: 'ROJO_RECALENTAMIENTO',
      severity: 'ROJO',
      shouldTriggerSiren: true,
      suspectedWaterLoss,
      headline: suspectedWaterLoss && temp < 102
        ? `¡SUBIDA BRUSCA DE TEMPERATURA (${temp}°C)! Posible pérdida de agua`
        : `¡PELIGRO DE RECALENTAMIENTO (${temp}°C)! Frená ahora`,
      humanAdvice:
        'La temperatura del agua está subiendo a velocidad peligrosa (+9°C/min). Aunque la aguja del tablero parezca clavada en 90°C, estacioná ya mismo y apagá el motor para no soplar la junta de tapa de cilindros. ¡NO abras la tapa del bidón de agua en caliente!',
      potentialDamageIfIgnoredUsd: 950, // Soplar junta y rectificar tapa de cilindros
    };
  }

  if (temp >= 98) {
    return {
      tempC: temp,
      slopeCPerMin: slope,
      zone: 'AMARILLO_ELECTRO',
      severity: 'AMARILLO',
      shouldTriggerSiren: false,
      suspectedWaterLoss: false,
      headline: `Motor exigido (${temp}°C) — Electroventilador al máximo`,
      humanAdvice:
        'Es normal en tránsito pesado con calor, pero verificá que la temperatura baje a ~92°C en los próximos 2 minutos. Si sigue subiendo, apagá el aire acondicionado.',
      potentialDamageIfIgnoredUsd: 950,
    };
  }

  if (temp < 75) {
    return {
      tempC: temp,
      slopeCPerMin: slope,
      zone: 'AZUL_FRIO',
      severity: 'VERDE',
      shouldTriggerSiren: false,
      suspectedWaterLoss: false,
      headline: `Motor frío (${temp}°C) — Tomando temperatura`,
      humanAdvice: 'Evitá aceleradas fuertes hasta que el agua llegue a 85°C para cuidar el motor y el aceite.',
      potentialDamageIfIgnoredUsd: 0,
    };
  }

  return {
    tempC: temp,
    slopeCPerMin: slope,
    zone: 'VERDE_NORMAL',
    severity: 'VERDE',
    shouldTriggerSiren: false,
    suspectedWaterLoss: false,
    headline: `Agua y Temperatura en rango ideal (${temp}°C)`,
    humanAdvice: 'Termostato, nivel de refrigerante y electroventilador trabajando en equilibrio perfecto.',
    potentialDamageIfIgnoredUsd: 0,
  };
}
