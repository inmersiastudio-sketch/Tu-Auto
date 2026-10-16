/**
 * Sistema de Diseño Minimalista "Clean Indigo & Pearl" — Tu-Auto
 * Inspirado en el diseño de referencia: cero ruido visual, tarjetas blancas limpias,
 * protagonista 3D sobre tarjeta Índigo y mucha paz mental para el conductor.
 */
export const COLORS = {
  // Fondos principales (Light Minimalist Mode)
  appBackground: '#F4F6FB',
  surfaceWhite: '#FFFFFF',
  surfaceSubtle: '#EEF1F8',
  borderLight: '#E5E9F2',

  // Hero Card Índigo
  heroBgPrimary: '#584CF4',
  heroBgSecondary: '#6E62F7',
  heroPillBg: 'rgba(255, 255, 255, 0.16)',
  heroCircleRing: 'rgba(255, 255, 255, 0.07)',

  // Textos
  textDark: '#131726',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',
  textWhiteMuted: 'rgba(255, 255, 255, 0.78)',

  // Marca & Navegación
  brandIndigo: '#4F46E5',
  brandIndigoSoft: '#ECEBFF',
  avatarDark: '#1E2238',

  // Semáforo Pastel & Acentos Limpios
  safeGreen: '#10B981',
  safeGreenPastel: '#E3F9F1',
  warningAmber: '#D97706',
  warningAmberDot: '#F59E0B',
  warningAmberPastel: '#FFF5E5',
  warningAmberCardBg: '#FDF6EA',
  warningAmberBorder: '#F7E3C0',
  dangerRed: '#EF4444',
  dangerRedPastel: '#FEE2E2',
  dangerRedCardBg: '#FEF2F2',
  dangerRedBorder: '#FECACA',

  // Compatibilidad con imports previos
  background: '#F4F6FB',
  cardBackground: '#FFFFFF',
  cardElevated: '#F8FAFC',
  border: '#E5E9F2',
  brandCyan: '#4F46E5',
  brandCyanMuted: '#ECEBFF',
  textPrimary: '#131726',
  safeGreenBg: '#E3F9F1',
  warningYellow: '#D97706',
  warningYellowBg: '#FFF5E5',
  dangerRedBg: '#FEE2E2',
  coldBlue: '#0284C7',
  coldBlueBg: '#E0F2FE',
} as const;

export interface CarPaintOption {
  id: string;
  name: string;
  bodyMain: string;
  bodyDark: string;
  bodyHighlight: string;
}

export const CAR_PAINT_OPTIONS: CarPaintOption[] = [
  {
    id: 'indigo',
    name: 'Azul Índigo',
    bodyMain: '#28266E',
    bodyDark: '#1B1952',
    bodyHighlight: '#4845A3',
  },
  {
    id: 'silver',
    name: 'Gris Platino',
    bodyMain: '#475569',
    bodyDark: '#1E293B',
    bodyHighlight: '#94A3B8',
  },
  {
    id: 'crimson',
    name: 'Rojo Flash',
    bodyMain: '#B91C1C',
    bodyDark: '#7F1D1D',
    bodyHighlight: '#EF4444',
  },
  {
    id: 'pearl',
    name: 'Blanco Cristal',
    bodyMain: '#E2E8F0',
    bodyDark: '#94A3B8',
    bodyHighlight: '#FFFFFF',
  },
];

export const DEFAULT_EXCHANGE_RATE_ARS = 1150;

export function formatARS(amountUsd: number, exchangeRate: number = DEFAULT_EXCHANGE_RATE_ARS): string {
  const ars = Math.round((amountUsd * exchangeRate) / 500) * 500;
  return `$${ars.toLocaleString('es-AR')}`;
}
