import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { evaluateElectricalSystem } from '../modules/electrical-guard/electricalEngine';
import { computeOverallHealthScore, translateVehicleFaults } from '../modules/fault-translator/faultCatalog';
import { LiveTelemetryFrame } from '../modules/obd2-engine/types';
import { evaluateOilAndFluids } from '../modules/oil-tracker/oilEngine';
import { evaluateThermalSystem } from '../modules/thermal-shield/thermalEngine';
import { COLORS, formatARS } from '../theme/colors';

/**
 * Pantalla 1: Dashboard Principal "Mi Auto Hoy"
 * Monitoreo en vivo de Sistema Eléctrico, Agua/Temperatura y Desgaste Real de Aceite.
 * Ticket: TUA-012
 */

interface DashboardScreenProps {
  frame: LiveTelemetryFrame;
  onNavigateToScanner: () => void;
  onNavigateToWallet: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  frame,
  onNavigateToScanner,
  onNavigateToWallet,
}) => {
  const health = computeOverallHealthScore(frame);
  const elec = evaluateElectricalSystem(frame);
  const thermal = evaluateThermalSystem(frame);
  const oil = evaluateOilAndFluids(frame);
  const faults = translateVehicleFaults(frame);

  const getSeverityColor = (sev: 'VERDE' | 'AMARILLO' | 'ROJO') => {
    if (sev === 'ROJO') return COLORS.dangerRed;
    if (sev === 'AMARILLO') return COLORS.warningYellow;
    return COLORS.safeGreen;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabecera del Vehículo + Estado de Conexión OBD2 */}
      <View style={styles.vehicleHeader}>
        <View>
          <Text style={styles.vehicleTitle}>🚗 Volkswagen Gol Trend 1.6</Text>
          <Text style={styles.vehicleSub}>
            Odómetro: {frame.odometerKm.toLocaleString('es-AR')} km • {frame.rpm} RPM
          </Text>
        </View>
        <View style={styles.connectionPill}>
          <View style={styles.greenDot} />
          <Text style={styles.connectionText}>KIT OBD2 ACTIVO</Text>
        </View>
      </View>

      {/* Banner de Sirena de Emergencia si recalienta el agua o falla el alternador */}
      {(thermal.shouldTriggerSiren || elec.alternatorSeverity === 'ROJO') && (
        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyTitle}>
            {thermal.shouldTriggerSiren ? thermal.headline : elec.alternatorHeadline}
          </Text>
          <Text style={styles.emergencyText}>
            {thermal.shouldTriggerSiren
              ? `${thermal.humanAdvice} Evitás una rotura de ${formatARS(thermal.potentialDamageIfIgnoredUsd)}.`
              : `Costo estimado de reparación hoy: ${formatARS(elec.replacementCostUsd.min)} a ${formatARS(elec.replacementCostUsd.max)}.`}
          </Text>
        </View>
      )}

      {/* Puntaje General de Salud del Auto (0 a 100%) */}
      <View style={[styles.healthHeroCard, { borderColor: getSeverityColor(health.statusColor) }]}>
        <View style={styles.healthScoreCircle}>
          <Text style={[styles.healthScoreValue, { color: getSeverityColor(health.statusColor) }]}>
            {health.score}%
          </Text>
          <Text style={styles.healthScoreCaption}>SALUD GENERAL</Text>
        </View>
        <View style={styles.healthHeroInfo}>
          <Text style={[styles.healthStatusLabel, { color: getSeverityColor(health.statusColor) }]}>
            {health.statusLabel}
          </Text>
          <Text style={styles.healthDescription}>
            {faults.length > 0
              ? `Se detectaron ${faults.length} problema(s) que requieren revisión para proteger tu bolsillo.`
              : 'Motor, sistema eléctrico, agua y sensores sin fallas ocultas.'}
          </Text>
          {faults.length > 0 && (
            <TouchableOpacity style={styles.inspectFaultsBtn} onPress={onNavigateToScanner}>
              <Text style={styles.inspectFaultsBtnText}>
                🔍 Ver qué se rompió y cuánto sale ({faults.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* MÓDULO 1: VIGÍA DEL SISTEMA ELÉCTRICO (Batería + Alternador) */}
      <View style={styles.moduleCard}>
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>⚡ Sistema Eléctrico & Batería</Text>
          <Text
            style={[
              styles.badgePill,
              {
                color: getSeverityColor(
                  elec.alternatorSeverity === 'ROJO' ? 'ROJO' : elec.batteryStatus
                ),
              },
            ]}
          >
            {elec.batterySohPercent}% Vida Útil
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>CARGA ALTERNADOR</Text>
            <Text
              style={[
                styles.metricBigNumber,
                { color: getSeverityColor(elec.alternatorSeverity) },
              ]}
            >
              {frame.voltageInstantV.toFixed(2)} V
            </Text>
            <Text style={styles.metricHint}>Normal: 13.8V a 14.4V</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>CAÍDA EN ARRANQUE</Text>
            <Text
              style={[styles.metricBigNumber, { color: getSeverityColor(elec.batteryStatus) }]}
            >
              {frame.lastCrankingMinV.toFixed(2)} V
            </Text>
            <Text style={styles.metricHint}>Mínimo seguro: &gt; 9.6V</Text>
          </View>
        </View>

        <Text style={styles.humanSummaryTitle}>{elec.batteryHeadline}</Text>
        <Text style={styles.humanSummaryBody}>{elec.batteryExplanation}</Text>
        <Text style={[styles.humanSummaryBody, { marginTop: 4, color: COLORS.brandCyan }]}>
          {elec.alternatorHeadline}
        </Text>
      </View>

      {/* MÓDULO 2: ESCUDO TÉRMICO Y CONTROL DE "AGUA" */}
      <View style={styles.moduleCard}>
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>🌡️ Temperatura de Agua (Real ECU)</Text>
          <Text style={[styles.badgePill, { color: getSeverityColor(thermal.severity) }]}>
            {thermal.tempC}°C
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>SENSOR DIGITAL REAL</Text>
            <Text
              style={[styles.metricBigNumber, { color: getSeverityColor(thermal.severity) }]}
            >
              {thermal.tempC} °C
            </Text>
            <Text style={styles.metricHint}>Óptimo: 88°C a 96°C</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>VELOCIDAD TÉRMICA</Text>
            <Text
              style={[
                styles.metricBigNumber,
                {
                  color: thermal.suspectedWaterLoss ? COLORS.dangerRed : COLORS.textPrimary,
                },
              ]}
            >
              +{thermal.slopeCPerMin.toFixed(1)}°/min
            </Text>
            <Text style={styles.metricHint}>Detecta manguera rota</Text>
          </View>
        </View>

        <Text style={styles.humanSummaryTitle}>{thermal.headline}</Text>
        <Text style={styles.humanSummaryBody}>{thermal.humanAdvice}</Text>
      </View>

      {/* MÓDULO 3: PREDICTOR INTELIGENTE DE CAMBIO DE ACEITE */}
      <View style={styles.moduleCard}>
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleTitle}>🛢️ Desgaste Real de Aceite y Filtros</Text>
          <Text style={[styles.badgePill, { color: getSeverityColor(oil.severity) }]}>
            Quedan ~{oil.estimatedDaysRemaining} días
          </Text>
        </View>

        {/* Barra de vida útil */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${oil.oilLifeRemainingPercent}%`,
                backgroundColor: getSeverityColor(oil.severity),
              },
            ]}
          />
        </View>

        <Text style={styles.humanSummaryTitle}>{oil.headline}</Text>
        <Text style={styles.humanSummaryBody}>{oil.humanExplanation}</Text>

        <TouchableOpacity style={styles.walletLinkBtn} onPress={onNavigateToWallet}>
          <Text style={styles.walletLinkBtnText}>
            💸 Costo estimado del próximo service: {formatARS(oil.serviceEstimatedCostUsd)} (Ver plan de ahorro)
          </Text>
        </TouchableOpacity>
      </View>
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
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  vehicleTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  vehicleSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  connectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.safeGreenBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.safeGreen,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.safeGreen,
    marginRight: 6,
  },
  connectionText: {
    color: COLORS.safeGreen,
    fontSize: 10,
    fontWeight: '800',
  },
  emergencyBanner: {
    backgroundColor: COLORS.dangerRedBg,
    borderWidth: 2,
    borderColor: COLORS.dangerRed,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  emergencyTitle: {
    color: COLORS.dangerRed,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  emergencyText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
  healthHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  healthScoreCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthScoreValue: {
    fontSize: 26,
    fontWeight: '900',
  },
  healthScoreCaption: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontWeight: '800',
    marginTop: 2,
  },
  healthHeroInfo: {
    flex: 1,
  },
  healthStatusLabel: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  healthDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  inspectFaultsBtn: {
    marginTop: 10,
    backgroundColor: COLORS.warningYellow,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  inspectFaultsBtnText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '900',
  },
  moduleCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  badgePill: {
    fontSize: 13,
    fontWeight: '900',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: COLORS.cardElevated,
    borderRadius: 12,
    padding: 12,
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  metricBigNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  metricHint: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  humanSummaryTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  humanSummaryBody: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: COLORS.cardElevated,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  walletLinkBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.brandCyanMuted,
    borderRadius: 10,
  },
  walletLinkBtnText: {
    color: COLORS.brandCyan,
    fontSize: 12,
    fontWeight: '700',
  },
});
