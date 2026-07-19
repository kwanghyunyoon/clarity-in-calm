/**
 * Tests for the crisis-detection logic shipped in src/lib/crisis-detection.ts
 * and used by journal.tsx to gate the crisis-support modal. No React Native
 * rendering required — pure logic only.
 */
import { checkCrisis } from '@/lib/crisis-detection';
import { TRANSLATIONS, type Locale } from '@/i18n/translations';

describe('checkCrisis', () => {
  const enKeywords = TRANSLATIONS.en.journal.crisisKeywords;

  test('flags text containing a crisis keyword', () => {
    expect(checkCrisis('I want to end my life', enKeywords)).toBe(true);
  });

  test('is case-insensitive on the input text', () => {
    expect(checkCrisis('I WANT TO DIE today', enKeywords)).toBe(true);
  });

  test('matches a keyword phrase embedded in a longer sentence', () => {
    expect(checkCrisis('lately I feel like better off dead most days', enKeywords)).toBe(true);
  });

  test('does not flag ordinary journal text', () => {
    expect(checkCrisis('Had a good day at work, feeling grateful.', enKeywords)).toBe(false);
  });

  test('does not flag empty text', () => {
    expect(checkCrisis('', enKeywords)).toBe(false);
  });

  const LOCALES: Locale[] = ['en', 'ko', 'es', 'hi'];

  test.each(LOCALES)('detects a real %s suicidalIdeation phrase', (locale) => {
    const keywords = TRANSLATIONS[locale].journal.crisisKeywords;
    const [firstPhrase] = keywords.suicidalIdeation;
    expect(checkCrisis(firstPhrase, keywords)).toBe(true);
  });
});
