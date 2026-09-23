import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASIC_EMOTIONS } from '@/constants/emotions';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { ensureContrastText } from '@/lib/color-contrast';

export interface SelectedEmotion {
  id: string;
  label: string;
  color: string;
}

function slugify(text: string): string {
  const slug = text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return slug || 'custom';
}

interface Props {
  selected: SelectedEmotion | null;
  onSelect: (emotion: SelectedEmotion) => void;
  otherLabel: string;
  customPlaceholder: string;
}

export function EmotionPillSelector({ selected, onSelect, otherLabel, customPlaceholder }: Props) {
  const { colors } = useTheme();
  const t = useTranslation();
  const [customText, setCustomText] = useState('');
  const [editingCustom, setEditingCustom] = useState(false);

  const isCustomSelected = !!selected && !BASIC_EMOTIONS.some(e => e.id === selected.id);
  const labelFor = (id: string, fallback: string) =>
    t.emotionsCatalog.basicEmotions[id as keyof typeof t.emotionsCatalog.basicEmotions] ?? fallback;

  function submitCustom() {
    const label = customText.trim();
    if (label) {
      onSelect({ id: slugify(label), label, color: colors.textSecondary });
    }
    setEditingCustom(false);
  }

  return (
    <View style={styles.wrap} accessibilityLabel="Emotion selector">
      {BASIC_EMOTIONS.map(emotion => {
        const isSelected = selected?.id === emotion.id;
        const label = labelFor(emotion.id, emotion.label);
        const textColor = ensureContrastText(emotion.color, colors.backgroundElement);
        return (
          <TouchableOpacity
            key={emotion.id}
            onPress={() => {
              setEditingCustom(false);
              onSelect({ ...emotion, label });
            }}
            style={[
              styles.pill,
              {
                backgroundColor: isSelected ? emotion.color + '22' : colors.backgroundElement,
                borderColor: isSelected ? emotion.color : colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={label}
          >
            <Text style={[styles.pillText, { color: isSelected ? textColor : colors.text }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {editingCustom ? (
        <TextInput
          autoFocus
          style={[
            styles.customInput,
            { color: colors.text, borderColor: colors.primary, backgroundColor: colors.backgroundElement },
          ]}
          placeholder={customPlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={customText}
          onChangeText={setCustomText}
          onSubmitEditing={submitCustom}
          onBlur={submitCustom}
          returnKeyType="done"
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            setCustomText(isCustomSelected ? selected!.label : '');
            setEditingCustom(true);
          }}
          style={[
            styles.pill,
            styles.otherPill,
            {
              backgroundColor: isCustomSelected ? colors.primary + '22' : colors.backgroundElement,
              borderColor: isCustomSelected ? colors.primary : colors.border,
            },
          ]}
          accessibilityRole="button"
          accessibilityState={{ selected: isCustomSelected }}
          accessibilityLabel={otherLabel}
        >
          <Text style={[styles.pillText, { color: isCustomSelected ? colors.primary : colors.textSecondary }]}>
            {isCustomSelected ? selected!.label : otherLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  pill: {
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
  },
  otherPill: {
    borderStyle: 'dashed',
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
  },
  customInput: {
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    paddingVertical: 9,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    minWidth: 160,
  },
});
