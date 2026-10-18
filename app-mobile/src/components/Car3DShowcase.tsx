import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Settings, Rotate3d } from 'lucide-react-native';
import { Colors, FontFamily } from '../theme/colors';
import { TipoCarroceria } from '../modules/medical-checkup/checkupEngine';
import { Car3DWebGLCanvas } from './Car3DWebGLCanvas';

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
    topStop: '#60A5FA',
    midStop: '#3B82F6',
    bottomStop: '#2563EB',
    swatch: '#2563EB',
  },
  {
    id: 'crystal-white',
    name: 'Blanco',
    topStop: '#FFFFFF',
    midStop: '#F1F5F9',
    bottomStop: '#CBD5E1',
    swatch: '#F1F5F9',
  },
  {
    id: 'platinum-silver',
    name: 'Gris Plata',
    topStop: '#E2E8F0',
    midStop: '#94A3B8',
    bottomStop: '#64748B',
    swatch: '#94A3B8',
  },
  {
    id: 'crimson-red',
    name: 'Rojo',
    topStop: '#F87171',
    midStop: '#EF4444',
    bottomStop: '#DC2626',
    swatch: '#EF4444',
  },
  {
    id: 'obsidian-dark',
    name: 'Negro',
    topStop: '#475569',
    midStop: '#1E293B',
    bottomStop: '#0F172A',
    swatch: '#1E293B',
  },
];

export const UNIVERSAL_BODY_TYPES: {
  id: TipoCarroceria;
  label: string;
}[] = [
  { id: 'hatchback', label: 'Hatchback' },
  { id: 'sedan', label: 'Sedán' },
  { id: 'pickup', label: 'Pick-up' },
  { id: 'suv', label: 'SUV' },
];

interface VectorProps {
  paint: CarPaintOption;
  bodyType?: TipoCarroceria;
  overallStatus?: 'GREEN' | 'YELLOW' | 'RED';
  height?: number;
  interactive?: boolean;
}

/**
 * Visor 3D Real con fondo transparente/blanco y sombra suave debajo.
 */
export const CarVectorIllustration: React.FC<VectorProps> = ({
  paint,
  bodyType = 'hatchback',
  height = 155,
  interactive = true,
}) => {
  return (
    <Car3DWebGLCanvas
      bodyType={bodyType}
      paintHex={paint.swatch}
      height={height}
      interactive={interactive}
    />
  );
};

interface Props {
  vehicleName: string;
  vehicleTrim?: string;
  vehicleYear: number;
  plate: string;
  bodyType?: TipoCarroceria;
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
  bodyType = 'hatchback',
  selectedPaint,
  overallStatus,
  statusHeadline,
  onOpenGarageSheet,
  onPressStatusBadge,
}) => {
  const [previewBody, setPreviewBody] = useState<TipoCarroceria>(bodyType);

  useEffect(() => {
    setPreviewBody(bodyType);
  }, [bodyType]);

  const statusConfig =
    overallStatus === 'GREEN'
      ? {
          dot: Colors.safeGreen,
          bg: Colors.safeGreenBg,
          text: Colors.safeGreenDark,
        }
      : overallStatus === 'YELLOW'
      ? {
          dot: Colors.warnAmber,
          bg: Colors.warnAmberBg,
          text: Colors.warnAmberDark,
        }
      : {
          dot: Colors.dangerRed,
          bg: Colors.dangerRedBg,
          text: Colors.dangerRedDark,
        };

  return (
    <View style={styles.whiteStudioCard}>
      {/* Top Row: Nombre del Auto + Botón Tuerca */}
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
          <Settings size={18} color={Colors.textPrimary} strokeWidth={2.1} />
        </TouchableOpacity>
      </View>

      {/* Selector de las 4 Carrocerías Universales (Hatchback, Sedán, Pick-up, SUV) */}
      <View style={styles.bodyTypeSelectorRow}>
        {UNIVERSAL_BODY_TYPES.map((bt) => {
          const active = previewBody === bt.id;
          return (
            <TouchableOpacity
              key={bt.id}
              style={[
                styles.bodyTypePill,
                active && styles.bodyTypePillActive,
              ]}
              onPress={() => setPreviewBody(bt.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.bodyTypePillText,
                  active && styles.bodyTypePillTextActive,
                ]}
              >
                {bt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Escenario 3D Real sobre fondo blanco con sombra suave abajo */}
      <View style={styles.carStageWhite}>
        <Car3DWebGLCanvas
          bodyType={previewBody}
          paintHex={selectedPaint.swatch}
          height={175}
          interactive={true}
        />
        <View style={styles.rotateHint}>
          <Rotate3d size={12} color={Colors.textMuted} />
          <Text style={styles.rotateHintText}>Arrastrá para girar 360°</Text>
        </View>
      </View>

      {/* Píldora inferior de estado general */}
      <TouchableOpacity
        style={[styles.statusPillBottom, { backgroundColor: statusConfig.bg }]}
        onPress={onPressStatusBadge}
        activeOpacity={0.85}
      >
        <View
          style={[styles.statusDot, { backgroundColor: statusConfig.dot }]}
        />
        <Text
          style={[styles.statusPillText, { color: statusConfig.text }]}
          numberOfLines={1}
        >
          {statusHeadline}
        </Text>
        <ChevronRight size={15} color={statusConfig.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  whiteStudioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleCol: {
    flex: 1,
    paddingRight: 12,
  },
  vehicleMainTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  vehicleSubTitle: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 2,
  },
  gearBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyTypeSelectorRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgPrimary,
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  bodyTypePill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyTypePillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  bodyTypePillText: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 11.5,
    fontWeight: '500',
  },
  bodyTypePillTextActive: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  carStageWhite: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  rotateHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -6,
    marginBottom: 8,
  },
  rotateHintText: {
    fontFamily: FontFamily,
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  statusPillBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 8,
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
    fontSize: 12.5,
    fontWeight: '600',
  },
});
