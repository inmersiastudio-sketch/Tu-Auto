import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import { Thermometer, Zap, Gauge } from 'lucide-react-native';
import { TelemetrySample } from '../modules/trip-logger/tripLoggerEngine';
import { Colors, FontFamily } from '../theme/colors';

interface TelemetryChartProps {
  samples: TelemetrySample[];
}

type MetricKey = 'TEMP' | 'VOLT' | 'SPEED';

export const TelemetryChart: React.FC<TelemetryChartProps> = ({ samples }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('TEMP');

  if (!samples || samples.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sin datos registrados en este recorrido</Text>
      </View>
    );
  }

  // Dimensiones del canvas SVG
  const chartWidth = 330;
  const chartHeight = 160;
  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 26;

  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  // Extraer valores según métrica
  let values: number[] = [];
  let unit = '';
  let colorStroke: string = Colors.brandPrimary;
  let gradientId = 'gradBlue';
  let thresholdValue: number | null = null;
  let thresholdLabel = '';

  if (selectedMetric === 'TEMP') {
    values = samples.map((s) => s.coolantTempC);
    unit = '°C';
    colorStroke = '#EF4444'; // Alerta roja/naranja para calor
    gradientId = 'gradTemp';
    thresholdValue = 100;
    thresholdLabel = 'Límite 100°C';
  } else if (selectedMetric === 'VOLT') {
    values = samples.map((s) => s.voltageV);
    unit = 'V';
    colorStroke = '#2563EB'; // Azul para electricidad
    gradientId = 'gradVolt';
    thresholdValue = 13.5;
    thresholdLabel = 'Carga 13.5V';
  } else {
    values = samples.map((s) => s.speedKmh);
    unit = 'km/h';
    colorStroke = '#059669'; // Verde para velocidad
    gradientId = 'gradSpeed';
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const minVal = Math.floor(rawMin * 0.95);
  const maxVal = Math.ceil(rawMax * 1.05) || minVal + 10;
  const range = maxVal - minVal || 1;

  // Mapear puntos a coordenadas (x, y)
  const points = values.map((val, idx) => {
    const x = paddingLeft + (idx / Math.max(1, values.length - 1)) * usableWidth;
    const y = paddingTop + (1 - (val - minVal) / range) * usableHeight;
    return { x, y, val };
  });

  // Generar string para el Path SVG de la curva
  const linePathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Generar string para el Path del área sombreada
  const areaPathD = `${linePathD} L ${points[points.length - 1].x} ${
    paddingTop + usableHeight
  } L ${points[0].x} ${paddingTop + usableHeight} Z`;

  // Calcular coordenada Y del umbral si aplica
  let thresholdY: number | null = null;
  if (thresholdValue !== null && thresholdValue >= minVal && thresholdValue <= maxVal) {
    thresholdY = paddingTop + (1 - (thresholdValue - minVal) / range) * usableHeight;
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Curva de Telemetría</Text>

        <View style={styles.metricPillsContainer}>
          <TouchableOpacity
            style={[
              styles.pillBtn,
              selectedMetric === 'TEMP' && styles.pillBtnActiveTemp,
            ]}
            onPress={() => setSelectedMetric('TEMP')}
            activeOpacity={0.8}
          >
            <Thermometer
              size={13}
              color={selectedMetric === 'TEMP' ? '#FFFFFF' : Colors.textSecondary}
            />
            <Text
              style={[
                styles.pillText,
                selectedMetric === 'TEMP' && styles.pillTextActive,
              ]}
            >
              Agua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pillBtn,
              selectedMetric === 'VOLT' && styles.pillBtnActiveVolt,
            ]}
            onPress={() => setSelectedMetric('VOLT')}
            activeOpacity={0.8}
          >
            <Zap
              size={13}
              color={selectedMetric === 'VOLT' ? '#FFFFFF' : Colors.textSecondary}
            />
            <Text
              style={[
                styles.pillText,
                selectedMetric === 'VOLT' && styles.pillTextActive,
              ]}
            >
              Batería
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pillBtn,
              selectedMetric === 'SPEED' && styles.pillBtnActiveSpeed,
            ]}
            onPress={() => setSelectedMetric('SPEED')}
            activeOpacity={0.8}
          >
            <Gauge
              size={13}
              color={selectedMetric === 'SPEED' ? '#FFFFFF' : Colors.textSecondary}
            />
            <Text
              style={[
                styles.pillText,
                selectedMetric === 'SPEED' && styles.pillTextActive,
              ]}
            >
              Km/h
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <Defs>
            <LinearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#EF4444" stopOpacity="0.28" />
              <Stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
            </LinearGradient>
            <LinearGradient id="gradVolt" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </LinearGradient>
            <LinearGradient id="gradSpeed" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Líneas horizontales de guía */}
          <Line
            x1={paddingLeft}
            y1={paddingTop}
            x2={chartWidth - paddingRight}
            y2={paddingTop}
            stroke="#E2E8F0"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <Line
            x1={paddingLeft}
            y1={paddingTop + usableHeight / 2}
            x2={chartWidth - paddingRight}
            y2={paddingTop + usableHeight / 2}
            stroke="#E2E8F0"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          <Line
            x1={paddingLeft}
            y1={paddingTop + usableHeight}
            x2={chartWidth - paddingRight}
            y2={paddingTop + usableHeight}
            stroke="#CBD5E1"
            strokeWidth={1}
          />

          {/* Línea de umbral crítico si existe */}
          {thresholdY !== null && (
            <>
              <Line
                x1={paddingLeft}
                y1={thresholdY}
                x2={chartWidth - paddingRight}
                y2={thresholdY}
                stroke="#DC2626"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              />
              <SvgText
                x={chartWidth - paddingRight}
                y={thresholdY - 4}
                fill="#DC2626"
                fontSize={9}
                fontWeight="700"
                textAnchor="end"
              >
                {thresholdLabel}
              </SvgText>
            </>
          )}

          {/* Relleno con gradiente bajo la curva */}
          <Path d={areaPathD} fill={`url(#${gradientId})`} />

          {/* Línea principal de la curva */}
          <Path
            d={linePathD}
            fill="none"
            stroke={colorStroke}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos destacados */}
          {points.map((pt, i) => (
            <Circle
              key={`dot-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={i === points.length - 1 ? 4.5 : 3}
              fill="#FFFFFF"
              stroke={colorStroke}
              strokeWidth={2}
            />
          ))}

          {/* Etiquetas del eje Y */}
          <SvgText
            x={paddingLeft - 6}
            y={paddingTop + 4}
            fill={Colors.textMuted}
            fontSize={9.5}
            fontWeight="600"
            textAnchor="end"
          >
            {maxVal}
          </SvgText>
          <SvgText
            x={paddingLeft - 6}
            y={paddingTop + usableHeight}
            fill={Colors.textMuted}
            fontSize={9.5}
            fontWeight="600"
            textAnchor="end"
          >
            {minVal}
          </SvgText>

          {/* Etiquetas del eje X (Tiempo) */}
          <SvgText
            x={paddingLeft}
            y={chartHeight - 6}
            fill={Colors.textMuted}
            fontSize={9.5}
            fontWeight="500"
            textAnchor="start"
          >
            Inicio
          </SvgText>
          <SvgText
            x={chartWidth - paddingRight}
            y={chartHeight - 6}
            fill={Colors.textMuted}
            fontSize={9.5}
            fontWeight="500"
            textAnchor="end"
          >
            Llegada
          </SvgText>
        </Svg>
      </View>

      <View style={styles.statsSummaryRow}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>MÍNIMO</Text>
          <Text style={styles.statValue}>
            {rawMin} {unit}
          </Text>
        </View>

        <View style={styles.statColBorder}>
          <Text style={styles.statLabel}>MÁXIMO</Text>
          <Text style={[styles.statValue, rawMax >= 100 && selectedMetric === 'TEMP' && { color: '#DC2626' }]}>
            {rawMax} {unit}
          </Text>
        </View>

        <View style={styles.statCol}>
          <Text style={styles.statLabel}>PROMEDIO</Text>
          <Text style={styles.statValue}>
            {(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)} {unit}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: FontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricPillsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: 10,
    padding: 2.5,
    gap: 2,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pillBtnActiveTemp: {
    backgroundColor: '#EF4444',
  },
  pillBtnActiveVolt: {
    backgroundColor: '#2563EB',
  },
  pillBtnActiveSpeed: {
    backgroundColor: '#059669',
  },
  pillText: {
    fontFamily: FontFamily,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statColBorder: {
    alignItems: 'center',
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontFamily: FontFamily,
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: FontFamily,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily,
    fontSize: 12.5,
    color: Colors.textMuted,
  },
});
