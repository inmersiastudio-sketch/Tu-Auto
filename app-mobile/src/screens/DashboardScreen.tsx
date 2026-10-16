import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Car3DShowcase } from '../components/Car3DShowcase';
import { evaluateElectricalSystem } from '../modules/electrical-guard/electricalEngine';
import { translateVehicleFaults } from '../modules/fault-translator/faultCatalog';
import { LiveTelemetryFrame } from '../modules/obd2-engine/types';
import { evaluateOilAndFluids } from '../modules/oil-tracker/oilEngine';
import { evaluateThermalSystem } from '../modules/thermal-shield/thermalEngine';
import { CAR_PAINT_OPTIONS, COLORS, formatARS } from '../theme/colors';

interface DashboardScreenProps {
  frame: LiveTelemetryFrame;
  onNavigateToScanner: () => void;
  onNavigateToWallet: () => void;
  onToggleDemoBar: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  frame,
  onNavigateToScanner,
  onNavigateToWallet,
  onToggleDemoBar,
}) => {
  const [paintIndex, setPaintIndex] = useState(0);
  const currentPaint = CAR_PAINT_OPTIONS[paintIndex];

  const elec = evaluateElectricalSystem(frame);
  const thermal = evaluateThermalSystem(frame);
  const oil = evaluateOilAndFluids(frame);
  const faults = translateVehicleFaults(frame);

  const isOverheating = thermal.severity === 'ROJO';
  const isElecCritical = elec.alternatorSeverity === 'ROJO' || elec.batteryStatus === 'ROJO';
  const hasAnyAlert = isOverheating || isElecCritical || faults.length > 0;

  const handleCyclePaint = () => {
    setPaintIndex((prev) => (prev + 1) % CAR_PAINT_OPTIONS.length);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO CARD ÍNDIGO CON MODELO 3D DEL AUTO */}
      <View
        style={[
          styles.heroCard,
          isOverheating && { backgroundColor: '#B91C1C' },
        ]}
      >
        {/* Fila superior: Píldora de estado + Botón de Ajustes/Simulador */}
        <View style={styles.heroTopRow}>
          <TouchableOpacity style={styles.connectedPill} onPress={onToggleDemoBar}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: hasAnyAlert ? '#FBBF24' : '#34D399' },
              ]}
            />
            <Text style={styles.connectedPillBold}>VW Gol 2021</Text>
            <Text style={styles.connectedPillLight}>Conectado  ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gearButton} onPress={onToggleDemoBar}>
            <Text style={styles.gearIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Modelo y Color */}
        <Text style={styles.carTitle}>Volkswagen Gol Trend</Text>
        <Text style={styles.carSubtitle}>1.6 MSI · {currentPaint.name}</Text>

        {/* Escenario 3D del Vehículo */}
        <Car3DShowcase
          paint={currentPaint}
          onCyclePaint={handleCyclePaint}
          waterTempC={thermal.tempC}
          voltageV={frame.voltageInstantV}
          isOverheating={isOverheating}
          isElectricalAlert={isElecCritical}
          hasEngineFault={faults.length > 0}
        />

        {/* Fila inferior dentro de la tarjeta Índigo */}
        <View style={styles.heroBottomRow}>
          <View>
            <View style={styles.parkedRow}>
              <View
                style={[
                  styles.statusDotSmall,
                  { backgroundColor: hasAnyAlert ? '#FBBF24' : '#34D399' },
                ]}
              />
              <Text style={styles.parkedTitle}>
                {isOverheating
                  ? '¡Temperatura Alta!'
                  : isElecCritical
                  ? 'Revisar Batería/Carga'
                  : 'Todo en orden'}
              </Text>
            </View>
            <Text style={styles.locationSub}>📍 Palermo, Buenos Aires</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.updatedTitle}>Actualizado ahora</Text>
            <Text style={styles.updatedSub}>
              {frame.odometerKm.toLocaleString('es-AR')} km reales
            </Text>
          </View>
        </View>
      </View>

      {/* SECCIÓN SEGUIMIENTO (3 Tarjetas Minimalistas Lado a Lado) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderLabel}>SEGUIMIENTO</Text>
        <TouchableOpacity onPress={onNavigateToScanner}>
          <Text style={styles.sectionHeaderAction}>Ver ficha completa</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.threeCardsRow}>
        {/* Tarjeta 1: Sistema Eléctrico / Batería */}
        <TouchableOpacity style={styles.miniCard} onPress={onNavigateToScanner}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isElecCritical
                  ? COLORS.dangerRedPastel
                  : COLORS.safeGreenPastel,
              },
            ]}
          >
            <Text style={styles.iconEmoji}>⚡</Text>
          </View>
          <Text style={styles.miniCardTitle}>Eléctrico</Text>
          <View style={styles.miniStatusRow}>
            <View
              style={[
                styles.miniDot,
                {
                  backgroundColor: isElecCritical
                    ? COLORS.dangerRed
                    : COLORS.safeGreen,
                },
              ]}
            />
            <Text style={styles.miniStatusText} numberOfLines={1}>
              {elec.alternatorSeverity === 'ROJO'
                ? 'Sin carga'
                : elec.batteryStatus === 'ROJO'
                ? 'Bat. baja'
                : `${elec.batterySohPercent}% firme`}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Tarjeta 2: Agua y Temperatura */}
        <TouchableOpacity style={styles.miniCard} onPress={onNavigateToScanner}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isOverheating
                  ? COLORS.dangerRedPastel
                  : COLORS.safeGreenPastel,
              },
            ]}
          >
            <Text style={styles.iconEmoji}>🌡️</Text>
          </View>
          <Text style={styles.miniCardTitle}>Agua</Text>
          <View style={styles.miniStatusRow}>
            <View
              style={[
                styles.miniDot,
                {
                  backgroundColor: isOverheating
                    ? COLORS.dangerRed
                    : COLORS.safeGreen,
                },
              ]}
            />
            <Text style={styles.miniStatusText} numberOfLines={1}>
              {thermal.tempC}°C {isOverheating ? '¡Alta!' : 'Normal'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Tarjeta 3: Próximo Service (Aceite) */}
        <TouchableOpacity style={styles.miniCard} onPress={onNavigateToWallet}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: COLORS.warningAmberPastel },
            ]}
          >
            <Text style={styles.iconEmoji}>🛢️</Text>
          </View>
          <Text style={styles.miniCardTitle}>Próximo service</Text>
          <View style={styles.miniStatusRow}>
            <View
              style={[
                styles.miniDot,
                { backgroundColor: COLORS.warningAmberDot },
              ]}
            />
            <Text style={styles.miniStatusText} numberOfLines={1}>
              En {oil.estimatedDaysRemaining || 18} días
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* TARJETA INFERIOR DINÁMICA (Mantenimiento o Alerta Prioritaria sin agobiar) */}
      {hasAnyAlert ? (
        <TouchableOpacity
          style={styles.alertBannerCard}
          onPress={onNavigateToScanner}
        >
          <View style={styles.alertIconBox}>
            <Text style={{ fontSize: 18 }}>⚠️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertBannerLabel}>ATENCIÓN EN TU AUTO</Text>
            <Text style={styles.alertBannerTitle} numberOfLines={1}>
              {isOverheating
                ? 'Temperatura de agua en zona peligrosa'
                : elec.alternatorSeverity === 'ROJO'
                ? 'El alternador dejó de cargar la batería'
                : elec.batteryStatus === 'ROJO'
                ? 'Tu batería está al límite para arrancar'
                : faults[0]?.humanTitle}
            </Text>
            <Text style={styles.alertBannerSub}>
              Tocá para ver qué es y cuánto cuesta arreglarlo hoy
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.maintenanceBannerCard}
          onPress={onNavigateToWallet}
        >
          <View style={styles.maintenanceIconBox}>
            <Text style={{ fontSize: 18 }}>🕒</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.maintenanceBannerLabel}>
              PRÓXIMO MANTENIMIENTO
            </Text>
            <Text style={styles.maintenanceBannerTitle}>
              Cambio de aceite y revisión
            </Text>
            <Text style={styles.maintenanceBannerSub}>
              En {oil.estimatedDaysRemaining || 18} días · Estimado{' '}
              {formatARS(oil.serviceEstimatedCostUsd)}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      )}
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
  heroCard: {
    backgroundColor: COLORS.heroBgPrimary,
    borderRadius: 32,
    padding: 22,
    marginBottom: 22,
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  connectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.heroPillBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 7,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  connectedPillBold: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800',
  },
  connectedPillLight: {
    color: COLORS.textWhiteMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.heroPillBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearIcon: {
    fontSize: 16,
  },
  carTitle: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: '800',
  },
  carSubtitle: {
    color: COLORS.textWhiteMuted,
    fontSize: 13,
    marginTop: 2,
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  parkedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  parkedTitle: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800',
  },
  locationSub: {
    color: COLORS.textWhiteMuted,
    fontSize: 12,
    marginTop: 3,
  },
  updatedTitle: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '800',
  },
  updatedSub: {
    color: COLORS.textWhiteMuted,
    fontSize: 12,
    marginTop: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionHeaderAction: {
    color: COLORS.brandIndigo,
    fontSize: 13,
    fontWeight: '700',
  },
  threeCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  miniCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: 24,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconEmoji: {
    fontSize: 18,
  },
  miniCardTitle: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  miniStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  miniDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  miniStatusText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  maintenanceBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningAmberCardBg,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.warningAmberBorder,
    gap: 14,
  },
  maintenanceIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FDE8C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintenanceBannerLabel: {
    color: COLORS.warningAmber,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  maintenanceBannerTitle: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  maintenanceBannerSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  alertBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerRedCardBg,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.dangerRedBorder,
    gap: 14,
  },
  alertIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: COLORS.dangerRedPastel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBannerLabel: {
    color: COLORS.dangerRed,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  alertBannerTitle: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  alertBannerSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  chevron: {
    color: COLORS.textSecondary,
    fontSize: 22,
    fontWeight: '400',
  },
});
