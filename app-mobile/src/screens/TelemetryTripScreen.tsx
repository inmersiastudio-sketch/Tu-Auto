import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Share2,
  Info,
  Zap,
  Gauge,
  Thermometer,
} from 'lucide-react-native';
import { TelemetryChart } from '../components/TelemetryChart';
import {
  TripSession,
  VIAJES_HISTORICOS_DEMO,
} from '../modules/trip-logger/tripLoggerEngine';
import { FreezeFrameSnapshot } from '../modules/obd2-engine/freezeFrameParser';
import { Colors, FontFamily } from '../theme/colors';

interface TelemetryTripScreenProps {
  onOpenScanner?: () => void;
}

export const TelemetryTripScreen: React.FC<TelemetryTripScreenProps> = () => {
  const [trips] = useState<TripSession[]>(VIAJES_HISTORICOS_DEMO);
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0].id);

  const activeTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  const handleShareReport = async (freezeFrame: FreezeFrameSnapshot) => {
    try {
      const text = `📋 *INFORME PERICIAL TU-AUTO (Modo 02)*\n` +
        `🚗 Falla Registrada: ${freezeFrame.causingDTC}\n` +
        `⏱️ Momento del Fallo: ${new Date(freezeFrame.timestamp).toLocaleString('es-AR')}\n` +
        `🌡️ Temperatura Motor: ${freezeFrame.coolantTempC}°C\n` +
        `🏎️ Velocidad del Auto: ${freezeFrame.vehicleSpeedKmh} km/h\n` +
        `🔄 Revoluciones: ${freezeFrame.engineRpm} RPM\n` +
        `⚡ Voltaje ECU: ${freezeFrame.controlVoltageV}V\n` +
        `📌 Contexto: ${freezeFrame.contextExplanation}\n\n` +
        `_Generado automáticamente por la Caja Negra de Tu-Auto._`;

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('Informe pericial copiado al portapapeles para enviar por WhatsApp al taller.');
      } else {
        await Share.share({ message: text });
      }
    } catch {
      // Ignorar cancelaciones
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Caja Negra & Viajes</Text>
          <Text style={styles.subtitle}>
            Telemetría continua y fotos periciales (Modo 02)
          </Text>
        </View>

        <View style={styles.recordingBadge}>
          <View style={styles.pulsingDot} />
          <Text style={styles.recordingText}>ACTIVO</Text>
        </View>
      </View>

      {/* Selector de Viajes */}
      <View style={styles.tripSelectorWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tripSelectorScroll}
        >
          {trips.map((trip) => {
            const isSelected = trip.id === activeTrip.id;
            const isCritical = trip.healthGrade === 'CRITICO';
            const isWarning = trip.healthGrade === 'PRECAUCION';

            return (
              <TouchableOpacity
                key={trip.id}
                style={[
                  styles.tripPill,
                  isSelected && styles.tripPillActive,
                ]}
                onPress={() => setSelectedTripId(trip.id)}
                activeOpacity={0.8}
              >
                <View style={styles.tripPillHeader}>
                  <Calendar
                    size={12}
                    color={isSelected ? '#FFFFFF' : Colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.tripDateText,
                      isSelected && styles.tripDateTextActive,
                    ]}
                  >
                    {trip.dateStr}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.tripTitleText,
                    isSelected && styles.tripTitleTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {trip.distanceKm} km · {trip.durationMinutes} min
                </Text>

                <View style={styles.tripTagRow}>
                  {isCritical ? (
                    <View style={styles.criticalBadge}>
                      <AlertTriangle size={10} color="#DC2626" />
                      <Text style={styles.criticalBadgeText}>Incidente</Text>
                    </View>
                  ) : isWarning ? (
                    <View style={styles.warningBadge}>
                      <Text style={styles.warningBadgeText}>Tráfico 99°C</Text>
                    </View>
                  ) : (
                    <View style={styles.safeBadge}>
                      <CheckCircle2 size={10} color="#059669" />
                      <Text style={styles.safeBadgeText}>Óptimo</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Hero Card del Viaje Seleccionado */}
      <View style={styles.tripHeroCard}>
        <View style={styles.heroTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTripTitle}>{activeTrip.title}</Text>
            <Text style={styles.heroTripSummary}>{activeTrip.healthSummary}</Text>
          </View>
        </View>

        <View style={styles.heroMetricsGrid}>
          <View style={styles.metricItem}>
            <Thermometer size={16} color="#EF4444" />
            <Text style={styles.metricLabel}>MÁX AGUA</Text>
            <Text style={[styles.metricValue, activeTrip.maxCoolantTempC >= 100 && { color: '#DC2626' }]}>
              {activeTrip.maxCoolantTempC}°C
            </Text>
          </View>

          <View style={styles.metricItem}>
            <Zap size={16} color="#2563EB" />
            <Text style={styles.metricLabel}>ARRANQUE</Text>
            <Text style={[styles.metricValue, activeTrip.minCrankingVoltV < 9.6 && { color: '#D97706' }]}>
              {activeTrip.minCrankingVoltV}V
            </Text>
          </View>

          <View style={styles.metricItem}>
            <Gauge size={16} color="#059669" />
            <Text style={styles.metricLabel}>VEL MEDIA</Text>
            <Text style={styles.metricValue}>
              {activeTrip.avgSpeedKmh} km/h
            </Text>
          </View>

          <View style={styles.metricItem}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.metricLabel}>DURACIÓN</Text>
            <Text style={styles.metricValue}>
              {activeTrip.durationMinutes} min
            </Text>
          </View>
        </View>
      </View>

      {/* Gráfico SVG de Telemetría */}
      <TelemetryChart samples={activeTrip.samples} />

      {/* Foto Congelada de Falla (Freeze Frame - Modo 02) */}
      {activeTrip.freezeFrame ? (
        <View style={styles.freezeFrameCard}>
          <View style={styles.freezeFrameHeader}>
            <View style={styles.freezeFrameBadge}>
              <Camera size={13} color="#FFFFFF" />
              <Text style={styles.freezeFrameBadgeText}>MODO 02 OBD2 · FOTO CONGELADA</Text>
            </View>
            <Text style={styles.freezeFrameDtc}>
              {activeTrip.freezeFrame.causingDTC}
            </Text>
          </View>

          <Text style={styles.freezeFrameExplanation}>
            {activeTrip.freezeFrame.contextExplanation}
          </Text>

          <View style={styles.freezeFrameGrid}>
            <View style={styles.freezeCol}>
              <Text style={styles.freezeLabel}>VELOCIDAD</Text>
              <Text style={styles.freezeValue}>{activeTrip.freezeFrame.vehicleSpeedKmh} km/h</Text>
            </View>
            <View style={styles.freezeCol}>
              <Text style={styles.freezeLabel}>REVOLUCIONES</Text>
              <Text style={styles.freezeValue}>{activeTrip.freezeFrame.engineRpm.toLocaleString('es-AR')} RPM</Text>
            </View>
            <View style={styles.freezeCol}>
              <Text style={styles.freezeLabel}>TEMPERATURA</Text>
              <Text style={[styles.freezeValue, { color: '#DC2626' }]}>
                {activeTrip.freezeFrame.coolantTempC}°C
              </Text>
            </View>
            <View style={styles.freezeCol}>
              <Text style={styles.freezeLabel}>CARGA MOTOR</Text>
              <Text style={styles.freezeValue}>{activeTrip.freezeFrame.calculatedLoadPercent}%</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => handleShareReport(activeTrip.freezeFrame!)}
            activeOpacity={0.85}
          >
            <Share2 size={16} color="#FFFFFF" />
            <Text style={styles.shareBtnText}>Copiar Informe para Enviar al Mecánico</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cleanTripCard}>
          <CheckCircle2 size={24} color="#059669" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cleanTripTitle}>Sin Fallas Grabadas en este Viaje</Text>
            <Text style={styles.cleanTripDesc}>
              La computadora del motor no disparó ningún cuadro congelado (Modo 02). Todos los parámetros se mantuvieron en rango normal.
            </Text>
          </View>
        </View>
      )}

      {/* Nota Pedagógica / Anti-Estafas */}
      <View style={styles.eduCard}>
        <Info size={18} color="#2563EB" style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.eduTitle}>¿Por qué esta información te protege?</Text>
          <Text style={styles.eduText}>
            En un taller mecánico convencional, si te dicen "se rompió la tapa de cilindros porque recalentó", vos podés abrir este historial y demostrar exactamente qué día, a qué hora y a qué velocidad ocurrió el fallo con datos inalterables de la computadora del auto.
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
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#059669',
  },
  recordingText: {
    fontFamily: FontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  tripSelectorWrapper: {
    marginBottom: 14,
  },
  tripSelectorScroll: {
    gap: 10,
  },
  tripPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    minWidth: 150,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
  },
  tripPillActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  tripPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  tripDateText: {
    fontFamily: FontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tripDateTextActive: {
    color: '#EFF6FF',
  },
  tripTitleText: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  tripTitleTextActive: {
    color: '#FFFFFF',
  },
  tripTagRow: {
    flexDirection: 'row',
  },
  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  safeBadgeText: {
    fontFamily: FontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  warningBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  warningBadgeText: {
    fontFamily: FontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#D97706',
  },
  criticalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  criticalBadgeText: {
    fontFamily: FontFamily,
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  tripHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 14,
  },
  heroTopRow: {
    marginBottom: 14,
  },
  heroTripTitle: {
    fontFamily: FontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  heroTripSummary: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 17,
  },
  heroMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    padding: 10,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontFamily: FontFamily,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: 4,
  },
  metricValue: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  freezeFrameCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    marginBottom: 14,
  },
  freezeFrameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  freezeFrameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freezeFrameBadgeText: {
    fontFamily: FontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  freezeFrameDtc: {
    fontFamily: FontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
  },
  freezeFrameExplanation: {
    fontFamily: FontFamily,
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  freezeFrameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 14,
  },
  freezeCol: {
    width: '45%',
  },
  freezeLabel: {
    fontFamily: FontFamily,
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  freezeValue: {
    fontFamily: FontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 12,
  },
  shareBtnText: {
    fontFamily: FontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cleanTripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 14,
  },
  cleanTripTitle: {
    fontFamily: FontFamily,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#166534',
  },
  cleanTripDesc: {
    fontFamily: FontFamily,
    fontSize: 12,
    color: '#15803D',
    marginTop: 2,
    lineHeight: 16,
  },
  eduCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.brandLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  eduTitle: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.brandPrimary,
  },
  eduText: {
    fontFamily: FontFamily,
    fontSize: 11.5,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
});
