import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COPING_ACTIONS } from '@/constants/emotions';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export function CopingActionsSelector({ selected, onToggle }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.grid}>
      {COPING_ACTIONS.map(action => {
        const isSelected = selected.includes(action.id);
        return (
          <TouchableOpacity
            key={action.id}
            onPress={() => onToggle(action.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.accent + '22' : colors.backgroundElement,
                borderColor: isSelected ? colors.accent : colors.border,
              },
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={action.label}
          >
            <Text style={styles.emoji}>{action.emoji}</Text>
            <Text style={[styles.label, { color: isSelected ? colors.accent : colors.textSecondary }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: Spacing.two + 2,
    gap: 6,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
