/**
 * Sistema de Diseño Automotriz Dark Mode — Tu-Auto
 * Cumple con AGENTS.md: Alto contraste para lectura rápida en el soporte del torpedo.
 */
export const COLORS = {
  background: '#0B0F19',
  cardBackground: '#111827',
  cardElevated: '#1F2937',
  border: '#374151',
  brandCyan: '#00E5FF',
  brandCyanMuted: 'rgba(0, 229, 255, 0.14)',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  // Semáforo de Gravedad Mecánica
  safeGreen: '#10B981',
  safeGreenBg: 'rgba(16, 185, 129, 0.14)',
  warningYellow: '#F59E0B',
  warningYellowBg: 'rgba(245, 158, 11, 0.15)',
  dangerRed: '#EF4444',
  dangerRedBg: 'rgba(239, 68, 68, 0.18)',
  coldBlue: '#38BDF8',
  coldBlueBg: 'rgba(56, 189, 248, 0.15)',
} as const;

export const DEFAULT_EXCHANGE_RATE_ARS = 1150;

/**
 * Convierte un valor base en USD a Pesos Argentinos (ARS) formateados sin decimales
 * para que el usuario vea impacto real en su billetera local.
 */
export function formatARS(amountUsd: number, exchangeRate: number = DEFAULT_EXCHANGE_RATE_ARS): string {
  const ars = Math.round((amountUsd * exchangeRate) / 500) * 500;
  return `$${ars.toLocaleString('es-AR')}`;
}
