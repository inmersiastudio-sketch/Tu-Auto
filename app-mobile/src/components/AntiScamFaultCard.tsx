import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TranslatedFaultCard } from '../modules/fault-translator/faultCatalog';
import { COLORS, formatARS } from '../theme/colors';

interface AntiScamFaultCardProps {
  fault: TranslatedFaultCard;
  vehicleLabel?: string;
}

export const AntiScamFaultCard: React.FC<AntiScamFaultCardProps> = ({
  fault,
  vehicleLabel = 'VW Gol Trend 1.6',
}) => {
  const isRed = fault.severity === 'ROJO';

  const handleRequestWorkshopQuote = () => {
    const minArs = formatARS(fault.fixTodayCostUsd.min);
    const maxArs = formatARS(fault.fixTodayCostUsd.max);
    const message = encodeURIComponent(
      `Hola! Mi app Tu-Auto detectó en mi ${vehicleLabel}: "${fault.humanTitle}". ` +
        `Presupuesto estimado: ${minArs} a ${maxArs}. ¿Tienen turno esta semana?`
    );
    Linking.openURL(`https://wa.me/5491100000000?text=${message}`).catch(() => {});
  };

  return (
    <View style={styles.card}>
      {/* Píldora limpia de estado */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isRed ? COLORS.dangerRedPastel : COLORS.warningAmberPastel },
          ]}
        >
          <View
            style={[
              styles.badgeDot,
              { backgroundColor: isRed ? COLORS.dangerRed : COLORS.warningAmberDot },
            ]}
          />
          <Text
            style={[
              styles.badgeText,
              { color: isRed ? COLORS.dangerRed : COLORS.warningAmber },
            ]}
          >
            {isRed ? 'Frenar y revisar ahora' : 'Podés seguir manejando'}
          </Text>
        </View>
      </View>

      {/* Título limpio y explicación breve */}
      <Text style={styles.title}>{fault.humanTitle}</Text>
      <Text style={styles.explanation}>{fault.plainExplanation}</Text>

      {/* Comparación Lado a Lado: Arreglarlo hoy vs Si lo dejás pasar */}
      <View style={styles.priceComparisonRow}>
        <View style={styles.priceBoxToday}>
          <Text style={styles.priceLabelToday}>ARREGLARLO HOY</Text>
          <Text style={styles.priceAmountToday}>
            {formatARS(fault.fixTodayCostUsd.min)}
          </Text>
          <Text style={styles.priceHint}>{fault.partsInvolved}</Text>
        </View>

        <View style={styles.priceBoxIgnore}>
          <Text style={styles.priceLabelIgnore}>SI LO DEJÁS PASAR</Text>
          <Text style={styles.priceAmountIgnore}>
            {formatARS(fault.ignoreDamageCostUsd)}
          </Text>
          <Text style={styles.priceHint}>{fault.ignoreConsequence}</Text>
        </View>
      </View>

      {/* Único botón principal limpio */}
      <TouchableOpacity style={styles.primaryBtn} onPress={handleRequestWorkshopQuote}>
        <Text style={styles.primaryBtnText}>Ver talleres de confianza cerca</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textDark,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  explanation: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  priceComparisonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  priceBoxToday: {
    flex: 1,
    backgroundColor: COLORS.safeGreenPastel,
    borderRadius: 18,
    padding: 14,
  },
  priceLabelToday: {
    color: COLORS.safeGreen,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  priceAmountToday: {
    color: COLORS.textDark,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  priceBoxIgnore: {
    flex: 1,
    backgroundColor: COLORS.dangerRedPastel,
    borderRadius: 18,
    padding: 14,
  },
  priceLabelIgnore: {
    color: COLORS.dangerRed,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  priceAmountIgnore: {
    color: COLORS.dangerRed,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  priceHint: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  primaryBtn: {
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
