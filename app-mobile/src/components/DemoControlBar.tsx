import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Flame,
  BatteryWarning,
  Zap,
  AlertTriangle,
  ShieldAlert,
  LucideIcon,
} from 'lucide-react-native';
import { ScenarioId } from '../modules/obd2-engine/types';
import { Colors } from '../theme/colors';

interface Props {
  activeScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
}

const PRESETS: {
  id: ScenarioId;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: 'NORMAL', label: 'Auto al 100%', Icon: CheckCircle2 },
  { id: 'CYLINDER_MISFIRE_P0302', label: 'Bujía ($75k)', Icon: Zap },
  { id: 'OVERHEATING_WATER', label: 'Agua 105°C', Icon: Flame },
  { id: 'ALTERNATOR_FAIL', label: 'Alternador', Icon: BatteryWarning },
  { id: 'DEAD_BATTERY_CRANK', label: 'Batería débil', Icon: AlertTriangle },
  { id: 'USED_CAR_FRAUD', label: 'Fraude Usado', Icon: ShieldAlert },
];

export const DemoControlBar: React.FC<Props> = ({
  activeScenario,
  onSelectScenario,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.togglePill}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.85}
      >
        <View style={styles.leftRow}>
          <View style={styles.iconCircle}>
            <SlidersHorizontal size={13} color={Colors.brandPrimary} />
          </View>
          <Text style={styles.toggleText}>
            Simulador OBD2:{' '}
            <Text style={styles.activeLabel}>
              {PRESETS.find((p) => p.id === activeScenario)?.label}
            </Text>
          </Text>
        </View>
        <View style={styles.expandRight}>
          <Text style={styles.expandHint}>
            {expanded ? 'Ocultar' : 'Simular escenario'}
          </Text>
          {expanded ? (
            <ChevronUp size={15} color={Colors.brandPrimary} />
          ) : (
            <ChevronDown size={15} color={Colors.brandPrimary} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {PRESETS.map((p) => {
            const active = activeScenario === p.id;
            const IconComponent = p.Icon;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => onSelectScenario(p.id)}
              >
                <IconComponent
                  size={14}
                  color={active ? '#FFFFFF' : Colors.textSecondary}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  togglePill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  activeLabel: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  expandRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandHint: {
    color: Colors.brandPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  chipsScroll: {
    gap: 8,
    paddingTop: 10,
    paddingBottom: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  chipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
