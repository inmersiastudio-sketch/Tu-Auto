import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  PiggyBank,
  PlusCircle,
  Droplets,
  Thermometer,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ThumbsUp,
} from 'lucide-react-native';
import { OilAndFluidReport } from '../modules/oil-tracker/oilEngine';
import { TranslatedFaultCard } from '../modules/fault-translator/faultCatalog';
import { Colors, DEFAULT_EXCHANGE_RATE_ARS } from '../theme/colors';

interface Props {
  oilReport: OilAndFluidReport;
  activeFaults: TranslatedFaultCard[];
}

function formatPesos(val: number): string {
  return '$' + val.toLocaleString('es-AR');
}

export const WalletScreen: React.FC<Props> = ({
  oilReport,
  activeFaults,
}) => {
  const [accumulatedSavings, setAccumulatedSavings] = useState(70000);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const targetSemester = 140000;
  const progressPct = Math.min(100, Math.round((accumulatedSavings / targetSemester) * 100));

  const remainingKm = Math.max(
    0,
    oilReport.intervalTargetKm - oilReport.equivalentWearKm
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top App Bar (Stitch Exact: TU AUTO • INTELIGENCIA FINANCIERA / Mi Bolsillo + Al día) */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.supHeader}>TU AUTO • INTELIGENCIA FINANCIERA</Text>
          <Text style={styles.pageTitle}>Mi Bolsillo</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.greenDot} />
          <Text style={styles.statusPillText}>Al día</Text>
        </View>
      </View>

      {/* Hero Smart Savings Card (Stitch Exact Indigo Gradient Card) */}
      <View style={styles.heroCard}>
        <View style={styles.heroTagRow}>
          <PiggyBank size={16} color="rgba(255,255,255,0.85)" />
          <Text style={styles.heroTagText}>Ahorro Sugerido • Plan semestral</Text>
        </View>

        <Text style={styles.heroSubtitle}>
          Para no tener sorpresas este semestre, separá:
        </Text>

        <View style={styles.heroAmountRow}>
          <Text style={styles.heroAmount}>$35.000</Text>
          <Text style={styles.heroAmountPerMonth}>/ mes</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelsRow}>
            <Text style={styles.progressLabelLeft}>
              Progreso para tus próximos 2 services
            </Text>
            <Text style={styles.progressLabelRight}>
              {formatPesos(accumulatedSavings)} acumulados
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>

          <View style={styles.progressFooterRow}>
            <Text style={styles.progressMicroText}>
              {progressPct}% del objetivo
            </Text>
            <Text style={styles.progressMicroText}>
              {formatPesos(targetSemester)} total est.
            </Text>
          </View>
        </View>

        {/* Action Buttons inside Hero */}
        <View style={styles.heroBtnRow}>
          <TouchableOpacity
            style={styles.heroPrimaryBtn}
            onPress={() =>
              setAccumulatedSavings((prev) => Math.min(targetSemester, prev + 17500))
            }
            activeOpacity={0.85}
          >
            <PlusCircle size={16} color={Colors.brandPrimaryDark} />
            <Text style={styles.heroPrimaryBtnText}>Simular aporte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heroSecondaryBtn}
            onPress={() => setShowBreakdown(!showBreakdown)}
            activeOpacity={0.85}
          >
            <Text style={styles.heroSecondaryBtnText}>
              {showBreakdown ? 'Ocultar' : 'Ver detalle'}
            </Text>
          </TouchableOpacity>
        </View>

        {showBreakdown && (
          <View style={styles.breakdownDrawer}>
            <Text style={styles.breakdownDrawerText}>
              Calculado según tu promedio de 1.100 km/mes en ciudad y precios de
              repuestos originales Volkswagen en CABA/GBA.
            </Text>
          </View>
        )}
      </View>

      {/* Section: Calendario Inteligente (3 Próximos Mantenimientos con Iconos Vectoriales) */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>CALENDARIO INTELIGENTE</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>3 próximos</Text>
          </View>
        </View>

        {/* Item 1: Cambio de aceite y filtros */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarLeft}>
            <View style={[styles.calIconBox, { backgroundColor: Colors.warnAmberBg }]}>
              <Droplets size={22} color={Colors.warnAmberDark} />
            </View>
            <View style={styles.calTextCol}>
              <Text style={styles.calTitle}>Cambio de aceite y filtros</Text>
              <Text style={styles.calSubtitle}>
                En ~{remainingKm.toLocaleString('es-AR')} km o {oilReport.estimatedDaysRemaining} días
              </Text>
              <View style={[styles.priorityPill, { backgroundColor: Colors.warnAmberBg }]}>
                <View style={[styles.priorityDot, { backgroundColor: Colors.warnAmber }]} />
                <Text style={[styles.priorityText, { color: Colors.warnAmberDark }]}>
                  Prioridad Media
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.calendarRight}>
            <Text style={styles.calPrice}>$65.000</Text>
            <Text style={styles.calPriceSub}>Estimado hoy</Text>
          </View>
        </View>

        {/* Item 2: Líquido refrigerante y purga */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarLeft}>
            <View style={[styles.calIconBox, { backgroundColor: Colors.infoSkyBg }]}>
              <Thermometer size={22} color={Colors.infoSky} />
            </View>
            <View style={styles.calTextCol}>
              <Text style={styles.calTitle}>Líquido refrigerante y purga</Text>
              <Text style={styles.calSubtitle}>En ~4.500 km o 3 meses</Text>
              <View style={[styles.priorityPill, { backgroundColor: Colors.safeGreenBg }]}>
                <View style={[styles.priorityDot, { backgroundColor: Colors.safeGreen }]} />
                <Text style={[styles.priorityText, { color: Colors.safeGreenDark }]}>
                  Preventivo
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.calendarRight}>
            <Text style={styles.calPrice}>$38.000</Text>
            <Text style={styles.calPriceSub}>Estimado hoy</Text>
          </View>
        </View>

        {/* Item 3: Rotación y alineación */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarLeft}>
            <View style={[styles.calIconBox, { backgroundColor: Colors.bgElevated }]}>
              <Sliders size={22} color={Colors.brandPrimary} />
            </View>
            <View style={styles.calTextCol}>
              <Text style={styles.calTitle}>Rotación y alineación</Text>
              <Text style={styles.calSubtitle}>En ~6.000 km o 4 meses</Text>
              <View style={[styles.priorityPill, { backgroundColor: Colors.bgElevated }]}>
                <Text style={[styles.priorityText, { color: Colors.textSecondary }]}>
                  Planificado
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.calendarRight}>
            <Text style={styles.calPrice}>$35.000</Text>
            <Text style={styles.calPriceSub}>Estimado hoy</Text>
          </View>
        </View>
      </View>

      {/* Section: Efecto Prevención (Cuidar hoy vs. Reparar mañana) */}
      <View style={styles.preventionCard}>
        <View style={styles.preventionHeaderRow}>
          <View>
            <Text style={styles.preventionTitle}>Efecto prevención</Text>
            <Text style={styles.preventionSubtitle}>
              Cuidar hoy vs. Reparar mañana
            </Text>
          </View>
          <View style={styles.preventionShieldIcon}>
            <ShieldCheck size={20} color={Colors.brandPrimaryDark} />
          </View>
        </View>

        <View style={styles.comparisonGrid}>
          {/* Left Column: Preventive Maintenance */}
          <View style={styles.compBoxGreen}>
            <View style={styles.compBadgeRow}>
              <CheckCircle2 size={15} color={Colors.safeGreenDark} />
              <Text style={styles.compLabelGreen}>MANTENIMIENTO HOY</Text>
            </View>
            <Text style={styles.compAmountGreen}>$138.000</Text>
            <Text style={styles.compDescGreen}>
              Total de tus 3 mantenimientos programados en los próximos 6 meses.
            </Text>
          </View>

          {/* Right Column: Neglected Breakdown */}
          <View style={styles.compBoxRed}>
            <View style={styles.compBadgeRow}>
              <AlertTriangle size={15} color={Colors.dangerRedDark} />
              <Text style={styles.compLabelRed}>ROTURA MAYOR</Text>
            </View>
            <Text style={styles.compAmountRed}>
              {activeFaults.length > 0
                ? formatPesos(
                    Math.round(activeFaults[0].ignoreDamageCostUsd * DEFAULT_EXCHANGE_RATE_ARS)
                  )
                : '$890.000+'}
            </Text>
            <Text style={styles.compDescRed}>
              Costo promedio de junta soplada o catalizador dañado por falta de
              service.
            </Text>
          </View>
        </View>

        {/* Bottom Savings Callout */}
        <View style={styles.footerSavingsNote}>
          <ThumbsUp size={18} color={Colors.brandPrimaryDark} />
          <Text style={styles.footerSavingsText}>
            Ahorrás más de{' '}
            <Text style={styles.footerSavingsBold}>$750.000</Text> en
            imprevistos manteniendo tu auto al día y conservás su valor de
            reventa.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  supHeader: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.safeGreen,
  },
  statusPillText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: Colors.heroIndigoMid,
    borderRadius: 24,
    padding: 22,
    marginBottom: 22,
    shadowColor: '#2A14B4',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 6,
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  heroTagText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 18,
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  heroAmountPerMonth: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    fontWeight: '600',
  },
  progressSection: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 16,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabelLeft: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '500',
  },
  progressLabelRight: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 999,
  },
  progressFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressMicroText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 11,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 999,
  },
  heroPrimaryBtnText: {
    color: Colors.brandPrimaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  heroSecondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSecondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownDrawer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  breakdownDrawerText: {
    color: 'rgba(224,224,255,0.88)',
    fontSize: 12,
    lineHeight: 17,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  countBadge: {
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countBadgeText: {
    color: Colors.brandPrimaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
  calendarCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 14,
    elevation: 2,
  },
  calendarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    flex: 1,
  },
  calIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calTextCol: {
    flex: 1,
  },
  calTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  calSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  calendarRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  calPrice: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  calPriceSub: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  preventionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  preventionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  preventionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  preventionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  preventionShieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  compBoxGreen: {
    flex: 1,
    backgroundColor: Colors.safeGreenBg,
    borderWidth: 1,
    borderColor: Colors.safeGreenBorder,
    borderRadius: 16,
    padding: 14,
  },
  compBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  compLabelGreen: {
    color: Colors.safeGreenDark,
    fontSize: 10,
    fontWeight: '800',
  },
  compAmountGreen: {
    color: '#065F46',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 4,
  },
  compDescGreen: {
    color: Colors.safeGreenDark,
    fontSize: 11,
    lineHeight: 15,
  },
  compBoxRed: {
    flex: 1,
    backgroundColor: Colors.dangerRedBg,
    borderWidth: 1,
    borderColor: Colors.dangerRedBorder,
    borderRadius: 16,
    padding: 14,
  },
  compLabelRed: {
    color: Colors.dangerRedDark,
    fontSize: 10,
    fontWeight: '800',
  },
  compAmountRed: {
    color: '#991B1B',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 4,
  },
  compDescRed: {
    color: Colors.dangerRedDark,
    fontSize: 11,
    lineHeight: 15,
  },
  footerSavingsNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgElevated,
    borderRadius: 14,
    padding: 13,
    marginTop: 12,
  },
  footerSavingsText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12,
    lineHeight: 17,
  },
  footerSavingsBold: {
    color: Colors.brandPrimaryDark,
    fontWeight: '800',
  },
});
