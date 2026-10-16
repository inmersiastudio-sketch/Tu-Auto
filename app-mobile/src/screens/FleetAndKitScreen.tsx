import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LiveTelemetryFrame } from '../modules/obd2-engine/types';
import { COLORS } from '../theme/colors';

/**
 * Pantalla 4: Panel de Control de Flota B2B (Uber / Remises) y Vinculación de Kit Hardware
 * Permite a dueños de múltiples autos vigilar cómo los choferes cuidan el agua, aceite y batería.
 * Ticket: TUA-019, TUA-025
 */

interface FleetAndKitScreenProps {
  frame: LiveTelemetryFrame;
}

export const FleetAndKitScreen: React.FC<FleetAndKitScreenProps> = ({ frame }) => {
  const [kitSerial, setKitSerial] = useState('TUAUTO-ESP32-AR-00148');

  const fleetVehicles = [
    {
      plate: 'AE 492 KL',
      model: 'VW Gol Trend 1.6 (Este Auto - En Vivo)',
      driver: 'Carlos Gómez (Turno Mañana)',
      waterTemp: `${frame.coolantTempC}°C`,
      voltage: `${frame.voltageInstantV.toFixed(1)}V`,
      oilStatus: '21% (Cambiar en 18 días)',
      alert:
        frame.coolantTempC >= 102
          ? '🔴 ¡RECALENTANDO AGUA AHORA!'
          : frame.voltageInstantV < 13.2
          ? '🔴 ¡FALLA DE ALTERNADOR!'
          : '🟢 Todo en orden',
      isCritical: frame.coolantTempC >= 102 || frame.voltageInstantV < 13.2,
    },
    {
      plate: 'AF 810 MZ',
      model: 'Fiat Cronos 1.3 GNC (Uber)',
      driver: 'Martín Quiroga',
      waterTemp: '91°C',
      voltage: '14.2V',
      oilStatus: '8% (¡Pasado por 62 hs de tráfico!)',
      alert: '🟡 Cambio de aceite vencido',
      isCritical: false,
    },
    {
      plate: 'AD 109 QP',
      model: 'Chevrolet Prisma 1.4 (Remis)',
      driver: 'Sergio Ríos',
      waterTemp: '89°C',
      voltage: '14.0V',
      oilStatus: '74% OK',
      alert: '🟢 Todo en orden',
      isCritical: false,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SECCIÓN 1: VINCULACIÓN DEL KIT HARDWARE ECONÓMICO TU-AUTO */}
      <View style={styles.kitCard}>
        <Text style={styles.kitBadge}>🔌 KIT HARDWARE PROPIO CONECTADO</Text>
        <Text style={styles.kitTitle}>Dispositivo: Tu-Auto Smart V1 (ESP32-C3 BLE)</Text>
        <Text style={styles.kitSerial}>Serie QR: {kitSerial} • Pin 16 ADC 1kHz + Buzzer 85dB Activo</Text>
        <View style={styles.kitActionsRow}>
          <TouchableOpacity
            style={styles.qrBtn}
            onPress={() =>
              setKitSerial(`TUAUTO-ESP32-AR-00${Math.floor(100 + Math.random() * 899)}`)
            }
          >
            <Text style={styles.qrBtnText}>📷 Escanear QR de Nuevo Kit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SECCIÓN 2: PANEL B2B PARA DUEÑOS DE FLOTAS / UBER / REMISES */}
      <Text style={styles.sectionTitle}>🚕 Panel de Flota en Vivo (3 Vehículos Monitoreados)</Text>
      <Text style={styles.sectionSub}>
        Ideal para dueños de autos alquilados: recibí alertas en tu celular si un chofer recalienta el motor, se pasa del aceite o desconecta el sensor.
      </Text>

      {fleetVehicles.map((car) => (
        <View
          key={car.plate}
          style={[
            styles.fleetCard,
            car.isCritical && {
              borderColor: COLORS.dangerRed,
              backgroundColor: COLORS.dangerRedBg,
            },
          ]}
        >
          <View style={styles.fleetHeader}>
            <Text style={styles.plateBadge}>{car.plate}</Text>
            <Text style={styles.alertText}>{car.alert}</Text>
          </View>
          <Text style={styles.carModel}>{car.model}</Text>
          <Text style={styles.driverName}>👤 Chofer: {car.driver}</Text>

          <View style={styles.telemetryPillsRow}>
            <View style={styles.miniPill}>
              <Text style={styles.miniPillLabel}>AGUA</Text>
              <Text style={styles.miniPillValue}>{car.waterTemp}</Text>
            </View>
            <View style={styles.miniPill}>
              <Text style={styles.miniPillLabel}>ELÉCTRICO</Text>
              <Text style={styles.miniPillValue}>{car.voltage}</Text>
            </View>
            <View style={[styles.miniPill, { flex: 1.6 }]}>
              <Text style={styles.miniPillLabel}>ACEITE REAL</Text>
              <Text style={styles.miniPillValue}>{car.oilStatus}</Text>
            </View>
          </View>
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
  kitCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.brandCyan,
    padding: 16,
    marginBottom: 20,
  },
  kitBadge: {
    color: COLORS.brandCyan,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  kitTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  kitSerial: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  kitActionsRow: {
    flexDirection: 'row',
  },
  qrBtn: {
    backgroundColor: COLORS.brandCyan,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  qrBtnText: {
    color: '#06101E',
    fontSize: 12,
    fontWeight: '900',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  fleetCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
  },
  fleetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  plateBadge: {
    backgroundColor: COLORS.cardElevated,
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  alertText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  carModel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  driverName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  telemetryPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniPill: {
    flex: 1,
    backgroundColor: COLORS.cardElevated,
    borderRadius: 10,
    padding: 8,
  },
  miniPillLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '800',
  },
  miniPillValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
});
