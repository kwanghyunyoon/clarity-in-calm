/**
 * Tests for the crisis-detection logic shipped in src/lib/crisis-detection.ts
 * and used by journal.tsx to gate the crisis-support modal. No React Native
 * rendering required — pure logic only.
 */
import { checkCrisis, checkTrauma, detectConcern, detectPattern, shouldShowPatternNotice } from '@/lib/crisis-detection';
import { TRANSLATIONS, type Locale } from '@/i18n/translations';
import type { JournalEntry } from '@/types';

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

describe('detectPattern', () => {
  const crisisKeywords = TRANSLATIONS.en.journal.crisisKeywords;
  const traumaKeywords = TRANSLATIONS.en.journal.traumaKeywords;
  const now = new Date('2026-09-19T12:00:00Z');

  function daysAgoIso(days: number): string {
    return new Date(now.getTime() - days * 86400000).toISOString();
  }

  let nextId = 0;
  function entry(overrides: Partial<JournalEntry> & { note: string; date: string }): JournalEntry {
    return {
      id: `e${nextId++}`,
      mood: 3,
      ...overrides,
    };
  }

  test('flags recurring urges: 3+ crisis-keyword entries within 14 days', () => {
    const entries = [
      entry({ note: 'I want to end my life', date: daysAgoIso(1) }),
      entry({ note: 'still thinking about suicide', date: daysAgoIso(5) }),
      entry({ note: 'kill myself keeps coming to mind', date: daysAgoIso(10) }),
    ];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toEqual({ type: 'recurringUrges' });
  });

  test('does not flag recurring urges below the threshold', () => {
    const entries = [
      entry({ note: 'I want to end my life', date: daysAgoIso(1) }),
      entry({ note: 'still thinking about suicide', date: daysAgoIso(5) }),
    ];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toBeNull();
  });

  test('does not flag recurring urges outside the 14-day window', () => {
    const entries = [
      entry({ note: 'I want to end my life', date: daysAgoIso(1) }),
      entry({ note: 'still thinking about suicide', date: daysAgoIso(5) }),
      // Older than both the 14-day urge window and the 28-day trend window.
      entry({ note: 'kill myself keeps coming to mind', date: daysAgoIso(40) }),
    ];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toBeNull();
  });

  test('flags a consistent trigger tag across concern-flagged entries', () => {
    const entries = [
      entry({ note: 'I had a flashback after seeing my ex', date: daysAgoIso(1), contextTags: ['relationship'] }),
      entry({ note: 'dissociating again after talking to my ex', date: daysAgoIso(6), contextTags: ['relationship'] }),
      entry({ note: 'derealization hit after my ex texted', date: daysAgoIso(12), contextTags: ['relationship'] }),
    ];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toEqual({ type: 'consistentTrigger', tag: 'relationship' });
  });

  test('does not flag a trigger tag that only recurs on unflagged entries', () => {
    const entries = [
      entry({ note: 'good day at work', date: daysAgoIso(1), contextTags: ['work'] }),
      entry({ note: 'fine day at work', date: daysAgoIso(2), contextTags: ['work'] }),
      entry({ note: 'ok day at work', date: daysAgoIso(3), contextTags: ['work'] }),
    ];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toBeNull();
  });

  test('flags a worsening trend when concern-flagged entries rise in frequency', () => {
    const entries = [
      entry({ note: 'I had a flashback', date: daysAgoIso(1) }),
      entry({ note: 'dissociating badly', date: daysAgoIso(8) }),
      entry({ note: 'a flashback again', date: daysAgoIso(20) }),
    ];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toEqual({ type: 'worseningTrend' });
  });

  test('does not flag a trend that is flat or improving', () => {
    const entries = [
      entry({ note: 'a flashback today', date: daysAgoIso(1) }),
      entry({ note: 'a flashback again', date: daysAgoIso(20) }),
      entry({ note: 'another flashback', date: daysAgoIso(22) }),
    ];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toBeNull();
  });

  test('returns null when nothing matches', () => {
    const entries = [entry({ note: 'Had a good day.', date: daysAgoIso(1) })];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toBeNull();
  });

  test('prioritizes recurring urges over a consistent trigger when both match', () => {
    const entries = [
      entry({ note: 'I want to end my life', date: daysAgoIso(1), contextTags: ['relationship'] }),
      entry({ note: 'still thinking about suicide', date: daysAgoIso(5), contextTags: ['relationship'] }),
      entry({ note: 'kill myself keeps coming to mind', date: daysAgoIso(10), contextTags: ['relationship'] }),
    ];
    expect(detectPattern(entries, now, crisisKeywords, traumaKeywords)).toEqual({ type: 'recurringUrges' });
  });
});

describe('shouldShowPatternNotice', () => {
  const now = new Date('2026-09-19T12:00:00Z');

  test('shows when no notice has been shown before', () => {
    expect(shouldShowPatternNotice({ type: 'recurringUrges' }, null, now)).toBe(true);
  });

  test('suppresses a repeat of the same pattern within the window', () => {
    const last = { type: 'recurringUrges' as const, shownAt: new Date(now.getTime() - 3 * 86400000).toISOString() };
    expect(shouldShowPatternNotice({ type: 'recurringUrges' }, last, now)).toBe(false);
  });

  test('shows again once the window has rolled over', () => {
    const last = { type: 'recurringUrges' as const, shownAt: new Date(now.getTime() - 15 * 86400000).toISOString() };
    expect(shouldShowPatternNotice({ type: 'recurringUrges' }, last, now)).toBe(true);
  });

  test('shows a genuinely new pattern even inside the previous window', () => {
    const last = { type: 'recurringUrges' as const, shownAt: new Date(now.getTime() - 3 * 86400000).toISOString() };
    expect(shouldShowPatternNotice({ type: 'consistentTrigger', tag: 'relationship' }, last, now)).toBe(true);
  });

  test('shows a new trigger tag even inside the previous window', () => {
    const last = { type: 'consistentTrigger' as const, tag: 'work', shownAt: new Date(now.getTime() - 3 * 86400000).toISOString() };
    expect(shouldShowPatternNotice({ type: 'consistentTrigger', tag: 'relationship' }, last, now)).toBe(true);
  });
});
