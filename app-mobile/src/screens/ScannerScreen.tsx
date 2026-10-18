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
import { Colors, FontFamily } from '../theme/colors';

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
        <Text style={styles.pageTitle}>Chequeo</Text>

        <TouchableOpacity
          style={styles.vehiclePill}
          onPress={onOpenGarageSheet}
          activeOpacity={0.8}
        >
          <SlidersHorizontal size={13} color={Colors.brandPrimaryDark} />
          <Text style={styles.vehiclePillText}>
            {chequeo.modelo.modelo} · {(chequeo.kmActuales / 1000).toFixed(0)}k km
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros Rápidos */}
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
            Atención ({chequeo.conteo.pronto + chequeo.conteo.revisar})
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
            Cargar ({chequeo.conteo.sinDatos})
          </Text>
        </TouchableOpacity>
      </View>

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
              ? 'Luz encendida en el tablero (Tocar para quitar)'
              : '¿Se prendió una luz en el tablero? Tocá acá'}
          </Text>
        </TouchableOpacity>
      )}

      {componentesFiltrados.map((item) => (
        <CheckupComponentCard
          key={item.id}
          item={item}
          kmActuales={chequeo.kmActuales}
          onOpenComponentSheet={onOpenComponentSheet}
        />
      ))}

      {chequeo.modelo.usaCadenaDistribucion && (
        <View style={styles.chainNoteBox}>
          <Info size={15} color={Colors.brandPrimary} />
          <Text style={styles.chainNoteText}>
            Tu {chequeo.modelo.modelo} usa cadena metálica de distribución (no requiere cambio periódico).
          </Text>
        </View>
      )}
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
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  vehiclePillText: {
    fontFamily: FontFamily,
    color: Colors.brandPrimaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  filterChipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  filterChipText: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  declareLightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  declareLightRowActive: {
    backgroundColor: Colors.dangerRedBg,
    borderColor: Colors.dangerRedBorder,
  },
  declareLightText: {
    fontFamily: FontFamily,
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12.5,
    fontWeight: '500',
  },
  chainNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.brandLight,
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  chainNoteText: {
    fontFamily: FontFamily,
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 12,
    lineHeight: 17,
  },
});
