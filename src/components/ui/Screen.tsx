import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ScreenProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** The root wrapper every tab screen renders into: theme background + flex:1. */
export function Screen({ style, children }: ScreenProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }, style]}>
      {children}
    </View>
  );
}

type ScreenHeaderVariant = 'standard' | 'immersive';

interface ScreenHeaderProps {
  /** 'standard' — bordered background strip, used by most content screens.
   * 'immersive' — no border, more relaxed spacing, used by full-bleed tools
   * like Breathe/Ground. Either way this owns the top safe-area inset, so
   * screens using ScreenHeader should not also wrap themselves in a
   * SafeAreaView with a 'top' edge. */
  variant?: ScreenHeaderVariant;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function ScreenHeader({ variant = 'standard', style, children }: ScreenHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        variant === 'standard' && [
          styles.headerStandard,
          { paddingTop: insets.top + Spacing.two, borderBottomColor: colors.border, backgroundColor: colors.background },
        ],
        variant === 'immersive' && [
          styles.headerImmersive,
          { paddingTop: insets.top + Spacing.six },
        ],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
  },
  headerStandard: {
    paddingBottom: Spacing.two + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerImmersive: {
    paddingBottom: Spacing.three,
    alignItems: 'center',
    gap: Spacing.two,
  },
});
