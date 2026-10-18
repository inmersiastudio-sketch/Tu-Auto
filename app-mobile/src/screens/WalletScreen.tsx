import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  ShieldCheck,
  MessageSquareQuote,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react-native';
import { ResumenChequeoMedico } from '../modules/medical-checkup/checkupEngine';
import { Colors, FontFamily } from '../theme/colors';

interface Props {
  chequeo: ResumenChequeoMedico;
}

export const WalletScreen: React.FC<Props> = ({ chequeo }) => {
  const componentesVisibles = chequeo.componentes.filter(
    (c) => c.aplicaAlModelo
  );

  const paraHacerPronto = componentesVisibles.filter(
    (c) => c.estado === 'revisar' || c.estado === 'pronto'
  );

  const todaviaTienenVida = componentesVisibles.filter(
    (c) =>
      c.estado === 'bien' &&
      c.id !== 'luces_testigos' &&
      c.vidaConsumidaPct !== null
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top App Bar */}
      <View style={styles.topHeader}>
        <Text style={styles.pageTitle}>Guía Taller</Text>
        <View style={styles.statusPill}>
          <ShieldCheck size={14} color={Colors.brandPrimaryDark} />
          <Text style={styles.statusPillText}>Cero sorpresas</Text>
        </View>
      </View>

      {/* Hero Compacto */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>
          Qué pedir y qué no hace falta cambiar hoy
        </Text>
        <Text style={styles.heroDesc}>
          Argumentos simples para hablar con el mecánico según los kilómetros de tu {chequeo.modelo.modelo}.
        </Text>
      </View>

      {/* 1. Qué pedir cotizar */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>
          Pedí cotizar ({paraHacerPronto.length})
        </Text>

        {paraHacerPronto.length === 0 ? (
          <View style={styles.emptyBox}>
            <CheckCircle2 size={18} color={Colors.safeGreenDark} />
            <Text style={styles.emptyBoxText}>
              No tenés arreglos pendientes hoy.
            </Text>
          </View>
        ) : (
          paraHacerPronto.map((item) => (
            <View key={item.id} style={styles.actionCard}>
              <View style={styles.actionTopRow}>
                <View style={styles.actionTitleRow}>
                  {item.estado === 'revisar' ? (
                    <AlertTriangle size={16} color={Colors.dangerRedDark} />
                  ) : (
                    <Clock size={16} color={Colors.warnAmberDark} />
                  )}
                  <Text style={styles.actionName}>{item.nombre}</Text>
                </View>
                <Text style={styles.actionWhen}>{item.cuandoToca}</Text>
              </View>

              {item.queDecirleAlTaller && (
                <View style={styles.quoteBlock}>
                  <MessageSquareQuote
                    size={14}
                    color={Colors.brandPrimaryDark}
                  />
                  <Text style={styles.quoteText}>
                    "{item.queDecirleAlTaller}"
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* 2. Lo que todavía tiene vida útil */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>
          No hace falta cambiar hoy ({todaviaTienenVida.length})
        </Text>

        {todaviaTienenVida.map((item) => (
          <View key={item.id} style={styles.stillGoodRow}>
            <View style={styles.stillGoodLeft}>
              <CheckCircle2 size={16} color={Colors.safeGreenDark} />
              <View style={styles.stillGoodTextCol}>
                <Text style={styles.stillGoodName}>{item.nombre}</Text>
                <Text style={styles.stillGoodSub}>{item.cuandoToca}</Text>
              </View>
            </View>
            <View style={styles.stillGoodPctPill}>
              <Text style={styles.stillGoodPctText}>
                {100 - (item.vidaConsumidaPct ?? 0)}% sano
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 105,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pageTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillText: {
    fontFamily: FontFamily,
    color: Colors.brandPrimaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: Colors.heroIndigoMid,
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  heroTitle: {
    fontFamily: FontFamily,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroDesc: {
    fontFamily: FontFamily,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 15.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  emptyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  emptyBoxText: {
    fontFamily: FontFamily,
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '500',
  },
  actionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  actionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionName: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  actionWhen: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  quoteBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 11,
  },
  quoteText: {
    fontFamily: FontFamily,
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 17,
  },
  stillGoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  stillGoodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  stillGoodTextCol: {
    flex: 1,
  },
  stillGoodName: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  stillGoodSub: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  stillGoodPctPill: {
    backgroundColor: Colors.safeGreenBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  stillGoodPctText: {
    fontFamily: FontFamily,
    color: Colors.safeGreenDark,
    fontSize: 11.5,
    fontWeight: '600',
  },
});
