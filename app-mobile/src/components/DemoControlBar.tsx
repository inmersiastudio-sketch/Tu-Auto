import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScenarioId } from '../modules/obd2-engine/types';
import { COLORS } from '../theme/colors';

/**
 * Barra de Simulación en Tiempo Real para Demostraciones Comerciales
 * Permite probar los 6 escenarios mecánicos con 1 toque sin estar enchufado a un auto.
 * Ticket: TUA-014
 */

interface DemoControlBarProps {
  activeScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
}

const SCENARIO_BUTTONS: { id: ScenarioId; label: string; badgeColor: string }[] = [
  { id: 'NORMAL', label: '🟢 Auto Sano (90°C / 14.1V)', badgeColor: COLORS.safeGreen },
  { id: 'OVERHEATING_WATER', label: '🔥 Recalentar Agua (107°C)', badgeColor: COLORS.dangerRed },
  { id: 'DEAD_BATTERY_CRANK', label: '🪫 Batería Muerta (9.0V)', badgeColor: COLORS.warningYellow },
  { id: 'ALTERNATOR_FAIL', label: '⚡ Falla Alternador (12.1V)', badgeColor: COLORS.dangerRed },
  { id: 'CYLINDER_MISFIRE_P0302', label: '🔧 Falla Bobina ($75k vs $660k)', badgeColor: COLORS.warningYellow },
  { id: 'USED_CAR_FRAUD', label: '🕵️ Fraude Auto Usado (9 km)', badgeColor: COLORS.brandCyan },
];

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  activeScenario,
  onSelectScenario,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🎛️ SIMULADOR OBD2 EN VIVO (MODO DEMO):</Text>
        <Text style={styles.subtitle}>Tocá para simular fallas reales</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SCENARIO_BUTTONS.map((item) => {
          const isSelected = activeScenario === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelectScenario(item.id)}
              style={[
                styles.chip,
                isSelected && {
                  borderColor: item.badgeColor,
                  backgroundColor: 'rgba(255,255,255,0.09)',
                },
              ]}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161F30',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: COLORS.brandCyan,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
});
