import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Car, ShieldCheck, Wallet } from 'lucide-react-native';
import { MockOBD2Provider } from './src/modules/obd2-engine/MockOBD2Provider';
import { LiveTelemetryFrame, ScenarioId } from './src/modules/obd2-engine/types';
import { evaluateElectricalSystem } from './src/modules/electrical-guard/electricalEngine';
import { evaluateThermalSystem } from './src/modules/thermal-shield/thermalEngine';
import { evaluateOilAndFluids } from './src/modules/oil-tracker/oilEngine';
import { translateVehicleFaults } from './src/modules/fault-translator/faultCatalog';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { Colors } from './src/theme/colors';

type TabKey = 'RESUMEN' | 'SALUD' | 'GASTOS';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('RESUMEN');
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('NORMAL');

  const providerRef = useRef(new MockOBD2Provider());

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
    odometerKm: 42500,
    idleTrafficHours: 48.5,
    lastOilChangeKm: 35700,
    activeDTCs: [],
    pendingDTCs: [],
  });

  useEffect(() => {
    const provider = providerRef.current;
    provider.connect();
    const unsubscribe = provider.subscribeTelemetry((nextFrame: LiveTelemetryFrame) => {
      setFrame(nextFrame);
    });

    return () => {
      unsubscribe();
      provider.disconnect();
    };
  }, []);

  const handleSelectScenario = (scenario: ScenarioId) => {
    setActiveScenario(scenario);
    providerRef.current.triggerSimulatedScenario(scenario);
  };

  const electricalReport = evaluateElectricalSystem(frame);
  const thermalReport = evaluateThermalSystem(frame);
  const oilReport = evaluateOilAndFluids(frame, 10000);
  const activeFaults = translateVehicleFaults(frame);

  const hasAlertDot =
    activeFaults.length > 0 ||
    thermalReport.severity === 'ROJO' ||
    electricalReport.alternatorSeverity === 'ROJO';

  return (
    <SafeAreaView style={styles.outerShell}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgPrimary} />

      <View style={styles.mobileViewport}>
        <View style={styles.mainBody}>
          {activeTab === 'RESUMEN' && (
            <DashboardScreen
              vehicleName="Volkswagen Gol Trend"
              plate="AE 492 KL"
              frame={frame}
              electricalReport={electricalReport}
              thermalReport={thermalReport}
              oilReport={oilReport}
              activeFaults={activeFaults}
              activeScenario={activeScenario}
              onSelectScenario={handleSelectScenario}
              onOpenScanner={() => setActiveTab('SALUD')}
              onOpenWallet={() => setActiveTab('GASTOS')}
            />
          )}

          {activeTab === 'SALUD' && (
            <ScannerScreen
              activeFaults={activeFaults}
              activeScenario={activeScenario}
              onSelectScenario={handleSelectScenario}
            />
          )}

          {activeTab === 'GASTOS' && (
            <WalletScreen
              oilReport={oilReport}
              activeFaults={activeFaults}
            />
          )}
        </View>

        {/* Floating Bottom Pill Navigation Bar (Stitch Exact: 3 Tabs + Lucide Vector Icons) */}
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
                activeTab === 'SALUD' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('SALUD')}
              activeOpacity={0.85}
            >
              <View style={styles.iconWithBadge}>
                <ShieldCheck
                  size={20}
                  color={
                    activeTab === 'SALUD' ? '#FFFFFF' : Colors.textSecondary
                  }
                />
                {hasAlertDot && activeTab !== 'SALUD' && (
                  <View style={styles.tabAlertDot} />
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'SALUD' && styles.tabLabelActive,
                ]}
              >
                Salud
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'GASTOS' && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab('GASTOS')}
              activeOpacity={0.85}
            >
              <Wallet
                size={20}
                color={
                  activeTab === 'GASTOS' ? '#FFFFFF' : Colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'GASTOS' && styles.tabLabelActive,
                ]}
              >
                Gastos
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
