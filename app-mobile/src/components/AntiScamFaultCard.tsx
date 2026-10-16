import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TranslatedFaultCard } from '../modules/fault-translator/faultCatalog';
import { COLORS, formatARS } from '../theme/colors';

/**
 * Tarjeta "Escudo Anti-Estafas" — Traduce fallas a lenguaje coloquial y doble precio
 * ("Cuánto sale arreglarlo hoy" vs "Cuánto perdés si lo dejás pasar").
 * Ticket: TUA-011, TUA-012, TUA-023
 */

interface AntiScamFaultCardProps {
  fault: TranslatedFaultCard;
  vehicleLabel?: string;
}

export const AntiScamFaultCard: React.FC<AntiScamFaultCardProps> = ({
  fault,
  vehicleLabel = 'VW Gol Trend 1.6',
}) => {
  const isRed = fault.severity === 'ROJO';
  const accentColor = isRed ? COLORS.dangerRed : COLORS.warningYellow;
  const accentBg = isRed ? COLORS.dangerRedBg : COLORS.warningYellowBg;

  const handleRequestWorkshopQuote = () => {
    const minArs = formatARS(fault.fixTodayCostUsd.min);
    const maxArs = formatARS(fault.fixTodayCostUsd.max);
    const message = encodeURIComponent(
      `Hola! Mi app Tu-Auto detectó en mi ${vehicleLabel} el diagnóstico: "${fault.humanTitle}" (Código ${fault.code}). ` +
        `El presupuesto estimado por la plataforma es de ${minArs} a ${maxArs} (${fault.partsInvolved}). ¿Tienen turno disponible esta semana?`
    );
    Linking.openURL(`https://wa.me/5491100000000?text=${message}`).catch(() => {});
  };

  return (
    <View style={[styles.card, { borderColor: accentColor }]}>
      {/* Cabecera de Gravedad + Etiqueta Modo 07 Preventivo */}
      <View style={styles.topRow}>
        <View style={[styles.severityBadge, { backgroundColor: accentBg }]}>
          <Text style={[styles.severityText, { color: accentColor }]}>
            {isRed ? '🔴 PELIGRO INMINENTE' : '🟡 ATENCIÓN PREVENTIVA'}
          </Text>
        </View>
        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>
            {fault.detectionType === 'PREVENTIVA_SILENCIOSA'
              ? '⚡ Detectado ANTES del Check Engine'
              : `Código ${fault.code}`}
          </Text>
        </View>
      </View>

      {/* Qué se rompió en lenguaje claro */}
      <Text style={styles.title}>{fault.humanTitle}</Text>
      <Text style={styles.explanation}>{fault.plainExplanation}</Text>

      {/* ¿Puedo seguir manejando? */}
      <View style={styles.drivingBox}>
        <Text style={styles.drivingLabel}>¿PUEDO SEGUIR MANEJANDO?</Text>
        <Text style={styles.drivingAdvice}>{fault.drivingInstruction}</Text>
      </View>

      {/* Comparador de Billetera: Arreglar Hoy vs. Hacerse el distraído */}
      <View style={styles.costComparisonContainer}>
        <View style={styles.costBoxToday}>
          <Text style={styles.costHeaderToday}>🛠️ ARREGLARLO HOY (PRECIO JUSTO)</Text>
          <Text style={styles.costValueToday}>
            {formatARS(fault.fixTodayCostUsd.min)} a {formatARS(fault.fixTodayCostUsd.max)}
          </Text>
          <Text style={styles.costSubtext}>{fault.partsInvolved}</Text>
        </View>

        <View style={styles.costBoxIgnored}>
          <Text style={styles.costHeaderIgnored}>💸 SI LO DEJÁS PASAR Y SE ROMPE TODO</Text>
          <Text style={styles.costValueIgnored}>{formatARS(fault.ignoreDamageCostUsd)}+</Text>
          <Text style={styles.costSubtext}>{fault.ignoreConsequence}</Text>
        </View>
      </View>

      {/* Botón de Monetización: Derivación a Taller de Confianza */}
      <TouchableOpacity style={styles.whatsappButton} onPress={handleRequestWorkshopQuote}>
        <Text style={styles.whatsappButtonText}>
          📲 Pedir turno en Taller de Confianza con este precio cerrado
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '800',
  },
  modeBadge: {
    backgroundColor: COLORS.brandCyanMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modeBadgeText: {
    color: COLORS.brandCyan,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  explanation: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  drivingBox: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  drivingLabel: {
    color: COLORS.brandCyan,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  drivingAdvice: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  costComparisonContainer: {
    gap: 10,
    marginBottom: 14,
  },
  costBoxToday: {
    backgroundColor: COLORS.safeGreenBg,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.safeGreen,
  },
  costHeaderToday: {
    color: COLORS.safeGreen,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  costValueToday: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  costBoxIgnored: {
    backgroundColor: COLORS.dangerRedBg,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.dangerRed,
  },
  costHeaderIgnored: {
    color: COLORS.dangerRed,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  costValueIgnored: {
    color: COLORS.dangerRed,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  costSubtext: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  whatsappButton: {
    backgroundColor: COLORS.brandCyan,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  whatsappButtonText: {
    color: '#06101E',
    fontSize: 13,
    fontWeight: '900',
  },
});
