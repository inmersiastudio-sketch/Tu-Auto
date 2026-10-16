import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { evaluateElectricalSystem } from '../modules/electrical-guard/electricalEngine';
import { translateVehicleFaults } from '../modules/fault-translator/faultCatalog';
import { LiveTelemetryFrame } from '../modules/obd2-engine/types';
import { evaluateOilAndFluids } from '../modules/oil-tracker/oilEngine';
import { COLORS, formatARS } from '../theme/colors';

/**
 * Pantalla 3: "Mi Bolsillo" — Predictor Financiero de Gastos a 6 Meses y Red de Talleres
 * Evita que el usuario sea sorprendido por un gasto mecánico calculando su cuota de ahorro mensual.
 * Ticket: TUA-013, TUA-023
 */

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
      title: '🛢️ Cambio de Aceite Sintético + 3 Filtros',
      when: `En ~${oil.estimatedDaysRemaining} días (${oil.oilLifeRemainingPercent}% restante)`,
      costUsd: oil.serviceEstimatedCostUsd,
      urgent: oil.severity !== 'VERDE',
    },
    {
      id: 'water',
      title: '🌡️ Limpieza de Circuito + Líquido Refrigerante Orgánico',
      when: 'En ~3 meses (Preventivo antes del verano)',
      costUsd: 42,
      urgent: false,
    },
    {
      id: 'battery',
      title: '🔋 Reemplazo Preventivo de Batería 12x65',
      when: elec.estimatedDaysUntilFailure
        ? `¡Atención! En ~${elec.estimatedDaysUntilFailure} días (${elec.batterySohPercent}% vida)`
        : 'En ~10 meses (Batería al 96%)',
      costUsd: 105,
      urgent: elec.batteryStatus !== 'VERDE',
    },
    {
      id: 'timing',
      title: '⚙️ Kit Correa de Distribución + Bomba de Agua',
      when: 'En ~5 meses (A los 90.000 km)',
      costUsd: 245,
      urgent: false,
    },
  ];

  const activeFaultsTotalUsd = activeFaults.reduce(
    (acc, f) => acc + Math.round((f.fixTodayCostUsd.min + f.fixTodayCostUsd.max) / 2),
    0
  );

  // Ahorro mensual sugerido (próximos 6 meses + fallas activas)
  const sixMonthMaintenanceUsd =
    oil.serviceEstimatedCostUsd +
    42 +
    (elec.batteryStatus !== 'VERDE' ? 105 : 0) +
    Math.round(245 / 2);
  const recommendedMonthlySavingUsd = Math.round((sixMonthMaintenanceUsd + activeFaultsTotalUsd) / 6);

  const workshops = [
    {
      name: 'Lubricentro & Service Express Palermo',
      specialty: 'Aceite, Filtros y Líquido Refrigerante',
      discount: '15% OFF usuarios Tu-Auto',
      phone: '5491100000001',
    },
    {
      name: 'ElectroAuto & Baterías Ruta 24hs',
      specialty: 'Baterías en el acto, Alternadores y Arranques',
      discount: 'Test y colocación sin cargo',
      phone: '5491100000002',
    },
    {
      name: 'Taller Inyección Pro-Mecánica Verificada',
      specialty: 'Diagnóstico Electrónico, Distribución y Tapa',
      discount: 'Presupuesto cerrado garantizado',
      phone: '5491100000003',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Tarjeta Principal: Alcancía Mecánica Mensual */}
      <View style={styles.piggyBankCard}>
        <Text style={styles.piggyBadge}>💰 PREDICTOR FINANCIERO (CERO SORPRESAS)</Text>
        <Text style={styles.piggyTitle}>Separando por mes:</Text>
        <Text style={styles.piggyBigAmount}>{formatARS(recommendedMonthlySavingUsd)} / mes</Text>
        <Text style={styles.piggySubtitle}>
          Cubrís todos los mantenimientos de los próximos 6 meses (aceite, agua, correas
          {activeFaults.length > 0 ? ' y arreglos pendientes' : ''}) sin endeudarte ni usar la tarjeta de emergencia.
        </Text>
      </View>

      {/* Calendario de Próximos Gastos del Auto */}
      <Text style={styles.sectionTitle}>📅 Próximos Gastos Previstos en tu Auto</Text>
      {upcomingItems.map((item) => (
        <View
          key={item.id}
          style={[
            styles.itemCard,
            item.urgent && { borderColor: COLORS.warningYellow, borderWidth: 1.5 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text
              style={[
                styles.itemWhen,
                item.urgent && { color: COLORS.warningYellow, fontWeight: '800' },
              ]}
            >
              {item.when}
            </Text>
          </View>
          <View style={styles.priceColumn}>
            <Text style={styles.itemPrice}>{formatARS(item.costUsd)}</Text>
            <Text style={styles.itemPriceCaption}>Est. hoy</Text>
          </View>
        </View>
      ))}

      {/* Red de Talleres y Lubricentros Aliados (Monetización por Comisión) */}
      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
        🤝 Talleres y Lubricentros de Confianza (Precio Cerrado)
      </Text>
      {workshops.map((w) => (
        <View key={w.name} style={styles.workshopCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.workshopName}>✅ {w.name}</Text>
            <Text style={styles.workshopSpec}>{w.specialty}</Text>
            <Text style={styles.workshopDiscount}>🎁 {w.discount}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => {
              const msg = encodeURIComponent(
                `Hola ${w.name}! Vengo desde la app Tu-Auto para pedir turno con beneficio para mi VW Gol Trend.`
              );
              Linking.openURL(`https://wa.me/${w.phone}?text=${msg}`).catch(() => {});
            }}
          >
            <Text style={styles.bookBtnText}>Pedir Turno</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  piggyBankCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.brandCyan,
    padding: 18,
    marginBottom: 20,
  },
  piggyBadge: {
    color: COLORS.brandCyan,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  piggyTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  piggyBigAmount: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  piggySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemWhen: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  priceColumn: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    color: COLORS.brandCyan,
    fontSize: 16,
    fontWeight: '900',
  },
  itemPriceCaption: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  workshopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.safeGreen,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  workshopName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  workshopSpec: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  workshopDiscount: {
    color: COLORS.safeGreen,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  bookBtn: {
    backgroundColor: COLORS.safeGreen,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  bookBtnText: {
    color: '#051B11',
    fontSize: 12,
    fontWeight: '900',
  },
});
