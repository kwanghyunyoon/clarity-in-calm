/**
 * Tests for the crisis-detection logic shipped in src/lib/crisis-detection.ts
 * and used by journal.tsx to gate the crisis-support modal. No React Native
 * rendering required — pure logic only.
 */
import { checkCrisis, checkTrauma, detectConcern } from '@/lib/crisis-detection';
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

describe('checkTrauma', () => {
  const enKeywords = TRANSLATIONS.en.journal.traumaKeywords;

  test('flags text containing a trauma-symptom keyword', () => {
    expect(checkTrauma('I had a flashback today', enKeywords)).toBe(true);
  });

  test('is case-insensitive on the input text', () => {
    expect(checkTrauma('I keep DISSOCIATING at work', enKeywords)).toBe(true);
  });

  test('does not flag ordinary journal text', () => {
    expect(checkTrauma('Had a good day at work, feeling grateful.', enKeywords)).toBe(false);
  });

  test('does not flag empty text', () => {
    expect(checkTrauma('', enKeywords)).toBe(false);
  });

  const LOCALES: Locale[] = ['en', 'ko', 'es', 'hi'];

  test.each(LOCALES)('detects a real %s traumaSymptoms phrase', (locale) => {
    const keywords = TRANSLATIONS[locale].journal.traumaKeywords;
    const [firstPhrase] = keywords.traumaSymptoms;
    expect(checkTrauma(firstPhrase, keywords)).toBe(true);
  });
});

describe('detectConcern', () => {
  const crisisKeywords = TRANSLATIONS.en.journal.crisisKeywords;
  const traumaKeywords = TRANSLATIONS.en.journal.traumaKeywords;

  test('returns "crisis" when crisis keywords match', () => {
    expect(detectConcern('I want to end my life', crisisKeywords, traumaKeywords)).toBe('crisis');
  });

  test('returns "trauma" when only trauma keywords match', () => {
    expect(detectConcern('I had a flashback today', crisisKeywords, traumaKeywords)).toBe('trauma');
  });

  test('prioritizes "crisis" when both crisis and trauma keywords match', () => {
    expect(detectConcern('I had a flashback and want to end my life', crisisKeywords, traumaKeywords)).toBe('crisis');
  });

  test('returns null when nothing matches', () => {
    expect(detectConcern('Had a good day at work, feeling grateful.', crisisKeywords, traumaKeywords)).toBeNull();
  });
});
