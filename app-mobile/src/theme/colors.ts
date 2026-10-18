/**
 * Tipografía Geométrica Moderna y Amigable (Plus Jakarta Sans / Inter)
 * Evita pesos 800/900 toscos en Windows y prioriza lectura limpia tipo iOS / Mercado Pago.
 */
export const FontFamily =
  typeof document !== 'undefined'
    ? "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    : 'System';

export const Colors = {
  // Superficies Limpias Daylight-First (Estilo Slate / Ice Blue)
  bgPrimary: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgElevated: '#F1F5F9',
  bgContainer: '#E2E8F0',
  bgHigh: '#E2E8F0',
  bgHighest: '#CBD5E1',

  // Hero y Gradientes Azul Eléctrico Automotriz
  heroIndigoStart: '#3B82F6',
  heroIndigoMid: '#2563EB',
  heroIndigoEnd: '#1D4ED8',
  heroIndigoDeep: '#0F172A',

  // Marca y Acción Primaria (Sapphire / Electric Blue)
  brandPrimary: '#2563EB',
  brandPrimaryDark: '#1D4ED8',
  brandLight: '#EFF6FF',

  // Tipografía Suave (Nunca negro puro)
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textOnHero: '#FFFFFF',
  textSubtleOnHero: '#DBEAFE',

  // Semáforo Amigable (Independiente del color de marca)
  safeGreen: '#10B981',
  safeGreenDark: '#059669',
  safeGreenBg: '#ECFDF5',
  safeGreenBorder: '#A7F3D0',

  warnAmber: '#F59E0B',
  warnAmberDark: '#B45309',
  warnAmberText: '#92400E',
  warnAmberBg: '#FFFBEB',
  warnAmberBorder: '#FDE68A',

  dangerRed: '#EF4444',
  dangerRedDark: '#DC2626',
  dangerRedBg: '#FEF2F2',
  dangerRedBorder: '#FECACA',

  infoSky: '#0284C7',
  infoSkyBg: '#F0F9FF',

  borderSubtle: 'rgba(203, 213, 225, 0.7)',
} as const;

export const COLORS = Colors;

export const DEFAULT_EXCHANGE_RATE_ARS = 1200;

export function formatARS(
  amountUsd: number,
  rateArs: number = DEFAULT_EXCHANGE_RATE_ARS
): string {
  const totalArs = Math.round(amountUsd * rateArs);
  return `$${totalArs.toLocaleString('es-AR')} ARS`;
}
