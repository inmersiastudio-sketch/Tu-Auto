import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntiScamFaultCard } from '../components/AntiScamFaultCard';
import { translateVehicleFaults } from '../modules/fault-translator/faultCatalog';
import { LiveTelemetryFrame } from '../modules/obd2-engine/types';
import { COLORS } from '../theme/colors';

/**
 * Pantalla 2: Escáner Inteligente, Escudo Anti-Estafas e Inspector de Auto Usado
 * Traduce códigos Modo 03/07 a lenguaje humano + Detecta si borraron fallas recientemente.
 * Ticket: TUA-012, TUA-013
 */

interface ScannerScreenProps {
  frame: LiveTelemetryFrame;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({ frame }) => {
  const [lastScanTimestamp, setLastScanTimestamp] = useState<string>('Recién actualizado');
  const faults = translateVehicleFaults(frame);
  const isUsedCarFraudSuspected = frame.distanceSinceResetKm < 150;

  const handleManualScan = () => {
    const now = new Date();
    setLastScanTimestamp(
      `Escaneado hoy a las ${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')} hs`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabecera de Escáner */}
      <View style={styles.scannerHero}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroTitle}>🔍 Escáner Anti-Estafas</Text>
          <Text style={styles.heroSubtitle}>
            Lee fallas activas y fallas silenciosas (Modo 07) antes de que prendan la luz del tablero.
          </Text>
          <Text style={styles.scanTime}>{lastScanTimestamp}</Text>
        </View>
        <TouchableOpacity style={styles.scanButton} onPress={handleManualScan}>
          <Text style={styles.scanButtonText}>Re-Escanear</Text>
        </TouchableOpacity>
      </View>

      {/* MÓDULO INSPECTOR DE COMPRA DE AUTO USADO (PID 0131) */}
      <View
        style={[
          styles.usedCarCard,
          {
            borderColor: isUsedCarFraudSuspected ? COLORS.dangerRed : COLORS.safeGreen,
            backgroundColor: isUsedCarFraudSuspected
              ? COLORS.dangerRedBg
              : COLORS.cardBackground,
          },
        ]}
      >
        <Text style={styles.usedCarBadge}>
          🕵️ AUDITORÍA DE MEMORIA ECU (COMPRA DE AUTO USADO)
        </Text>
        <Text style={styles.usedCarTitle}>
          {isUsedCarFraudSuspected
            ? `🚨 ¡ALERTA DE OCULTAMIENTO! Borraron las fallas hace solo ${frame.distanceSinceResetKm} km`
            : `✅ Memoria Limpia: Pasaron ${frame.distanceSinceResetKm.toLocaleString('es-AR')} km desde el último reseteo`}
        </Text>
        <Text style={styles.usedCarBody}>
          {isUsedCarFraudSuspected
            ? 'Alguien conectó un escáner y borró la luz de Check Engine hace poquísimos kilómetros (típico truco antes de mostrar un auto en venta para esconder fallas caras).'
            : 'Nadie manipuló ni borró la computadora recientemente. Las lecturas del motor son auténticas.'}
        </Text>
      </View>

      {/* LISTA DE ROTURAS TRADUCIDAS CON COSTOS EN MONEDA LOCAL */}
      <Text style={styles.sectionHeader}>
        {faults.length > 0
          ? `⚠️ Diagnósticos y Presupuestos Detectados (${faults.length})`
          : '🟢 0 Fallas Encontradas en la Computadora'}
      </Text>

      {faults.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🛡️</Text>
          <Text style={styles.emptyTitle}>¡Tu auto no tiene fallas eléctricas ni de motor!</Text>
          <Text style={styles.emptySubtitle}>
            Revisamos inyección, bobinas, sensores de agua, catalizador y alternador (Modo 03 y Modo 07 Preventivo).
            Podés usar la barra superior de Simulación para probar cómo se ve cuando algo se rompe.
          </Text>
        </View>
      ) : (
        faults.map((fault) => <AntiScamFaultCard key={fault.code} fault={fault} />)
      )}
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
  scannerHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    gap: 12,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  scanTime: {
    color: COLORS.brandCyan,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  scanButton: {
    backgroundColor: COLORS.brandCyan,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scanButtonText: {
    color: '#06101E',
    fontWeight: '900',
    fontSize: 12,
  },
  usedCarCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 18,
  },
  usedCarBadge: {
    color: COLORS.brandCyan,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  usedCarTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  usedCarBody: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.safeGreen,
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 38,
    marginBottom: 8,
  },
  emptyTitle: {
    color: COLORS.safeGreen,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});
