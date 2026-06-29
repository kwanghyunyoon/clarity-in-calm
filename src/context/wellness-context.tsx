import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { secureRead, secureWrite } from '@/lib/secure-storage';
import { JournalEntry, MoodValue } from '@/types';

// Re-export for backward compat
export type { MoodValue, JournalEntry };

interface WellnessContextType {
  entries: JournalEntry[];
  addEntry: (mood: MoodValue, note: string, extras?: Partial<Pick<JournalEntry, 'templateId' | 'tags' | 'title'>>) => void;
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

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function computeStreak(entries: JournalEntry[]): number {
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
  const [entries,           setEntries]           = useState<JournalEntry[]>([]);
  const [breathingSessions, setBreathingSessions]  = useState(0);
  const [customTags,        setCustomTags]         = useState<string[]>([]);
  const [isLoaded,          setIsLoaded]           = useState(false);
  const [saveError,         setSaveError]          = useState(false);

  useEffect(() => {
    async function load() {
      const [savedEntries, legacyEntries, savedSessions, savedTags] = await Promise.all([
        secureRead<JournalEntry[]>(STORAGE_KEY_ENTRIES),
        secureRead<JournalEntry[]>(STORAGE_KEY_ENTRIES_LEGACY),
        secureRead<number>(STORAGE_KEY_SESSIONS),
        secureRead<string[]>(STORAGE_KEY_TAGS),
      ]);
      // Prefer v2; fall back to legacy v1 on first upgrade
      const loaded = savedEntries ?? legacyEntries ?? [];
      setEntries(loaded);
      if (savedSessions) setBreathingSessions(savedSessions);
      if (savedTags) setCustomTags(savedTags);
      setIsLoaded(true);
    }
    load().catch(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY_ENTRIES, entries).then(ok => { if (!ok) setSaveError(true); });
  }, [entries, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY_SESSIONS, breathingSessions).then(ok => { if (!ok) setSaveError(true); });
  }, [breathingSessions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY_TAGS, customTags);
  }, [customTags, isLoaded]);

  const addEntry = useCallback((
    mood: MoodValue,
    note: string,
    extras?: Partial<Pick<JournalEntry, 'templateId' | 'tags' | 'title'>>,
  ) => {
    if (!isLoaded) return;
    setEntries(prev => [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      date: new Date().toISOString(),
      mood,
      note,
      ...extras,
    }, ...prev]);
  }, [isLoaded]);

  const updateEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    if (!isLoaded) return;
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
  }, [isLoaded]);

  const deleteEntry = useCallback((id: string) => {
    if (!isLoaded) return;
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [isLoaded]);

  const addCustomTag = useCallback((tag: string) => {
    const t = tag.trim().toLowerCase();
    if (!t) return;
    setCustomTags(prev => prev.includes(t) ? prev : [...prev, t]);
  }, []);

  const addBreathingSession = useCallback(() => {
    if (!isLoaded) return;
    setBreathingSessions(prev => prev + 1);
  }, [isLoaded]);

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
