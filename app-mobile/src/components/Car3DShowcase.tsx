import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Ellipse,
  Path,
  Circle,
  Rect,
} from 'react-native-svg';
import { ChevronRight, Settings } from 'lucide-react-native';
import { Colors, FontFamily } from '../theme/colors';

export interface CarPaintOption {
  id: string;
  name: string;
  topStop: string;
  midStop: string;
  bottomStop: string;
  swatch: string;
}

export const CAR_PAINTS: CarPaintOption[] = [
  {
    id: 'indigo-blue',
    name: 'Azul',
    topStop: '#E0E7FF',
    midStop: '#A5B4FC',
    bottomStop: '#6366F1',
    swatch: '#6366F1',
  },
  {
    id: 'crystal-white',
    name: 'Blanco',
    topStop: '#FFFFFF',
    midStop: '#E2E8F0',
    bottomStop: '#94A3B8',
    swatch: '#F8FAFC',
  },
  {
    id: 'platinum-silver',
    name: 'Gris',
    topStop: '#E2E8F0',
    midStop: '#94A3B8',
    bottomStop: '#475569',
    swatch: '#94A3B8',
  },
  {
    id: 'crimson-red',
    name: 'Rojo',
    topStop: '#FECACA',
    midStop: '#F87171',
    bottomStop: '#DC2626',
    swatch: '#EF4444',
  },
  {
    id: 'obsidian-dark',
    name: 'Negro',
    topStop: '#64748B',
    midStop: '#334155',
    bottomStop: '#0F172A',
    swatch: '#1E293B',
  },
];

interface VectorProps {
  paint: CarPaintOption;
  overallStatus?: 'GREEN' | 'YELLOW' | 'RED';
  height?: number;
}

export const CarVectorIllustration: React.FC<VectorProps> = ({
  paint,
  overallStatus = 'GREEN',
  height = 132,
}) => {
  return (
    <Svg width="100%" height={height} viewBox="0 0 280 135">
      <Defs>
        <LinearGradient id={`carBody-${paint.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={paint.topStop} />
          <Stop offset="50%" stopColor={paint.midStop} />
          <Stop offset="100%" stopColor={paint.bottomStop} />
        </LinearGradient>
        <LinearGradient id="carGlass" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#1E1B4B" />
          <Stop offset="100%" stopColor="#312E81" />
        </LinearGradient>
        <RadialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#0F0A3C" stopOpacity="0.55" />
          <Stop offset="100%" stopColor="#0F0A3C" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <Ellipse cx="140" cy="116" rx="112" ry="12" fill="url(#floorShadow)" />

      <Path
        d="M32,92 C28,92 24,86 25,78 C26,68 34,62 48,58 L84,32 C96,24 115,21 155,22 C188,23 208,30 222,46 L246,56 C255,60 260,68 258,80 C257,88 252,92 244,92 L228,92 C228,76 214,66 198,66 C182,66 168,76 168,92 L112,92 C112,76 98,66 82,66 C66,66 52,76 52,92 Z"
        fill={`url(#carBody-${paint.id})`}
      />

      <Path
        d="M90,36 C100,29 116,27 152,27 C180,27 196,33 208,46 L154,48 L154,27 M146,27 L146,48 L76,48 Z"
        fill="url(#carGlass)"
      />

      <Path
        d="M48,62 L248,62"
        stroke="#FFFFFF"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <Path d="M244,58 C252,61 256,66 255,72 L240,70 Z" fill="#FEF08A" />
      <Path d="M26,70 C26,64 30,60 36,59 L38,68 Z" fill="#F87171" />

      <Circle cx="82" cy="92" r="21" fill="#1E1B4B" />
      <Circle cx="82" cy="92" r="13" fill="#C7D2FE" />
      <Circle cx="82" cy="92" r="5" fill="#312E81" />

      <Circle cx="198" cy="92" r="21" fill="#1E1B4B" />
      <Circle cx="198" cy="92" r="13" fill="#C7D2FE" />
      <Circle cx="198" cy="92" r="5" fill="#312E81" />

      <Rect x="195" y="43" width="12" height="7" rx="3.5" fill={paint.topStop} />

      {overallStatus !== 'GREEN' && (
        <Circle
          cx="222"
          cy="56"
          r="8"
          fill={overallStatus === 'RED' ? '#EF4444' : '#F59E0B'}
          stroke="#FFFFFF"
          strokeWidth="2"
        />
      )}
    </Svg>
  );
};

interface Props {
  vehicleName: string;
  vehicleTrim?: string;
  vehicleYear: number;
  plate: string;
  selectedPaint: CarPaintOption;
  overallStatus: 'GREEN' | 'YELLOW' | 'RED';
  statusHeadline: string;
  isDriving: boolean;
  rpm?: number;
  onOpenGarageSheet: () => void;
  onPressStatusBadge?: () => void;
}

export const Car3DShowcase: React.FC<Props> = ({
  vehicleName,
  vehicleTrim = '1.6 MSI',
  selectedPaint,
  overallStatus,
  statusHeadline,
  onOpenGarageSheet,
  onPressStatusBadge,
}) => {
  const statusDotColor =
    overallStatus === 'GREEN'
      ? '#4ADE80'
      : overallStatus === 'YELLOW'
      ? '#FBBF24'
      : '#F87171';

  return (
    <View style={styles.heroCard}>
      {/* Top Row: Nombre del auto + Botón Tuerca redondo (sin desborde) */}
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <Text style={styles.vehicleMainTitle} numberOfLines={1}>
            {vehicleName}
          </Text>
          <Text style={styles.vehicleSubTitle} numberOfLines={1}>
            {vehicleTrim}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.gearBtn}
          onPress={onOpenGarageSheet}
          activeOpacity={0.75}
        >
          <Settings size={18} color="#FFFFFF" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      {/* Auto 3D/SVG central */}
      <TouchableOpacity
        style={styles.carStageContainer}
        onPress={onOpenGarageSheet}
        activeOpacity={0.92}
      >
        <CarVectorIllustration
          paint={selectedPaint}
          overallStatus={overallStatus}
          height={126}
        />
      </TouchableOpacity>

      {/* Píldora única inferior con el resumen del estado */}
      <TouchableOpacity
        style={styles.statusPillBottom}
        onPress={onPressStatusBadge}
        activeOpacity={0.85}
      >
        <View style={[styles.statusDot, { backgroundColor: statusDotColor }]} />
        <Text style={styles.statusPillText} numberOfLines={1}>
          {statusHeadline}
        </Text>
        <ChevronRight size={15} color="rgba(255,255,255,0.75)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: Colors.heroIndigoMid,
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#2A14B4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCol: {
    flex: 1,
    paddingRight: 12,
  },
  vehicleMainTitle: {
    fontFamily: FontFamily,
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  vehicleSubTitle: {
    fontFamily: FontFamily,
    color: 'rgba(224, 231, 255, 0.85)',
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 2,
  },
  gearBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carStageContainer: {
    marginVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPillBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 10, 60, 0.36)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPillText: {
    fontFamily: FontFamily,
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
