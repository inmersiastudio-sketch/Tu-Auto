import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Bell,
  User,
  Gauge,
  Thermometer,
  Wrench,
  Clock,
  ChevronRight,
  Zap,
  ShieldAlert,
} from 'lucide-react-native';
import { LiveTelemetryFrame, ScenarioId } from '../modules/obd2-engine/types';
import { ElectricalHealthReport } from '../modules/electrical-guard/electricalEngine';
import { ThermalHealthReport } from '../modules/thermal-shield/thermalEngine';
import { OilAndFluidReport } from '../modules/oil-tracker/oilEngine';
import { TranslatedFaultCard } from '../modules/fault-translator/faultCatalog';
import { Car3DShowcase } from '../components/Car3DShowcase';
import { DemoControlBar } from '../components/DemoControlBar';
import { Colors, DEFAULT_EXCHANGE_RATE_ARS } from '../theme/colors';

interface Props {
  vehicleName: string;
  plate: string;
  frame: LiveTelemetryFrame;
  electricalReport: ElectricalHealthReport;
  thermalReport: ThermalHealthReport;
  oilReport: OilAndFluidReport;
  activeFaults: TranslatedFaultCard[];
  activeScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  onOpenScanner: () => void;
  onOpenWallet: () => void;
}

export const DashboardScreen: React.FC<Props> = ({
  vehicleName,
  plate,
  frame,
  electricalReport,
  thermalReport,
  oilReport,
  activeFaults,
  activeScenario,
  onSelectScenario,
  onOpenScanner,
  onOpenWallet,
}) => {
  const worstStatus: 'GREEN' | 'YELLOW' | 'RED' =
    electricalReport.alternatorSeverity === 'ROJO' ||
    electricalReport.batteryStatus === 'ROJO' ||
    thermalReport.severity === 'ROJO' ||
    oilReport.severity === 'ROJO' ||
    activeFaults.some((f) => f.severity === 'ROJO')
      ? 'RED'
      : electricalReport.alternatorSeverity === 'AMARILLO' ||
        electricalReport.batteryStatus === 'AMARILLO' ||
        thermalReport.severity === 'AMARILLO' ||
        oilReport.severity === 'AMARILLO' ||
        activeFaults.length > 0
      ? 'YELLOW'
      : 'GREEN';

  const statusHeadline =
    worstStatus === 'RED'
      ? thermalReport.severity === 'ROJO'
        ? thermalReport.headline
        : electricalReport.alternatorSeverity === 'ROJO'
        ? electricalReport.alternatorHeadline
        : electricalReport.batteryHeadline
      : worstStatus === 'YELLOW'
      ? activeFaults.length > 0
        ? activeFaults[0].humanTitle
        : 'Mantenimiento preventivo sugerido'
      : 'Todo en orden para salir a manejar';

  const isDriving = frame.rpm > 400;
  const remainingServiceKm = Math.max(
    0,
    oilReport.intervalTargetKm - oilReport.equivalentWearKm
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top App Bar (Stitch Exact: BUEN DÍA / Resumen + Bell + User) */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.greetingSup}>BUEN DÍA</Text>
          <Text style={styles.pageTitle}>Resumen</Text>
        </View>
        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={onOpenScanner}
            activeOpacity={0.8}
          >
            <Bell size={19} color={Colors.textPrimary} />
            <View
              style={[
                styles.notifDot,
                {
                  backgroundColor:
                    worstStatus === 'GREEN' ? Colors.warnAmber : Colors.dangerRed,
                },
              ]}
            />
          </TouchableOpacity>
          <View style={styles.avatarCircle}>
            <User size={19} color={Colors.brandPrimaryDark} />
          </View>
        </View>
      </View>

      {/* Simulador OBD2 colapsable para pruebas en vivo */}
      <DemoControlBar
        activeScenario={activeScenario}
        onSelectScenario={onSelectScenario}
      />

      {/* Hero Section: Connected Vehicle Card con Vector Hatchback y Pintura Personalizable */}
      <Car3DShowcase
        vehicleName={vehicleName}
        vehicleTrim="1.6 MSI"
        vehicleYear={2021}
        plate={plate}
        overallStatus={worstStatus}
        statusHeadline={statusHeadline}
        isDriving={isDriving}
        rpm={frame.rpm}
        onPressStatusBadge={onOpenScanner}
      />

      {/* Quick Stats Grid: SEGUIMIENTO (3 Tarjetas Blancas Limpias con Iconos Vectoriales) */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>SEGUIMIENTO</Text>
          <Text style={styles.sectionSubLabel}>Sincronizado vía OBD2</Text>
        </View>

        <View style={styles.statsGrid}>
          {/* Stat 1: Kilómetros */}
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: Colors.safeGreenBg }]}>
              <Gauge size={18} color={Colors.safeGreenDark} />
            </View>
            <View>
              <Text style={styles.statValue}>
                {frame.odometerKm.toLocaleString('es-AR')}
              </Text>
              <Text style={styles.statTitle}>Kilómetros</Text>
              <Text style={[styles.statMicro, { color: Colors.safeGreenDark }]}>
                +320 esta sem.
              </Text>
            </View>
          </View>

          {/* Stat 2: Temperatura Motor / Agua */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={onOpenScanner}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.statIconWrap,
                {
                  backgroundColor:
                    thermalReport.severity === 'ROJO'
                      ? Colors.dangerRedBg
                      : Colors.infoSkyBg,
                },
              ]}
            >
              <Thermometer
                size={18}
                color={
                  thermalReport.severity === 'ROJO'
                    ? Colors.dangerRed
                    : Colors.infoSky
                }
              />
            </View>
            <View>
              <Text
                style={[
                  styles.statValue,
                  thermalReport.severity === 'ROJO' && { color: Colors.dangerRed },
                ]}
              >
                {Math.round(frame.coolantTempC)}°C
              </Text>
              <Text style={styles.statTitle}>Motor / Agua</Text>
              <Text
                style={[
                  styles.statMicro,
                  {
                    color:
                      thermalReport.severity === 'VERDE'
                        ? Colors.textMuted
                        : Colors.dangerRed,
                  },
                ]}
              >
                {thermalReport.severity === 'VERDE' ? 'Estable (90°C)' : 'Revisar ya'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Stat 3: Próximo Service */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={onOpenWallet}
            activeOpacity={0.85}
          >
            <View style={[styles.statIconWrap, { backgroundColor: Colors.warnAmberBg }]}>
              <Wrench size={18} color={Colors.warnAmberDark} />
            </View>
            <View>
              <Text style={styles.statValue}>
                {remainingServiceKm.toLocaleString('es-AR')} km
              </Text>
              <Text style={styles.statTitle}>Próx. service</Text>
              <Text style={[styles.statMicro, { color: Colors.warnAmberDark }]}>
                Vida aceite {Math.round(oilReport.oilLifeRemainingPercent)}%
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner Ámbar o Coral de Próximo Mantenimiento / Diagnóstico (Stitch Exact) */}
      <TouchableOpacity
        style={[
          styles.maintenanceBanner,
          worstStatus === 'RED' && styles.maintenanceBannerRed,
        ]}
        onPress={worstStatus === 'GREEN' ? onOpenWallet : onOpenScanner}
        activeOpacity={0.88}
      >
        <View
          style={[
            styles.bannerIconBox,
            worstStatus === 'RED' && styles.bannerIconBoxRed,
          ]}
        >
          {worstStatus === 'RED' ? (
            <ShieldAlert size={22} color={Colors.dangerRedDark} />
          ) : (
            <Clock size={22} color={Colors.warnAmberDark} />
          )}
        </View>

        <View style={styles.bannerTextCol}>
          <View style={styles.bannerTagRow}>
            <Text
              style={[
                styles.bannerTagText,
                worstStatus === 'RED' && { color: Colors.dangerRedDark },
              ]}
            >
              {worstStatus === 'GREEN'
                ? 'PRÓXIMO MANTENIMIENTO'
                : 'DIAGNÓSTICO DETECTADO'}
            </Text>
            <View
              style={[
                styles.bannerDot,
                {
                  backgroundColor:
                    worstStatus === 'RED' ? Colors.dangerRed : Colors.warnAmber,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.bannerTitle,
              worstStatus === 'RED' && { color: '#7F1D1D' },
            ]}
          >
            {worstStatus === 'GREEN'
              ? 'Cambio de aceite y revisión'
              : statusHeadline}
          </Text>
          <Text
            style={[
              styles.bannerSub,
              worstStatus === 'RED' && { color: Colors.dangerRedDark },
            ]}
          >
            {worstStatus === 'GREEN'
              ? `En ${oilReport.estimatedDaysRemaining} días • Estimado $65.000`
              : activeFaults.length > 0
              ? `Arreglar hoy: $${Math.round(activeFaults[0].fixTodayCostUsd.min * DEFAULT_EXCHANGE_RATE_ARS).toLocaleString('es-AR')} • Evitá gastar $${Math.round(activeFaults[0].ignoreDamageCostUsd * DEFAULT_EXCHANGE_RATE_ARS).toLocaleString('es-AR')}`
              : 'Tocar para ver explicación simple y costos'}
          </Text>
        </View>

        <View style={styles.bannerArrowCircle}>
          <ChevronRight
            size={18}
            color={worstStatus === 'RED' ? Colors.dangerRedDark : Colors.warnAmberDark}
          />
        </View>
      </TouchableOpacity>

      {/* Tarjeta Inferior Rápida de Salud Eléctrica y Sensores (Stitch Quick Health Insights) */}
      <TouchableOpacity
        style={styles.quickInsightCard}
        onPress={onOpenScanner}
        activeOpacity={0.85}
      >
        <View style={styles.quickLeftRow}>
          <View style={styles.quickIconBox}>
            <Zap size={20} color={Colors.brandPrimary} />
          </View>
          <View style={styles.quickTextWrap}>
            <Text style={styles.quickTitle}>
              Sistema eléctrico ({frame.voltageInstantV.toFixed(1)} V)
            </Text>
            <Text style={styles.quickSub} numberOfLines={1}>
              {electricalReport.alternatorSeverity === 'VERDE' &&
              electricalReport.batteryStatus === 'VERDE'
                ? 'Batería y alternador en rango óptimo'
                : electricalReport.alternatorSeverity !== 'VERDE'
                ? electricalReport.alternatorHeadline
                : electricalReport.batteryHeadline}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.okBadge,
            (electricalReport.alternatorSeverity !== 'VERDE' ||
              electricalReport.batteryStatus !== 'VERDE') &&
              styles.warnBadge,
          ]}
        >
          <View
            style={[
              styles.okDot,
              {
                backgroundColor:
                  electricalReport.alternatorSeverity === 'VERDE' &&
                  electricalReport.batteryStatus === 'VERDE'
                    ? Colors.safeGreen
                    : Colors.dangerRed,
              },
            ]}
          />
          <Text
            style={[
              styles.okBadgeText,
              (electricalReport.alternatorSeverity !== 'VERDE' ||
                electricalReport.batteryStatus !== 'VERDE') && {
                color: Colors.dangerRedDark,
              },
            ]}
          >
            {electricalReport.alternatorSeverity === 'VERDE' &&
            electricalReport.batteryStatus === 'VERDE'
              ? 'OK'
              : 'Ver'}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  greetingSup: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  topActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.bgPrimary,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  sectionSubLabel: {
    color: Colors.brandPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    justifyContent: 'space-between',
    minHeight: 118,
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statTitle: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statMicro: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  maintenanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.warnAmberBg,
    borderWidth: 1,
    borderColor: Colors.warnAmberBorder,
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  maintenanceBannerRed: {
    backgroundColor: Colors.dangerRedBg,
    borderColor: Colors.dangerRedBorder,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIconBoxRed: {
    backgroundColor: '#FEE2E2',
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerTagText: {
    color: Colors.warnAmberDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bannerTitle: {
    color: '#451A03',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  bannerSub: {
    color: Colors.warnAmberText,
    fontSize: 12,
    marginTop: 2,
  },
  bannerArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(253, 230, 138, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickInsightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  quickLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quickIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  quickTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  quickSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  okBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.safeGreenBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  warnBadge: {
    backgroundColor: Colors.dangerRedBg,
  },
  okDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  okBadgeText: {
    color: Colors.safeGreenDark,
    fontSize: 12,
    fontWeight: '800',
  },
});
