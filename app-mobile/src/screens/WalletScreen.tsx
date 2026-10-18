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
  Info,
  Wrench,
} from 'lucide-react-native';
import { ResumenChequeoMedico } from '../modules/medical-checkup/checkupEngine';
import { Colors } from '../theme/colors';

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
        <View>
          <Text style={styles.supHeader}>ARGUMENTOS Y PREVISIÓN</Text>
          <Text style={styles.pageTitle}>Guía para el Taller</Text>
        </View>
        <View style={styles.statusPill}>
          <ShieldCheck size={14} color={Colors.brandPrimaryDark} />
          <Text style={styles.statusPillText}>Cero sorpresas</Text>
        </View>
      </View>

      {/* Hero Card: Cómo ir al taller con información clara */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTag}>TU RESUMEN PARA EL MECÁNICO</Text>
        <Text style={styles.heroTitle}>
          Sabé qué pedir y qué todavía no hace falta cambiar
        </Text>
        <Text style={styles.heroDesc}>
          Cada taller maneja su propia mano de obra, pero saber exactamente qué
          le toca a tu {chequeo.modelo.modelo} por kilometraje evita que te
          sumen repuestos que todavía están sanos.
        </Text>
      </View>

      {/* SECCIÓN 1: Qué pedir en tu próxima visita (Estado Pronto / Revisar) */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>
            1. LO QUE SÍ CONVIENE PROGRAMAR
          </Text>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>
              {paraHacerPronto.length}{' '}
              {paraHacerPronto.length === 1 ? 'ítem' : 'ítems'}
            </Text>
          </View>
        </View>

        {paraHacerPronto.length === 0 ? (
          <View style={styles.emptyBox}>
            <CheckCircle2 size={20} color={Colors.safeGreenDark} />
            <Text style={styles.emptyBoxText}>
              No tenés mantenimientos vencidos ni próximos a vencer en este
              momento.
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

                <View
                  style={[
                    styles.magnitudeBadge,
                    item.magnitudCosto === 'Importante'
                      ? styles.magHigh
                      : item.magnitudCosto === 'Moderado'
                      ? styles.magMed
                      : styles.magLow,
                  ]}
                >
                  <Text style={styles.magnitudeText}>
                     Magnitud: {item.magnitudCosto}
                  </Text>
                </View>
              </View>

              <Text style={styles.actionWhen}>{item.cuandoToca}</Text>

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

      {/* SECCIÓN 2: Lo que todavía tiene vida útil ("Que no te cambien de más") */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>
            2. LO QUE TODAVÍA TIENE VIDA ÚTIL
          </Text>
        </View>

        <View style={styles.shieldExplanationCard}>
          <Wrench size={18} color={Colors.safeGreenDark} />
          <Text style={styles.shieldExplanationText}>
            Si en el service te sugieren cambiar alguno de estos componentes,
            pedí que te muestren el desgaste físico porque según tu kilometraje
            todavía tienen margen:
          </Text>
        </View>

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
                {100 - (item.vidaConsumidaPct ?? 0)}% libre
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* SECCIÓN 3: Por qué conviene prevenir a tiempo (Magnitud relativa, sin precios frágiles) */}
      <View style={styles.magnitudeComparisonCard}>
        <Text style={styles.magTitle}>
          Por qué el mantenimiento a tiempo cuida tu bolsillo
        </Text>
        <Text style={styles.magSubtitle}>
          Sin importar el taller que elijas, la proporción en mecánica siempre
          se mantiene:
        </Text>

        <View style={styles.magGrid}>
          <View style={styles.magColGreen}>
            <Text style={styles.magColHeaderGreen}>HACERLO A TIEMPO</Text>
            <Text style={styles.magColBigGreen}>1x</Text>
            <Text style={styles.magColDescGreen}>
              Cambiar aceite, líquido refrigerante o el kit de correa cuando
              corresponde es un gasto programado y acotado.
            </Text>
          </View>

          <View style={styles.magColRed}>
            <Text style={styles.magColHeaderRed}>SI SE CORTA O RECALIENTA</Text>
            <Text style={styles.magColBigRed}>8x a 12x</Text>
            <Text style={styles.magColDescRed}>
              Una correa cortada o una recalentada sin agua obliga a desarmar la
              tapa de cilindros y multiplica el gasto por diez.
            </Text>
          </View>
        </View>

        <View style={styles.infoNoteRow}>
          <Info size={15} color={Colors.textSecondary} />
          <Text style={styles.infoNoteText}>
            Consejo práctico: pedí siempre que te separen el precio del repuesto
            por un lado y la mano de obra por otro.
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 110,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  supHeader: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillText: {
    color: Colors.brandPrimaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  heroCard: {
    backgroundColor: Colors.heroIndigoMid,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  heroTag: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 8,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 13,
    lineHeight: 19,
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  badgeCount: {
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeCountText: {
    color: Colors.brandPrimaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  emptyBoxText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  actionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  actionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  actionName: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  magnitudeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  magLow: {
    backgroundColor: Colors.safeGreenBg,
  },
  magMed: {
    backgroundColor: Colors.warnAmberBg,
  },
  magHigh: {
    backgroundColor: Colors.dangerRedBg,
  },
  magnitudeText: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '800',
  },
  actionWhen: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  quoteBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F3F0FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D9D4FF',
  },
  quoteText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 18,
  },
  shieldExplanationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.safeGreenBg,
    borderRadius: 14,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.safeGreenBorder,
  },
  shieldExplanationText: {
    flex: 1,
    color: Colors.safeGreenDark,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  stillGoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 14,
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
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  stillGoodSub: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  stillGoodPctPill: {
    backgroundColor: Colors.safeGreenBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  stillGoodPctText: {
    color: Colors.safeGreenDark,
    fontSize: 11,
    fontWeight: '800',
  },
  magnitudeComparisonCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  magTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  magSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 14,
  },
  magGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  magColGreen: {
    flex: 1,
    backgroundColor: Colors.safeGreenBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.safeGreenBorder,
  },
  magColHeaderGreen: {
    color: Colors.safeGreenDark,
    fontSize: 10,
    fontWeight: '800',
  },
  magColBigGreen: {
    color: '#065F46',
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 4,
  },
  magColDescGreen: {
    color: Colors.safeGreenDark,
    fontSize: 11,
    lineHeight: 16,
  },
  magColRed: {
    flex: 1,
    backgroundColor: Colors.dangerRedBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.dangerRedBorder,
  },
  magColHeaderRed: {
    color: Colors.dangerRedDark,
    fontSize: 10,
    fontWeight: '800',
  },
  magColBigRed: {
    color: '#991B1B',
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 4,
  },
  magColDescRed: {
    color: Colors.dangerRedDark,
    fontSize: 11,
    lineHeight: 16,
  },
  infoNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  infoNoteText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
});
