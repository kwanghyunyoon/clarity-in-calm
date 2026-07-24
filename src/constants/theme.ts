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
    // New tokens
    amber: '#D4870A',
    positive: '#4A8C50',
    negative: '#C0404A',
    cardShadow: 'rgba(26,46,28,0.08)',
    overlay: 'rgba(26,46,28,0.4)',
    tabBar: '#FAF3EA',
    tabBarBorder: '#C8E3C9',
    // Elevation tokens
    glow: 'rgba(74,140,80,0.35)',
  },
  dark: {
    text: '#E8E0D4',
    background: '#0D1117',
    backgroundElement: '#161B22',
    backgroundSelected: '#1C2128',
    textSecondary: '#8B949E',
    primary: '#F0A855',
    accent: '#6AA96F',
    surface: '#161B22',
    border: '#21262D',
    // New tokens
    amber: '#F0A855',
    positive: '#6AA96F',
    negative: '#F47067',
    cardShadow: 'rgba(0,0,0,0.4)',
    overlay: 'rgba(0,0,0,0.6)',
    tabBar: '#0D1117',
    tabBarBorder: '#21262D',
    // Elevation tokens
    glow: 'rgba(240,168,85,0.35)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const EmotionColors = {
  joy:          '#F5C842',
  trust:        '#82C341',
  fear:         '#4CAF7D',
  surprise:     '#29B6D6',
  sadness:      '#5B7FD6',
  disgust:      '#9C6BBF',
  anger:        '#EF5350',
  anticipation: '#FF9800',
} as const;

export type PrimaryEmotion = keyof typeof EmotionColors;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
    journalSerif: 'Georgia',
    displaySans: 'system-ui',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    journalSerif: 'serif',
    displaySans: 'normal',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
    journalSerif: 'Georgia, "Times New Roman", serif',
    displaySans: 'var(--font-display)',
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
  seven: 80,
  eight: 120,
} as const;

export const TAB_BAR_FLOAT_HEIGHT = 54;
export const TAB_BAR_FLOAT_MARGIN = Spacing.two + 8;
export const TAB_BAR_CLEARANCE = TAB_BAR_FLOAT_HEIGHT + TAB_BAR_FLOAT_MARGIN + Spacing.two;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
