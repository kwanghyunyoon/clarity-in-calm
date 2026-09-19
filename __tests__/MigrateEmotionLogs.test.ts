/**
 * Tests for the EmotionLog -> unified JournalEntry mapping designed in
 * issue #66. Pure logic only — no wiring into WellnessProvider/EmotionProvider
 * yet; see src/lib/migrate-emotion-logs.ts for scope notes.
 */
import { mapEmotionLogToEntry, mergeEmotionLogsIntoEntries } from '@/lib/migrate-emotion-logs';
import type { EmotionLog, JournalEntry } from '@/types';

function makeLog(overrides: Partial<EmotionLog> = {}): EmotionLog {
  return {
    id: 'log-1',
    date: '2026-01-01T12:00:00.000Z',
    emotionId: 'anger',
    emotionLabel: 'Anger',
    primaryEmotion: 'anger',
    intensity: 6,
    contextTags: ['work'],
    bodyRegions: ['chest'],
    copingActions: ['breathing'],
    ...overrides,
  };
}

describe('mapEmotionLogToEntry', () => {
  test('carries over identity and catalog fields as-is', () => {
    const entry = mapEmotionLogToEntry(makeLog());
    expect(entry.id).toBe('log-1');
    expect(entry.date).toBe('2026-01-01T12:00:00.000Z');
    expect(entry.emotionId).toBe('anger');
    expect(entry.emotionLabel).toBe('Anger');
    expect(entry.primaryEmotion).toBe('anger');
    expect(entry.contextTags).toEqual(['work']);
    expect(entry.bodyRegions).toEqual(['chest']);
    expect(entry.copingActions).toEqual(['breathing']);
  });

  test.each([
    [1, 1], [2, 1],
    [3, 2], [4, 2],
    [5, 3], [6, 3],
    [7, 4], [8, 4],
    [9, 5], [10, 5],
  ])('maps intensity %i to mood %i via ceil(intensity / 2), per #64 resolution', (intensity, mood) => {
    expect(mapEmotionLogToEntry(makeLog({ intensity })).mood).toBe(mood);
  });

  test('defaults note to an empty string when the log has none', () => {
    expect(mapEmotionLogToEntry(makeLog({ note: undefined })).note).toBe('');
  });

  test('carries over note when present', () => {
    expect(mapEmotionLogToEntry(makeLog({ note: 'felt tense' })).note).toBe('felt tense');
  });

  test('leaves fields with no EmotionLog equivalent undefined rather than fabricating defaults', () => {
    const entry = mapEmotionLogToEntry(makeLog());
    expect(entry.copingHelped).toBeUndefined();
    expect(entry.sleepHours).toBeUndefined();
    expect(entry.sleepQuality).toBeUndefined();
    expect(entry.isPositiveEvent).toBeUndefined();
    expect(entry.templateId).toBeUndefined();
    expect(entry.tags).toBeUndefined();
    expect(entry.title).toBeUndefined();
    expect(entry.isFutureSelf).toBeUndefined();
    expect(entry.unlockAt).toBeUndefined();
  });
});

describe('mergeEmotionLogsIntoEntries', () => {
  test('appends mapped logs to the existing entries', () => {
    const entries: JournalEntry[] = [
      { id: 'e-1', date: '2026-01-02T00:00:00.000Z', mood: 4, note: 'ok day' },
    ];
    const merged = mergeEmotionLogsIntoEntries(entries, [makeLog()]);
    expect(merged).toHaveLength(2);
    expect(merged.find(e => e.id === 'log-1')).toBeDefined();
    expect(merged.find(e => e.id === 'e-1')).toBeDefined();
  });

  test('sorts the merged result by date, newest first', () => {
    const entries: JournalEntry[] = [
      { id: 'e-old', date: '2025-12-01T00:00:00.000Z', mood: 3, note: '' },
    ];
    const logs = [
      makeLog({ id: 'log-mid', date: '2026-01-01T00:00:00.000Z' }),
      makeLog({ id: 'log-newest', date: '2026-02-01T00:00:00.000Z' }),
    ];
    const merged = mergeEmotionLogsIntoEntries(entries, logs);
    expect(merged.map(e => e.id)).toEqual(['log-newest', 'log-mid', 'e-old']);
  });

  test('is idempotent: re-running the merge does not duplicate already-migrated logs', () => {
    const entries: JournalEntry[] = [];
    const logs = [makeLog()];
    const firstPass = mergeEmotionLogsIntoEntries(entries, logs);
    const secondPass = mergeEmotionLogsIntoEntries(firstPass, logs);
    expect(secondPass).toHaveLength(1);
  });

  test('returns entries unchanged when there are no emotion logs to merge', () => {
    const entries: JournalEntry[] = [
      { id: 'e-1', date: '2026-01-02T00:00:00.000Z', mood: 4, note: 'ok day' },
    ];
    expect(mergeEmotionLogsIntoEntries(entries, [])).toEqual(entries);
  });
});
