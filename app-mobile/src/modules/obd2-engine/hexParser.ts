/**
 * Decodificador Hexadecimal del Protocolo OBD2 (SAE J1979 / ELM327)
 * Implementa las fórmulas de `.agents/skills/obd2-elm327-protocol/SKILL.md`
 * Tickets: TUA-007, TUA-017
 */

/**
 * Limpia espacios, saltos de línea y caracteres '>' de una trama ELM327.
 */
export function sanitizeHexResponse(raw: string): string {
  return raw.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
}

/**
 * PID 0105: Temperatura de Líquido Refrigerante ("Agua") en °C.
 * Trama esperada: "41 05 XX" -> A - 40
 */
export function parseCoolantTempHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('4105');
  if (idx === -1 || clean.length < idx + 6) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  if (Number.isNaN(byteA)) return null;
  return byteA - 40;
}

/**
 * PID 010C: Revoluciones por Minuto del Motor (RPM).
 * Trama esperada: "41 0C AA BB" -> ((A * 256) + B) / 4
 */
export function parseRpmHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('410C');
  if (idx === -1 || clean.length < idx + 8) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  const byteB = parseInt(clean.slice(idx + 6, idx + 8), 16);
  if (Number.isNaN(byteA) || Number.isNaN(byteB)) return null;
  return Math.round((byteA * 256 + byteB) / 4);
}

/**
 * PID 010D: Velocidad del Vehículo en km/h.
 * Trama esperada: "41 0D AA" -> A
 */
export function parseSpeedHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('410D');
  if (idx === -1 || clean.length < idx + 6) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  return Number.isNaN(byteA) ? null : byteA;
}

/**
 * PID 0142: Voltaje del Módulo de Control (ECU) en Voltios.
 * Trama esperada: "41 42 AA BB" -> ((A * 256) + B) / 1000
 */
export function parseControlModuleVoltageHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('4142');
  if (idx === -1 || clean.length < idx + 8) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  const byteB = parseInt(clean.slice(idx + 6, idx + 8), 16);
  if (Number.isNaN(byteA) || Number.isNaN(byteB)) return null;
  return Number(((byteA * 256 + byteB) / 1000).toFixed(2));
}

/**
 * Comando AT RV: Voltaje analógico directo del Pin 16 OBD2 (ej. "14.1V" o "12.4V").
 */
export function parseAtRvVoltage(rawText: string): number | null {
  const match = rawText.match(/(\d{1,2}\.\d{1,2})\s*V?/i);
  if (!match) return null;
  const val = parseFloat(match[1]);
  return Number.isNaN(val) ? null : val;
}

/**
 * PID 0131: Distancia recorrida (km) desde que se borraron los códigos de falla.
 * Clave para detectar fraude en compra de autos usados.
 * Trama esperada: "41 31 AA BB" -> (A * 256) + B
 */
export function parseDistanceSinceCodesClearedHex(rawHex: string): number | null {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf('4131');
  if (idx === -1 || clean.length < idx + 8) return null;
  const byteA = parseInt(clean.slice(idx + 4, idx + 6), 16);
  const byteB = parseInt(clean.slice(idx + 6, idx + 8), 16);
  if (Number.isNaN(byteA) || Number.isNaN(byteB)) return null;
  return byteA * 256 + byteB;
}

/**
 * Decodifica una respuesta del Modo 03 (encabezado 43) o Modo 07 (encabezado 47)
 * a una lista de códigos estándar SAE (Pxxxx, Cxxxx, Bxxxx, Uxxxx).
 */
export function decodeDTCResponseHex(rawHex: string, modePrefix: '43' | '47' = '43'): string[] {
  const clean = sanitizeHexResponse(rawHex);
  const idx = clean.indexOf(modePrefix);
  if (idx === -1) return [];

  const payload = clean.slice(idx + 2);
  const prefixes = ['P', 'C', 'B', 'U'] as const;
  const codes: string[] = [];

  // En CAN ISO 15765-4 a veces el primer byte después de 43/47 es la cantidad de DTCs
  // Si la longitud restante es impar en pares de bytes (múltiplo de 4 + 2), saltamos el byte contador
  const startOffset = payload.length % 4 === 2 ? 2 : 0;

  for (let i = startOffset; i + 4 <= payload.length; i += 4) {
    const chunk = payload.slice(i, i + 4);
    if (chunk === '0000') continue;

    const firstByte = parseInt(chunk.slice(0, 2), 16);
    if (Number.isNaN(firstByte)) continue;

    const typeBits = (firstByte & 0b11000000) >> 6;
    const secondDigit = (firstByte & 0b00110000) >> 4;
    const thirdDigit = (firstByte & 0b00001111).toString(16).toUpperCase();
    const lastTwoDigits = chunk.slice(2, 4).toUpperCase();

    const dtc = `${prefixes[typeBits]}${secondDigit}${thirdDigit}${lastTwoDigits}`;
    if (!codes.includes(dtc)) {
      codes.push(dtc);
    }
  }

  return codes;
}
