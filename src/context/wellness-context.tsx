import React, { createContext, useCallback, useContext, useState } from 'react';
import { DataKeySpec } from '@/lib/data-keys';
import { toLocalDateStr } from '@/lib/date-utils';
import { usePersistedState } from '@/lib/use-persisted-state';
import { JournalEntry, MoodValue } from '@/types';

// Re-export for backward compat
export type { MoodValue, JournalEntry };

interface WellnessContextType {
  entries: JournalEntry[];
  addEntry: (mood: MoodValue, note: string, extras?: Partial<Pick<JournalEntry, 'templateId' | 'tags' | 'title' | 'isFutureSelf' | 'unlockAt'>>) => void;
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
}

const WellnessContext = createContext<WellnessContextType | null>(null);

const STORAGE_KEY_ENTRIES  = 'wellness_entries_v2';
const STORAGE_KEY_ENTRIES_LEGACY = 'wellness_entries_v1';
const STORAGE_KEY_SESSIONS = 'wellness_sessions_v1';
const STORAGE_KEY_TAGS     = 'wellness_custom_tags_v1';

export const WELLNESS_DATA_KEYS: DataKeySpec[] = [
  STORAGE_KEY_ENTRIES,
  STORAGE_KEY_ENTRIES_LEGACY,
  STORAGE_KEY_SESSIONS,
  STORAGE_KEY_TAGS,
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

  const isLoaded = entriesLoaded && sessionsLoaded && tagsLoaded;

  const reload = useCallback(async () => {
    await Promise.all([reloadEntries(), reloadSessions(), reloadTags()]);
  }, [reloadEntries, reloadSessions, reloadTags]);

  const addEntry = useCallback((
    mood: MoodValue,
    note: string,
    extras?: Partial<Pick<JournalEntry, 'templateId' | 'tags' | 'title' | 'isFutureSelf' | 'unlockAt'>>,
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
