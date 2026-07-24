import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
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
        <Text style={[styles.title, { color: colors.text, fontFamily: Fonts?.displaySans }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={2}>
          {subtitle}
        </Text>
      </Card>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
});
