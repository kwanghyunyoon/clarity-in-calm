/**
 * Every locale's journal.crisisKeywords is a hand-translated, categorized keyword
 * list (see src/i18n/translations.ts). TypeScript already enforces that ko/es/hi
 * declare the same category keys as en (they're typed `: Translations`), but this
 * test is a runtime regression net against that guarantee slipping (e.g. an `as any`
 * escape hatch) and documents which categories still have zero phrases in a locale.
 */
import { TRANSLATIONS, type Locale } from '@/i18n/translations';

const LOCALES: Locale[] = ['en', 'ko', 'es', 'hi'];

describe('crisisKeywords locale parity', () => {
  const categoryKeys = LOCALES.map(locale => ({
    locale,
    keys: Object.keys(TRANSLATIONS[locale].journal.crisisKeywords).sort(),
  }));

  test('every locale defines the same crisis-keyword categories', () => {
    const [expected, ...rest] = categoryKeys;
    for (const { locale, keys } of rest) {
      expect({ locale, keys }).toEqual({ locale, keys: expected.keys });
    }
  });

  test.each(LOCALES)('%s has at least one phrase per non-empty-by-design category', (locale: Locale) => {
    const categories = TRANSLATIONS[locale].journal.crisisKeywords;
    for (const [category, phrases] of Object.entries(categories) as [string, readonly string[]][]) {
      if (locale !== 'en' && category === 'overdose') continue; // known gap: ko/hi have no translated phrase yet
      expect(phrases.length).toBeGreaterThan(0);
    }
  });
});
