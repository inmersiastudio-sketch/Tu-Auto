import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Car,
  Gauge,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
} from 'lucide-react-native';
import { Colors, FontFamily } from '../theme/colors';
import {
  CATALOGO_MODELOS_ARG,
  PerfilVehiculoUsuario,
} from '../modules/medical-checkup/checkupEngine';
import {
  CAR_PAINTS,
  CarPaintOption,
  CarVectorIllustration,
} from '../components/Car3DShowcase';

interface OnboardingScreenProps {
  onComplete: (perfil: PerfilVehiculoUsuario, paint: CarPaintOption) => void;
}

const KM_PRESETS = [20000, 35000, 50000, 68000, 85000, 110000];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedModelId, setSelectedModelId] = useState<string>('vw_gol_trend');
  const [selectedPaint, setSelectedPaint] = useState<CarPaintOption>(CAR_PAINTS[0]);
  const [kmActuales, setKmActuales] = useState<number>(56000);
  const [aceitePreset, setAceitePreset] = useState<
    'RECIEN' | 'OCHO_MESES' | 'MAS_DE_ANIO' | 'NO_SE'
  >('OCHO_MESES');
  const [correaPreset, setCorreaPreset] = useState<
    'ORIGINAL' | 'CAMBIADA' | 'NO_SE'
  >('ORIGINAL');

  const selectedModel =
    CATALOGO_MODELOS_ARG.find((m) => m.id === selectedModelId) ||
    CATALOGO_MODELOS_ARG[0];

  const handleFinish = () => {
    const historial: PerfilVehiculoUsuario['historial'] = {};

    if (aceitePreset === 'RECIEN') {
      historial.aceite_filtro = {
        ultimoCambioKm: Math.max(0, kmActuales - 2000),
        mesesDesdeUltimoCambio: 2,
      };
    } else if (aceitePreset === 'OCHO_MESES') {
      historial.aceite_filtro = {
        ultimoCambioKm: Math.max(0, kmActuales - 8000),
        mesesDesdeUltimoCambio: 8,
      };
    } else if (aceitePreset === 'MAS_DE_ANIO') {
      historial.aceite_filtro = {
        ultimoCambioKm: Math.max(0, kmActuales - 12000),
        mesesDesdeUltimoCambio: 14,
      };
    } else {
      historial.aceite_filtro = {
        desconocidoPorCompraUsado: true,
      };
    }

    if (!selectedModel.usaCadenaDistribucion) {
      if (correaPreset === 'ORIGINAL') {
        historial.correa_distribucion = {
          ultimoCambioKm: 0,
          mesesDesdeUltimoCambio: Math.min(48, Math.round(kmActuales / 1200)),
        };
      } else if (correaPreset === 'CAMBIADA') {
        historial.correa_distribucion = {
          ultimoCambioKm: Math.max(0, kmActuales - 15000),
          mesesDesdeUltimoCambio: 12,
        };
      } else {
        historial.correa_distribucion = {
          desconocidoPorCompraUsado: true,
        };
      }
    }

    const nuevoPerfil: PerfilVehiculoUsuario = {
      modeloId: selectedModel.id,
      anio: 2021,
      kmActuales,
      dongleConectado: false,
      luzTestigoDeclaradaPorUsuario: false,
      historial,
    };

    onComplete(nuevoPerfil, selectedPaint);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bgPrimary} />

      <View style={styles.container}>
        {/* Barra superior de progreso */}
        <View style={styles.topProgressRow}>
          {step > 1 ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep((prev) => (prev - 1) as any)}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}

          <View style={styles.stepsIndicator}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[
                  styles.stepSegment,
                  s === step && styles.stepSegmentActive,
                  s < step && styles.stepSegmentCompleted,
                ]}
              />
            ))}
          </View>

          <Text style={styles.stepNumberText}>{step} de 3</Text>
        </View>

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ============================================================ */}
          {/* PASO 1: Elegir Modelo y Color del Auto                        */}
          {/* ============================================================ */}
          {step === 1 && (
            <View>
              <View style={styles.headerBlock}>
                <Text style={styles.title}>¿Qué auto manejás?</Text>
                <Text style={styles.subtitle}>
                  Configuramos el manual de mantenimiento y el chequeo para tu modelo.
                </Text>
              </View>

              {/* Showcase 3D del auto seleccionado */}
              <View style={styles.studioCard}>
                <Text style={styles.studioModelName}>
                  {selectedModel.marca} {selectedModel.modelo}
                </Text>
                <Text style={styles.studioEngine}>
                  {selectedModel.motor} ·{' '}
                  {selectedModel.usaCadenaDistribucion
                    ? 'Motor con cadena metálica'
                    : 'Motor con correa de distribución'}
                </Text>

                <View style={styles.stageWrap}>
                  <CarVectorIllustration
                    paint={selectedPaint}
                    bodyType={selectedModel.tipoCarroceria}
                    height={145}
                  />
                </View>

                {/* Paleta de colores */}
                <View style={styles.colorsRow}>
                  {CAR_PAINTS.map((p) => {
                    const active = p.id === selectedPaint.id;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: p.swatch },
                          active && styles.colorCircleActive,
                        ]}
                        onPress={() => setSelectedPaint(p)}
                        activeOpacity={0.8}
                      >
                        {active && (
                          <Check
                            size={12}
                            color={p.id === 'crystal-white' ? '#1E1B4B' : '#FFFFFF'}
                            strokeWidth={3}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Lista de Modelos */}
              <Text style={styles.sectionLabel}>Modelos frecuentes</Text>
              <View style={styles.modelsGrid}>
                {CATALOGO_MODELOS_ARG.map((m) => {
                  const active = m.id === selectedModelId;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[
                        styles.modelCard,
                        active && styles.modelCardActive,
                      ]}
                      onPress={() => setSelectedModelId(m.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.modelTopRow}>
                        <Text
                          style={[
                            styles.modelBrand,
                            active && { color: Colors.brandPrimary },
                          ]}
                        >
                          {m.marca}
                        </Text>
                        {active && (
                          <View style={styles.checkedCircle}>
                            <Check size={11} color="#FFFFFF" strokeWidth={3} />
                          </View>
                        )}
                      </View>
                      <Text style={styles.modelName}>{m.modelo}</Text>
                      <Text style={styles.modelSub}>{m.motor}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ============================================================ */}
          {/* PASO 2: Kilómetros Actuales                                 */}
          {/* ============================================================ */}
          {step === 2 && (
            <View>
              <View style={styles.headerBlock}>
                <Text style={styles.title}>¿Cuántos km tiene hoy?</Text>
                <Text style={styles.subtitle}>
                  Con esto calculamos el desgaste de los 8 componentes sin necesidad de instalar nada.
                </Text>
              </View>

              {/* Card visual del kilometraje */}
              <View style={styles.kmHeroCard}>
                <Gauge size={28} color={Colors.brandPrimary} strokeWidth={2.2} />
                <Text style={styles.kmBigNumber}>
                  {kmActuales.toLocaleString('es-AR')} km
                </Text>
                <Text style={styles.kmHeroSub}>Kilometraje aproximado</Text>
              </View>

              <Text style={styles.sectionLabel}>Elegí el más cercano</Text>
              <View style={styles.kmChipsGrid}>
                {KM_PRESETS.map((km) => {
                  const active = kmActuales === km;
                  return (
                    <TouchableOpacity
                      key={km}
                      style={[
                        styles.kmChip,
                        active && styles.kmChipActive,
                      ]}
                      onPress={() => setKmActuales(km)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.kmChipText,
                          active && styles.kmChipTextActive,
                        ]}
                      >
                        {(km / 1000).toFixed(0)} mil km
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.infoTipBox}>
                <ShieldCheck size={18} color={Colors.safeGreenDark} />
                <Text style={styles.infoTipText}>
                  Podés ajustarlo en cualquier momento más tarde desde la pantalla principal.
                </Text>
              </View>
            </View>
          )}

          {/* ============================================================ */}
          {/* PASO 3: Estado del Mantenimiento                           */}
          {/* ============================================================ */}
          {step === 3 && (
            <View>
              <View style={styles.headerBlock}>
                <Text style={styles.title}>¿Cuándo fue el último service?</Text>
                <Text style={styles.subtitle}>
                  Una estimación rápida para no darte falsas alertas ni cobrarte de más.
                </Text>
              </View>

              {/* Aceite y Filtro */}
              <View style={styles.serviceQuestionCard}>
                <View style={styles.questionHeader}>
                  <Wrench size={16} color={Colors.brandPrimary} />
                  <Text style={styles.questionTitle}>Cambio de aceite y filtro</Text>
                </View>
                <View style={styles.optionsList}>
                  {[
                    { id: 'RECIEN', label: 'Hace poco (menos de 4 meses)' },
                    { id: 'OCHO_MESES', label: 'Hace unos 8 meses' },
                    { id: 'MAS_DE_ANIO', label: 'Hace más de 1 año' },
                    { id: 'NO_SE', label: 'No me acuerdo / Lo compré usado' },
                  ].map((opt) => {
                    const active = aceitePreset === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.optionBtn,
                          active && styles.optionBtnActive,
                        ]}
                        onPress={() => setAceitePreset(opt.id as any)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            active && styles.radioCircleActive,
                          ]}
                        >
                          {active && <View style={styles.radioDot} />}
                        </View>
                        <Text
                          style={[
                            styles.optionLabel,
                            active && styles.optionLabelActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Correa de distribución si aplica */}
              {!selectedModel.usaCadenaDistribucion && (
                <View style={styles.serviceQuestionCard}>
                  <View style={styles.questionHeader}>
                    <Car size={16} color={Colors.warnAmberDark} />
                    <Text style={styles.questionTitle}>Correa de distribución</Text>
                  </View>
                  <View style={styles.optionsList}>
                    {[
                      { id: 'ORIGINAL', label: 'Todavía la de fábrica' },
                      { id: 'CAMBIADA', label: 'Se cambió hace algún tiempo' },
                      { id: 'NO_SE', label: 'No tengo idea' },
                    ].map((opt) => {
                      const active = correaPreset === opt.id;
                      return (
                        <TouchableOpacity
                          key={opt.id}
                          style={[
                            styles.optionBtn,
                            active && styles.optionBtnActive,
                          ]}
                          onPress={() => setCorreaPreset(opt.id as any)}
                          activeOpacity={0.8}
                        >
                          <View
                            style={[
                              styles.radioCircle,
                              active && styles.radioCircleActive,
                            ]}
                          >
                            {active && <View style={styles.radioDot} />}
                          </View>
                          <Text
                            style={[
                              styles.optionLabel,
                              active && styles.optionLabelActive,
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

        {/* Botón inferior flotante de siguiente paso */}
        <View style={styles.bottomCtaWrapper}>
          <TouchableOpacity
            style={styles.primaryCta}
            onPress={() => {
              if (step < 3) {
                setStep((prev) => (prev + 1) as any);
              } else {
                handleFinish();
              }
            }}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryCtaText}>
              {step === 3 ? 'Ver el estado de mi auto' : 'Continuar'}
            </Text>
            <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.bgPrimary,
  },
  topProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  stepsIndicator: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  stepSegment: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderSubtle,
  },
  stepSegmentActive: {
    backgroundColor: Colors.brandPrimary,
    width: 36,
  },
  stepSegmentCompleted: {
    backgroundColor: Colors.safeGreen,
  },
  stepNumberText: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 100,
  },
  headerBlock: {
    marginBottom: 16,
  },
  title: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 23,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '400',
  },
  studioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },
  studioModelName: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  studioEngine: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  stageWrap: {
    width: '100%',
    marginVertical: 4,
    alignItems: 'center',
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.bgPrimary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  colorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(15, 23, 42, 0.12)',
  },
  colorCircleActive: {
    borderColor: Colors.brandPrimary,
    transform: [{ scale: 1.15 }],
  },
  sectionLabel: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelCard: {
    width: '48.5%',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
  },
  modelCardActive: {
    backgroundColor: Colors.brandLight,
    borderColor: Colors.brandPrimary,
  },
  modelTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modelBrand: {
    fontFamily: FontFamily,
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  checkedCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelName: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 3,
  },
  modelSub: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  kmHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 20,
  },
  kmBigNumber: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  kmHeroSub: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12.5,
    marginTop: 2,
  },
  kmChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  kmChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  kmChipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  kmChipText: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  kmChipTextActive: {
    color: '#FFFFFF',
  },
  infoTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.safeGreenBg,
    borderRadius: 14,
    padding: 12,
  },
  infoTipText: {
    fontFamily: FontFamily,
    flex: 1,
    color: Colors.safeGreenDark,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  serviceQuestionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  questionTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 14.5,
    fontWeight: '600',
  },
  optionsList: {
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgPrimary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionBtnActive: {
    backgroundColor: Colors.brandLight,
    borderColor: Colors.brandPrimary,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.brandPrimary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
  },
  optionLabel: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  optionLabelActive: {
    color: Colors.brandPrimaryDark,
    fontWeight: '600',
  },
  bottomCtaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: 'rgba(248, 247, 252, 0.95)',
  },
  primaryCta: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: Colors.brandPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 4,
  },
  primaryCtaText: {
    fontFamily: FontFamily,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
