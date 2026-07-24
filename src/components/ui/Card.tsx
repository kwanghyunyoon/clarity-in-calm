import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  variant?: 'default' | 'primary';
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * Shared elevation surface. `primary` adds a glow shadow for the single
 * primary CTA on a screen; `default` is a flat, bordered ambient card.
 */
export function Card({ variant = 'default', style, children }: Props) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: isPrimary ? colors.glow : colors.cardShadow,
        },
        isPrimary ? styles.primary : styles.default,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  default: {
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primary: {
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
