/**
 * Tests for the insights-analytics logic shipped in src/lib/insights-analytics.ts
 * and used by insights.tsx. No React Native rendering required — pure logic only.
 */
import {
  computeAvgIntensity,
  computeDayMoods,
  computeMoodDistribution,
  computeTimeOfDay,
  computeTopEmotion,
  computeTriggerCounts,
  getLast7Days,
} from '@/lib/insights-analytics';
import type { EmotionLog, JournalEntry } from '@/types';

function makeEntry(partial: Partial<JournalEntry> & { date: string; mood: JournalEntry['mood'] }): JournalEntry {
  return { id: `${Math.random()}`, note: '', ...partial };
}

function makeLog(partial: Partial<EmotionLog> & { date: string; emotionId: string }): EmotionLog {
  return {
    id: `${Math.random()}`,
    emotionLabel: partial.emotionId,
    primaryEmotion: partial.emotionId,
    intensity: 5,
    contextTags: [],
    bodyRegions: [],
    copingActions: [],
    ...partial,
  };
}

describe('getLast7Days', () => {
  test('returns 7 consecutive local-date strings ending today', () => {
    const today = new Date(2026, 6, 19); // 2026-07-19
    const days = getLast7Days(today);
    expect(days).toEqual([
      '2026-07-13', '2026-07-14', '2026-07-15', '2026-07-16',
      '2026-07-17', '2026-07-18', '2026-07-19',
    ]);
  });
});

describe('computeAvgIntensity', () => {
  test('averages intensity across logs', () => {
    const logs = [makeLog({ date: '2026-07-19', emotionId: 'fear', intensity: 4 }),
      makeLog({ date: '2026-07-19', emotionId: 'anger', intensity: 8 })];
    expect(computeAvgIntensity(logs)).toBe(6);
  });

  test('returns 0 for no logs', () => {
    expect(computeAvgIntensity([])).toBe(0);
  });
});

describe('computeTopEmotion', () => {
  test('picks the most frequently logged emotion', () => {
    const logs = [
      makeLog({ date: '2026-07-19', emotionId: 'sadness' }),
      makeLog({ date: '2026-07-19', emotionId: 'fear' }),
      makeLog({ date: '2026-07-19', emotionId: 'fear' }),
    ];
    expect(computeTopEmotion(logs, '#000')?.label).toBe('fear');
  });

  test('falls back to the given color for an unknown emotionId', () => {
    const logs = [makeLog({ date: '2026-07-19', emotionId: 'unknown-id' })];
    expect(computeTopEmotion(logs, '#123456')?.color).toBe('#123456');
  });

  test('returns null with no logs', () => {
    expect(computeTopEmotion([], '#000')).toBeNull();
  });
});

describe('computeTriggerCounts', () => {
  test('ranks tags by frequency, most common first', () => {
    const logs = [
      makeLog({ date: '2026-07-19', emotionId: 'fear', contextTags: ['work'] }),
      makeLog({ date: '2026-07-19', emotionId: 'anger', contextTags: ['work', 'commuting'] }),
    ];
    expect(computeTriggerCounts(logs)).toEqual([['work', 2], ['commuting', 1]]);
  });

  test('caps results at the given limit', () => {
    const logs = [makeLog({
      date: '2026-07-19', emotionId: 'fear',
      contextTags: ['a', 'b', 'c', 'd'],
    })];
    expect(computeTriggerCounts(logs, 2)).toHaveLength(2);
  });
});

describe('computeTimeOfDay', () => {
  test('buckets logs into morning/afternoon/evening/night', () => {
    const logs = [
      makeLog({ date: '2026-07-19T08:00:00', emotionId: 'fear' }),   // morning
      makeLog({ date: '2026-07-19T14:00:00', emotionId: 'fear' }),   // afternoon
      makeLog({ date: '2026-07-19T19:00:00', emotionId: 'fear' }),   // evening
      makeLog({ date: '2026-07-19T02:00:00', emotionId: 'fear' }),   // night
    ];
    expect(computeTimeOfDay(logs)).toEqual({ morning: 1, afternoon: 1, evening: 1, night: 1 });
  });
});

describe('computeDayMoods', () => {
  test('averages same-day entries and returns null for days with none', () => {
    const days = ['2026-07-18', '2026-07-19'];
    const entries = [
      makeEntry({ date: '2026-07-19T09:00:00', mood: 2 }),
      makeEntry({ date: '2026-07-19T20:00:00', mood: 4 }),
    ];
    expect(computeDayMoods(entries, days)).toEqual([null, 3]);
  });
});

describe('computeMoodDistribution', () => {
  test('counts entries per mood value and scales pct to the max bucket', () => {
    const entries = [
      makeEntry({ date: '2026-07-19', mood: 1 }),
      makeEntry({ date: '2026-07-19', mood: 1 }),
      makeEntry({ date: '2026-07-19', mood: 5 }),
    ];
    expect(computeMoodDistribution(entries)).toEqual([
      { count: 2, pct: 1 },
      { count: 0, pct: 0 },
      { count: 0, pct: 0 },
      { count: 0, pct: 0 },
      { count: 1, pct: 0.5 },
    ]);
  });

  test('all buckets zero when there are no entries', () => {
    expect(computeMoodDistribution([])).toEqual([
      { count: 0, pct: 0 }, { count: 0, pct: 0 }, { count: 0, pct: 0 },
      { count: 0, pct: 0 }, { count: 0, pct: 0 },
    ]);
  });
});
