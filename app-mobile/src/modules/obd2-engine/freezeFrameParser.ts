import { sanitizeHexResponse } from './hexParser';

/**
 * Decodificador del Modo 02 de OBD2 (Freeze Frame / Cuadro Congelado)
 * Permite capturar la "foto instantánea" exacta de los sensores del motor
 * en el milisegundo en que la computadora (ECU) registró un código de falla.
 * Ticket: TUA-029
 */

export interface FreezeFrameSnapshot {
  causingDTC: string;             // PID 0202: Código de falla que disparó el congelamiento
  coolantTempC: number;           // PID 0205: Temperatura del motor en el fallo (°C)
  engineRpm: number;              // PID 020C: Revoluciones por minuto en el fallo
  vehicleSpeedKmh: number;        // PID 020D: Velocidad en el fallo (km/h)
  calculatedLoadPercent: number;  // PID 0204: Porcentaje de carga del motor (%)
  controlVoltageV: number;        // PID 0242: Voltaje de la ECU en el instante del fallo
  timestamp: number;              // Fecha/hora de captura
  contextExplanation: string;     // Resumen en lenguaje claro para el conductor
}

/**
 * Parsea el DTC causante del Freeze Frame (PID 0202 / Respuesta 42 02 XX YY)
 */
export function parseFreezeFrameDTCHex(rawHex: string): string | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('4202');
  if (idx === -1 || clean.length < idx + 8) return null;

  const prefixes = ['P', 'C', 'B', 'U'] as const;
  const chunk = clean.slice(idx + 4, idx + 8);
  if (chunk === '0000') return null;

  const firstByte = parseInt(chunk.slice(0, 2), 16);
  if (Number.isNaN(firstByte)) return null;

  const typeBits = (firstByte & 0b11000000) >> 6;
  const secondDigit = (firstByte & 0b00110000) >> 4;
  const thirdDigit = (firstByte & 0b00001111).toString(16).toUpperCase();
  const lastTwoDigits = chunk.slice(2, 4).toUpperCase();

  return `${prefixes[typeBits]}${secondDigit}${thirdDigit}${lastTwoDigits}`;
}

/**
 * Parsea la temperatura de refrigerante del Freeze Frame (PID 0205 / Respuesta 42 05 XX -> A - 40)
 */
export function parseFreezeFrameCoolantHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('4205');
  if (idx === -1 || clean.length < idx + 6) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  return Number.isNaN(byteA) ? null : byteA - 40;
}

/**
 * Parsea las RPM del motor en el Freeze Frame (PID 020C / Respuesta 42 0C AA BB -> ((A*256)+B)/4)
 */
export function parseFreezeFrameRpmHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('420C');
  if (idx === -1 || clean.length < idx + 8) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  const byteB = parseInt(clean.slice(idx + 6, idx + 8), 16);
  if (Number.isNaN(byteA) || Number.isNaN(byteB)) return null;
  return Math.round((byteA * 256 + byteB) / 4);
}

/**
 * Parsea la velocidad del vehículo en el Freeze Frame (PID 020D / Respuesta 42 0D XX -> A km/h)
 */
export function parseFreezeFrameSpeedHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('420D');
  if (idx === -1 || clean.length < idx + 6) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  return Number.isNaN(byteA) ? null : byteA;
}

/**
 * Parsea la carga del motor en el Freeze Frame (PID 0204 / Respuesta 42 04 XX -> (A * 100) / 255 %)
 */
export function parseFreezeFrameLoadHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('4204');
  if (idx === -1 || clean.length < idx + 6) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  if (Number.isNaN(byteA)) return null;
  return Math.round((byteA * 100) / 255);
}

/**
 * Genera una explicación pericial comprensible para el conductor sobre el momento del fallo.
 */
export function generarExplicacionFreezeFrame(
  dtc: string,
  speedKmh: number,
  rpm: number,
  tempC: number
): string {
  let accion = 'circulando';
  if (speedKmh === 0 && rpm > 0) {
    accion = 'detenido con el motor regulando en ralentí (semáforo o embotellamiento)';
  } else if (speedKmh > 70) {
    accion = `en autopista o ruta a ${speedKmh} km/h`;
  } else if (speedKmh > 0) {
    accion = `en tránsito urbano a ${speedKmh} km/h`;
  }

  let estadoMotor = 'a temperatura normal';
  if (tempC >= 100) {
    estadoMotor = `con temperatura elevada (${tempC}°C - riesgo de junta)`;
  } else if (tempC < 70) {
    estadoMotor = `con el motor todavía frío (${tempC}°C)`;
  }

  return `La falla ${dtc} se grabó mientras el auto estaba ${accion}, a ${rpm.toLocaleString('es-AR')} RPM y ${estadoMotor}.`;
}
