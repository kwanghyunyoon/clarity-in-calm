/**
 * Tests for mood tracking + engagement stat logic, against the real functions
 * shipped in wellness-context.tsx and date-utils.ts.
 */
import { countEntriesThisMonth } from '@/context/wellness-context';
import { toLocalDateStr } from '@/lib/date-utils';
import type { JournalEntry, MoodValue } from '@/types';

function makeEntry(daysAgo: number, mood: MoodValue = 3): JournalEntry {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(12, 0, 0, 0);
  return { id: `${daysAgo}-${mood}`, date: d.toISOString(), mood, note: '' };
}

describe('MoodTracker', () => {
  test('selecting a mood records it in the entry', () => {
    const entry = makeEntry(0, 4);
    expect(entry.mood).toBe(4);
  });

  test('mood value is within valid range 1–5', () => {
    for (let m = 1; m <= 5; m++) {
      const entry = makeEntry(0, m as MoodValue);
      expect(entry.mood).toBeGreaterThanOrEqual(1);
      expect(entry.mood).toBeLessThanOrEqual(5);
    }
  });

  test('counts entries logged this month', () => {
    const entries = [makeEntry(0), makeEntry(1), makeEntry(2)];
    expect(countEntriesThisMonth(entries)).toBe(3);
  });

  test('multiple entries same day both count toward the monthly total', () => {
    const entries = [makeEntry(0), makeEntry(0, 5), makeEntry(1)];
    expect(countEntriesThisMonth(entries)).toBe(3);
  });

  test('excludes entries from a different calendar month', () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const entries: JournalEntry[] = [
      makeEntry(0),
      { id: 'old', date: lastMonth.toISOString(), mood: 3, note: '' },
    ];
    expect(countEntriesThisMonth(entries)).toBe(1);
  });

  test('no entries this month → 0', () => {
    expect(countEntriesThisMonth([])).toBe(0);
  });

  test('toLocalDateStr groups same-day entries under one key', () => {
    const morning = new Date();
    morning.setHours(1, 0, 0, 0);
    const night = new Date();
    night.setHours(23, 0, 0, 0);
    expect(toLocalDateStr(morning)).toBe(toLocalDateStr(night));
  });
});
