import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DemoControlBar } from './src/components/DemoControlBar';
import { translateVehicleFaults } from './src/modules/fault-translator/faultCatalog';
import { sharedOBD2Provider } from './src/modules/obd2-engine/MockOBD2Provider';
import { LiveTelemetryFrame, ScenarioId } from './src/modules/obd2-engine/types';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { COLORS } from './src/theme/colors';

type ActiveTab = 'DASHBOARD' | 'SCANNER' | 'WALLET';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');
  const [showDemoBar, setShowDemoBar] = useState<boolean>(false);
  const [frame, setFrame] = useState<LiveTelemetryFrame>(() =>
    sharedOBD2Provider.computeNextFrame()
  );

  useEffect(() => {
    const unsubscribe = sharedOBD2Provider.subscribeTelemetry((newFrame) => {
      setFrame(newFrame);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSelectScenario = (scenario: ScenarioId) => {
    sharedOBD2Provider.triggerSimulatedScenario(scenario);
  };

  const activeFaultCount = translateVehicleFaults(frame).length;

  const headerTitle =
    activeTab === 'DASHBOARD'
      ? 'Resumen de tu auto'
      : activeTab === 'SCANNER'
      ? 'Salud y diagnóstico'
      : 'Gastos previstos';

  return (
    <View style={styles.outerBackground}>
      <SafeAreaView style={styles.phoneFrame}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.appBackground} />

        {/* Cabecera Minimalista Exacta a la Referencia: "BUEN DÍA / Resumen de tu auto" + Avatar MP */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingText}>BUEN DÍA</Text>
            <Text style={styles.mainHeaderTitle}>{headerTitle}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => setShowDemoBar((prev) => !prev)}
          >
            <Text style={styles.avatarText}>MP</Text>
          </TouchableOpacity>
        </View>

        {/* Cajón Ocultable de Simulación (se abre al tocar ⚙️ o el avatar MP) */}
        <DemoControlBar
          activeScenario={frame.activeScenario}
          onSelectScenario={handleSelectScenario}
          visible={showDemoBar}
          onClose={() => setShowDemoBar(false)}
        />

        {/* Contenido Principal Limpio */}
        <View style={styles.screenArea}>
          {activeTab === 'DASHBOARD' && (
            <DashboardScreen
              frame={frame}
              onNavigateToScanner={() => setActiveTab('SCANNER')}
              onNavigateToWallet={() => setActiveTab('WALLET')}
              onToggleDemoBar={() => setShowDemoBar((prev) => !prev)}
            />
          )}
          {activeTab === 'SCANNER' && <ScannerScreen frame={frame} />}
          {activeTab === 'WALLET' && <WalletScreen frame={frame} />}
        </View>

        {/* Barra de Navegación Inferior Flotante Estilo Píldora (3 Pestañas Limpias) */}
        <View style={styles.bottomNavWrapper}>
          <View style={styles.bottomNavCard}>
            <TouchableOpacity
              style={[
                styles.navTab,
                activeTab === 'DASHBOARD' && styles.navTabActivePill,
              ]}
              onPress={() => setActiveTab('DASHBOARD')}
            >
              <Text style={styles.navIcon}>🚗</Text>
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'DASHBOARD' && styles.navLabelActive,
                ]}
              >
                Resumen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navTab,
                activeTab === 'SCANNER' && styles.navTabActivePill,
              ]}
              onPress={() => setActiveTab('SCANNER')}
            >
              <View>
                <Text style={styles.navIcon}>🕒</Text>
                {activeFaultCount > 0 && <View style={styles.redDotBadge} />}
              </View>
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'SCANNER' && styles.navLabelActive,
                ]}
              >
                Historial
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navTab,
                activeTab === 'WALLET' && styles.navTabActivePill,
              ]}
              onPress={() => setActiveTab('WALLET')}
            >
              <Text style={styles.navIcon}>👛</Text>
              <Text
                style={[
                  styles.navLabel,
                  activeTab === 'WALLET' && styles.navLabelActive,
                ]}
              >
                Gastos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerBackground: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : '100%',
    maxHeight: Platform.OS === 'web' ? 900 : '100%',
    backgroundColor: COLORS.appBackground,
    borderRadius: Platform.OS === 'web' ? 42 : 0,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'web' ? 8 : 0,
    borderColor: '#1E2238',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 14,
  },
  greetingText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  mainHeaderTitle: {
    color: COLORS.textDark,
    fontSize: 24,
    fontWeight: '800',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.avatarDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800',
  },
  screenArea: {
    flex: 1,
  },
  bottomNavWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 6,
    backgroundColor: COLORS.appBackground,
  },
  bottomNavCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: 28,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 22,
  },
  navTabActivePill: {
    backgroundColor: COLORS.brandIndigoSoft,
  },
  navIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  navLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  navLabelActive: {
    color: COLORS.brandIndigo,
    fontWeight: '800',
  },
  redDotBadge: {
    position: 'absolute',
    right: -4,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.dangerRed,
  },
});
