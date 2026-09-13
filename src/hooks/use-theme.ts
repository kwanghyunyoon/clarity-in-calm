/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useSettings } from '@/context/settings-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const systemScheme = useColorScheme();
  const { settings } = useSettings();
  const override = settings.themeOverride;

  const resolvedSystemScheme = systemScheme === 'unspecified' ? 'light' : systemScheme;
  const theme = override === 'system' ? resolvedSystemScheme : override;
  const colors = Colors[theme];

  return { colors, scheme: theme };
}
