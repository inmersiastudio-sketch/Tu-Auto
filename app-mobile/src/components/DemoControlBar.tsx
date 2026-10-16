import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScenarioId } from '../modules/obd2-engine/types';
import { COLORS } from '../theme/colors';

interface DemoControlBarProps {
  activeScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
  visible: boolean;
  onClose: () => void;
}

const SCENARIO_BUTTONS: { id: ScenarioId; label: string; dotColor: string }[] = [
  { id: 'NORMAL', label: 'Auto Sano', dotColor: COLORS.safeGreen },
  { id: 'OVERHEATING_WATER', label: 'Recalentar Agua (107°C)', dotColor: COLORS.dangerRed },
  { id: 'DEAD_BATTERY_CRANK', label: 'Batería Baja (9.0V)', dotColor: COLORS.warningAmberDot },
  { id: 'ALTERNATOR_FAIL', label: 'Falla Alternador', dotColor: COLORS.dangerRed },
  { id: 'CYLINDER_MISFIRE_P0302', label: 'Falla Bujía ($75k vs $650k)', dotColor: COLORS.warningAmberDot },
  { id: 'USED_CAR_FRAUD', label: 'Auto Usado Adulterado', dotColor: COLORS.brandIndigo },
];

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  activeScenario,
  onSelectScenario,
  visible,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Simulador OBD2 en Vivo (Para Demos)</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeBtn}>Ocultar ✕</Text>
        </TouchableOpacity>
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
                isSelected && styles.chipActive,
              ]}
            >
              <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
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
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  closeBtn: {
    color: COLORS.brandIndigo,
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: COLORS.appBackground,
    gap: 6,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: COLORS.brandIndigoSoft,
    borderWidth: 1,
    borderColor: COLORS.brandIndigo,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.brandIndigo,
    fontWeight: '700',
  },
});
