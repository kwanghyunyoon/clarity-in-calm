import { BASIC_EMOTIONS_BY_ID } from '@/constants/emotions';
import { toLocalDateStr } from '@/lib/date-utils';
import type { JournalEntry } from '@/types';

export interface TopEmotion {
  count: number;
  label: string;
  color: string;
}

export interface TimeOfDayBuckets {
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
}

export interface MoodDistBucket {
  count: number;
  pct: number;
}

export function getLast7Days(today: Date = new Date()): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(toLocalDateStr(d));
  }
  return days;
}

export type EmotionEntry = JournalEntry & { emotionId: string };

/** Entries that came from an emotion check-in (native or migrated from the
 * retired EmotionLog store, per #66/#70) — the only ones with emotion-catalog
 * fields to analyze. Plain journal entries have `emotionId` undefined. */
export function filterEmotionEntries(entries: JournalEntry[]): EmotionEntry[] {
  return entries.filter((e): e is EmotionEntry => e.emotionId !== undefined);
}

/**
 * Average mood (1-5) across emotion check-ins. Pre-#70, this averaged
 * EmotionLog.intensity (1-10). The unified JournalEntry model has no
 * intensity field — #66 mapped intensity to mood via ceil(intensity / 2) and
 * deliberately didn't carry the finer 1-10 value forward, so this stat
 * accepts that coarser scale rather than inventing a field migrated entries
 * can't populate (see #70's resolution).
 */
export function computeAvgMood(entries: JournalEntry[]): number {
  const emotionEntries = filterEmotionEntries(entries);
  if (emotionEntries.length === 0) return 0;
  return emotionEntries.reduce((sum, e) => sum + e.mood, 0) / emotionEntries.length;
}

export function computeTopEmotion(entries: JournalEntry[], fallbackColor: string): TopEmotion | null {
  const counts: Record<string, TopEmotion> = {};
  filterEmotionEntries(entries).forEach(e => {
    const color = BASIC_EMOTIONS_BY_ID[e.emotionId]?.color ?? fallbackColor;
    if (!counts[e.emotionId]) counts[e.emotionId] = { count: 0, label: e.emotionLabel ?? e.emotionId, color };
    counts[e.emotionId].count++;
  });
  return Object.values(counts).sort((a, b) => b.count - a.count)[0] ?? null;
}

export function computeTriggerCounts(entries: JournalEntry[], limit = 6): [string, number][] {
  const counts: Record<string, number> = {};
  filterEmotionEntries(entries).forEach(e => {
    (e.contextTags ?? []).forEach(tag => { counts[tag] = (counts[tag] ?? 0) + 1; });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export function computeTimeOfDay(entries: JournalEntry[]): TimeOfDayBuckets {
  const buckets: TimeOfDayBuckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  filterEmotionEntries(entries).forEach(e => {
    const h = new Date(e.date).getHours();
    if (h >= 6 && h < 12) buckets.morning++;
    else if (h >= 12 && h < 17) buckets.afternoon++;
    else if (h >= 17 && h < 22) buckets.evening++;
    else buckets.night++;
  });
  return buckets;
}

export function computeDayMoods(entries: JournalEntry[], days: string[]): (number | null)[] {
  return days.map(day => {
    const dayEntries = entries.filter(e => toLocalDateStr(new Date(e.date)) === day);
    if (dayEntries.length === 0) return null;
    return dayEntries.reduce((sum, e) => sum + e.mood, 0) / dayEntries.length;
  });
}

export function computeMoodDistribution(entries: JournalEntry[]): MoodDistBucket[] {
  const counts = [0, 0, 0, 0, 0];
  entries.forEach(e => { counts[e.mood - 1]++; });
  const max = Math.max(...counts, 1);
  return counts.map(c => ({ count: c, pct: c / max }));
}
