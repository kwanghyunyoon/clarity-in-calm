import { type Locale } from '@/i18n/translations';

export interface LanguageOption {
  locale: Locale;
  flag: string;
  /** Language name written in that language itself, not translated. */
  nativeName: string;
  /** Compact abbreviation for space-constrained UI (e.g. the onboarding toggle row). */
  shortLabel: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { locale: 'en', flag: '🇺🇸', nativeName: 'English', shortLabel: 'EN' },
  { locale: 'ko', flag: '🇰🇷', nativeName: '한국어', shortLabel: '한' },
  { locale: 'es', flag: '🇲🇽', nativeName: 'Español', shortLabel: 'ES' },
  { locale: 'hi', flag: '🇮🇳', nativeName: 'हिन्दी', shortLabel: 'हि' },
];
