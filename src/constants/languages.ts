import { type Locale } from '@/i18n/translations';

export interface LanguageOption {
  locale: Locale;
  flag: string;
  /** Language name written in that language itself, not translated. */
  nativeName: string;
  /** Plain-text abbreviation for space-constrained UI (e.g. the onboarding toggle row). */
  code: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { locale: 'en', flag: '🇺🇸', nativeName: 'English', code: 'EN' },
  { locale: 'ko', flag: '🇰🇷', nativeName: '한국어', code: 'KO' },
  { locale: 'es', flag: '🇲🇽', nativeName: 'Español', code: 'ES' },
  { locale: 'hi', flag: '🇮🇳', nativeName: 'हिन्दी', code: 'HI' },
];
