import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Car,
  Gauge,
  Wrench,
  CheckCircle2,
  X,
  Bluetooth,
  Smartphone,
  AlertTriangle,
} from 'lucide-react-native';
import {
  CATALOGO_MODELOS_ARG,
  PerfilVehiculoUsuario,
} from '../modules/medical-checkup/checkupEngine';
import { Colors } from '../theme/colors';

interface Props {
  visible: boolean;
  perfilActual: PerfilVehiculoUsuario;
  onSavePerfil: (nuevoPerfil: PerfilVehiculoUsuario) => void;
  onClose: () => void;
}

const KM_PRESETS = [25000, 42500, 56000, 68000, 95000];

export const OnboardingModal: React.FC<Props> = ({
  visible,
  perfilActual,
  onSavePerfil,
  onClose,
}) => {
  const [modeloId, setModeloId] = useState(perfilActual.modeloId);
  const [kmActuales, setKmActuales] = useState(perfilActual.kmActuales);
  const [dongleConectado, setDongleConectado] = useState(
    perfilActual.dongleConectado
  );
  const [aceitePreset, setAceitePreset] = useState<
    'RECIEN' | 'OCHO_MESES' | 'MAS_DE_ANIO' | 'USADO_SIN_DATO'
  >('OCHO_MESES');
  const [correaPreset, setCorreaPreset] = useState<
    'DE_FABRICA' | 'CAMBIADA_HACE_POCO' | 'NO_TENGO_IDEA'
  >('DE_FABRICA');

  if (!visible) return null;

  const modeloSeleccionado =
    CATALOGO_MODELOS_ARG.find((m) => m.id === modeloId) ??
    CATALOGO_MODELOS_ARG[0];

  const handleConfirm = () => {
    // Construir historial inicial a partir de las 3 preguntas simples
    const historial: PerfilVehiculoUsuario['historial'] = {
      ...perfilActual.historial,
    };

    if (aceitePreset === 'RECIEN') {
      historial.aceite_filtro = {
        ultimoCambioKm: Math.max(0, kmActuales - 2500),
        mesesDesdeUltimoCambio: 3,
      };
    } else if (aceitePreset === 'OCHO_MESES') {
      historial.aceite_filtro = {
        ultimoCambioKm: Math.max(0, kmActuales - 8200),
        mesesDesdeUltimoCambio: 9,
      };
    } else if (aceitePreset === 'MAS_DE_ANIO') {
      historial.aceite_filtro = {
        ultimoCambioKm: Math.max(0, kmActuales - 11500),
        mesesDesdeUltimoCambio: 14,
      };
    } else {
      historial.aceite_filtro = {
        desconocidoPorCompraUsado: true,
      };
    }

    if (!modeloSeleccionado.usaCadenaDistribucion) {
      if (correaPreset === 'DE_FABRICA') {
        historial.correa_distribucion = {
          ultimoCambioKm: 0,
          mesesDesdeUltimoCambio: Math.min(48, Math.round(kmActuales / 1200)),
        };
      } else if (correaPreset === 'CAMBIADA_HACE_POCO') {
        historial.correa_distribucion = {
          ultimoCambioKm: Math.max(0, kmActuales - 10000),
          mesesDesdeUltimoCambio: 10,
        };
      } else {
        historial.correa_distribucion = {
          desconocidoPorCompraUsado: true,
        };
      }
    }

    onSavePerfil({
      ...perfilActual,
      modeloId,
      kmActuales,
      dongleConectado,
      historial,
    });
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.supTitle}>CONFIGURACIÓN EN 3 PASOS</Text>
            <Text style={styles.title}>Cargá tu auto sin complicarte</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollBody}
        >
          {/* PASO 1: Elegir Modelo */}
          <View style={styles.stepBox}>
            <View style={styles.stepHeader}>
              <Car size={16} color={Colors.brandPrimary} />
              <Text style={styles.stepTitle}>
                1. ¿Qué auto manejás? (Ajusta el manual oficial)
              </Text>
            </View>
            <View style={styles.modelsGrid}>
              {CATALOGO_MODELOS_ARG.map((m) => {
                const active = m.id === modeloId;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.modelChip, active && styles.modelChipActive]}
                    onPress={() => setModeloId(m.id)}
                  >
                    <Text
                      style={[
                        styles.modelChipBrand,
                        active && { color: 'rgba(255,255,255,0.8)' },
                      ]}
                    >
                      {m.marca}
                    </Text>
                    <Text
                      style={[
                        styles.modelChipName,
                        active && { color: '#FFFFFF' },
                      ]}
                    >
                      {m.modelo}
                    </Text>
                    <Text
                      style={[
                        styles.modelChipEngine,
                        active && { color: '#E0E0FF' },
                      ]}
                    >
                      {m.usaCadenaDistribucion ? 'Motor a Cadena' : 'Usa Correa'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* PASO 2: Kilómetros Actuales */}
          <View style={styles.stepBox}>
            <View style={styles.stepHeader}>
              <Gauge size={16} color={Colors.brandPrimary} />
              <Text style={styles.stepTitle}>
                2. ¿Cuántos kilómetros marca hoy el tablero?
              </Text>
            </View>
            <View style={styles.kmRow}>
              {KM_PRESETS.map((val) => {
                const active = kmActuales === val;
                return (
                  <TouchableOpacity
                    key={val}
                    style={[styles.kmChip, active && styles.kmChipActive]}
                    onPress={() => setKmActuales(val)}
                  >
                    <Text
                      style={[
                        styles.kmChipText,
                        active && styles.kmChipTextActive,
                      ]}
                    >
                      {(val / 1000).toFixed(val === 42500 ? 1 : 0)}k km
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* PASO 3: Último Service de Aceite */}
          <View style={styles.stepBox}>
            <View style={styles.stepHeader}>
              <Wrench size={16} color={Colors.brandPrimary} />
              <Text style={styles.stepTitle}>
                3. ¿Cuándo le hiciste el último cambio de aceite?
              </Text>
            </View>
            <View style={styles.optionsList}>
              {[
                { id: 'RECIEN', label: 'Hace poco (menos de 4 meses)' },
                { id: 'OCHO_MESES', label: 'Hace unos 8 o 9 meses (~8.200 km)' },
                { id: 'MAS_DE_ANIO', label: 'Hace más de 1 año (ya me pasé)' },
                {
                  id: 'USADO_SIN_DATO',
                  label: 'No me acuerdo / Lo compré usado hace poco',
                },
              ].map((opt) => {
                const active = aceitePreset === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.optionRowBtn,
                      active && styles.optionRowBtnActive,
                    ]}
                    onPress={() => setAceitePreset(opt.id as any)}
                  >
                    <CheckCircle2
                      size={16}
                      color={active ? Colors.brandPrimary : Colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.optionRowText,
                        active && styles.optionRowTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pregunta especial de Correa si el modelo NO lleva cadena */}
          {!modeloSeleccionado.usaCadenaDistribucion && (
            <View style={styles.timingBeltQuestionBox}>
              <View style={styles.stepHeader}>
                <AlertTriangle size={16} color={Colors.warnAmberDark} />
                <Text style={styles.timingBeltQuestionTitle}>
                  Tu {modeloSeleccionado.modelo} usa correa de distribución: ¿se
                  cambió alguna vez?
                </Text>
              </View>
              <View style={styles.kmRow}>
                {[
                  { id: 'DE_FABRICA', label: 'Nunca (original)' },
                  { id: 'CAMBIADA_HACE_POCO', label: 'Sí, se cambió' },
                  { id: 'NO_TENGO_IDEA', label: 'No tengo idea' },
                ].map((opt) => {
                  const active = correaPreset === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.kmChip, active && styles.kmChipActive]}
                      onPress={() => setCorreaPreset(opt.id as any)}
                    >
                      <Text
                        style={[
                          styles.kmChipText,
                          active && styles.kmChipTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Selector de Modo: Sin Dongle vs Con Dongle OBD2 */}
          <View style={styles.stepBox}>
            <Text style={styles.stepTitle}>
              ¿Cómo querés usar la app ahora?
            </Text>
            <View style={styles.modeSelectorRow}>
              <TouchableOpacity
                style={[
                  styles.modeCard,
                  !dongleConectado && styles.modeCardActive,
                ]}
                onPress={() => setDongleConectado(false)}
              >
                <Smartphone
                  size={18}
                  color={
                    !dongleConectado ? Colors.brandPrimary : Colors.textSecondary
                  }
                />
                <Text style={styles.modeCardTitle}>Sin Dongle (Solo App)</Text>
                <Text style={styles.modeCardSub}>
                  Calcula todo por km, fecha y manual de tu auto
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeCard,
                  dongleConectado && styles.modeCardActive,
                ]}
                onPress={() => setDongleConectado(true)}
              >
                <Bluetooth
                  size={18}
                  color={
                    dongleConectado ? Colors.brandPrimary : Colors.textSecondary
                  }
                />
                <Text style={styles.modeCardTitle}>Con Dongle OBD2</Text>
                <Text style={styles.modeCardSub}>
                  Suma temperatura de agua, batería y luces en vivo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.savePrimaryBtn}
          onPress={handleConfirm}
          activeOpacity={0.88}
        >
          <Text style={styles.savePrimaryBtnText}>
            Ver el chequeo médico de mi auto
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(24, 20, 69, 0.55)',
    justifyContent: 'flex-end',
    zIndex: 50,
  },
  sheet: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '92%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  supTitle: {
    color: Colors.brandPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingBottom: 14,
  },
  stepBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelChip: {
    width: '48%',
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  modelChipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  modelChipBrand: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  modelChipName: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 1,
  },
  modelChipEngine: {
    color: Colors.brandPrimary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  kmRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  kmChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  kmChipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  kmChipText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  kmChipTextActive: {
    color: '#FFFFFF',
  },
  optionsList: {
    gap: 7,
  },
  optionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 11,
    borderRadius: 12,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  optionRowBtnActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.brandPrimary,
  },
  optionRowText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  optionRowTextActive: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  timingBeltQuestionBox: {
    backgroundColor: Colors.warnAmberBg,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.warnAmberBorder,
  },
  timingBeltQuestionTitle: {
    color: Colors.warnAmberText,
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  modeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modeCard: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
  },
  modeCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.brandPrimary,
  },
  modeCardTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },
  modeCardSub: {
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  savePrimaryBtn: {
    backgroundColor: Colors.brandPrimary,
    paddingVertical: 15,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  savePrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
