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
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquareQuote,
  Bluetooth,
  Calculator,
  PlusCircle,
  SlidersHorizontal,
} from 'lucide-react-native';
import {
  ComponenteEvaluado,
  ComponenteId,
  EstadoComponente,
} from '../modules/medical-checkup/checkupEngine';
import { Colors } from '../theme/colors';

interface Props {
  item: ComponenteEvaluado;
  kmActuales: number;
  onOpenComponentSheet?: (item: ComponenteEvaluado) => void;
}

function renderComponentIcon(id: ComponenteId, color: string) {
  switch (id) {
    case 'aceite_filtro':
      return <Droplets size={20} color={color} />;
    case 'correa_distribucion':
      return <Cog size={20} color={color} />;
    case 'refrigerante':
      return <Thermometer size={20} color={color} />;
    case 'bateria':
      return <BatteryCharging size={20} color={color} />;
    case 'frenos':
      return <Disc size={20} color={color} />;
    case 'neumaticos':
      return <CircleDot size={20} color={color} />;
    case 'filtro_aire':
      return <Wind size={20} color={color} />;
    case 'luces_testigos':
      return <AlertTriangle size={20} color={color} />;
  }
}

function getEstadoConfig(estado: EstadoComponente) {
  switch (estado) {
    case 'bien':
      return {
        label: 'Bien',
        textColor: Colors.safeGreenDark,
        bgColor: Colors.safeGreenBg,
        borderColor: Colors.safeGreenBorder,
        barColor: Colors.safeGreen,
        StatusIcon: CheckCircle2,
      };
    case 'pronto':
      return {
        label: 'Pronto',
        textColor: Colors.warnAmberDark,
        bgColor: Colors.warnAmberBg,
        borderColor: Colors.warnAmberBorder,
        barColor: Colors.warnAmber,
        StatusIcon: Clock,
      };
    case 'revisar':
      return {
        label: 'Revisar',
        textColor: Colors.dangerRedDark,
        bgColor: Colors.dangerRedBg,
        borderColor: Colors.dangerRedBorder,
        barColor: Colors.dangerRed,
        StatusIcon: AlertTriangle,
      };
    case 'sin_datos':
      return {
        label: 'Sin datos',
        textColor: Colors.textSecondary,
        bgColor: Colors.bgElevated,
        borderColor: Colors.borderSubtle,
        barColor: Colors.textMuted,
        StatusIcon: HelpCircle,
      };
  }
}

export const CheckupComponentCard: React.FC<Props> = ({
  item,
  onOpenComponentSheet,
}) => {
  const cfg = getEstadoConfig(item.estado);
  const StatusIcon = cfg.StatusIcon;

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
      activeOpacity={canConfigure ? 0.85 : 1}
    >
      {/* Banda destacada superior si es Correa de Distribución en atención */}
      {isTimingBeltAlert && (
        <View
          style={[
            styles.criticalTopRibbon,
            item.estado === 'revisar' && styles.criticalTopRibbonRed,
          ]}
        >
          <AlertTriangle
            size={13}
            color={
              item.estado === 'revisar'
                ? Colors.dangerRedDark
                : Colors.warnAmberDark
            }
          />
          <Text
            style={[
              styles.criticalTopRibbonText,
              item.estado === 'revisar' && { color: Colors.dangerRedDark },
            ]}
          >
            COMPONENTE CRÍTICO DEL MOTOR · PRIORIDAD ALTA
          </Text>
        </View>
      )}

      {/* 1. Nombre, Fuente (Medido vs Estimado) y Estado (Icono + Palabra) */}
      <View style={styles.topRow}>
        <View style={styles.leftTitleGroup}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: cfg.bgColor, borderColor: cfg.borderColor },
            ]}
          >
            {renderComponentIcon(item.id, cfg.textColor)}
          </View>

          <View style={styles.titleTextCol}>
            <Text style={styles.componentName}>{item.nombre}</Text>
            <View style={styles.sourceRow}>
              {item.fuente === 'medido' ? (
                <Bluetooth size={11} color={Colors.brandPrimary} />
              ) : (
                <Calculator size={11} color={Colors.textMuted} />
              )}
              <Text
                style={[
                  styles.sourceText,
                  item.fuente === 'medido' && styles.sourceTextMeasured,
                ]}
              >
                {item.fuente === 'medido' ? 'Medido' : 'Estimado'} ·{' '}
                {item.intervaloReferenciaTexto}
              </Text>
            </View>
          </View>
        </View>

        {/* Píldora de Estado: Icono + Palabra clara */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: cfg.bgColor, borderColor: cfg.borderColor },
          ]}
        >
          <StatusIcon size={13} color={cfg.textColor} />
          <Text style={[styles.statusBadgeText, { color: cfg.textColor }]}>
            {cfg.label}
          </Text>
        </View>
      </View>

      {/* 2. Barra de vida útil consumida (o botón para abrir burbuja si está sin datos) */}
      {item.aplicaAlModelo && item.id !== 'luces_testigos' && (
        <View style={styles.progressContainer}>
          {item.vidaConsumidaPct !== null ? (
            <>
              <View style={styles.progressHeaderRow}>
                <Text style={styles.progressLabel}>Vida útil consumida</Text>
                <Text style={[styles.progressPctText, { color: cfg.textColor }]}>
                  {Math.min(100, item.vidaConsumidaPct)}%
                  {item.vidaConsumidaPct > 100 ? ' (Vencido)' : ''}
                </Text>
              </View>
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
            </>
          ) : (
            <View style={styles.missingDataPrompt}>
              <PlusCircle size={15} color={Colors.brandPrimary} />
              <Text style={styles.missingDataPromptText}>
                Sin datos todavía · Tocá para cargar cuándo se cambió
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 3. Frase en criollo: qué hace y por qué importa */}
      <Text style={styles.colloquialExplanation}>{item.fraseCriollo}</Text>

      {/* 4. Cuándo toca */}
      <View style={styles.whenDueBox}>
        <Text style={styles.whenDueLabel}>CUÁNDO TOCA:</Text>
        <Text
          style={[
            styles.whenDueValue,
            item.estado === 'revisar' && { color: Colors.dangerRedDark },
            item.estado === 'pronto' && { color: Colors.warnAmberDark },
          ]}
        >
          {item.cuandoToca}
        </Text>
      </View>

      {/* 5. Qué decirle al taller (Solo en estado Pronto o Revisar) */}
      {(item.estado === 'pronto' || item.estado === 'revisar') &&
        item.queDecirleAlTaller && (
          <View style={styles.mechanicArgumentBox}>
            <View style={styles.mechanicHeaderRow}>
              <MessageSquareQuote size={15} color={Colors.brandPrimaryDark} />
              <Text style={styles.mechanicHeaderTitle}>
                Qué decirle al taller (para que no te cobren de más):
              </Text>
            </View>
            <Text style={styles.mechanicQuoteText}>
              "{item.queDecirleAlTaller}"
            </Text>
          </View>
        )}

      {/* Pie táctil que abre la Burbuja Flotante sin deformar la tarjeta */}
      {canConfigure && (
        <View style={styles.footerRow}>
          <SlidersHorizontal size={12} color={Colors.brandPrimary} />
          <Text style={styles.footerActionText}>
            {item.estado === 'sin_datos'
              ? 'Cargar último cambio'
              : 'Actualizar fecha / km del último cambio'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E5E0FA',
    borderBottomWidth: 4,
    borderBottomColor: '#D0C9F0',
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  cardTimingBeltHighlight: {
    borderColor: Colors.warnAmber,
    borderBottomColor: '#D97706',
  },
  cardRevisarBorder: {
    borderColor: Colors.dangerRedBorder,
    borderBottomColor: '#EF4444',
  },
  criticalTopRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.warnAmberBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  criticalTopRibbonRed: {
    backgroundColor: Colors.dangerRedBg,
  },
  criticalTopRibbonText: {
    color: Colors.warnAmberDark,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  leftTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleTextCol: {
    flex: 1,
  },
  componentName: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  sourceText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  sourceTextMeasured: {
    color: Colors.brandPrimary,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  progressPctText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressTrack: {
    width: '100%',
    height: 9,
    backgroundColor: Colors.bgElevated,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  missingDataPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  missingDataPromptText: {
    flex: 1,
    color: Colors.brandPrimaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  colloquialExplanation: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  whenDueBox: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 8,
  },
  whenDueLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  whenDueValue: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  mechanicArgumentBox: {
    backgroundColor: '#F3F0FF',
    borderRadius: 14,
    padding: 13,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#D9D4FF',
  },
  mechanicHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  mechanicHeaderTitle: {
    color: Colors.brandPrimaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  mechanicQuoteText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  footerActionText: {
    color: Colors.brandPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
});
