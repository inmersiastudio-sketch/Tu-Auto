import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Thermometer,
  BatteryCharging,
  CheckCircle2,
  Bluetooth,
  Sparkles,
} from 'lucide-react-native';
import { LiveTelemetryFrame, ScenarioId } from '../modules/obd2-engine/types';
import {
  ComponenteEvaluado,
  ResumenChequeoMedico,
} from '../modules/medical-checkup/checkupEngine';
import { Car3DShowcase, CarPaintOption } from '../components/Car3DShowcase';
import { DemoControlBar } from '../components/DemoControlBar';
import { CheckupComponentCard } from '../components/CheckupComponentCard';
import { Colors, FontFamily } from '../theme/colors';

interface Props {
  chequeo: ResumenChequeoMedico;
  selectedPaint: CarPaintOption;
  frame: LiveTelemetryFrame;
  activeScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  onToggleDongle: () => void;
  onOpenGarageSheet: () => void;
  onOpenCheckupTab: () => void;
  onOpenComponentSheet: (item: ComponenteEvaluado) => void;
}

export const DashboardScreen: React.FC<Props> = ({
  chequeo,
  selectedPaint,
  frame,
  activeScenario,
  onSelectScenario,
  onToggleDongle,
  onOpenGarageSheet,
  onOpenCheckupTab,
  onOpenComponentSheet,
}) => {
  const overallHeroColor: 'GREEN' | 'YELLOW' | 'RED' =
    chequeo.estadoGlobal === 'revisar'
      ? 'RED'
      : chequeo.estadoGlobal === 'pronto'
      ? 'YELLOW'
      : 'GREEN';

  const componentesAtencion = chequeo.componentes
    .filter(
      (c) =>
        c.aplicaAlModelo &&
        (c.estado === 'revisar' ||
          c.estado === 'pronto' ||
          c.estado === 'sin_datos')
    )
    .sort((a, b) => (a.esCritico === b.esCritico ? 0 : a.esCritico ? -1 : 1));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar Minimalista */}
      <View style={styles.topHeader}>
        <Text style={styles.pageTitle}>Mi Auto</Text>

        <TouchableOpacity
          style={[
            styles.modeChip,
            chequeo.dongleConectado && styles.modeChipActive,
          ]}
          onPress={onToggleDongle}
          activeOpacity={0.8}
        >
          {chequeo.dongleConectado ? (
            <Bluetooth size={13} color={Colors.brandPrimary} />
          ) : (
            <Sparkles size={13} color={Colors.textSecondary} />
          )}
          <Text
            style={[
              styles.modeChipText,
              chequeo.dongleConectado && styles.modeChipTextActive,
            ]}
          >
            {chequeo.dongleConectado ? 'OBD2 en vivo' : 'Por km'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Si el dongle está activo, controles de simulación */}
      {chequeo.dongleConectado && (
        <DemoControlBar
          activeScenario={activeScenario}
          onSelectScenario={onSelectScenario}
        />
      )}

      {/* Hero Card con el Auto 3D/SVG */}
      <Car3DShowcase
        vehicleName={`${chequeo.modelo.marca} ${chequeo.modelo.modelo}`}
        vehicleTrim={`${chequeo.modelo.motor} · ${chequeo.kmActuales.toLocaleString('es-AR')} km`}
        vehicleYear={2021}
        plate="AE 492 KL"
        selectedPaint={selectedPaint}
        overallStatus={overallHeroColor}
        statusHeadline={chequeo.tituloResumen}
        isDriving={chequeo.dongleConectado && frame.rpm > 400}
        rpm={frame.rpm}
        onOpenGarageSheet={onOpenGarageSheet}
        onPressStatusBadge={onOpenCheckupTab}
      />

      {/* Signos Vitales Compactos (Solo cuando el OBD2 está conectado) */}
      {chequeo.dongleConectado && (
        <View style={styles.vitalsRow}>
          <View style={styles.vitalCard}>
            <Thermometer
              size={18}
              color={
                frame.coolantTempC >= 100 ? Colors.dangerRed : Colors.infoSky
              }
            />
            <View>
              <Text style={styles.vitalValue}>
                {Math.round(frame.coolantTempC)}°C
              </Text>
              <Text style={styles.vitalLabel}>Temperatura</Text>
            </View>
          </View>

          <View style={styles.vitalCard}>
            <BatteryCharging
              size={18}
              color={
                frame.voltageInstantV < 13.2
                  ? Colors.dangerRed
                  : Colors.safeGreenDark
              }
            />
            <View>
              <Text style={styles.vitalValue}>
                {frame.voltageInstantV.toFixed(1)} V
              </Text>
              <Text style={styles.vitalLabel}>Batería</Text>
            </View>
          </View>
        </View>
      )}

      {/* Lista Limpia de Prioridades */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {componentesAtencion.length > 0 ? 'Próximos cuidados' : 'Todo al día'}
          </Text>
          <TouchableOpacity onPress={onOpenCheckupTab} activeOpacity={0.75}>
            <Text style={styles.seeAllLink}>Ver los 8 puntos</Text>
          </TouchableOpacity>
        </View>

        {componentesAtencion.length > 0 ? (
          componentesAtencion.map((item) => (
            <CheckupComponentCard
              key={item.id}
              item={item}
              kmActuales={chequeo.kmActuales}
              onOpenComponentSheet={onOpenComponentSheet}
            />
          ))
        ) : (
          <View style={styles.allGoodCard}>
            <CheckCircle2 size={22} color={Colors.safeGreenDark} />
            <Text style={styles.allGoodTitle}>
              Todo en orden por ahora
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 105,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  modeChipActive: {
    backgroundColor: Colors.brandLight,
  },
  modeChipText: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  modeChipTextActive: {
    color: Colors.brandPrimaryDark,
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  vitalCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  vitalValue: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  vitalLabel: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 11.5,
    fontWeight: '400',
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  seeAllLink: {
    fontFamily: FontFamily,
    color: Colors.brandPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  allGoodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  allGoodTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
