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
  Wrench,
  Check,
  CheckCircle2,
  X,
  Bluetooth,
  Smartphone,
  AlertTriangle,
  Palette,
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
import { Colors } from '../theme/colors';

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
          damping: 19,
          stiffness: 180,
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
      {/* Fondo Oscurecido (Backdrop Scrim) — Tocar afuera cierra la burbuja */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
      </Animated.View>

      {/* Burbuja Cuadrada Flotante estilo iOS / Duolingo / Mercado Pago */}
      <Animated.View
        style={[
          styles.floatingBubble,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Drag Handle Pill superior */}
        <View style={styles.dragHandleWrap}>
          <View style={styles.dragHandlePill} />
        </View>

        {/* Encabezado de la Burbuja */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.supTitle}>MI GARAGE INTERACTIVO</Text>
            <Text style={styles.title}>Personalizá tu auto</Text>
          </View>
          <TouchableOpacity
            style={styles.closeCircleBtn}
            onPress={onClose}
            activeOpacity={0.75}
          >
            <X size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Escenario 3D/SVG en Vivo dentro de la Burbuja + Selector de Colores */}
        <View style={styles.livePreviewStage}>
          <View style={styles.stageTopBadges}>
            <View style={styles.stageModelPill}>
              <Text style={styles.stageModelText}>
                {modeloSeleccionado.marca} {modeloSeleccionado.modelo}
              </Text>
            </View>
            <View style={styles.stageEnginePill}>
              <Text style={styles.stageEngineText}>
                {modeloSeleccionado.usaCadenaDistribucion
                  ? 'Motor a Cadena'
                  : `Correa c/${((modeloSeleccionado.intervalos.correaKm ?? 60000) / 1000).toFixed(0)}k km`}
              </Text>
            </View>
          </View>

          <View style={styles.carSvgWrap}>
            <CarVectorIllustration paint={selectedPaint} height={106} />
          </View>

          {/* Barra de Selección de Pintura en Vivo */}
          <View style={styles.paintBar}>
            <View style={styles.paintLabelRow}>
              <Palette size={12} color="#E0E0FF" />
              <Text style={styles.paintLabelText}>
                Color: <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{selectedPaint.name}</Text>
              </Text>
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
                        size={14}
                        color={p.id === 'crystal-white' ? '#1E1B4B' : '#FFFFFF'}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Segmented Control (Estilo iOS / Mercado Pago) para no saturar */}
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
              1. Modelo del auto
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
              2. Km y Service ({(kmActuales / 1000).toFixed(1)}k)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cuerpo Deslizable de la Burbuja */}
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
                        <CheckCircle2 size={15} color={Colors.brandPrimary} />
                      )}
                    </View>
                    <Text style={styles.modelNameText}>{m.modelo}</Text>
                    <Text style={styles.modelEngineSub}>
                      {m.motor} ·{' '}
                      {m.usaCadenaDistribucion ? 'Usa Cadena' : 'Usa Correa'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.kmServiceContainer}>
              {/* Selección de Kilómetros Actuales */}
              <View style={styles.blockCard}>
                <Text style={styles.blockTitle}>
                  ¿Cuántos kilómetros tiene hoy?
                </Text>
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
                          {(val / 1000).toFixed(val === 42500 ? 1 : 0)} mil km
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Último Service de Aceite */}
              <View style={styles.blockCard}>
                <View style={styles.blockTitleRow}>
                  <Wrench size={14} color={Colors.brandPrimary} />
                  <Text style={styles.blockTitle}>
                    ¿Cuándo hiciste el último cambio de aceite?
                  </Text>
                </View>
                <View style={styles.optionsCol}>
                  {[
                    { id: 'RECIEN', label: 'Hace poco (menos de 4 meses)' },
                    { id: 'OCHO_MESES', label: 'Hace ~8 meses (ya se acerca)' },
                    { id: 'MAS_DE_ANIO', label: 'Hace más de 1 año (vencido)' },
                    {
                      id: 'USADO_SIN_DATO',
                      label: 'No me acuerdo / Lo compré usado',
                    },
                  ].map((opt) => {
                    const active = aceitePreset === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.tactileOptionBtn,
                          active && styles.tactileOptionBtnActive,
                        ]}
                        onPress={() => setAceitePreset(opt.id as any)}
                      >
                        <CheckCircle2
                          size={16}
                          color={
                            active ? Colors.brandPrimary : Colors.textMuted
                          }
                        />
                        <Text
                          style={[
                            styles.tactileOptionText,
                            active && styles.tactileOptionTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Pregunta de Correa si aplica al modelo */}
              {!modeloSeleccionado.usaCadenaDistribucion && (
                <View style={styles.beltAlertBlock}>
                  <View style={styles.blockTitleRow}>
                    <AlertTriangle size={14} color={Colors.warnAmberDark} />
                    <Text style={styles.beltAlertTitle}>
                      ¿Se cambió la correa de distribución alguna vez?
                    </Text>
                  </View>
                  <View style={styles.chipsWrap}>
                    {[
                      { id: 'DE_FABRICA', label: 'Todavía original' },
                      { id: 'CAMBIADA_HACE_POCO', label: 'Sí, se cambió' },
                      { id: 'NO_TENGO_IDEA', label: 'No tengo idea' },
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

              {/* Selector de Modo: Sin Dongle vs Con Dongle */}
              <View style={styles.modeDualRow}>
                <TouchableOpacity
                  style={[
                    styles.modeMiniCard,
                    !dongleConectado && styles.modeMiniCardActive,
                  ]}
                  onPress={() => setDongleConectado(false)}
                >
                  <Smartphone
                    size={16}
                    color={
                      !dongleConectado
                        ? Colors.brandPrimary
                        : Colors.textSecondary
                    }
                  />
                  <Text style={styles.modeMiniTitle}>Sin Dongle</Text>
                  <Text style={styles.modeMiniSub}>Por km y manual</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeMiniCard,
                    dongleConectado && styles.modeMiniCardActive,
                  ]}
                  onPress={() => setDongleConectado(true)}
                >
                  <Bluetooth
                    size={16}
                    color={
                      dongleConectado
                        ? Colors.brandPrimary
                        : Colors.textSecondary
                    }
                  />
                  <Text style={styles.modeMiniTitle}>Con Dongle OBD2</Text>
                  <Text style={styles.modeMiniSub}>Mide agua y batería</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Botón Táctil 3D Estilo Duolingo / Mercado Pago */}
        <TouchableOpacity
          style={styles.duolingoPrimaryBtn}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.duolingoPrimaryBtnText}>
            Listo, guardar mi auto
          </Text>
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
    backgroundColor: 'rgba(14, 11, 41, 0.62)',
  },
  backdropPressable: {
    flex: 1,
  },
  floatingBubble: {
    backgroundColor: Colors.bgPrimary,
    marginHorizontal: 12,
    marginBottom: 14,
    borderRadius: 32,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 10,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 5,
    borderBottomColor: '#D6D1F5',
    shadowColor: '#0F0A3C',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.32,
    shadowRadius: 32,
    elevation: 16,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  dragHandlePill: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#CFCBE6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  supTitle: {
    color: Colors.brandPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  closeCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bgHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePreviewStage: {
    backgroundColor: Colors.heroIndigoMid,
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#2E239E',
  },
  stageTopBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageModelPill: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  stageModelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stageEnginePill: {
    backgroundColor: 'rgba(15, 10, 60, 0.45)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  stageEngineText: {
    color: '#E0E0FF',
    fontSize: 10,
    fontWeight: '700',
  },
  carSvgWrap: {
    marginVertical: 2,
    alignItems: 'center',
  },
  paintBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  paintLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  paintLabelText: {
    color: '#E0E0FF',
    fontSize: 11,
    fontWeight: '600',
  },
  swatchesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  colorCircleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  colorCircleBtnActive: {
    borderColor: '#FFFFFF',
    borderWidth: 2.5,
    transform: [{ scale: 1.12 }],
  },
  segmentedTrack: {
    flexDirection: 'row',
    backgroundColor: Colors.bgHigh,
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 11,
  },
  segmentedTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#181445',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  segmentedText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  segmentedTextActive: {
    color: Colors.brandPrimaryDark,
    fontWeight: '800',
  },
  scrollArea: {
    maxHeight: 230,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tactileModelCard: {
    width: '48%',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 11,
    borderWidth: 1.5,
    borderColor: '#E2DDF8',
    borderBottomWidth: 4,
    borderBottomColor: '#D0C9F0',
  },
  tactileModelCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.brandPrimary,
    borderBottomColor: Colors.brandPrimaryDark,
  },
  modelCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelBrandText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modelNameText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  modelEngineSub: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
  kmServiceContainer: {
    gap: 10,
  },
  blockCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  blockTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tactileChip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: '#DCD6F7',
    borderBottomWidth: 3,
    borderBottomColor: '#C7C0EB',
  },
  tactileChipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
    borderBottomColor: Colors.brandPrimaryDark,
  },
  tactileChipText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  tactileChipTextActive: {
    color: '#FFFFFF',
  },
  optionsCol: {
    gap: 6,
  },
  tactileOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: '#E2DDF8',
    borderBottomWidth: 3,
    borderBottomColor: '#CFC8EE',
  },
  tactileOptionBtnActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.brandPrimary,
    borderBottomColor: Colors.brandPrimaryDark,
  },
  tactileOptionText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  tactileOptionTextActive: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  beltAlertBlock: {
    backgroundColor: Colors.warnAmberBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.warnAmberBorder,
  },
  beltAlertTitle: {
    color: Colors.warnAmberText,
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  modeDualRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modeMiniCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 11,
    borderWidth: 1.5,
    borderColor: '#E2DDF8',
    borderBottomWidth: 3,
    borderBottomColor: '#CFC8EE',
  },
  modeMiniCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: Colors.brandPrimary,
    borderBottomColor: Colors.brandPrimaryDark,
  },
  modeMiniTitle: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  modeMiniSub: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 1,
  },
  duolingoPrimaryBtn: {
    backgroundColor: Colors.brandPrimary,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: Colors.brandPrimaryDark,
  },
  duolingoPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
