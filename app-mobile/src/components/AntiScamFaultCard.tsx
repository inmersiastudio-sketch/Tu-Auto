import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Zap,
  CheckCircle2,
  AlertOctagon,
  PiggyBank,
  Lightbulb,
  Store,
  ArrowRight,
  Clock,
  ShieldCheck,
} from 'lucide-react-native';
import { TranslatedFaultCard } from '../modules/fault-translator/faultCatalog';
import { Colors, DEFAULT_EXCHANGE_RATE_ARS } from '../theme/colors';

interface Props {
  fault: TranslatedFaultCard;
  onRequestQuote?: (fault: TranslatedFaultCard) => void;
}

function toARS(usd: number): number {
  return Math.round((usd * DEFAULT_EXCHANGE_RATE_ARS) / 1000) * 1000;
}

function formatPesos(amount: number): string {
  return '$' + amount.toLocaleString('es-AR');
}

export const AntiScamFaultCard: React.FC<Props> = ({
  fault,
  onRequestQuote,
}) => {
  const [reminderSaved, setReminderSaved] = useState(false);

  const isRed = fault.severity === 'ROJO';
  const avgFixUsd = (fault.fixTodayCostUsd.min + fault.fixTodayCostUsd.max) / 2;
  const costNowArs = toARS(avgFixUsd);
  const costIgnoreArs = toARS(fault.ignoreDamageCostUsd);
  const savingsArs = Math.max(0, costIgnoreArs - costNowArs);

  return (
    <View style={styles.card}>
      {/* Friendly Status Badge (Stitch Exact) */}
      <View
        style={[
          styles.statusPill,
          isRed ? styles.statusPillRed : styles.statusPillAmber,
        ]}
      >
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isRed ? Colors.dangerRed : Colors.warnAmber },
          ]}
        />
        <Text
          style={[
            styles.statusPillText,
            { color: isRed ? Colors.dangerRedDark : Colors.warnAmberText },
          ]}
        >
          {isRed
            ? 'Atención inmediata • Detené la marcha'
            : 'Atención preventiva • Podés seguir manejando sin apuro'}
        </Text>
      </View>

      {/* Primary Message Row */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconBox,
            isRed ? styles.iconBoxRed : styles.iconBoxAmber,
          ]}
        >
          {isRed ? (
            <AlertOctagon size={24} color={Colors.dangerRedDark} />
          ) : (
            <Zap size={24} color={Colors.warnAmberDark} />
          )}
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>{fault.humanTitle}</Text>
          <Text style={styles.subtitle}>{fault.plainExplanation}</Text>
        </View>
      </View>

      {/* Reassurance Box */}
      <View style={styles.reassuranceBox}>
        <CheckCircle2
          size={20}
          color={isRed ? Colors.dangerRed : Colors.safeGreen}
        />
        <View style={styles.reassuranceTextCol}>
          <Text style={styles.reassuranceTitle}>
            {isRed
              ? 'Prioridad máxima de seguridad'
              : 'No te vas a quedar tirado hoy'}
          </Text>
          <Text style={styles.reassuranceDesc}>
            {fault.drivingInstruction}
          </Text>
        </View>
      </View>

      {/* Financial Impact Comparison (Side-by-Side) */}
      <View style={styles.costSection}>
        <View style={styles.costHeaderRow}>
          <Text style={styles.costSectionTitle}>
            Comparativa de costos reales
          </Text>
          <Text style={styles.costRegionTag}>Precios promedio CABA/GBA</Text>
        </View>

        <View style={styles.costGrid}>
          {/* Left Column: Arreglarlo Hoy */}
          <View style={styles.costBoxNow}>
            <Text style={styles.costLabelNow}>ARREGLARLO HOY</Text>
            <Text style={styles.costValueNow}>
              {formatPesos(costNowArs)}
            </Text>
            <Text style={styles.costDescNow}>{fault.partsInvolved}</Text>
          </View>

          {/* Right Column: Si lo dejás pasar */}
          <View style={styles.costBoxWait}>
            <Text style={styles.costLabelWait}>SI LO DEJÁS PASAR</Text>
            <Text style={styles.costValueWait}>
              {formatPesos(costIgnoreArs)}
            </Text>
            <Text style={styles.costDescWait}>
              {fault.ignoreConsequence}
            </Text>
          </View>
        </View>

        {/* Savings Highlight Pill */}
        <View style={styles.savingsBanner}>
          <PiggyBank size={18} color={Colors.safeGreenDark} />
          <Text style={styles.savingsText}>
            Ahorrás{' '}
            <Text style={styles.savingsBold}>{formatPesos(savingsArs)}</Text>{' '}
            arreglando a tiempo
          </Text>
        </View>
      </View>

      {/* Educational Section & Anti-Scam Shield */}
      <View style={styles.educationalBox}>
        <View style={styles.eduTopRow}>
          <View style={styles.eduIconWrap}>
            <Lightbulb size={18} color={Colors.brandPrimary} />
          </View>
          <View style={styles.eduContentCol}>
            <Text style={styles.eduTitle}>
              ¿Qué pedir exactamente en el taller?
            </Text>
            <View style={styles.checkItemRow}>
              <ShieldCheck size={15} color={Colors.brandPrimary} />
              <Text style={styles.eduDesc}>
                Repuesto involucrado: {fault.partsInvolved}. Exigí que no te
                cobren desarme de motor innecesario.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action CTAs (Stitch Rounded Full Pill Buttons) */}
      <View style={styles.ctaGroup}>
        <TouchableOpacity
          style={styles.primaryCtaButton}
          onPress={() => onRequestQuote?.(fault)}
          activeOpacity={0.88}
        >
          <Store size={19} color="#FFFFFF" />
          <Text style={styles.primaryCtaText}>
            Ver talleres recomendados cerca
          </Text>
          <ArrowRight size={17} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryCtaButton}
          onPress={() => setReminderSaved(true)}
          activeOpacity={0.85}
        >
          <Clock size={17} color={Colors.brandPrimaryDark} />
          <Text style={styles.secondaryCtaText}>
            {reminderSaved
              ? 'Recordatorio agendado para el sábado 10:00 hs'
              : 'Recordármelo el fin de semana'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 18,
  },
  statusPillAmber: {
    backgroundColor: Colors.warnAmberBg,
    borderColor: Colors.warnAmberBorder,
  },
  statusPillRed: {
    backgroundColor: Colors.dangerRedBg,
    borderColor: Colors.dangerRedBorder,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 18,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBoxAmber: {
    backgroundColor: Colors.warnAmberBg,
    borderColor: Colors.warnAmberBorder,
  },
  iconBoxRed: {
    backgroundColor: Colors.dangerRedBg,
    borderColor: Colors.dangerRedBorder,
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  reassuranceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgElevated,
    borderRadius: 14,
    padding: 14,
    marginBottom: 22,
  },
  reassuranceTextCol: {
    flex: 1,
  },
  reassuranceTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  reassuranceDesc: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  costSection: {
    marginBottom: 20,
  },
  costHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  costSectionTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  costRegionTag: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  costGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  costBoxNow: {
    flex: 1,
    backgroundColor: Colors.safeGreenBg,
    borderWidth: 1,
    borderColor: Colors.safeGreenBorder,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
  },
  costLabelNow: {
    color: Colors.safeGreenDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  costValueNow: {
    color: '#065F46',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  costDescNow: {
    color: Colors.safeGreenDark,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 8,
  },
  costBoxWait: {
    flex: 1,
    backgroundColor: Colors.dangerRedBg,
    borderWidth: 1,
    borderColor: Colors.dangerRedBorder,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
  },
  costLabelWait: {
    color: Colors.dangerRedDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  costValueWait: {
    color: '#991B1B',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  costDescWait: {
    color: Colors.dangerRedDark,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 8,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.safeGreenBg,
    borderWidth: 1,
    borderColor: Colors.safeGreenBorder,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  savingsText: {
    color: '#065F46',
    fontSize: 13,
    fontWeight: '600',
  },
  savingsBold: {
    fontWeight: '800',
  },
  educationalBox: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 20,
  },
  eduTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  eduIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.bgHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  eduContentCol: {
    flex: 1,
  },
  eduTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
  },
  eduDesc: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  ctaGroup: {
    gap: 10,
  },
  primaryCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.brandPrimary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.bgHigh,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  secondaryCtaText: {
    color: Colors.brandPrimaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
});
