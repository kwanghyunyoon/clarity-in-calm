import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PREDEFINED_CONTEXT_TAGS } from '@/constants/emotions';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  selected: string[];
  onToggle: (tag: string) => void;
  customTags?: string[];
  tagLabels?: Record<string, string>;
}

export function ContextTagSelector({ selected, onToggle, customTags = [], tagLabels }: Props) {
  const { colors } = useTheme();

  const allTags = [...PREDEFINED_CONTEXT_TAGS, ...customTags];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {allTags.map(tag => {
        const isSelected = selected.includes(tag);
        const label = tagLabels?.[tag] ?? tag;
        return (
          <TouchableOpacity
            key={tag}
            onPress={() => onToggle(tag)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary + '22' : colors.backgroundElement,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={label}
          >
            <Text style={[styles.chipText, { color: isSelected ? colors.primary : colors.textSecondary }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.two,
    paddingBottom: 2,
  },
  chip: {
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: Spacing.two + 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
