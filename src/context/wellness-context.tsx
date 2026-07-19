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
  streak: number;
  isLoaded: boolean;
  saveError: boolean;
  clearSaveError: () => void;
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

export function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;
  const uniqueDays = [...new Set(entries.map(e => toLocalDateStr(new Date(e.date))))].sort((a, b) => (a < b ? 1 : -1));
  const today = toLocalDateStr(new Date());
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const yesterday = toLocalDateStr(yd);
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;
  let count = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays === 1) { count++; } else { break; }
  }
  return count;
}

export function WellnessProvider({ children }: { children: React.ReactNode }) {
  const [saveError, setSaveError] = useState(false);
  const onSaveResult = useCallback((ok: boolean) => { if (!ok) setSaveError(true); }, []);

  // Prefer v2; fall back to legacy v1 on first upgrade
  const [entries, setEntries, entriesLoaded] = usePersistedState<JournalEntry[]>(
    STORAGE_KEY_ENTRIES, [], { legacyKey: STORAGE_KEY_ENTRIES_LEGACY, onSaveResult },
  );
  const [breathingSessions, setBreathingSessions, sessionsLoaded] = usePersistedState<number>(
    STORAGE_KEY_SESSIONS, 0, { onSaveResult },
  );
  const [customTags, setCustomTags, tagsLoaded] = usePersistedState<string[]>(STORAGE_KEY_TAGS, []);

  const isLoaded = entriesLoaded && sessionsLoaded && tagsLoaded;

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

  const streak = computeStreak(entries);

  return (
    <WellnessContext.Provider value={{
      entries, addEntry, updateEntry, deleteEntry,
      customTags, addCustomTag,
      todayMood, breathingSessions, addBreathingSession,
      streak, isLoaded, saveError, clearSaveError,
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
