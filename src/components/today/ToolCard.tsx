import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  accentColor: string;
  onPress: () => void;
}

export function ToolCard({ icon, title, subtitle, accentColor, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <AnimatedPressable
      onPress={onPress}
      style={styles.pressable}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${subtitle}`}
    >
      <Card style={styles.card}>
        <IconChip name={icon} color={accentColor} />
        <View style={styles.text}>
          <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.displaySans }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </Card>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  // Takes the row's leftover width so long titles wrap instead of clipping.
  text: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
});
