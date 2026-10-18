/**
 * Tipografía Geométrica Moderna y Amigable (Plus Jakarta Sans / Inter)
 * Evita pesos 800/900 toscos en Windows y prioriza lectura limpia tipo iOS / Mercado Pago.
 */
export const FontFamily =
  typeof document !== 'undefined'
    ? "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    : 'System';

export const Colors = {
  // Superficies Limpias Daylight-First
  bgPrimary: '#F8F7FC',
  bgCard: '#FFFFFF',
  bgElevated: '#F2F0FA',
  bgContainer: '#ECE9F8',
  bgHigh: '#E6E2F5',
  bgHighest: '#DDD8F0',

  // Hero Indigo Automotriz
  heroIndigoStart: '#5B4FE8',
  heroIndigoMid: '#4C3FD9',
  heroIndigoEnd: '#3B2EC2',
  heroIndigoDeep: '#1E1B4B',

  // Marca y Acción Primaria
  brandPrimary: '#4F46E5',
  brandPrimaryDark: '#3730A3',
  brandLight: '#E0E7FF',

  // Tipografía Suave (Nunca negro puro)
  textPrimary: '#1E1B4B',
  textSecondary: '#52506E',
  textMuted: '#85839E',
  textOnHero: '#FFFFFF',
  textSubtleOnHero: '#E0E7FF',

  // Semáforo Amigable
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

  borderSubtle: 'rgba(199, 196, 215, 0.28)',
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
