import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  MapPin,
  Store,
  Sparkles,
} from 'lucide-react-native';
import { TranslatedFaultCard } from '../modules/fault-translator/faultCatalog';
import { ScenarioId } from '../modules/obd2-engine/types';
import { AntiScamFaultCard } from '../components/AntiScamFaultCard';
import { DemoControlBar } from '../components/DemoControlBar';
import { Colors } from '../theme/colors';

interface Props {
  activeFaults: TranslatedFaultCard[];
  activeScenario: ScenarioId;
  onSelectScenario: (scenario: ScenarioId) => void;
}

export const ScannerScreen: React.FC<Props> = ({
  activeFaults,
  activeScenario,
  onSelectScenario,
}) => {
  const [quoteRequestedFor, setQuoteRequestedFor] = useState<string | null>(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top App Bar (Stitch Exact: DIAGNÓSTICO EN TIEMPO REAL / Salud del Auto + VW Gol 2021 pill) */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.supHeader}>DIAGNÓSTICO EN TIEMPO REAL</Text>
          <Text style={styles.pageTitle}>Salud del Auto</Text>
        </View>

        <View style={styles.connectedPill}>
          <View style={styles.liveGreenDot} />
          <Text style={styles.connectedPillText}>VW Gol 2021 • Conectado</Text>
        </View>
      </View>

      {/* Simulador OBD2 colapsable */}
      <DemoControlBar
        activeScenario={activeScenario}
        onSelectScenario={onSelectScenario}
      />

      {/* Confirmación de turno/presupuesto solicitado */}
      {quoteRequestedFor && (
        <View style={styles.quoteModalBanner}>
          <View style={styles.quoteModalHeader}>
            <Store size={18} color={Colors.safeGreenDark} />
            <Text style={styles.quoteModalTitle}>
              Talleres verificados cerca de Palermo ({quoteRequestedFor})
            </Text>
          </View>
          <Text style={styles.quoteModalDesc}>
            Enviamos el diagnóstico pre-aprobado a 3 talleres certificados. No
            necesitás explicar nada técnico al llegar: el precio de referencia ya
            está fijado.
          </Text>
          <View style={styles.workshopMiniRow}>
            <MapPin size={14} color={Colors.safeGreenDark} />
            <Text style={styles.workshopMiniText}>
              Taller Bosch Car Service Palermo (a 1.2 km) • Turno disponible hoy
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeQuoteBtn}
            onPress={() => setQuoteRequestedFor(null)}
          >
            <Text style={styles.closeQuoteText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Estado Impecable vs Diagnóstico Preventivo */}
      {activeFaults.length === 0 ? (
        <View style={styles.healthyCard}>
          <View style={styles.healthyIconCircle}>
            <ShieldCheck size={34} color={Colors.safeGreenDark} />
          </View>
          <Text style={styles.healthyTitle}>
            Tu motor está sano y sin alertas pendientes
          </Text>
          <Text style={styles.healthyDesc}>
            Escaneamos la computadora de tu auto en tiempo real. Todos los
            cilindros, sensores de inyección y emisiones funcionan dentro de los
            parámetros originales de fábrica.
          </Text>

          <View style={styles.reassuranceStrip}>
            <CheckCircle2 size={18} color={Colors.safeGreenDark} />
            <Text style={styles.reassuranceStripText}>
              Escudo Anti-Estafas activo: 0 repuestos por cambiar hoy
            </Text>
          </View>

          <TouchableOpacity
            style={styles.tryFaultBtn}
            onPress={() => onSelectScenario('CYLINDER_MISFIRE_P0302')}
            activeOpacity={0.85}
          >
            <Zap size={16} color={Colors.brandPrimary} />
            <Text style={styles.tryFaultText}>
              Simular desgaste de bujía ($75.000 vs $650.000)
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {activeFaults.map((fault) => (
            <AntiScamFaultCard
              key={fault.code}
              fault={fault}
              onRequestQuote={(f) => setQuoteRequestedFor(f.humanTitle)}
            />
          ))}
        </View>
      )}

      {/* Sello de Transparencia Mecánica */}
      <View style={styles.transparencyCard}>
        <Sparkles size={18} color={Colors.brandPrimary} />
        <Text style={styles.transparencyText}>
          Tu-Auto traduce las señales internas de la computadora del vehículo a
          precios reales del mercado argentino para que nunca pagues de más en el
          taller.
        </Text>
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
    flexWrap: 'wrap',
    gap: 8,
  },
  supHeader: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  connectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.bgHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.safeGreen,
  },
  connectedPillText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  quoteModalBanner: {
    backgroundColor: Colors.safeGreenBg,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.safeGreenBorder,
  },
  quoteModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  quoteModalTitle: {
    color: Colors.safeGreenDark,
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  quoteModalDesc: {
    color: Colors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
  workshopMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
  },
  workshopMiniText: {
    color: Colors.safeGreenDark,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  closeQuoteBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: Colors.safeGreen,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  closeQuoteText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  healthyCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 16,
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  healthyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.safeGreenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  healthyTitle: {
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  healthyDesc: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  reassuranceStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.safeGreenBg,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    marginBottom: 18,
  },
  reassuranceStripText: {
    color: Colors.safeGreenDark,
    fontSize: 12,
    fontWeight: '700',
  },
  tryFaultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  tryFaultText: {
    color: Colors.brandPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  transparencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  transparencyText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
});
