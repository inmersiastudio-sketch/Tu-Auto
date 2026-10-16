import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DemoControlBar } from './src/components/DemoControlBar';
import { translateVehicleFaults } from './src/modules/fault-translator/faultCatalog';
import { sharedOBD2Provider } from './src/modules/obd2-engine/MockOBD2Provider';
import { LiveTelemetryFrame, ScenarioId } from './src/modules/obd2-engine/types';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { FleetAndKitScreen } from './src/screens/FleetAndKitScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { COLORS } from './src/theme/colors';

type ActiveTab = 'DASHBOARD' | 'SCANNER' | 'WALLET' | 'FLEET';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Cabecera Superior de Marca */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Text style={styles.brandLogo}>⚡ TU-AUTO</Text>
          <Text style={styles.brandTag}>COPILOTO & ESCUDO ANTI-ESTAFAS</Text>
        </View>
      </View>

      {/* Barra Flotante de Simulación Comercial (6 Escenarios en Vivo) */}
      <DemoControlBar
        activeScenario={frame.activeScenario}
        onSelectScenario={handleSelectScenario}
      />

      {/* Contenido de la Pestaña Activa */}
      <View style={styles.screenContainer}>
        {activeTab === 'DASHBOARD' && (
          <DashboardScreen
            frame={frame}
            onNavigateToScanner={() => setActiveTab('SCANNER')}
            onNavigateToWallet={() => setActiveTab('WALLET')}
          />
        )}
        {activeTab === 'SCANNER' && <ScannerScreen frame={frame} />}
        {activeTab === 'WALLET' && <WalletScreen frame={frame} />}
        {activeTab === 'FLEET' && <FleetAndKitScreen frame={frame} />}
      </View>

      {/* Barra de Navegación Inferior (4 Pestañas) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('DASHBOARD')}
        >
          <Text style={[styles.tabIcon, activeTab === 'DASHBOARD' && styles.tabActive]}>
            🏠
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'DASHBOARD' && styles.tabActive]}>
            Mi Auto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('SCANNER')}
        >
          <View>
            <Text style={[styles.tabIcon, activeTab === 'SCANNER' && styles.tabActive]}>
              🔍
            </Text>
            {activeFaultCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{activeFaultCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabLabel, activeTab === 'SCANNER' && styles.tabActive]}>
            Diagnóstico
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('WALLET')}
        >
          <Text style={[styles.tabIcon, activeTab === 'WALLET' && styles.tabActive]}>
            💸
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'WALLET' && styles.tabActive]}>
            Mi Bolsillo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('FLEET')}
        >
          <Text style={[styles.tabIcon, activeTab === 'FLEET' && styles.tabActive]}>
            🚕
          </Text>
          <Text style={[styles.tabLabel, activeTab === 'FLEET' && styles.tabActive]}>
            Flota / Kit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandLogo: {
    color: COLORS.brandCyan,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandTag: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },
  screenContainer: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  tabLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tabActive: {
    color: COLORS.brandCyan,
    opacity: 1,
  },
  badgeCount: {
    position: 'absolute',
    right: -10,
    top: -4,
    backgroundColor: COLORS.dangerRed,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
