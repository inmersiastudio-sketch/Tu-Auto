import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AntiScamFaultCard } from '../components/AntiScamFaultCard';
import { evaluateElectricalSystem } from '../modules/electrical-guard/electricalEngine';
import { translateVehicleFaults } from '../modules/fault-translator/faultCatalog';
import { LiveTelemetryFrame } from '../modules/obd2-engine/types';
import { evaluateThermalSystem } from '../modules/thermal-shield/thermalEngine';
import { COLORS, formatARS } from '../theme/colors';

interface ScannerScreenProps {
  frame: LiveTelemetryFrame;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({ frame }) => {
  const faults = translateVehicleFaults(frame);
  const elec = evaluateElectricalSystem(frame);
  const thermal = evaluateThermalSystem(frame);
  const isUsedCarFraudSuspected = frame.distanceSinceResetKm < 150;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Estado Rápido de Batería y Agua en tarjetas limpias */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>BATERÍA Y CARGA</Text>
          <Text style={styles.summaryValue}>{elec.batterySohPercent}% vida</Text>
          <Text style={styles.summarySub}>
            Arranque: {frame.lastCrankingMinV.toFixed(1)}V · Carga: {frame.voltageInstantV.toFixed(1)}V
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>AGUA Y MOTOR</Text>
          <Text style={styles.summaryValue}>{thermal.tempC}°C</Text>
          <Text style={styles.summarySub}>
            {thermal.severity === 'ROJO' ? '¡Detener motor!' : 'Electroventilador OK'}
          </Text>
        </View>
      </View>

      {/* Si la batería está baja pero no es un código DTC, mostramos su tarjeta limpia */}
      {elec.batteryStatus === 'ROJO' && (
        <View style={styles.cleanAlertCard}>
          <Text style={styles.cleanAlertBadge}>BATERÍA AL LÍMITE</Text>
          <Text style={styles.cleanAlertTitle}>{elec.batteryHeadline}</Text>
          <Text style={styles.cleanAlertBody}>{elec.batteryExplanation}</Text>
          <Text style={styles.cleanAlertPrice}>
            Cambio preventivo estimado: {formatARS(elec.replacementCostUsd.min)}
          </Text>
        </View>
      )}

      {/* Tarjetas de Fallas (con comparación limpia Hoy vs Si lo dejás pasar) */}
      {faults.length === 0 && elec.batteryStatus !== 'ROJO' ? (
        <View style={styles.peaceCard}>
          <View style={styles.peaceIconCircle}>
            <Text style={{ fontSize: 28 }}>✨</Text>
          </View>
          <Text style={styles.peaceTitle}>Tu auto está 100% sano</Text>
          <Text style={styles.peaceBody}>
            No hay fallas eléctricas, de agua ni de motor registradas en la computadora.
          </Text>
        </View>
      ) : (
        faults.map((fault) => <AntiScamFaultCard key={fault.code} fault={fault} />)
      )}

      {/* Chequeo minimalista de memoria (Compra de Auto Usado) */}
      <View
        style={[
          styles.memoryCard,
          isUsedCarFraudSuspected && {
            backgroundColor: COLORS.dangerRedCardBg,
            borderColor: COLORS.dangerRedBorder,
          },
        ]}
      >
        <Text style={styles.memoryLabel}>AUDITORÍA DE MEMORIA (AUTO USADO)</Text>
        <Text style={styles.memoryTitle}>
          {isUsedCarFraudSuspected
            ? `⚠️ Borraron fallas con escáner hace solo ${frame.distanceSinceResetKm} km`
            : `✅ Sin borrados sospechosos (${frame.distanceSinceResetKm.toLocaleString('es-AR')} km limpios)`}
        </Text>
      </View>
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
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryValue: {
    color: COLORS.textDark,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  summarySub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  cleanAlertCard: {
    backgroundColor: COLORS.warningAmberCardBg,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.warningAmberBorder,
  },
  cleanAlertBadge: {
    color: COLORS.warningAmber,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  cleanAlertTitle: {
    color: COLORS.textDark,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  cleanAlertBody: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  cleanAlertPrice: {
    color: COLORS.brandIndigo,
    fontSize: 14,
    fontWeight: '800',
  },
  peaceCard: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  peaceIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.safeGreenPastel,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  peaceTitle: {
    color: COLORS.textDark,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  peaceBody: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  memoryCard: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  memoryLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  memoryTitle: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '700',
  },
});
