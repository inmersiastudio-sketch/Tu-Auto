import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { evaluateElectricalSystem } from '../modules/electrical-guard/electricalEngine';
import { translateVehicleFaults } from '../modules/fault-translator/faultCatalog';
import { LiveTelemetryFrame } from '../modules/obd2-engine/types';
import { evaluateOilAndFluids } from '../modules/oil-tracker/oilEngine';
import { COLORS, formatARS } from '../theme/colors';

interface WalletScreenProps {
  frame: LiveTelemetryFrame;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ frame }) => {
  const oil = evaluateOilAndFluids(frame);
  const elec = evaluateElectricalSystem(frame);
  const activeFaults = translateVehicleFaults(frame);

  const upcomingItems = [
    {
      id: 'oil',
      icon: '🛢️',
      title: 'Cambio de aceite y filtros',
      when: `En ${oil.estimatedDaysRemaining || 18} días`,
      costUsd: oil.serviceEstimatedCostUsd,
      bg: COLORS.warningAmberPastel,
    },
    {
      id: 'water',
      icon: '🌡️',
      title: 'Líquido refrigerante',
      when: 'En 3 meses',
      costUsd: 42,
      bg: COLORS.safeGreenPastel,
    },
    {
      id: 'battery',
      icon: '🔋',
      title: 'Batería 12x65',
      when: elec.estimatedDaysUntilFailure
        ? `En ${elec.estimatedDaysUntilFailure} días`
        : 'En 10 meses',
      costUsd: 105,
      bg: elec.batteryStatus !== 'VERDE' ? COLORS.dangerRedPastel : COLORS.safeGreenPastel,
    },
    {
      id: 'timing',
      icon: '⚙️',
      title: 'Kit correa de distribución',
      when: 'A los 90.000 km',
      costUsd: 245,
      bg: COLORS.brandIndigoSoft,
    },
  ];

  const activeFaultsTotalUsd = activeFaults.reduce(
    (acc, f) => acc + Math.round((f.fixTodayCostUsd.min + f.fixTodayCostUsd.max) / 2),
    0
  );

  const sixMonthMaintenanceUsd =
    oil.serviceEstimatedCostUsd +
    42 +
    (elec.batteryStatus !== 'VERDE' ? 105 : 0) +
    Math.round(245 / 2);
  const recommendedMonthlySavingUsd = Math.round(
    (sixMonthMaintenanceUsd + activeFaultsTotalUsd) / 6
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Tarjeta Índigo Minimalista de Ahorro Mensual */}
      <View style={styles.heroSavingsCard}>
        <Text style={styles.heroSavingsLabel}>SIN GASTOS SORPRESA</Text>
        <Text style={styles.heroSavingsAmount}>
          {formatARS(recommendedMonthlySavingUsd)} / mes
        </Text>
        <Text style={styles.heroSavingsSub}>
          Separando este monto por mes cubrís todos los services y mantenimientos de tu auto este semestre.
        </Text>
      </View>

      {/* Lista Limpia de Próximos Mantenimientos */}
      <Text style={styles.sectionTitle}>PRÓXIMOS SERVICES</Text>
      {upcomingItems.map((item) => (
        <View key={item.id} style={styles.rowCard}>
          <View style={[styles.rowIconBox, { backgroundColor: item.bg }]}>
            <Text style={{ fontSize: 18 }}>{item.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSub}>{item.when}</Text>
          </View>
          <Text style={styles.rowPrice}>{formatARS(item.costUsd)}</Text>
        </View>
      ))}

      {/* Botón Limpio de Turno en Lubricentro/Taller */}
      <TouchableOpacity
        style={styles.workshopBanner}
        onPress={() => {
          const msg = encodeURIComponent(
            'Hola! Quiero reservar turno para el próximo service con descuento desde la app Tu-Auto.'
          );
          Linking.openURL(`https://wa.me/5491100000001?text=${msg}`).catch(() => {});
        }}
      >
        <View>
          <Text style={styles.workshopTitle}>Reservar turno con 15% OFF</Text>
          <Text style={styles.workshopSub}>Lubricentros y talleres verificados en tu zona</Text>
        </View>
        <Text style={styles.workshopArrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  heroSavingsCard: {
    backgroundColor: COLORS.heroBgPrimary,
    borderRadius: 28,
    padding: 22,
    marginBottom: 22,
  },
  heroSavingsLabel: {
    color: COLORS.textWhiteMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  heroSavingsAmount: {
    color: COLORS.textWhite,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSavingsSub: {
    color: COLORS.textWhiteMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: 22,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 14,
  },
  rowIconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  rowSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  rowPrice: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '800',
  },
  workshopBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.brandIndigoSoft,
    borderRadius: 22,
    padding: 18,
    marginTop: 8,
  },
  workshopTitle: {
    color: COLORS.brandIndigo,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  workshopSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  workshopArrow: {
    color: COLORS.brandIndigo,
    fontSize: 22,
  },
});
