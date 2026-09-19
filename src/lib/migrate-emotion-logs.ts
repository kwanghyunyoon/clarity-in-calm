import type { EmotionLog, JournalEntry } from '@/types';

/**
 * Field mapping decided in issue #66 (blocked by / extends #64's unified
 * entry model). Maps a legacy EmotionLog record onto the unified JournalEntry
 * shape. Fields with no EmotionLog equivalent (copingHelped, sleep*,
 * isPositiveEvent, templateId, tags, title, isFutureSelf, unlockAt) are left
 * undefined rather than defaulted to a fabricated value — there is no
 * historical signal to derive them from.
 *
 * `id` is reused as-is from the EmotionLog so merges are idempotent
 * (re-running mergeEmotionLogsIntoEntries against the same logs never
 * produces duplicate entries).
 */
export function mapEmotionLogToEntry(log: EmotionLog): JournalEntry {
  return {
    id: log.id,
    date: log.date,
    mood: Math.ceil(log.intensity / 2) as JournalEntry['mood'],
    note: log.note ?? '',
    emotionId: log.emotionId,
    emotionLabel: log.emotionLabel,
    primaryEmotion: log.primaryEmotion,
    contextTags: log.contextTags,
    bodyRegions: log.bodyRegions,
    copingActions: log.copingActions,
  };
}

/**
 * Merges legacy EmotionLog records into an existing JournalEntry array,
 * skipping any log whose id has already been migrated. Wired into
 * WellnessProvider's one-time cutover effect as of #70.
 */
export function mergeEmotionLogsIntoEntries(entries: JournalEntry[], emotionLogs: EmotionLog[]): JournalEntry[] {
  if (emotionLogs.length === 0) return entries;
  const existingIds = new Set(entries.map(e => e.id));
  const mapped = emotionLogs.filter(log => !existingIds.has(log.id)).map(mapEmotionLogToEntry);
  return [...entries, ...mapped].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
