import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  SlidersHorizontal,
  Thermometer,
  BatteryCharging,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  Bluetooth,
  Smartphone,
  ShieldCheck,
} from 'lucide-react-native';
import { LiveTelemetryFrame, ScenarioId } from '../modules/obd2-engine/types';
import {
  ComponenteEvaluado,
  ResumenChequeoMedico,
} from '../modules/medical-checkup/checkupEngine';
import { Car3DShowcase, CarPaintOption } from '../components/Car3DShowcase';
import { DemoControlBar } from '../components/DemoControlBar';
import { CheckupComponentCard } from '../components/CheckupComponentCard';
import { Colors } from '../theme/colors';

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

  // Componentes que requieren atención ('revisar' o 'pronto'), priorizando correa
  const componentesAtencion = chequeo.componentes
    .filter(
      (c) => c.aplicaAlModelo && (c.estado === 'revisar' || c.estado === 'pronto')
    )
    .sort((a, b) => (a.esCritico === b.esCritico ? 0 : a.esCritico ? -1 : 1));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top App Bar Mobile: Título + Botón para abrir la Burbuja de Garage */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.greetingSup}>CONTROL DE SALUD VEHICULAR</Text>
          <Text style={styles.pageTitle}>Resumen</Text>
        </View>

        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={styles.editAutoPill}
            onPress={onOpenGarageSheet}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={14} color={Colors.brandPrimaryDark} />
            <Text style={styles.editAutoPillText}>Mi auto / Color</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selector rápido de modo: Sin Dongle (Estimado) vs Con Dongle (Medido en vivo) */}
      <View style={styles.connectionBanner}>
        <View style={styles.connectionLeft}>
          {chequeo.dongleConectado ? (
            <Bluetooth size={15} color={Colors.brandPrimary} />
          ) : (
            <Smartphone size={15} color={Colors.textSecondary} />
          )}
          <Text style={styles.connectionText}>
            {chequeo.dongleConectado
              ? 'Dongle OBD2 activo · Midiendo signos vitales'
              : 'Modo sin dongle · Calculado por km, fecha y manual'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.switchDongleBtn}
          onPress={onToggleDongle}
          activeOpacity={0.8}
        >
          <Text style={styles.switchDongleText}>
            {chequeo.dongleConectado ? 'Probar sin dongle' : 'Conectar OBD2'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Si el dongle está conectado, mostramos el simulador interactivo de escenarios */}
      {chequeo.dongleConectado && (
        <DemoControlBar
          activeScenario={activeScenario}
          onSelectScenario={onSelectScenario}
        />
      )}

      {/* Hero Section: Vehículo 3D/SVG (Al tocar la tuerca o el auto abre la Burbuja Flotante desde abajo) */}
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

      {/* RESUMEN ÚNICO ARRIBA DE TODO: "¿Cómo está mi auto?" */}
      <TouchableOpacity
        style={styles.medicalSummaryCard}
        onPress={onOpenCheckupTab}
        activeOpacity={0.88}
      >
        <View style={styles.summaryTopRow}>
          <View style={styles.summaryTitleCol}>
            <Text style={styles.summarySup}>¿CÓMO ESTÁ MI AUTO HOY?</Text>
            <Text style={styles.summaryHeadline}>{chequeo.tituloResumen}</Text>
            <Text style={styles.summarySub}>{chequeo.subtituloResumen}</Text>
          </View>
          <View style={styles.summaryArrowCircle}>
            <ChevronRight size={18} color={Colors.brandPrimaryDark} />
          </View>
        </View>

        {/* Contadores de los 4 estados del Chequeo Médico */}
        <View style={styles.countsGrid}>
          <View style={[styles.countPill, { backgroundColor: Colors.safeGreenBg }]}>
            <CheckCircle2 size={13} color={Colors.safeGreenDark} />
            <Text style={[styles.countPillText, { color: Colors.safeGreenDark }]}>
              {chequeo.conteo.bien} Bien
            </Text>
          </View>

          <View style={[styles.countPill, { backgroundColor: Colors.warnAmberBg }]}>
            <Clock size={13} color={Colors.warnAmberDark} />
            <Text style={[styles.countPillText, { color: Colors.warnAmberDark }]}>
              {chequeo.conteo.pronto} Pronto
            </Text>
          </View>

          <View style={[styles.countPill, { backgroundColor: Colors.dangerRedBg }]}>
            <AlertTriangle size={13} color={Colors.dangerRedDark} />
            <Text style={[styles.countPillText, { color: Colors.dangerRedDark }]}>
              {chequeo.conteo.revisar} Revisar
            </Text>
          </View>

          <View style={[styles.countPill, { backgroundColor: Colors.bgElevated }]}>
            <HelpCircle size={13} color={Colors.textSecondary} />
            <Text style={[styles.countPillText, { color: Colors.textSecondary }]}>
              {chequeo.conteo.sinDatos} Sin datos
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* SIGNOS VITALES (Solo medidos en vivo si hay dongle, o aclaración honesta si no hay) */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>SIGNOS VITALES</Text>
          <Text style={styles.sectionSubLabel}>
            {chequeo.dongleConectado ? 'Medido en vivo por OBD2' : 'Opcional con dongle'}
          </Text>
        </View>

        {chequeo.dongleConectado ? (
          <View style={styles.vitalsRow}>
            <View style={styles.vitalCard}>
              <View style={styles.vitalTop}>
                <View
                  style={[
                    styles.vitalIconWrap,
                    {
                      backgroundColor:
                        frame.coolantTempC >= 100
                          ? Colors.dangerRedBg
                          : Colors.infoSkyBg,
                    },
                  ]}
                >
                  <Thermometer
                    size={18}
                    color={
                      frame.coolantTempC >= 100
                        ? Colors.dangerRed
                        : Colors.infoSky
                    }
                  />
                </View>
                <View style={styles.measuredTag}>
                  <Text style={styles.measuredTagText}>Medido</Text>
                </View>
              </View>
              <Text style={styles.vitalValue}>
                {Math.round(frame.coolantTempC)}°C
              </Text>
              <Text style={styles.vitalLabel}>Temperatura motor</Text>
              <Text
                style={[
                  styles.vitalStatusText,
                  {
                    color:
                      frame.coolantTempC >= 100
                        ? Colors.dangerRedDark
                        : Colors.safeGreenDark,
                  },
                ]}
              >
                {frame.coolantTempC >= 100
                  ? 'Revisar: Muy caliente'
                  : 'Bien (Rango normal ~90°C)'}
              </Text>
            </View>

            <View style={styles.vitalCard}>
              <View style={styles.vitalTop}>
                <View
                  style={[
                    styles.vitalIconWrap,
                    {
                      backgroundColor:
                        frame.voltageInstantV < 13.2
                          ? Colors.dangerRedBg
                          : Colors.safeGreenBg,
                    },
                  ]}
                >
                  <BatteryCharging
                    size={18}
                    color={
                      frame.voltageInstantV < 13.2
                        ? Colors.dangerRed
                        : Colors.safeGreenDark
                    }
                  />
                </View>
                <View style={styles.measuredTag}>
                  <Text style={styles.measuredTagText}>Medido</Text>
                </View>
              </View>
              <Text style={styles.vitalValue}>
                {frame.voltageInstantV.toFixed(1)} V
              </Text>
              <Text style={styles.vitalLabel}>Carga eléctrica</Text>
              <Text
                style={[
                  styles.vitalStatusText,
                  {
                    color:
                      frame.voltageInstantV < 13.2
                        ? Colors.dangerRedDark
                        : Colors.safeGreenDark,
                  },
                ]}
              >
                {frame.voltageInstantV < 13.2
                  ? 'Revisar carga de alternador'
                  : 'Bien (Alternador cargando)'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noDongleHonestCard}>
            <ShieldCheck size={18} color={Colors.brandPrimary} />
            <View style={styles.noDongleTextCol}>
              <Text style={styles.noDongleTitle}>
                Chequeo preventivo funcionando sin dongle
              </Text>
              <Text style={styles.noDongleDesc}>
                Tus controles de aceite, correa, frenos y neumáticos se calculan
                con los kilómetros y el manual de tu {chequeo.modelo.modelo}. No
                necesitás enchufar nada para llevar tu auto al día.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* COMPONENTES PARA ATENDER PRONTO O REVISAR */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>
            {componentesAtencion.length > 0
              ? 'ATENCIÓN SUGERIDA'
              : 'ESTUDIOS DE RUTINA'}
          </Text>
          <TouchableOpacity onPress={onOpenCheckupTab}>
            <Text style={styles.seeAllLink}>Ver los 8 componentes</Text>
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
            <CheckCircle2 size={24} color={Colors.safeGreenDark} />
            <Text style={styles.allGoodTitle}>
              No tenés vencimientos urgentes este mes
            </Text>
            <Text style={styles.allGoodSub}>
              Tocá "Ver los 8 componentes" para revisar el porcentaje de cada
              uno o completar los que están sin datos.
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
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greetingSup: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
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
    gap: 8,
  },
  editAutoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgHigh,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6D0F5',
    borderBottomWidth: 3,
    borderBottomColor: '#C2B9EC',
  },
  editAutoPillText: {
    color: Colors.brandPrimaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  connectionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  connectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  connectionText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  switchDongleBtn: {
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  switchDongleText: {
    color: Colors.brandPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  medicalSummaryCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E5E0FA',
    borderBottomWidth: 4,
    borderBottomColor: '#D0C9F0',
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  summarySup: {
    color: Colors.brandPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  summaryHeadline: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 3,
  },
  summarySub: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  summaryArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  sectionSubLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  seeAllLink: {
    color: Colors.brandPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  vitalCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E5E0FA',
    borderBottomWidth: 4,
    borderBottomColor: '#D0C9F0',
  },
  vitalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  measuredTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  measuredTagText: {
    color: Colors.brandPrimary,
    fontSize: 10,
    fontWeight: '800',
  },
  vitalValue: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  vitalLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  vitalStatusText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  noDongleHonestCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#E5E0FA',
    borderBottomWidth: 4,
    borderBottomColor: '#D0C9F0',
  },
  noDongleTextCol: {
    flex: 1,
  },
  noDongleTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  noDongleDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  allGoodCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  allGoodTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },
  allGoodSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 17,
  },
});
