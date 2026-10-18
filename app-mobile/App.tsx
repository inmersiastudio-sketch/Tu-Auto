import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Car, ClipboardCheck, MessageSquareQuote } from 'lucide-react-native';
import { MockOBD2Provider } from './src/modules/obd2-engine/MockOBD2Provider';
import { LiveTelemetryFrame, ScenarioId } from './src/modules/obd2-engine/types';
import {
  CATALOGO_MODELOS_ARG,
  ComponenteId,
  ejecutarChequeoMedico,
  PerfilVehiculoUsuario,
} from './src/modules/medical-checkup/checkupEngine';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { OnboardingModal } from './src/components/OnboardingModal';
import { Colors } from './src/theme/colors';

type TabKey = 'RESUMEN' | 'CHEQUEO' | 'TALLER';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('RESUMEN');
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('NORMAL');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const providerRef = useRef(new MockOBD2Provider());

  // Estado del perfil del vehículo del usuario (funciona con o sin dongle)
  const [perfil, setPerfil] = useState<PerfilVehiculoUsuario>({
    modeloId: 'vw_gol_trend',
    anio: 2021,
    kmActuales: 56000,
    dongleConectado: false, // Arranca demostrando que el valor principal no depende del hardware
    luzTestigoDeclaradaPorUsuario: false,
    historial: {
      // Correa original de fábrica a los 56.000 km (intervalo 60.000 km -> 93% consumido -> 'pronto')
      correa_distribucion: {
        ultimoCambioKm: 0,
        mesesDesdeUltimoCambio: 42,
      },
      // Aceite hecho hace 8.200 km y 9 meses (intervalo 10.000 km -> 82% consumido -> 'pronto')
      aceite_filtro: {
        ultimoCambioKm: 47800,
        mesesDesdeUltimoCambio: 9,
      },
      // Filtro de aire hecho junto con el último cambio de aceite (55% consumido -> 'bien')
      filtro_aire: {
        ultimoCambioKm: 47800,
        mesesDesdeUltimoCambio: 6,
      },
      // Batería instalada hace 18 meses (50% consumido -> 'bien')
      bateria: {
        mesesDesdeUltimoCambio: 18,
      },
      // Refrigerante cambiado hace 12 meses (50% consumido -> 'bien')
      refrigerante: {
        ultimoCambioKm: 40000,
        mesesDesdeUltimoCambio: 12,
      },
      // Frenos y Neumáticos arrancan 'sin_datos' para no mostrar un 'Bien' falso
    },
  });

  const [frame, setFrame] = useState<LiveTelemetryFrame>({
    timestamp: Date.now(),
    connectionStatus: 'CONNECTED_SIMULATOR',
    activeScenario: 'NORMAL',
    rpm: 840,
    speedKmh: 42,
    coolantTempC: 90,
    coolantSlopeCPerMin: 0.2,
    voltageInstantV: 14.15,
    restingVoltageV: 12.6,
    lastCrankingMinV: 10.35,
    distanceSinceResetKm: 4820,
    odometerKm: 56000,
    idleTrafficHours: 48.5,
    lastOilChangeKm: 47800,
    activeDTCs: [],
    pendingDTCs: [],
  });

  useEffect(() => {
    const provider = providerRef.current;
    provider.connect();
    const unsubscribe = provider.subscribeTelemetry(
      (nextFrame: LiveTelemetryFrame) => {
        setFrame(nextFrame);
      }
    );

    return () => {
      unsubscribe();
      provider.disconnect();
    };
  }, []);

  const handleSelectScenario = (scenario: ScenarioId) => {
    setActiveScenario(scenario);
    providerRef.current.triggerSimulatedScenario(scenario);
  };

  const handleToggleDongle = () => {
    setPerfil((prev) => ({
      ...prev,
      dongleConectado: !prev.dongleConectado,
    }));
  };

  const handleToggleLuzTestigo = () => {
    setPerfil((prev) => ({
      ...prev,
      luzTestigoDeclaradaPorUsuario: !prev.luzTestigoDeclaradaPorUsuario,
    }));
  };

  const handleQuickUpdateComponent = (
    id: ComponenteId,
    preset: 'RECIEN_HECHO' | 'MITAD_VIDA' | 'POR_VENCER' | 'DESCONOCIDO'
  ) => {
    const modelo =
      CATALOGO_MODELOS_ARG.find((m) => m.id === perfil.modeloId) ??
      CATALOGO_MODELOS_ARG[0];
    const km = perfil.kmActuales;

    const intervaloKmMap: Partial<Record<ComponenteId, number>> = {
      aceite_filtro: modelo.intervalos.aceiteKm,
      correa_distribucion: modelo.intervalos.correaKm ?? 60000,
      refrigerante: modelo.intervalos.refrigeranteKm,
      frenos: modelo.intervalos.frenosKm,
      neumaticos: modelo.intervalos.neumaticosRotacionKm,
      filtro_aire: modelo.intervalos.filtroAireKm,
    };

    const intKm = intervaloKmMap[id] ?? 10000;

    let nuevoRegistro = {};
    if (preset === 'RECIEN_HECHO') {
      nuevoRegistro = {
        ultimoCambioKm: Math.max(0, km - Math.round(intKm * 0.15)),
        mesesDesdeUltimoCambio: 2,
      };
    } else if (preset === 'MITAD_VIDA') {
      nuevoRegistro = {
        ultimoCambioKm: Math.max(0, km - Math.round(intKm * 0.5)),
        mesesDesdeUltimoCambio: 6,
      };
    } else if (preset === 'POR_VENCER') {
      nuevoRegistro = {
        ultimoCambioKm: Math.max(0, km - Math.round(intKm * 0.88)),
        mesesDesdeUltimoCambio: 10,
      };
    } else {
      nuevoRegistro = {
        desconocidoPorCompraUsado: true,
      };
    }

    setPerfil((prev) => ({
      ...prev,
      historial: {
        ...prev.historial,
        [id]: nuevoRegistro,
      },
    }));
  };

  const chequeo = ejecutarChequeoMedico(
    perfil,
    perfil.dongleConectado
      ? {
          coolantTempC: frame.coolantTempC,
          voltageV: frame.voltageInstantV,
          rpm: frame.rpm,
          activeDTCs: frame.activeDTCs,
          pendingDTCs: frame.pendingDTCs,
        }
      : undefined
  );

  const hasAlertDot =
    chequeo.conteo.revisar > 0 || chequeo.conteo.pronto > 0;

  return (
    <SafeAreaView style={styles.outerShell}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgPrimary} />

      <View style={styles.mobileViewport}>
        <View style={styles.mainBody}>
          {activeTab === 'RESUMEN' && (
            <DashboardScreen
              chequeo={chequeo}
              frame={frame}
              activeScenario={activeScenario}
              onSelectScenario={handleSelectScenario}
              onToggleDongle={handleToggleDongle}
              onOpenOnboarding={() => setShowOnboarding(true)}
              onOpenCheckupTab={() => setActiveTab('CHEQUEO')}
              onQuickUpdateComponent={handleQuickUpdateComponent}
            />
          )}

          {activeTab === 'CHEQUEO' && (
            <ScannerScreen
              chequeo={chequeo}
              luzTestigoDeclarada={perfil.luzTestigoDeclaradaPorUsuario}
              onToggleLuzTestigo={handleToggleLuzTestigo}
              onOpenOnboarding={() => setShowOnboarding(true)}
              onQuickUpdateComponent={handleQuickUpdateComponent}
            />
          )}

          {activeTab === 'TALLER' && <WalletScreen chequeo={chequeo} />}
        </View>

        {/* Modal de Carga Inicial / Configuración de 3 Pasos */}
        <OnboardingModal
          visible={showOnboarding}
          perfilActual={perfil}
          onSavePerfil={setPerfil}
          onClose={() => setShowOnboarding(false)}
        />

        {/* Floating Bottom Pill Navigation Bar (3 Pestañas Mobile) */}
        <View style={styles.bottomNavWrapper} pointerEvents="box-none">
          <View style={styles.bottomNavPill}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'RESUMEN' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('RESUMEN')}
              activeOpacity={0.85}
            >
              <Car
                size={20}
                color={
                  activeTab === 'RESUMEN' ? '#FFFFFF' : Colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'RESUMEN' && styles.tabLabelActive,
                ]}
              >
                Resumen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'CHEQUEO' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('CHEQUEO')}
              activeOpacity={0.85}
            >
              <View style={styles.iconWithBadge}>
                <ClipboardCheck
                  size={20}
                  color={
                    activeTab === 'CHEQUEO' ? '#FFFFFF' : Colors.textSecondary
                  }
                />
                {hasAlertDot && activeTab !== 'CHEQUEO' && (
                  <View
                    style={[
                      styles.tabAlertDot,
                      chequeo.conteo.revisar > 0 && {
                        backgroundColor: Colors.dangerRed,
                      },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'CHEQUEO' && styles.tabLabelActive,
                ]}
              >
                Chequeo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'TALLER' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('TALLER')}
              activeOpacity={0.85}
            >
              <MessageSquareQuote
                size={20}
                color={
                  activeTab === 'TALLER' ? '#FFFFFF' : Colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'TALLER' && styles.tabLabelActive,
                ]}
              >
                Guía Taller
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    flex: 1,
    backgroundColor: '#EFECE6',
    alignItems: 'center',
  },
  mobileViewport: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    backgroundColor: Colors.bgPrimary,
    position: 'relative',
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
  },
  mainBody: {
    flex: 1,
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 18,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bottomNavPill: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 999,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    borderRadius: 999,
  },
  tabButtonActive: {
    backgroundColor: Colors.brandPrimary,
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  tabLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  iconWithBadge: {
    position: 'relative',
  },
  tabAlertDot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warnAmber,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
