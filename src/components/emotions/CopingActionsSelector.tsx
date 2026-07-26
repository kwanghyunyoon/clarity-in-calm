import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COPING_ACTIONS } from '@/constants/emotions';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const COPING_ICONS: Record<string, IoniconsName> = {
  breathing:   'partly-sunny-outline',
  journaling:  'book-outline',
  walk:        'walk-outline',
  call:        'call-outline',
  rest:        'bed-outline',
  music:       'musical-notes-outline',
  meditation:  'leaf-outline',
  water:       'water-outline',
  grounding:   'earth-outline',
  nothing:     'ellipse-outline',
};

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export function CopingActionsSelector({ selected, onToggle }: Props) {
  const { colors } = useTheme();
  const t = useTranslation();

  return (
    <View style={styles.grid}>
      {COPING_ACTIONS.map(action => {
        const isSelected = selected.includes(action.id);
        const label = t.emotionsCatalog.copingActions[action.id as keyof typeof t.emotionsCatalog.copingActions] ?? action.label;
        const iconName: IoniconsName = COPING_ICONS[action.id] ?? 'ellipse-outline';
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
            accessibilityLabel={label}
          >
            <Ionicons
              name={iconName}
              size={14}
              color={isSelected ? colors.accent : colors.textSecondary}
            />
            <Text style={[styles.label, { color: isSelected ? colors.accent : colors.textSecondary }]}>
              {label}
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
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
