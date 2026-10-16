/**
 * Paleta Oficial "Kinetic Telematics" (Google Stitch Export)
 * Cero ruido visual, Daylight-First (#FCF8FF), Hero Indigo (#4338CA) y Cero Emojis.
 */
export const Colors = {
  // Superficies Tonal Layering (No-Line Rule)
  bgPrimary: '#FCF8FF', // Base Surface Canvas
  bgCard: '#FFFFFF', // Surface Container Lowest (Tarjetas principales)
  bgElevated: '#F6F2FF', // Surface Container Low (Fondos secundarios suaves)
  bgContainer: '#F0ECFF', // Surface Container
  bgHigh: '#E9E5FF', // Surface Container High (Píldoras de estado)
  bgHighest: '#E3DFFF', // Surface Container Highest (Barras de progreso base)

  // Hero Indigo Automotriz (Kinetic Telematics)
  heroIndigoStart: '#6366F1',
  heroIndigoMid: '#5148D7',
  heroIndigoEnd: '#372ABF',
  heroIndigoDeep: '#1E1B4B',

  // Marca y Acción Primaria
  brandPrimary: '#4338CA', // Primary Container CTA
  brandPrimaryDark: '#2A14B4', // Primary Deep Indigo
  brandLight: '#E0E0FF', // Primary Fixed

  // Tipografía Editorial (Deep Indigo Charcoal — Nunca negro #000000 puro)
  textPrimary: '#181445', // On-Surface
  textSecondary: '#464554', // On-Surface-Variant
  textMuted: '#777586', // Outline
  textOnHero: '#FFFFFF',
  textSubtleOnHero: '#E0E0FF',

  // Semáforo Automotriz (Esmeralda, Ámbar y Coral)
  safeGreen: '#10B981',
  safeGreenDark: '#047857',
  safeGreenBg: '#ECFDF5',
  safeGreenBorder: '#A7F3D0',

  warnAmber: '#F59E0B',
  warnAmberDark: '#B45309',
  warnAmberText: '#78350F',
  warnAmberBg: '#FFFBEB',
  warnAmberBorder: '#FDE68A',

  dangerRed: '#EF4444',
  dangerRedDark: '#B91C1C',
  dangerRedBg: '#FEF2F2',
  dangerRedBorder: '#FECACA',

  infoSky: '#0284C7',
  infoSkyBg: '#F0F9FF',

  borderSubtle: 'rgba(199, 196, 215, 0.25)', // Ghost Border (#C7C4D7 al 25%)
} as const;

export const COLORS = Colors;

export const DEFAULT_EXCHANGE_RATE_ARS = 1200;

export function formatARS(amountUsd: number, rateArs: number = DEFAULT_EXCHANGE_RATE_ARS): string {
  const totalArs = Math.round(amountUsd * rateArs);
  return `$${totalArs.toLocaleString('es-AR')} ARS`;
}
