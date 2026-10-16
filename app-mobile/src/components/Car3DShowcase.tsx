import React, { useState } from 'react';
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
import { ChevronRight, Settings, MapPin, ShieldAlert } from 'lucide-react-native';
import { Colors } from '../theme/colors';

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
    name: 'Azul Índigo',
    topStop: '#E0E7FF',
    midStop: '#A5B4FC',
    bottomStop: '#6366F1',
    swatch: '#6366F1',
  },
  {
    id: 'crystal-white',
    name: 'Blanco Puro',
    topStop: '#FFFFFF',
    midStop: '#E2E8F0',
    bottomStop: '#94A3B8',
    swatch: '#F8FAFC',
  },
  {
    id: 'platinum-silver',
    name: 'Gris Platino',
    topStop: '#E2E8F0',
    midStop: '#94A3B8',
    bottomStop: '#475569',
    swatch: '#94A3B8',
  },
  {
    id: 'crimson-red',
    name: 'Rojo Tornado',
    topStop: '#FECACA',
    midStop: '#F87171',
    bottomStop: '#DC2626',
    swatch: '#EF4444',
  },
  {
    id: 'obsidian-dark',
    name: 'Negro Ninja',
    topStop: '#64748B',
    midStop: '#334155',
    bottomStop: '#0F172A',
    swatch: '#1E293B',
  },
];

interface Props {
  vehicleName: string;
  vehicleTrim?: string;
  vehicleYear: number;
  plate: string;
  overallStatus: 'GREEN' | 'YELLOW' | 'RED';
  statusHeadline: string;
  isDriving: boolean;
  rpm?: number;
  onPressStatusBadge?: () => void;
}

export const Car3DShowcase: React.FC<Props> = ({
  vehicleName,
  vehicleTrim = '1.6 MSI',
  vehicleYear,
  plate,
  overallStatus,
  statusHeadline,
  isDriving,
  rpm = 0,
  onPressStatusBadge,
}) => {
  const [selectedPaint, setSelectedPaint] = useState<CarPaintOption>(CAR_PAINTS[0]);
  const [showPaintSelector, setShowPaintSelector] = useState(false);

  const statusDotColor =
    overallStatus === 'GREEN'
      ? '#4ADE80'
      : overallStatus === 'YELLOW'
      ? '#FBBF24'
      : '#F87171';

  return (
    <View style={styles.heroCard}>
      {/* Anillos concéntricos sutiles de estudio automotriz (Stitch Hero Visual) */}
      <View style={styles.concentricRingsContainer} pointerEvents="none">
        <View style={styles.ringOuter} />
        <View style={styles.ringInner} />
      </View>

      {/* Top Bar: Píldora del vehículo conectado + Botón Settings */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.vehiclePill}
          onPress={() => setShowPaintSelector(!showPaintSelector)}
          activeOpacity={0.8}
        >
          <View style={[styles.liveDot, { backgroundColor: statusDotColor }]} />
          <Text style={styles.vehiclePillText}>
            VW Gol {vehicleYear} • Conectado
          </Text>
          <ChevronRight size={14} color="rgba(255,255,255,0.75)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsCircleBtn}
          onPress={() => setShowPaintSelector(!showPaintSelector)}
          activeOpacity={0.8}
        >
          <Settings size={18} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>
      </View>

      {/* Selector desplegable de pintura del modelo 3D/SVG (al tocar la ruedita) */}
      {showPaintSelector && (
        <View style={styles.paintDrawer}>
          <Text style={styles.paintDrawerLabel}>
            PERSONALIZAR PINTURA DEL VEHÍCULO ({plate})
          </Text>
          <View style={styles.paintSwatchesRow}>
            {CAR_PAINTS.map((paint) => {
              const active = paint.id === selectedPaint.id;
              return (
                <TouchableOpacity
                  key={paint.id}
                  style={[
                    styles.swatchChip,
                    active && styles.swatchChipActive,
                  ]}
                  onPress={() => setSelectedPaint(paint)}
                >
                  <View
                    style={[
                      styles.swatchCircle,
                      { backgroundColor: paint.swatch },
                    ]}
                  />
                  <Text
                    style={[
                      styles.swatchText,
                      active && styles.swatchTextActive,
                    ]}
                  >
                    {paint.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Título del Vehículo y Subtítulo (Stitch Header inside Hero) */}
      <View style={styles.titleBlock}>
        <Text style={styles.vehicleMainTitle}>{vehicleName}</Text>
        <Text style={styles.vehicleSubTitle}>
          {vehicleTrim} • {selectedPaint.name}
        </Text>
      </View>

      {/* Escenario 3D/SVG del Hatchback (Exactamente el vector de Google Stitch + Pintura Dinámica) */}
      <View style={styles.carStageContainer}>
        <Svg width="100%" height={145} viewBox="0 0 280 140">
          <Defs>
            <LinearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={selectedPaint.topStop} />
              <Stop offset="50%" stopColor={selectedPaint.midStop} />
              <Stop offset="100%" stopColor={selectedPaint.bottomStop} />
            </LinearGradient>
            <LinearGradient id="carGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#1E1B4B" />
              <Stop offset="100%" stopColor="#312E81" />
            </LinearGradient>
            <RadialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#0F0A3C" stopOpacity="0.6" />
              <Stop offset="100%" stopColor="#0F0A3C" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Sombra proyectada en el piso */}
          <Ellipse cx="140" cy="118" rx="115" ry="14" fill="url(#floorShadow)" />

          {/* Silueta principal Hatchback (VW Gol Trend Stitch Vector) */}
          <Path
            d="M32,92 C28,92 24,86 25,78 C26,68 34,62 48,58 L84,32 C96,24 115,21 155,22 C188,23 208,30 222,46 L246,56 C255,60 260,68 258,80 C257,88 252,92 244,92 L228,92 C228,76 214,66 198,66 C182,66 168,76 168,92 L112,92 C112,76 98,66 82,66 C66,66 52,76 52,92 Z"
            fill="url(#carBody)"
          />

          {/* Cabina vidriada (Parabrisas y ventanillas) */}
          <Path
            d="M90,36 C100,29 116,27 152,27 C180,27 196,33 208,46 L154,48 L154,27 M146,27 L146,48 L76,48 Z"
            fill="url(#carGlass)"
          />

          {/* Líneas de carácter lateral y reflejos de carrocería */}
          <Path
            d="M48,62 L248,62"
            stroke="#FFFFFF"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Path
            d="M115,78 L165,78"
            stroke="#312E81"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Óptica delantera LED y faro trasero */}
          <Path
            d="M244,58 C252,61 256,66 255,72 L240,70 Z"
            fill="#FEF08A"
          />
          <Path
            d="M26,70 C26,64 30,60 36,59 L38,68 Z"
            fill="#F87171"
          />

          {/* Rueda Trasera con llanta de aleación */}
          <Circle cx="82" cy="92" r="22" fill="#1E1B4B" />
          <Circle cx="82" cy="92" r="14" fill="#C7D2FE" />
          <Circle cx="82" cy="92" r="5" fill="#312E81" />

          {/* Rueda Delantera con llanta de aleación */}
          <Circle cx="198" cy="92" r="22" fill="#1E1B4B" />
          <Circle cx="198" cy="92" r="14" fill="#C7D2FE" />
          <Circle cx="198" cy="92" r="5" fill="#312E81" />

          {/* Espejo retrovisor lateral */}
          <Rect x="195" y="43" width="12" height="7" rx="3.5" fill="#E0E7FF" />

          {/* Indicador luminoso sobre el capot cuando hay alerta preventiva o crítica */}
          {overallStatus !== 'GREEN' && (
            <Circle
              cx="222"
              cy="56"
              r="9"
              fill={overallStatus === 'RED' ? '#EF4444' : '#F59E0B'}
              fillOpacity="0.88"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          )}
        </Svg>
      </View>

      {/* Si hay alerta activa, mostramos píldora interactiva hacia Salud del Auto */}
      {overallStatus !== 'GREEN' && onPressStatusBadge && (
        <TouchableOpacity
          style={[
            styles.alertBannerInHero,
            overallStatus === 'RED' && styles.alertBannerRed,
          ]}
          onPress={onPressStatusBadge}
          activeOpacity={0.85}
        >
          <ShieldAlert size={16} color="#FFFFFF" />
          <Text style={styles.alertBannerText} numberOfLines={1}>
            {statusHeadline} — Tocar para ver diagnóstico
          </Text>
          <ChevronRight size={15} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Barra Inferior del Hero (Estado + Ubicación + Última sincronización) */}
      <View style={styles.bottomBar}>
        <View>
          <View style={styles.parkingStatusRow}>
            <View
              style={[
                styles.parkingDot,
                { backgroundColor: isDriving ? '#38BDF8' : '#4ADE80' },
              ]}
            />
            <Text style={styles.parkingStatusTitle}>
              {isDriving ? `En marcha (${Math.round(rpm)} RPM)` : 'Estacionado'}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={13} color="rgba(224,224,255,0.8)" />
            <Text style={styles.locationText}>Palermo, Buenos Aires</Text>
          </View>
        </View>

        <View style={styles.syncBlockRight}>
          <View style={styles.syncPill}>
            <Text style={styles.syncPillText}>Actualizado ahora</Text>
          </View>
          <Text style={styles.lastTripText}>Último viaje: ayer, 19:42</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: Colors.heroIndigoMid,
    borderRadius: 24,
    padding: 22,
    marginBottom: 22,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#2A14B4',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 8,
  },
  concentricRingsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    position: 'absolute',
  },
  ringInner: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    position: 'absolute',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 2,
  },
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vehiclePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  settingsCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paintDrawer: {
    backgroundColor: 'rgba(15, 10, 60, 0.55)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  paintDrawerLabel: {
    color: 'rgba(224,224,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  paintSwatchesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  swatchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  swatchChipActive: {
    backgroundColor: '#FFFFFF',
  },
  swatchCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  swatchText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  swatchTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  titleBlock: {
    marginBottom: 2,
    zIndex: 2,
  },
  vehicleMainTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  vehicleSubTitle: {
    color: 'rgba(224, 224, 255, 0.82)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  carStageContainer: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  alertBannerInHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 10,
    gap: 8,
  },
  alertBannerRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
  },
  alertBannerText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    zIndex: 2,
  },
  parkingStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  parkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  parkingStatusTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  locationText: {
    color: 'rgba(224, 224, 255, 0.82)',
    fontSize: 12,
  },
  syncBlockRight: {
    alignItems: 'flex-end',
  },
  syncPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  syncPillText: {
    color: 'rgba(224,224,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
  },
  lastTripText: {
    color: 'rgba(224,224,255,0.75)',
    fontSize: 11,
    marginTop: 4,
  },
});
