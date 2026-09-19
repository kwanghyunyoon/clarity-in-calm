import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DataKeySpec } from '@/lib/data-keys';
import { toLocalDateStr } from '@/lib/date-utils';
import { PatternConcern, PatternNoticeRecord } from '@/lib/crisis-detection';
import { mergeEmotionLogsIntoEntries } from '@/lib/migrate-emotion-logs';
import { secureRead } from '@/lib/secure-storage';
import { usePersistedState } from '@/lib/use-persisted-state';
import { EmotionLog, JournalEntry, MoodValue } from '@/types';

// Re-export for backward compat
export type { MoodValue, JournalEntry };

type EmotionEntryExtras = Partial<Pick<JournalEntry,
  | 'templateId' | 'tags' | 'title' | 'isFutureSelf' | 'unlockAt'
  | 'emotionId' | 'emotionLabel' | 'primaryEmotion' | 'contextTags' | 'bodyRegions' | 'copingActions'
>>;

interface WellnessContextType {
  entries: JournalEntry[];
  addEntry: (mood: MoodValue, note: string, extras?: EmotionEntryExtras) => void;
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  customTags: string[];
  addCustomTag: (tag: string) => void;
  todayMood: MoodValue | null;
  breathingSessions: number;
  addBreathingSession: () => void;
  entriesThisMonth: number;
  isLoaded: boolean;
  saveError: boolean;
  clearSaveError: () => void;
  reload: () => Promise<void>;
  lastPatternNotice: PatternNoticeRecord | null;
  recordPatternNotice: (concern: PatternConcern) => void;
}

const WellnessContext = createContext<WellnessContextType | null>(null);

const STORAGE_KEY_ENTRIES  = 'wellness_entries_v2';
const STORAGE_KEY_ENTRIES_LEGACY = 'wellness_entries_v1';
const STORAGE_KEY_SESSIONS = 'wellness_sessions_v1';
const STORAGE_KEY_TAGS     = 'wellness_custom_tags_v1';
const STORAGE_KEY_PATTERN_NOTICE = 'wellness_pattern_notice_v1';
// Retired as a write target by #70 — EmotionProvider/addEmotionLog is gone,
// the Emotions tab now writes through addEntry below. Read-only from here on:
// once to merge any not-yet-migrated logs into `entries`, and kept in
// WELLNESS_DATA_KEYS purely so backup/export-all and delete-all still cover
// whatever's left at this key on devices that already had EmotionLog data.
const STORAGE_KEY_EMOTION_LOGS_LEGACY = 'wellness_emotions_v1';

export const WELLNESS_DATA_KEYS: DataKeySpec[] = [
  STORAGE_KEY_ENTRIES,
  STORAGE_KEY_ENTRIES_LEGACY,
  STORAGE_KEY_SESSIONS,
  STORAGE_KEY_TAGS,
  STORAGE_KEY_PATTERN_NOTICE,
  STORAGE_KEY_EMOTION_LOGS_LEGACY,
].map(key => ({ key, backend: 'secure' }));

/** Counts journal entries in a raw data-registry dump (e.g. a decrypted
 * backup payload), preferring v2 with the same v1 fallback used on load. */
export function countEntriesInBackup(data: Record<string, unknown>): number {
  const entries = (data[STORAGE_KEY_ENTRIES] as unknown[] | undefined) ?? (data[STORAGE_KEY_ENTRIES_LEGACY] as unknown[] | undefined);
  return entries?.length ?? 0;
}

/** Neutral, non-punishing engagement stat: entries logged in the current
 * calendar month. Deliberately not a "streak" — journaling.pdf warns that
 * consecutive-day mechanics import guilt-inducing gamification into what
 * should be a low-pressure activity. */
export function countEntriesThisMonth(entries: JournalEntry[]): number {
  const now = new Date();
  return entries.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
}

export function WellnessProvider({ children }: { children: React.ReactNode }) {
  const [saveError, setSaveError] = useState(false);
  const onSaveResult = useCallback((ok: boolean) => { if (!ok) setSaveError(true); }, []);

  // Prefer v2; fall back to legacy v1 on first upgrade
  const [entries, setEntries, entriesLoaded, reloadEntries] = usePersistedState<JournalEntry[]>(
    STORAGE_KEY_ENTRIES, [], { legacyKey: STORAGE_KEY_ENTRIES_LEGACY, onSaveResult },
  );
  const [breathingSessions, setBreathingSessions, sessionsLoaded, reloadSessions] = usePersistedState<number>(
    STORAGE_KEY_SESSIONS, 0, { onSaveResult },
  );
  const [customTags, setCustomTags, tagsLoaded, reloadTags] = usePersistedState<string[]>(STORAGE_KEY_TAGS, []);
  const [lastPatternNotice, setLastPatternNotice, patternNoticeLoaded, reloadPatternNotice] =
    usePersistedState<PatternNoticeRecord | null>(STORAGE_KEY_PATTERN_NOTICE, null, { onSaveResult });

  const isLoaded = entriesLoaded && sessionsLoaded && tagsLoaded && patternNoticeLoaded;

  // One-time cutover (#70): fold any not-yet-migrated EmotionLog records into
  // `entries`. mergeEmotionLogsIntoEntries dedupes by id, so this is safe to
  // re-run — it's a no-op once every legacy log has been merged.
  const migrateEmotionLogs = useCallback(async () => {
    const legacyLogs = await secureRead<EmotionLog[]>(STORAGE_KEY_EMOTION_LOGS_LEGACY);
    if (!legacyLogs || legacyLogs.length === 0) return;
    setEntries(prev => mergeEmotionLogsIntoEntries(prev, legacyLogs));
  }, [setEntries]);

  const hasMigratedRef = useRef(false);
  useEffect(() => {
    if (!entriesLoaded || hasMigratedRef.current) return;
    hasMigratedRef.current = true;
    migrateEmotionLogs().catch(() => {});
  }, [entriesLoaded, migrateEmotionLogs]);

  const reload = useCallback(async () => {
    await Promise.all([reloadEntries(), reloadSessions(), reloadTags(), reloadPatternNotice()]);
    // A restore can bring in EmotionLog data unmerged relative to a
    // pre-#70 backup — re-check on every reload, not just first mount.
    await migrateEmotionLogs();
  }, [reloadEntries, reloadSessions, reloadTags, reloadPatternNotice, migrateEmotionLogs]);

  const recordPatternNotice = useCallback((concern: PatternConcern) => {
    if (!isLoaded) return;
    setLastPatternNotice({ ...concern, shownAt: new Date().toISOString() });
  }, [isLoaded, setLastPatternNotice]);

  const addEntry = useCallback((
    mood: MoodValue,
    note: string,
    extras?: EmotionEntryExtras,
  ) => {
    if (!isLoaded) return;
    setEntries(prev => [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: new Date().toISOString(),
      mood,
      note,
      ...extras,
    }, ...prev]);
  }, [isLoaded, setEntries]);

  const updateEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    if (!isLoaded) return;
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  }, [isLoaded, setEntries]);

  const deleteEntry = useCallback((id: string) => {
    if (!isLoaded) return;
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [isLoaded, setEntries]);

  const addCustomTag = useCallback((tag: string) => {
    const t = tag.trim().toLowerCase();
    if (!t) return;
    setCustomTags(prev => prev.includes(t) ? prev : [...prev, t]);
  }, [setCustomTags]);

  const addBreathingSession = useCallback(() => {
    if (!isLoaded) return;
    setBreathingSessions(prev => prev + 1);
  }, [isLoaded, setBreathingSessions]);

  const clearSaveError = useCallback(() => setSaveError(false), []);

  const todayMood: MoodValue | null = (() => {
    const raw = entries.find(e => toLocalDateStr(new Date(e.date)) === toLocalDateStr(new Date()))?.mood;
    return raw !== undefined && raw >= 1 && raw <= 5 ? (raw as MoodValue) : null;
  })();

  const entriesThisMonth = countEntriesThisMonth(entries);

  return (
    <WellnessContext.Provider value={{
      entries, addEntry, updateEntry, deleteEntry,
      customTags, addCustomTag,
      todayMood, breathingSessions, addBreathingSession,
      entriesThisMonth, isLoaded, saveError, clearSaveError, reload,
      lastPatternNotice, recordPatternNotice,
    }}>
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness(): WellnessContextType {
  const ctx = useContext(WellnessContext);
  if (!ctx) throw new Error('useWellness must be used inside <WellnessProvider>');
  return ctx;
}
