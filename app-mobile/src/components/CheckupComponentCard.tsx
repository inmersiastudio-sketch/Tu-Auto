import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Droplets,
  Cog,
  Thermometer,
  BatteryCharging,
  Disc,
  CircleDot,
  Wind,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react-native';
import {
  ComponenteEvaluado,
  ComponenteId,
  EstadoComponente,
} from '../modules/medical-checkup/checkupEngine';
import { Colors, FontFamily } from '../theme/colors';

interface Props {
  item: ComponenteEvaluado;
  kmActuales: number;
  onOpenComponentSheet?: (item: ComponenteEvaluado) => void;
}

function renderComponentIcon(id: ComponenteId, color: string) {
  const props = { size: 19, color, strokeWidth: 2.1 };
  switch (id) {
    case 'aceite_filtro':
      return <Droplets {...props} />;
    case 'correa_distribucion':
      return <Cog {...props} />;
    case 'refrigerante':
      return <Thermometer {...props} />;
    case 'bateria':
      return <BatteryCharging {...props} />;
    case 'frenos':
      return <Disc {...props} />;
    case 'neumaticos':
      return <CircleDot {...props} />;
    case 'filtro_aire':
      return <Wind {...props} />;
    case 'luces_testigos':
      return <AlertTriangle {...props} />;
  }
}

function getEstadoConfig(estado: EstadoComponente) {
  switch (estado) {
    case 'bien':
      return {
        label: 'Bien',
        textColor: Colors.safeGreenDark,
        bgColor: Colors.safeGreenBg,
        barColor: Colors.safeGreen,
      };
    case 'pronto':
      return {
        label: 'Pronto',
        textColor: Colors.warnAmberDark,
        bgColor: Colors.warnAmberBg,
        barColor: Colors.warnAmber,
      };
    case 'revisar':
      return {
        label: 'Revisar',
        textColor: Colors.dangerRedDark,
        bgColor: Colors.dangerRedBg,
        barColor: Colors.dangerRed,
      };
    case 'sin_datos':
      return {
        label: 'Cargar',
        textColor: Colors.textSecondary,
        bgColor: Colors.bgElevated,
        barColor: Colors.textMuted,
      };
  }
}

export const CheckupComponentCard: React.FC<Props> = ({
  item,
  onOpenComponentSheet,
}) => {
  const cfg = getEstadoConfig(item.estado);

  const isTimingBeltAlert =
    item.id === 'correa_distribucion' &&
    item.aplicaAlModelo &&
    (item.estado === 'pronto' || item.estado === 'revisar');

  const barWidthPct =
    item.vidaConsumidaPct !== null
      ? Math.min(100, Math.max(6, item.vidaConsumidaPct))
      : 0;

  const canConfigure =
    item.aplicaAlModelo &&
    item.id !== 'luces_testigos' &&
    !!onOpenComponentSheet;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isTimingBeltAlert && styles.cardTimingBeltHighlight,
        item.estado === 'revisar' && styles.cardRevisarBorder,
      ]}
      onPress={() => canConfigure && onOpenComponentSheet?.(item)}
      activeOpacity={canConfigure ? 0.78 : 1}
    >
      <View style={styles.mainRow}>
        <View style={[styles.iconBox, { backgroundColor: cfg.bgColor }]}>
          {renderComponentIcon(item.id, cfg.textColor)}
        </View>

        <View style={styles.titleTextCol}>
          <Text style={styles.componentName} numberOfLines={1}>
            {item.nombre}
          </Text>
          <Text style={styles.shortSub} numberOfLines={1}>
            {item.cuandoToca}
          </Text>
        </View>

        <View style={styles.rightCol}>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bgColor }]}>
            <Text style={[styles.statusBadgeText, { color: cfg.textColor }]}>
              {cfg.label}
            </Text>
          </View>
          {canConfigure && (
            <ChevronRight size={16} color={Colors.textMuted} strokeWidth={2} />
          )}
        </View>
      </View>

      {item.aplicaAlModelo &&
        item.id !== 'luces_testigos' &&
        item.vidaConsumidaPct !== null && (
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${barWidthPct}%`,
                  backgroundColor: cfg.barColor,
                },
              ]}
            />
          </View>
        )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  cardTimingBeltHighlight: {
    borderColor: Colors.warnAmberBorder,
    backgroundColor: '#FFFDF7',
  },
  cardRevisarBorder: {
    borderColor: Colors.dangerRedBorder,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  componentName: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  shortSub: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12.5,
    fontWeight: '400',
    marginTop: 2,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontFamily: FontFamily,
    fontSize: 11.5,
    fontWeight: '600',
  },
  progressTrack: {
    width: '100%',
    height: 5,
    backgroundColor: Colors.bgElevated,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});
