import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import {
  Car,
  Gauge,
  Check,
  CheckCircle2,
  X,
} from 'lucide-react-native';
import {
  CATALOGO_MODELOS_ARG,
  PerfilVehiculoUsuario,
} from '../modules/medical-checkup/checkupEngine';
import {
  CAR_PAINTS,
  CarPaintOption,
  CarVectorIllustration,
} from './Car3DShowcase';
import { Colors, FontFamily } from '../theme/colors';

interface Props {
  visible: boolean;
  perfilActual: PerfilVehiculoUsuario;
  selectedPaint: CarPaintOption;
  onSelectPaint: (paint: CarPaintOption) => void;
  onSavePerfil: (nuevoPerfil: PerfilVehiculoUsuario) => void;
  onClose: () => void;
}

const KM_PRESETS = [25000, 42500, 56000, 68000, 95000];

export const OnboardingModal: React.FC<Props> = ({
  visible,
  perfilActual,
  selectedPaint,
  onSelectPaint,
  onSavePerfil,
  onClose,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ESTILO_MODELO' | 'KM_SERVICE'>(
    'ESTILO_MODELO'
  );
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

  const slideAnim = useRef(new Animated.Value(420)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setModeloId(perfilActual.modeloId);
      setKmActuales(perfilActual.kmActuales);
      setDongleConectado(perfilActual.dongleConectado);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(420);
      fadeAnim.setValue(0);
    }
  }, [visible, perfilActual, fadeAnim, slideAnim]);

  if (!visible) return null;

  const modeloSeleccionado =
    CATALOGO_MODELOS_ARG.find((m) => m.id === modeloId) ??
    CATALOGO_MODELOS_ARG[0];

  const handleConfirm = () => {
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
    <View style={styles.rootPortal}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingBubble,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.dragHandleWrap}>
          <View style={styles.dragHandlePill} />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.title}>Mi Auto</Text>
          <TouchableOpacity
            style={styles.closeCircleBtn}
            onPress={onClose}
            activeOpacity={0.75}
          >
            <X size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Auto 3D en vivo sobre fondo blanco + Colores */}
        <View style={styles.livePreviewStage}>
          <Text style={styles.stageModelText}>
            {modeloSeleccionado.marca} {modeloSeleccionado.modelo} ·{' '}
            {modeloSeleccionado.motor}
          </Text>

          <View style={styles.carSvgWrap}>
            <CarVectorIllustration
              paint={selectedPaint}
              bodyType={modeloSeleccionado.tipoCarroceria}
              height={135}
            />
          </View>

          <View style={styles.swatchesRow}>
            {CAR_PAINTS.map((p) => {
              const active = p.id === selectedPaint.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.colorCircleBtn,
                    { backgroundColor: p.swatch },
                    active && styles.colorCircleBtnActive,
                  ]}
                  onPress={() => onSelectPaint(p)}
                  activeOpacity={0.8}
                >
                  {active && (
                    <Check
                      size={13}
                      color={p.id === 'crystal-white' ? '#1E1B4B' : '#FFFFFF'}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentedTrack}>
          <TouchableOpacity
            style={[
              styles.segmentedTab,
              activeSubTab === 'ESTILO_MODELO' && styles.segmentedTabActive,
            ]}
            onPress={() => setActiveSubTab('ESTILO_MODELO')}
            activeOpacity={0.85}
          >
            <Car
              size={14}
              color={
                activeSubTab === 'ESTILO_MODELO'
                  ? Colors.brandPrimaryDark
                  : Colors.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentedText,
                activeSubTab === 'ESTILO_MODELO' && styles.segmentedTextActive,
              ]}
            >
              Modelo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentedTab,
              activeSubTab === 'KM_SERVICE' && styles.segmentedTabActive,
            ]}
            onPress={() => setActiveSubTab('KM_SERVICE')}
            activeOpacity={0.85}
          >
            <Gauge
              size={14}
              color={
                activeSubTab === 'KM_SERVICE'
                  ? Colors.brandPrimaryDark
                  : Colors.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentedText,
                activeSubTab === 'KM_SERVICE' && styles.segmentedTextActive,
              ]}
            >
              Kilómetros ({(kmActuales / 1000).toFixed(0)}k)
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeSubTab === 'ESTILO_MODELO' ? (
            <View style={styles.modelsGrid}>
              {CATALOGO_MODELOS_ARG.map((m) => {
                const active = m.id === modeloId;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.tactileModelCard,
                      active && styles.tactileModelCardActive,
                    ]}
                    onPress={() => setModeloId(m.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.modelCardTop}>
                      <Text
                        style={[
                          styles.modelBrandText,
                          active && { color: Colors.brandPrimary },
                        ]}
                      >
                        {m.marca}
                      </Text>
                      {active && (
                        <CheckCircle2 size={14} color={Colors.brandPrimary} />
                      )}
                    </View>
                    <Text style={styles.modelNameText}>{m.modelo}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.kmServiceContainer}>
              <View style={styles.blockCard}>
                <Text style={styles.blockTitle}>Kilómetros actuales</Text>
                <View style={styles.chipsWrap}>
                  {KM_PRESETS.map((val) => {
                    const active = kmActuales === val;
                    return (
                      <TouchableOpacity
                        key={val}
                        style={[
                          styles.tactileChip,
                          active && styles.tactileChipActive,
                        ]}
                        onPress={() => setKmActuales(val)}
                      >
                        <Text
                          style={[
                            styles.tactileChipText,
                            active && styles.tactileChipTextActive,
                          ]}
                        >
                          {(val / 1000).toFixed(val === 42500 ? 1 : 0)}k km
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.blockCard}>
                <Text style={styles.blockTitle}>Último cambio de aceite</Text>
                <View style={styles.chipsWrap}>
                  {[
                    { id: 'RECIEN', label: 'Hace poco' },
                    { id: 'OCHO_MESES', label: 'Hace ~8 meses' },
                    { id: 'MAS_DE_ANIO', label: 'Más de 1 año' },
                    { id: 'USADO_SIN_DATO', label: 'No sé' },
                  ].map((opt) => {
                    const active = aceitePreset === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.tactileChip,
                          active && styles.tactileChipActive,
                        ]}
                        onPress={() => setAceitePreset(opt.id as any)}
                      >
                        <Text
                          style={[
                            styles.tactileChipText,
                            active && styles.tactileChipTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {!modeloSeleccionado.usaCadenaDistribucion && (
                <View style={styles.blockCard}>
                  <Text style={styles.blockTitle}>Correa de distribución</Text>
                  <View style={styles.chipsWrap}>
                    {[
                      { id: 'DE_FABRICA', label: 'Original' },
                      { id: 'CAMBIADA_HACE_POCO', label: 'Ya cambiada' },
                      { id: 'NO_TENGO_IDEA', label: 'No sé' },
                    ].map((opt) => {
                      const active = correaPreset === opt.id;
                      return (
                        <TouchableOpacity
                          key={opt.id}
                          style={[
                            styles.tactileChip,
                            active && styles.tactileChipActive,
                          ]}
                          onPress={() => setCorreaPreset(opt.id as any)}
                        >
                          <Text
                            style={[
                              styles.tactileChipText,
                              active && styles.tactileChipTextActive,
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
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.primarySaveBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.primarySaveBtnText}>Guardar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootPortal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(14, 11, 41, 0.58)',
  },
  backdropPressable: {
    flex: 1,
  },
  floatingBubble: {
    backgroundColor: Colors.bgPrimary,
    marginHorizontal: 12,
    marginBottom: 14,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 10,
    maxHeight: '86%',
    shadowColor: '#0F0A3C',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 26,
    elevation: 16,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  dragHandlePill: {
    width: 38,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#CFCBE6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  title: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePreviewStage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  stageModelText: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  carSvgWrap: {
    width: '100%',
    marginVertical: 2,
    alignItems: 'center',
  },
  swatchesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    backgroundColor: Colors.bgPrimary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  colorCircleBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(15, 23, 42, 0.14)',
  },
  colorCircleBtnActive: {
    borderColor: Colors.brandPrimary,
    transform: [{ scale: 1.15 }],
  },
  segmentedTrack: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  segmentedTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  segmentedText: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12.5,
    fontWeight: '500',
  },
  segmentedTextActive: {
    color: Colors.brandPrimaryDark,
    fontWeight: '600',
  },
  scrollArea: {
    maxHeight: 210,
  },
  scrollContent: {
    paddingBottom: 6,
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tactileModelCard: {
    width: '48%',
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 11,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
  },
  tactileModelCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.brandPrimary,
  },
  modelCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelBrandText: {
    fontFamily: FontFamily,
    color: Colors.textMuted,
    fontSize: 10.5,
    fontWeight: '600',
  },
  modelNameText: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
    marginTop: 2,
  },
  kmServiceContainer: {
    gap: 10,
  },
  blockCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  blockTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tactileChip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: Colors.bgElevated,
  },
  tactileChipActive: {
    backgroundColor: Colors.brandPrimary,
  },
  tactileChipText: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  tactileChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  primarySaveBtn: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  primarySaveBtnText: {
    fontFamily: FontFamily,
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
  },
});
