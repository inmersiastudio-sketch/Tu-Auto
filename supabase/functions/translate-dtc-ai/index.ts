// ============================================================================
// SUPABASE EDGE FUNCTION: translate-dtc-ai
// Traduce códigos de falla (DTC) no catalogados usando Gemini Flash y los
// guarda en caché en `dtc_master_catalog` + `repair_cost_matrix`
// Ticket: TUA-022
// ============================================================================

export interface TranslateDtcRequest {
  dtcCode: string;
  brand: string;
  model: string;
  year: number;
  vehicleSegment?: 'ECONOMICO' | 'MEDIANO' | 'PICKUP_SUV' | 'PREMIUM';
}

export interface GeminiTranslatedDtcPayload {
  code: string;
  system_category:
    | 'ELECTRICO'
    | 'AGUA_REFRIGERACION'
    | 'MOTOR_INYECCION'
    | 'ACEITE_LUBRICACION'
    | 'EMISIONES_ESCAPE'
    | 'TRANSMISION';
  severity_level: 'VERDE' | 'AMARILLO' | 'ROJO';
  human_title: string;
  human_explanation: string;
  can_keep_driving: boolean;
  driving_advice: string;
  consequence_if_ignored: string;
  part_name: string;
  part_cost_min_usd: number;
  part_cost_max_usd: number;
  labor_cost_usd: number;
  ignored_damage_cost_usd: number;
}

const DTC_REGEX = /^[PCBU][0-3][0-9A-F]{3}$/i;

export function validateTranslateRequest(body: unknown): TranslateDtcRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Payload inválido: se esperaba un objeto JSON.');
  }
  const candidate = body as Record<string, unknown>;
  const dtcCode = String(candidate.dtcCode ?? '').trim().toUpperCase();

  if (!DTC_REGEX.test(dtcCode)) {
    throw new Error(`Código DTC inválido: "${dtcCode}". Formato requerido: P0xxx / C0xxx / B0xxx / U0xxx.`);
  }

  const brand = String(candidate.brand ?? 'Genérico').slice(0, 50);
  const model = String(candidate.model ?? 'Estándar').slice(0, 60);
  const year = Number(candidate.year ?? 2018);
  if (Number.isNaN(year) || year < 1990 || year > 2030) {
    throw new Error('Año del vehículo fuera de rango válido (1990-2030).');
  }

  return {
    dtcCode,
    brand,
    model,
    year,
    vehicleSegment: 'ECONOMICO',
  };
}

export function buildMechanicSystemPrompt(req: TranslateDtcRequest): string {
  return [
    'Sos un jefe de taller mecánico honesto de Argentina/Latinoamérica trabajando para la app Tu-Auto.',
    `Explicá el código de falla OBD2 "${req.dtcCode}" para un ${req.brand} ${req.model} (${req.year}).`,
    'REGLAS OBLIGATORIAS:',
    '1. Prohibido usar jerga técnica sin explicarla. Hablá claro: bulbo, bobina, bujías, alternador, junta de tapa, cuerpo mariposa.',
    '2. Indicá si puede seguir manejando tranquilo o debe frenar ya.',
    '3. Estimá el costo justo en USD de arreglarlo hoy (repuesto min/max + mano de obra) vs el costo del daño grave si lo ignora.',
    'Respondé exclusivamente en JSON válido con las claves de GeminiTranslatedDtcPayload.',
  ].join('\n');
}
