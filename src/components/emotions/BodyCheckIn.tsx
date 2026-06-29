import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BODY_REGIONS } from '@/constants/emotions';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
  accentColor: string;
}

export function BodyCheckIn({ selected, onToggle, accentColor }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.grid}>
      {BODY_REGIONS.map(region => {
        const isSelected = selected.includes(region.id);
        return (
          <TouchableOpacity
            key={region.id}
            onPress={() => onToggle(region.id)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? accentColor + '22' : colors.backgroundElement,
                borderColor: isSelected ? accentColor : colors.border,
              },
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={region.label}
          >
            <Text style={styles.emoji}>{region.emoji}</Text>
            <Text style={[styles.label, { color: isSelected ? accentColor : colors.textSecondary }]}>
              {region.label}
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
