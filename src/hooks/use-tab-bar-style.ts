import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing, TAB_BAR_FLOAT_HEIGHT } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * The floating tab bar's default style, factored out of `(tabs)/_layout.tsx`
 * so screens that hide the bar (Breathe/Ground) can restore the exact same
 * object on blur instead of guessing at it.
 */
export function useTabBarStyle() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const barBottom = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 4) + Spacing.two;

  return {
    position: 'absolute' as const,
    left: Spacing.three,
    right: Spacing.three,
    bottom: barBottom,
    height: TAB_BAR_FLOAT_HEIGHT,
    borderRadius: 28,
    borderTopWidth: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.tabBarBorder,
    backgroundColor: colors.tabBar,
    paddingTop: 6,
    paddingBottom: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  };
}
