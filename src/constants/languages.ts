import { type Locale } from '@/i18n/translations';

export interface LanguageOption {
  locale: Locale;
  flag: string;
  /** Language name written in that language itself, not translated. */
  nativeName: string;
}

export const LANGUAGES: readonly LanguageOption[] = [
  { locale: 'en', flag: '🇺🇸', nativeName: 'English' },
  { locale: 'ko', flag: '🇰🇷', nativeName: '한국어' },
  { locale: 'es', flag: '🇲🇽', nativeName: 'Español' },
  { locale: 'hi', flag: '🇮🇳', nativeName: 'हिन्दी' },
];
