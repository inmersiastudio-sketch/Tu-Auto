import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import {
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HelpCircle,
  MessageSquareQuote,
} from 'lucide-react-native';
import {
  ComponenteEvaluado,
  ComponenteId,
} from '../modules/medical-checkup/checkupEngine';
import { Colors } from '../theme/colors';

interface Props {
  item: ComponenteEvaluado | null;
  onSelectPreset: (
    id: ComponenteId,
    preset: 'RECIEN_HECHO' | 'MITAD_VIDA' | 'POR_VENCER' | 'DESCONOCIDO'
  ) => void;
  onClose: () => void;
}

export const ComponentQuickSheet: React.FC<Props> = ({
  item,
  onSelectPreset,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(360)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (item) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 19,
          stiffness: 185,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(360);
      fadeAnim.setValue(0);
    }
  }, [item, fadeAnim, slideAnim]);

  if (!item) return null;

  const handlePick = (
    preset: 'RECIEN_HECHO' | 'MITAD_VIDA' | 'POR_VENCER' | 'DESCONOCIDO'
  ) => {
    onSelectPreset(item.id, preset);
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
          <View style={styles.headerTitleCol}>
            <Text style={styles.supTitle}>
              {item.intervaloReferenciaTexto.toUpperCase()}
            </Text>
            <Text style={styles.title}>{item.nombre}</Text>
          </View>
          <TouchableOpacity style={styles.closeCircleBtn} onPress={onClose}>
            <X size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.explanationText}>{item.fraseCriollo}</Text>

        {item.queDecirleAlTaller && (
          <View style={styles.workshopQuoteBox}>
            <View style={styles.workshopQuoteHeader}>
              <MessageSquareQuote size={15} color={Colors.brandPrimaryDark} />
              <Text style={styles.workshopQuoteTitle}>
                Qué decirle al mecánico:
              </Text>
            </View>
            <Text style={styles.workshopQuoteBody}>
              "{item.queDecirleAlTaller}"
            </Text>
          </View>
        )}

        <Text style={styles.promptTitle}>
          ¿Cuándo se hizo el último cambio de {item.nombre.toLowerCase()}?
        </Text>

        <View style={styles.choicesList}>
          <TouchableOpacity
            style={[styles.tactileChoiceCard, styles.choiceGreen]}
            onPress={() => handlePick('RECIEN_HECHO')}
            activeOpacity={0.8}
          >
            <CheckCircle2 size={20} color={Colors.safeGreenDark} />
            <View style={styles.choiceTextCol}>
              <Text style={styles.choiceTitle}>Lo cambié hace poco</Text>
              <Text style={styles.choiceSub}>
                Queda marcado como "Bien" (recién hecho)
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tactileChoiceCard}
            onPress={() => handlePick('MITAD_VIDA')}
            activeOpacity={0.8}
          >
            <Clock size={20} color={Colors.brandPrimary} />
            <View style={styles.choiceTextCol}>
              <Text style={styles.choiceTitle}>Va por la mitad de su vida</Text>
              <Text style={styles.choiceSub}>
                Alrededor del 50% del intervalo recomendado
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tactileChoiceCard, styles.choiceAmber]}
            onPress={() => handlePick('POR_VENCER')}
            activeOpacity={0.8}
          >
            <AlertTriangle size={20} color={Colors.warnAmberDark} />
            <View style={styles.choiceTextCol}>
              <Text style={styles.choiceTitle}>Ya está por cumplir</Text>
              <Text style={styles.choiceSub}>
                Pasa a estado "Pronto" para que lo programes
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tactileChoiceCard}
            onPress={() => handlePick('DESCONOCIDO')}
            activeOpacity={0.8}
          >
            <HelpCircle size={20} color={Colors.textSecondary} />
            <View style={styles.choiceTextCol}>
              <Text style={styles.choiceTitle}>
                No tengo idea / Lo compré usado
              </Text>
              <Text style={styles.choiceSub}>
                Te sugiere hacerlo revisar por precaución
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
    zIndex: 110,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(14, 11, 41, 0.60)',
  },
  backdropPressable: {
    flex: 1,
  },
  floatingBubble: {
    backgroundColor: Colors.bgPrimary,
    marginHorizontal: 12,
    marginBottom: 14,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
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
    alignItems: 'flex-start',
    marginTop: 6,
    marginBottom: 8,
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  supTitle: {
    color: Colors.brandPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  closeCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.bgHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanationText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  workshopQuoteBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 13,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  workshopQuoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  workshopQuoteTitle: {
    color: Colors.brandPrimaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  workshopQuoteBody: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 17,
  },
  promptTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  choicesList: {
    gap: 8,
  },
  tactileChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: '#E2DDF8',
    borderBottomWidth: 4,
    borderBottomColor: '#CFC8EE',
  },
  choiceGreen: {
    borderColor: Colors.safeGreenBorder,
    borderBottomColor: '#6EE7B7',
  },
  choiceAmber: {
    borderColor: Colors.warnAmberBorder,
    borderBottomColor: '#FCD34D',
  },
  choiceTextCol: {
    flex: 1,
  },
  choiceTitle: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  choiceSub: {
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
});
