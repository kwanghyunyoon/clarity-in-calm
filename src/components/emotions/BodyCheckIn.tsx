import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BODY_REGIONS } from '@/constants/emotions';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const BODY_REGION_ICONS: Record<string, IoniconsName> = {
  head:      'person-circle-outline',
  throat:    'mic-outline',
  chest:     'heart-outline',
  stomach:   'body-outline',
  shoulders: 'barbell-outline',
  arms:      'fitness-outline',
  legs:      'walk-outline',
  hands:     'hand-left-outline',
};

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
  accentColor: string;
}

export function BodyCheckIn({ selected, onToggle, accentColor }: Props) {
  const { colors } = useTheme();
  const t = useTranslation();
  const bodyRegionLabels = t.emotionsCatalog.bodyRegions as Record<string, string>;

  return (
    <View style={styles.grid}>
      {BODY_REGIONS.map(region => {
        const isSelected = selected.includes(region.id);
        const iconName: IoniconsName = BODY_REGION_ICONS[region.id] ?? 'ellipse-outline';
        const label = bodyRegionLabels[region.id] ?? region.label;
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
            accessibilityLabel={label}
          >
            <Ionicons
              name={iconName}
              size={14}
              color={isSelected ? accentColor : colors.textSecondary}
            />
            <Text style={[styles.label, { color: isSelected ? accentColor : colors.textSecondary }]}>
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
