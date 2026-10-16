import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CarPaintOption, COLORS } from '../theme/colors';

/**
 * Componente Central 3D Estilizado del Vehículo con Puntos de Salud en Vivo
 * Muestra el auto con el color real elegido por el usuario, anillos de radar suaves
 * y etiquetas flotantes minimalistas cuando hay una alerta en capot/batería/agua.
 */

interface Car3DShowcaseProps {
  paint: CarPaintOption;
  onCyclePaint: () => void;
  waterTempC: number;
  voltageV: number;
  isOverheating: boolean;
  isElectricalAlert: boolean;
  hasEngineFault: boolean;
}

export const Car3DShowcase: React.FC<Car3DShowcaseProps> = ({
  paint,
  onCyclePaint,
  waterTempC,
  voltageV,
  isOverheating,
  isElectricalAlert,
  hasEngineFault,
}) => {
  const hoodAlertActive = isOverheating || isElectricalAlert || hasEngineFault;

  return (
    <View style={styles.StageContainer}>
      {/* Círculos concéntricos suaves de fondo (Estilo Radar Stitch) */}
      <View style={styles.radarOuter} />
      <View style={styles.radarMiddle} />
      <View style={styles.radarInner} />

      {/* Píldora flotante de estado sobre el capot (solo resalta si hay alerta o muestra paz mental) */}
      <View style={styles.floatingBadgesRow}>
        <View
          style={[
            styles.sensorChip,
            isOverheating && { backgroundColor: COLORS.dangerRed },
          ]}
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: isOverheating ? '#FFF' : '#34D399' },
            ]}
          />
          <Text style={styles.sensorChipText}>Agua {waterTempC}°C</Text>
        </View>

        <View
          style={[
            styles.sensorChip,
            isElectricalAlert && { backgroundColor: COLORS.dangerRed },
          ]}
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: isElectricalAlert ? '#FFF' : '#34D399' },
            ]}
          />
          <Text style={styles.sensorChipText}>{voltageV.toFixed(1)}V</Text>
        </View>

        <TouchableOpacity style={styles.paintChip} onPress={onCyclePaint}>
          <View style={[styles.paintSwatch, { backgroundColor: paint.bodyHighlight }]} />
          <Text style={styles.sensorChipText}>{paint.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Silueta 3D Multicapa del Vehículo (Con sombreado volumétrico y reflejos) */}
      <View style={styles.carWrapper}>
        {/* Resplandor de alerta en el motor (Capot) si algo falla */}
        {hoodAlertActive && <View style={styles.hoodAlertGlow} />}

        {/* Techo y Cabina */}
        <View style={[styles.carCabin, { backgroundColor: paint.bodyMain }]}>
          <View style={styles.windowsRow}>
            <View style={styles.windowRear} />
            <View style={styles.windowPillar} />
            <View style={styles.windowFront} />
          </View>
        </View>

        {/* Cuerpo Principal 3D con línea de reflejo superior */}
        <View style={[styles.carBody, { backgroundColor: paint.bodyMain }]}>
          <View
            style={[
              styles.carBodyHighlight,
              { backgroundColor: paint.bodyHighlight },
            ]}
          />
          <View
            style={[
              styles.carLowerSkirt,
              { backgroundColor: paint.bodyDark },
            ]}
          />
          {/* Óptica delantera LED y luz trasera */}
          <View style={styles.headlightLed} />
          <View style={styles.taillightLed} />
        </View>

        {/* Sombra de piso realista debajo del auto */}
        <View style={styles.floorShadow} />

        {/* Rueda Trasera y Rueda Delantera con llanta de aleación */}
        <View style={[styles.wheelOuter, styles.wheelLeft]}>
          <View style={styles.wheelRim}>
            <View style={styles.wheelHub} />
          </View>
        </View>

        <View style={[styles.wheelOuter, styles.wheelRight]}>
          <View style={styles.wheelRim}>
            <View style={styles.wheelHub} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  StageContainer: {
    height: 195,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 6,
  },
  radarOuter: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: COLORS.heroCircleRing,
  },
  radarMiddle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.heroCircleRing,
  },
  radarInner: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.heroCircleRing,
  },
  floatingBadgesRow: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  sensorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 23, 38, 0.28)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 5,
  },
  paintChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 5,
  },
  paintSwatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sensorChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  carWrapper: {
    width: 240,
    height: 110,
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  hoodAlertGlow: {
    position: 'absolute',
    left: 8,
    bottom: 28,
    width: 68,
    height: 48,
    borderRadius: 34,
    backgroundColor: 'rgba(239, 68, 68, 0.55)',
  },
  carCabin: {
    width: 136,
    height: 42,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 30,
    marginBottom: -4,
    marginLeft: 14,
    paddingTop: 6,
    paddingHorizontal: 12,
    zIndex: 2,
  },
  windowsRow: {
    flexDirection: 'row',
    height: 26,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#C7D2FE',
  },
  windowRear: {
    flex: 1,
    backgroundColor: '#C7D2FE',
  },
  windowPillar: {
    width: 6,
    backgroundColor: '#1E1B4B',
  },
  windowFront: {
    flex: 1.2,
    backgroundColor: '#DBEAFE',
  },
  carBody: {
    width: 226,
    height: 46,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 3,
  },
  carBodyHighlight: {
    position: 'absolute',
    top: 6,
    left: 18,
    right: 18,
    height: 7,
    borderRadius: 4,
    opacity: 0.45,
  },
  carLowerSkirt: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 14,
  },
  headlightLed: {
    position: 'absolute',
    left: 4,
    top: 16,
    width: 18,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F8FAFC',
  },
  taillightLed: {
    position: 'absolute',
    right: 4,
    top: 16,
    width: 14,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
  },
  floorShadow: {
    width: 220,
    height: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.32)',
    marginTop: 6,
  },
  wheelOuter: {
    position: 'absolute',
    bottom: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  wheelLeft: {
    left: 28,
  },
  wheelRight: {
    right: 28,
  },
  wheelRim: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelHub: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#475569',
  },
});
