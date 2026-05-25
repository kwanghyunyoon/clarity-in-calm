/**
 * Wellness colour palette — earthy & grounded.
 * Light: warm sand + terracotta + sage green
 * Dark:  deep forest + warm clay + moss green
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A2E1C',
    background: '#F5EDE0',
    backgroundElement: '#DFF0DF',
    backgroundSelected: '#C8E3C9',
    textSecondary: '#5A7A5C',
    primary: '#4A8C50',
    accent: '#C17A4A',
    surface: '#FAF3EA',
    border: '#C8E3C9',
  },
  dark: {
    text: '#F0E8DC',
    background: '#1C1A14',
    backgroundElement: '#2A2519',
    backgroundSelected: '#3A3225',
    textSecondary: '#A89880',
    primary: '#D4935E',
    accent: '#6B9470',
    surface: '#231F17',
    border: '#3A3225',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
