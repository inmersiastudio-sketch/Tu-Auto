import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  SlidersHorizontal,
  Info,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react-native';
import {
  ComponenteEvaluado,
  ResumenChequeoMedico,
} from '../modules/medical-checkup/checkupEngine';
import { CheckupComponentCard } from '../components/CheckupComponentCard';
import { Colors } from '../theme/colors';

interface Props {
  chequeo: ResumenChequeoMedico;
  luzTestigoDeclarada: boolean;
  onToggleLuzTestigo: () => void;
  onOpenGarageSheet: () => void;
  onOpenComponentSheet: (item: ComponenteEvaluado) => void;
}

type FiltroKey = 'TODOS' | 'ATENCION' | 'SIN_DATOS';

export const ScannerScreen: React.FC<Props> = ({
  chequeo,
  luzTestigoDeclarada,
  onToggleLuzTestigo,
  onOpenGarageSheet,
  onOpenComponentSheet,
}) => {
  const [filtro, setFiltro] = useState<FiltroKey>('TODOS');

  // Si el modelo usa cadena en lugar de correa, ese ítem se oculta (aplicaAlModelo === false)
  const componentesAplicables = chequeo.componentes.filter(
    (c) => c.aplicaAlModelo
  );

  const componentesFiltrados = componentesAplicables.filter((c) => {
    if (filtro === 'ATENCION') {
      return c.estado === 'pronto' || c.estado === 'revisar';
    }
    if (filtro === 'SIN_DATOS') {
      return c.estado === 'sin_datos';
    }
    return true;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top App Bar */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.supHeader}>FICHA MÉDICA DEL VEHÍCULO</Text>
          <Text style={styles.pageTitle}>Chequeo</Text>
        </View>

        <TouchableOpacity
          style={styles.vehiclePill}
          onPress={onOpenGarageSheet}
          activeOpacity={0.8}
        >
          <SlidersHorizontal size={13} color={Colors.brandPrimaryDark} />
          <Text style={styles.vehiclePillText}>
            {chequeo.modelo.modelo} · {(chequeo.kmActuales / 1000).toFixed(1)}k km
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resumen Único Superior: "¿Cómo está mi auto?" */}
      <View style={styles.summaryBanner}>
        <Text style={styles.summaryTitle}>{chequeo.tituloResumen}</Text>
        <Text style={styles.summarySub}>{chequeo.subtituloResumen}</Text>
        {chequeo.modelo.esGenerico && (
          <View style={styles.genericWarningRow}>
            <Info size={14} color={Colors.warnAmberDark} />
            <Text style={styles.genericWarningText}>
              Intervalos de referencia general · Consultá el manual de tu auto.
            </Text>
          </View>
        )}
      </View>

      {/* Filtros Rápidos con Relieve Táctil */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filtro === 'TODOS' && styles.filterChipActive,
          ]}
          onPress={() => setFiltro('TODOS')}
        >
          <Text
            style={[
              styles.filterChipText,
              filtro === 'TODOS' && styles.filterChipTextActive,
            ]}
          >
            Todos ({componentesAplicables.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filtro === 'ATENCION' && styles.filterChipActive,
          ]}
          onPress={() => setFiltro('ATENCION')}
        >
          <Text
            style={[
              styles.filterChipText,
              filtro === 'ATENCION' && styles.filterChipTextActive,
            ]}
          >
            Pronto / Revisar ({chequeo.conteo.pronto + chequeo.conteo.revisar})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filtro === 'SIN_DATOS' && styles.filterChipActive,
          ]}
          onPress={() => setFiltro('SIN_DATOS')}
        >
          <Text
            style={[
              styles.filterChipText,
              filtro === 'SIN_DATOS' && styles.filterChipTextActive,
            ]}
          >
            Sin datos ({chequeo.conteo.sinDatos})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Si no tiene dongle conectado, botón simple para declarar si se prendió una luz en el tablero */}
      {!chequeo.dongleConectado && (
        <TouchableOpacity
          style={[
            styles.declareLightRow,
            luzTestigoDeclarada && styles.declareLightRowActive,
          ]}
          onPress={onToggleLuzTestigo}
          activeOpacity={0.85}
        >
          {luzTestigoDeclarada ? (
            <AlertTriangle size={16} color={Colors.dangerRedDark} />
          ) : (
            <CheckCircle2 size={16} color={Colors.safeGreenDark} />
          )}
          <Text style={styles.declareLightText}>
            {luzTestigoDeclarada
              ? 'Declaraste una luz encendida en el tablero (Tocar para quitar)'
              : '¿Tenés alguna luz amarilla o roja prendida en el tablero? Tocá acá'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Listado de Tarjetas de los Componentes */}
      {componentesFiltrados.map((item) => (
        <CheckupComponentCard
          key={item.id}
          item={item}
          kmActuales={chequeo.kmActuales}
          onOpenComponentSheet={onOpenComponentSheet}
        />
      ))}

      {/* Aclaración cuando el auto usa cadena de distribución y se ocultó la correa */}
      {chequeo.modelo.usaCadenaDistribucion && (
        <View style={styles.chainNoteBox}>
          <Info size={16} color={Colors.brandPrimary} />
          <Text style={styles.chainNoteText}>
            Nota sobre tu {chequeo.modelo.marca} {chequeo.modelo.modelo}: este
            motor utiliza cadena de distribución metálica en lugar de correa de
            goma, por eso ocultamos ese ítem de tus vencimientos periódicos.
          </Text>
        </View>
      )}

      {/* Nota honesta sobre el alcance del chequeo */}
      <View style={styles.honestyFooter}>
        <Text style={styles.honestyTitle}>Sobre este chequeo preventivo</Text>
        <Text style={styles.honestyDesc}>
          Los estados etiquetados como "Estimado" se calculan según los
          kilómetros, fechas cargadas y el plan de mantenimiento orientativo de
          cada modelo. No reemplazan la revisión visual de un mecánico ante
          ruidos o pérdidas de fluidos.
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
    marginBottom: 12,
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
    letterSpacing: -0.5,
  },
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgHigh,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6D0F5',
    borderBottomWidth: 3,
    borderBottomColor: '#C2B9EC',
  },
  vehiclePillText: {
    color: Colors.brandPrimaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  summaryBanner: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5E0FA',
    borderBottomWidth: 4,
    borderBottomColor: '#D0C9F0',
  },
  summaryTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  summarySub: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  genericWarningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: Colors.warnAmberBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  genericWarningText: {
    color: Colors.warnAmberDark,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: '#E2DDF8',
    borderBottomWidth: 3,
    borderBottomColor: '#D0C9F0',
  },
  filterChipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
    borderBottomColor: Colors.brandPrimaryDark,
  },
  filterChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  declareLightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  declareLightRowActive: {
    backgroundColor: Colors.dangerRedBg,
    borderColor: Colors.dangerRedBorder,
  },
  declareLightText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  chainNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  chainNoteText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12,
    lineHeight: 18,
  },
  honestyFooter: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  honestyTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  honestyDesc: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
});
