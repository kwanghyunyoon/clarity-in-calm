import { computeStreak } from '@/context/wellness-context';
import { JournalEntry, MoodValue } from '@/types';

export interface ClarityAIExportV1 {
  app: 'clarity-in-calm';
  version: 1;
  exportedAt: string;
  moodEntries: { date: string; mood: MoodValue }[];
  streak: number;
  totalEntries: number;
  totalBreathingSessions: number;
  moodDist: Record<'1' | '2' | '3' | '4' | '5', number>;
}

export function buildClarityAIExport(
  entries: JournalEntry[],
  breathingSessions: number,
): ClarityAIExportV1 {
  const moodDist: Record<'1' | '2' | '3' | '4' | '5', number> = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
  };
  for (const entry of entries) {
    moodDist[String(entry.mood) as '1' | '2' | '3' | '4' | '5']++;
  }

  return {
    app: 'clarity-in-calm',
    version: 1,
    exportedAt: new Date().toISOString(),
    moodEntries: entries.map(e => ({ date: e.date, mood: e.mood })),
    streak: computeStreak(entries),
    totalEntries: entries.length,
    totalBreathingSessions: breathingSessions,
    moodDist,
  };
}
