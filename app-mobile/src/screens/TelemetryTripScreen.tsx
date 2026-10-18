import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
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
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { TelemetryChart } from '../components/TelemetryChart';
import {
  TripSession,
  VIAJES_HISTORICOS_DEMO,
} from '../modules/trip-logger/tripLoggerEngine';
import { FreezeFrameSnapshot } from '../modules/obd2-engine/freezeFrameParser';
import { Colors, FontFamily } from '../theme/colors';

type FilterType = 'ALL' | 'ALERTS' | 'CLEAN';

interface MiniSparklineProps {
  samples: { coolantTempC: number }[];
  color: string;
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({ samples, color }) => {
  if (!samples || samples.length < 2) return null;
  const width = 84;
  const height = 32;
  const values = samples.map((s) => s.coolantTempC);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return { x, y };
  });

  const lineD = points.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );
  const areaD = `${lineD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <View style={styles.sparklineContainer}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>
        <Path d={areaD} fill={`url(#sparkGrad-${color.replace('#', '')})`} />
        <Path d={lineD} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    </View>
  );
};

export const TelemetryTripScreen: React.FC = () => {
  const [trips] = useState<TripSession[]>(VIAJES_HISTORICOS_DEMO);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [expandedTripId, setExpandedTripId] = useState<string>(trips[0].id);

  const filteredTrips = trips.filter((t) => {
    if (filter === 'ALERTS') return t.healthGrade === 'CRITICO' || t.healthGrade === 'PRECAUCION';
    if (filter === 'CLEAN') return t.healthGrade === 'EXCELENTE';
    return true;
  });

  const handleShareReport = async (freezeFrame: FreezeFrameSnapshot) => {
    try {
      const text =
        `📋 *INFORME PERICIAL TU-AUTO (Modo 02 OBD2)*\n\n` +
        `🚗 *Falla Registrada:* ${freezeFrame.causingDTC}\n` +
        `⏱️ *Momento:* ${new Date(freezeFrame.timestamp).toLocaleString('es-AR')}\n` +
        `🌡️ *Temperatura de Agua:* ${freezeFrame.coolantTempC}°C\n` +
        `🏎️ *Velocidad:* ${freezeFrame.vehicleSpeedKmh} km/h\n` +
        `🔄 *Revoluciones del Motor:* ${freezeFrame.engineRpm.toLocaleString('es-AR')} RPM\n` +
        `⚡ *Voltaje ECU:* ${freezeFrame.controlVoltageV}V\n` +
        `📊 *Carga de Motor:* ${freezeFrame.calculatedLoadPercent}%\n\n` +
        `📌 *Diagnóstico Pericial:* ${freezeFrame.contextExplanation}\n\n` +
        `_Generado por la Caja Negra de Tu-Auto._`;

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        alert('Informe pericial copiado para enviar por WhatsApp al taller.');
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
      {/* Encabezado Principal */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Bitácora de Viajes</Text>
          <Text style={styles.subtitle}>
            Historial de conducción y caja negra pericial
          </Text>
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>EN VIVO</Text>
        </View>
      </View>

      {/* Tarjeta Ejecutiva Semanal */}
      <View style={styles.weeklySummaryCard}>
        <View style={styles.weeklyCardHeader}>
          <View style={styles.weeklyScoreBadge}>
            <ShieldCheck size={14} color="#059669" />
            <Text style={styles.weeklyScoreText}>94 / 100 · Salud Óptima</Text>
          </View>
          <Text style={styles.weeklyDateRange}>Últimos 7 días</Text>
        </View>

        <Text style={styles.weeklyHeadline}>
          50.4 km recorridos en 3 viajes
        </Text>
        <Text style={styles.weeklySubtext}>
          El sistema eléctrico respondió excelente (10.35V en arranque). Solo se registró un pico térmico por embotellamiento.
        </Text>

        <View style={styles.weeklyStatsGrid}>
          <View style={styles.weeklyStatCol}>
            <Text style={styles.statLabel}>VIAJES</Text>
            <Text style={styles.statNumber}>3</Text>
          </View>
          <View style={styles.weeklyStatColBorder}>
            <Text style={styles.statLabel}>TEMP MÁX</Text>
            <Text style={[styles.statNumber, { color: '#DC2626' }]}>104°C</Text>
          </View>
          <View style={styles.weeklyStatColBorder}>
            <Text style={styles.statLabel}>BATERÍA MÍN</Text>
            <Text style={styles.statNumber}>9.85V</Text>
          </View>
          <View style={styles.weeklyStatCol}>
            <Text style={styles.statLabel}>MODO 02</Text>
            <Text style={[styles.statNumber, { color: '#2563EB' }]}>1 FOTO</Text>
          </View>
        </View>
      </View>

      {/* Filtros de la Bitácora */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'ALL' && styles.filterPillActive]}
          onPress={() => setFilter('ALL')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>
            Todos ({trips.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'CLEAN' && styles.filterPillActive]}
          onPress={() => setFilter('CLEAN')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filter === 'CLEAN' && styles.filterTextActive]}>
            Sin Falla (2)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'ALERTS' && styles.filterPillActive]}
          onPress={() => setFilter('ALERTS')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filter === 'ALERTS' && styles.filterTextActive]}>
            Incidentes (1)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feed Vertical de Viajes */}
      <View style={styles.tripsFeed}>
        {filteredTrips.map((trip) => {
          const isExpanded = trip.id === expandedTripId;
          const isCritical = trip.healthGrade === 'CRITICO';
          const isWarning = trip.healthGrade === 'PRECAUCION';
          const sparkColor = isCritical ? '#DC2626' : isWarning ? '#D97706' : '#2563EB';

          return (
            <View
              key={trip.id}
              style={[
                styles.tripCard,
                isExpanded && styles.tripCardExpanded,
                isCritical && styles.tripCardCriticalBorder,
              ]}
            >
              {/* Cabecera de la Tarjeta de Viaje */}
              <TouchableOpacity
                style={styles.tripCardHeader}
                onPress={() => setExpandedTripId(isExpanded ? '' : trip.id)}
                activeOpacity={0.85}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.tripMetaRow}>
                    <Calendar size={12} color={Colors.textMuted} />
                    <Text style={styles.tripDate}>{trip.dateStr}</Text>
                    <Text style={styles.tripDotSeparator}>•</Text>
                    <Clock size={12} color={Colors.textMuted} />
                    <Text style={styles.tripMetaText}>{trip.durationMinutes} min</Text>
                  </View>

                  <Text style={styles.tripTitle}>{trip.title}</Text>

                  <View style={styles.tripHighlightsRow}>
                    <Text style={styles.tripKmBadge}>{trip.distanceKm} km</Text>
                    <Text style={styles.tripMetaText}>
                      Promedio {trip.avgSpeedKmh} km/h
                    </Text>
                  </View>
                </View>

                {/* Mini Gráfico Sparkline a la derecha */}
                <View style={styles.cardRightCol}>
                  <MiniSparkline samples={trip.samples} color={sparkColor} />
                  <View style={styles.expandChevronRow}>
                    {isCritical ? (
                      <View style={styles.cardCritTag}>
                        <AlertTriangle size={11} color="#DC2626" />
                        <Text style={styles.cardCritText}>Incidente</Text>
                      </View>
                    ) : isWarning ? (
                      <View style={styles.cardWarnTag}>
                        <Text style={styles.cardWarnText}>99°C</Text>
                      </View>
                    ) : (
                      <View style={styles.cardSafeTag}>
                        <CheckCircle2 size={11} color="#059669" />
                        <Text style={styles.cardSafeText}>Óptimo</Text>
                      </View>
                    )}

                    {isExpanded ? (
                      <ChevronUp size={16} color={Colors.textMuted} />
                    ) : (
                      <ChevronDown size={16} color={Colors.textMuted} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Contenido Expandible de Detalle */}
              {isExpanded && (
                <View style={styles.expandedContent}>
                  {/* Resumen del Conductor */}
                  <View style={styles.summaryBox}>
                    <Text style={styles.summaryBoxText}>{trip.healthSummary}</Text>
                  </View>

                  {/* Radiografía de Métricas Clave */}
                  <View style={styles.metricsDetailGrid}>
                    <View style={styles.metricDetailBox}>
                      <Thermometer size={14} color="#EF4444" />
                      <Text style={styles.metricDetailLabel}>MÁX AGUA</Text>
                      <Text
                        style={[
                          styles.metricDetailVal,
                          trip.maxCoolantTempC >= 100 && { color: '#DC2626' },
                        ]}
                      >
                        {trip.maxCoolantTempC}°C
                      </Text>
                    </View>

                    <View style={styles.metricDetailBox}>
                      <Zap size={14} color="#2563EB" />
                      <Text style={styles.metricDetailLabel}>ARRANQUE</Text>
                      <Text
                        style={[
                          styles.metricDetailVal,
                          trip.minCrankingVoltV < 9.6 && { color: '#D97706' },
                        ]}
                      >
                        {trip.minCrankingVoltV}V
                      </Text>
                    </View>

                    <View style={styles.metricDetailBox}>
                      <Gauge size={14} color="#059669" />
                      <Text style={styles.metricDetailLabel}>VELOCIDAD</Text>
                      <Text style={styles.metricDetailVal}>{trip.avgSpeedKmh} km/h</Text>
                    </View>
                  </View>

                  {/* Gráfica SVG Completa del Viaje */}
                  <View style={styles.chartContainer}>
                    <TelemetryChart samples={trip.samples} />
                  </View>

                  {/* Línea de Sucesos del Viaje (Timeline) */}
                  <View style={styles.timelineCard}>
                    <Text style={styles.timelineTitle}>Línea de Sucesos del Viaje</Text>

                    <View style={styles.timelineItem}>
                      <View style={styles.timelineDotGreen} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.timelineEventTitle}>
                          Partida & Giro de Arranque
                        </Text>
                        <Text style={styles.timelineEventDesc}>
                          Batería cayó a {trip.minCrankingVoltV}V durante el giro del motor (saludable). Temperatura inicial: {trip.samples[0]?.coolantTempC || 45}°C.
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timelineItem}>
                      <View
                        style={[
                          styles.timelineDotBlue,
                          trip.maxCoolantTempC >= 100 && { backgroundColor: '#DC2626' },
                        ]}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.timelineEventTitle}>
                          Punto Máximo Térmico ({trip.maxCoolantTempC}°C)
                        </Text>
                        <Text style={styles.timelineEventDesc}>
                          {trip.maxCoolantTempC >= 100
                            ? 'El motor superó los 100°C. La computadora activó protocolo de seguridad.'
                            : 'El electroventilador y termostato mantuvieron la temperatura en rango ideal (88-92°C).'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.timelineItemLast}>
                      <View style={styles.timelineDotGray} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.timelineEventTitle}>Fin de Recorrido</Text>
                        <Text style={styles.timelineEventDesc}>
                          {trip.distanceKm} km completados. Alternador promedió {trip.avgVoltageV}V.
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Tarjeta Pericial Modo 02 si hay Falla */}
                  {trip.freezeFrame ? (
                    <View style={styles.freezeFrameBox}>
                      <View style={styles.freezeHeaderRow}>
                        <View style={styles.freezeBadge}>
                          <Camera size={13} color="#FFFFFF" />
                          <Text style={styles.freezeBadgeText}>
                            MODO 02 OBD2 · FOTO CONGELADA
                          </Text>
                        </View>
                        <Text style={styles.freezeDtcText}>
                          {trip.freezeFrame.causingDTC}
                        </Text>
                      </View>

                      <Text style={styles.freezeExplanation}>
                        {trip.freezeFrame.contextExplanation}
                      </Text>

                      <View style={styles.freezeDataGrid}>
                        <View style={styles.freezeCol}>
                          <Text style={styles.freezeColLabel}>VELOCIDAD</Text>
                          <Text style={styles.freezeColVal}>
                            {trip.freezeFrame.vehicleSpeedKmh} km/h
                          </Text>
                        </View>
                        <View style={styles.freezeCol}>
                          <Text style={styles.freezeColLabel}>RPM</Text>
                          <Text style={styles.freezeColVal}>
                            {trip.freezeFrame.engineRpm.toLocaleString('es-AR')}
                          </Text>
                        </View>
                        <View style={styles.freezeCol}>
                          <Text style={styles.freezeColLabel}>TEMPERATURA</Text>
                          <Text style={[styles.freezeColVal, { color: '#DC2626' }]}>
                            {trip.freezeFrame.coolantTempC}°C
                          </Text>
                        </View>
                        <View style={styles.freezeCol}>
                          <Text style={styles.freezeColLabel}>CARGA ECU</Text>
                          <Text style={styles.freezeColVal}>
                            {trip.freezeFrame.calculatedLoadPercent}%
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.shareReportBtn}
                        onPress={() => handleShareReport(trip.freezeFrame!)}
                        activeOpacity={0.85}
                      >
                        <Share2 size={15} color="#FFFFFF" />
                        <Text style={styles.shareReportText}>
                          Enviar Prueba Pericial al Mecánico por WhatsApp
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Nota Pedagógica de Protección */}
      <View style={styles.footerNote}>
        <Info size={18} color="#2563EB" style={{ marginTop: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.footerNoteTitle}>¿Cómo funciona esta Caja Negra?</Text>
          <Text style={styles.footerNoteText}>
            Tu-Auto almacena cada viaje en la memoria segura del teléfono y lee la foto congelada (Modo 02) que el auto graba en su computadora cuando salta un Check Engine. Con estos datos ningún taller puede inventarte fallas que nunca ocurrieron.
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
    paddingBottom: 95,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FontFamily,
    fontSize: 21,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  liveBadge: {
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
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#059669',
  },
  liveBadgeText: {
    fontFamily: FontFamily,
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  weeklySummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 16,
  },
  weeklyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weeklyScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  weeklyScoreText: {
    fontFamily: FontFamily,
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  weeklyDateRange: {
    fontFamily: FontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  weeklyHeadline: {
    fontFamily: FontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  weeklySubtext: {
    fontFamily: FontFamily,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16.5,
    marginBottom: 14,
  },
  weeklyStatsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    paddingVertical: 10,
  },
  weeklyStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  weeklyStatColBorder: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontFamily: FontFamily,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  statNumber: {
    fontFamily: FontFamily,
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  filterPillActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  filterText: {
    fontFamily: FontFamily,
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  tripsFeed: {
    gap: 12,
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
  },
  tripCardExpanded: {
    borderColor: Colors.brandPrimary,
    shadowColor: Colors.brandPrimary,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  tripCardCriticalBorder: {
    borderColor: '#FCA5A5',
  },
  tripCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  tripDate: {
    fontFamily: FontFamily,
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tripDotSeparator: {
    color: Colors.textMuted,
    fontSize: 10,
  },
  tripMetaText: {
    fontFamily: FontFamily,
    fontSize: 11.5,
    color: Colors.textMuted,
  },
  tripTitle: {
    fontFamily: FontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  tripHighlightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripKmBadge: {
    fontFamily: FontFamily,
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.brandPrimary,
    backgroundColor: Colors.brandLight,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  cardRightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  sparklineContainer: {
    marginBottom: 2,
  },
  expandChevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardSafeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardSafeText: {
    fontFamily: FontFamily,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#059669',
  },
  cardWarnTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardWarnText: {
    fontFamily: FontFamily,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D97706',
  },
  cardCritTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardCritText: {
    fontFamily: FontFamily,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  expandedContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  summaryBox: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  summaryBoxText: {
    fontFamily: FontFamily,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16.5,
  },
  metricsDetailGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricDetailBox: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  metricDetailLabel: {
    fontFamily: FontFamily,
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: 4,
  },
  metricDetailVal: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  chartContainer: {
    marginBottom: 12,
  },
  timelineCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  timelineTitle: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#CBD5E1',
    marginLeft: 6,
    paddingLeft: 14,
  },
  timelineItemLast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginLeft: 6,
    paddingLeft: 14,
  },
  timelineDotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#059669',
    position: 'absolute',
    left: -20,
    top: 2,
  },
  timelineDotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    position: 'absolute',
    left: -20,
    top: 2,
  },
  timelineDotGray: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#94A3B8',
    position: 'absolute',
    left: -20,
    top: 2,
  },
  timelineEventTitle: {
    fontFamily: FontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timelineEventDesc: {
    fontFamily: FontFamily,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
  freezeFrameBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
  },
  freezeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  freezeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  freezeBadgeText: {
    fontFamily: FontFamily,
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  freezeDtcText: {
    fontFamily: FontFamily,
    fontSize: 15,
    fontWeight: '800',
    color: '#DC2626',
  },
  freezeExplanation: {
    fontFamily: FontFamily,
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 16.5,
    fontWeight: '500',
    marginBottom: 10,
  },
  freezeDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    gap: 10,
    marginBottom: 12,
  },
  freezeCol: {
    width: '45%',
  },
  freezeColLabel: {
    fontFamily: FontFamily,
    fontSize: 8.5,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  freezeColVal: {
    fontFamily: FontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  shareReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 10,
  },
  shareReportText: {
    fontFamily: FontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.brandLight,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  footerNoteTitle: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.brandPrimary,
  },
  footerNoteText: {
    fontFamily: FontFamily,
    fontSize: 11.5,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
});
