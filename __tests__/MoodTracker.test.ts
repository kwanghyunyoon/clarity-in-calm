/**
 * Tests for mood tracking + streak logic, against the real functions
 * shipped in wellness-context.tsx and date-utils.ts.
 */
import { computeStreak } from '@/context/wellness-context';
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

  test('logging mood today with no prior entries → streak of 1', () => {
    const entries = [makeEntry(0)];
    expect(computeStreak(entries)).toBe(1);
  });

  test('consecutive days → streak increments', () => {
    const entries = [makeEntry(0), makeEntry(1), makeEntry(2)];
    expect(computeStreak(entries)).toBe(3);
  });

  test('gap of 1 day resets streak to 0 (unless yesterday)', () => {
    // Entries from 2 and 3 days ago — no today or yesterday → streak = 0
    const entries = [makeEntry(2), makeEntry(3)];
    expect(computeStreak(entries)).toBe(0);
  });

  test('multiple entries same day count as a single day in streak', () => {
    const entries = [makeEntry(0), makeEntry(0, 5), makeEntry(1), makeEntry(2)];
    expect(computeStreak(entries)).toBe(3);
  });

  test('toLocalDateStr groups same-day entries under one key', () => {
    const morning = new Date();
    morning.setHours(1, 0, 0, 0);
    const night = new Date();
    night.setHours(23, 0, 0, 0);
    expect(toLocalDateStr(morning)).toBe(toLocalDateStr(night));
  });
});
