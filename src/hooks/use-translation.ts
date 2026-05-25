/**
 * useTranslation — returns the translation object for the active locale.
 * The locale comes from LanguageContext (auto-detected + manually overridable).
 *
 * Usage:
 *   const t = useTranslation();
 *   <Text>{t.home.greeting.morning}</Text>
 */

import { useLocale } from '@/context/language-context';
import { TRANSLATIONS } from '@/i18n/translations';

export function useTranslation() {
  const { locale } = useLocale();
  return TRANSLATIONS[locale];
}
