import { BASIC_EMOTIONS_BY_ID } from '@/constants/emotions';
import { toLocalDateStr } from '@/lib/date-utils';
import type { EmotionLog, JournalEntry } from '@/types';

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

export function computeAvgIntensity(emotionLogs: EmotionLog[]): number {
  if (emotionLogs.length === 0) return 0;
  return emotionLogs.reduce((sum, e) => sum + e.intensity, 0) / emotionLogs.length;
}

export function computeTopEmotion(emotionLogs: EmotionLog[], fallbackColor: string): TopEmotion | null {
  const counts: Record<string, TopEmotion> = {};
  emotionLogs.forEach(log => {
    const color = BASIC_EMOTIONS_BY_ID[log.emotionId]?.color ?? fallbackColor;
    if (!counts[log.emotionId]) counts[log.emotionId] = { count: 0, label: log.emotionLabel, color };
    counts[log.emotionId].count++;
  });
  return Object.values(counts).sort((a, b) => b.count - a.count)[0] ?? null;
}

export function computeTriggerCounts(emotionLogs: EmotionLog[], limit = 6): [string, number][] {
  const counts: Record<string, number> = {};
  emotionLogs.forEach(log => {
    log.contextTags.forEach(tag => { counts[tag] = (counts[tag] ?? 0) + 1; });
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export function computeTimeOfDay(emotionLogs: EmotionLog[]): TimeOfDayBuckets {
  const buckets: TimeOfDayBuckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  emotionLogs.forEach(log => {
    const h = new Date(log.date).getHours();
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
