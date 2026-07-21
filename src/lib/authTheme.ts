// Minimal, self-contained design tokens so the auth screens drop in without
// depending on the app's theme. Kept intentionally close to Clarity in Calm's
// palette (primary #208AEF). The token names below are all the auth screens use.
export const theme = {
  bgScreen: '#ffffff',
  bgSubtle: '#f5f5f7',
  bgCard: '#ffffff',
  border: '#e2e2e8',
  primary: '#208AEF',
  textPrimary: '#111114',
  textSecondary: '#4b4b55',
  textMuted: '#8a8a94',
  textPlaceholder: '#b0b0ba',
  radiusInput: 12,
  radiusButton: 12,
  shadowFab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;
