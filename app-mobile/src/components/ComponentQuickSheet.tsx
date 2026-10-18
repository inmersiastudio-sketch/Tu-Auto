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
import { Colors, FontFamily } from '../theme/colors';

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
          damping: 20,
          stiffness: 200,
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
            <Text style={styles.title}>{item.nombre}</Text>
            <Text style={styles.supTitle}>{item.cuandoToca}</Text>
          </View>
          <TouchableOpacity style={styles.closeCircleBtn} onPress={onClose}>
            <X size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.explanationText}>{item.fraseCriollo}</Text>

        {item.queDecirleAlTaller && (
          <View style={styles.workshopQuoteBox}>
            <View style={styles.workshopQuoteHeader}>
              <MessageSquareQuote size={14} color={Colors.brandPrimaryDark} />
              <Text style={styles.workshopQuoteTitle}>Qué pedir en el taller</Text>
            </View>
            <Text style={styles.workshopQuoteBody}>
              "{item.queDecirleAlTaller}"
            </Text>
          </View>
        )}

        <Text style={styles.promptTitle}>Actualizar último cambio</Text>

        <View style={styles.choicesList}>
          <TouchableOpacity
            style={styles.tactileChoiceCard}
            onPress={() => handlePick('RECIEN_HECHO')}
            activeOpacity={0.8}
          >
            <CheckCircle2 size={18} color={Colors.safeGreenDark} />
            <Text style={styles.choiceTitle}>Lo cambié hace poco</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tactileChoiceCard}
            onPress={() => handlePick('MITAD_VIDA')}
            activeOpacity={0.8}
          >
            <Clock size={18} color={Colors.brandPrimary} />
            <Text style={styles.choiceTitle}>Va por la mitad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tactileChoiceCard}
            onPress={() => handlePick('POR_VENCER')}
            activeOpacity={0.8}
          >
            <AlertTriangle size={18} color={Colors.warnAmberDark} />
            <Text style={styles.choiceTitle}>Ya está por vencer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tactileChoiceCard}
            onPress={() => handlePick('DESCONOCIDO')}
            activeOpacity={0.8}
          >
            <HelpCircle size={18} color={Colors.textSecondary} />
            <Text style={styles.choiceTitle}>No sé / Lo compré usado</Text>
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
    backgroundColor: 'rgba(14, 11, 41, 0.56)',
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
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 8,
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  supTitle: {
    fontFamily: FontFamily,
    color: Colors.brandPrimary,
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 2,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanationText: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  workshopQuoteBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  workshopQuoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  workshopQuoteTitle: {
    fontFamily: FontFamily,
    color: Colors.brandPrimaryDark,
    fontSize: 11.5,
    fontWeight: '600',
  },
  workshopQuoteBody: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 17,
  },
  promptTitle: {
    fontFamily: FontFamily,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  choicesList: {
    gap: 7,
  },
  tactileChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  choiceTitle: {
    fontFamily: FontFamily,
    color: Colors.textPrimary,
    fontSize: 13.5,
    fontWeight: '600',
  },
});
