import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { secureRead, secureWrite } from '@/lib/secure-storage';

export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  mood: MoodValue;
  note: string;
}

interface WellnessContextType {
  entries: JournalEntry[];
  addEntry: (mood: MoodValue, note: string) => void;
  deleteEntry: (id: string) => void;
  todayMood: MoodValue | null;
  breathingSessions: number;
  addBreathingSession: () => void;
  streak: number;
  isLoaded: boolean;
}

const WellnessContext = createContext<WellnessContextType | null>(null);

// ─── Storage keys ────────────────────────────────────────────────────────────
const STORAGE_KEY_ENTRIES   = 'wellness_entries_v1';
const STORAGE_KEY_SESSIONS  = 'wellness_sessions_v1';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const uniqueDays = [
    ...new Set(entries.map((e) => new Date(e.date).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let count = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev    = new Date(uniqueDays[i - 1]);
    const curr    = new Date(uniqueDays[i]);
    const diffMs  = prev.getTime() - curr.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    if (diffDays === 1) {
      count++;
    } else {
      break;
    }
  }
  return count;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WellnessProvider({ children }: { children: React.ReactNode }) {
  const [entries,           setEntries]           = useState<JournalEntry[]>([]);
  const [breathingSessions, setBreathingSessions]  = useState(0);
  const [isLoaded,          setIsLoaded]           = useState(false);

  // ── Load encrypted data on mount ──────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const [savedEntries, savedSessions] = await Promise.all([
        secureRead<JournalEntry[]>(STORAGE_KEY_ENTRIES),
        secureRead<number>(STORAGE_KEY_SESSIONS),
      ]);
      if (savedEntries)  setEntries(savedEntries);
      if (savedSessions) setBreathingSessions(savedSessions);
      setIsLoaded(true);
    }
    load();
  }, []);

  // ── Persist entries whenever they change (skip first render) ──────────────
  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY_ENTRIES, entries);
  }, [entries, isLoaded]);

  // ── Persist sessions whenever they change ─────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY_SESSIONS, breathingSessions);
  }, [breathingSessions, isLoaded]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const addEntry = useCallback((mood: MoodValue, note: string) => {
    setEntries((prev) => [
      {
        id:   `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: new Date().toISOString(),
        mood,
        note,
      },
      ...prev,
    ]);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addBreathingSession = useCallback(() => {
    setBreathingSessions((prev) => prev + 1);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const todayMood: MoodValue | null =
    (entries.find((e) => {
      const today = new Date().toDateString();
      return new Date(e.date).toDateString() === today;
    })?.mood ?? null) as MoodValue | null;

  const streak = computeStreak(entries);

  return (
    <WellnessContext.Provider
      value={{
        entries,
        addEntry,
        deleteEntry,
        todayMood,
        breathingSessions,
        addBreathingSession,
        streak,
        isLoaded,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness(): WellnessContextType {
  const ctx = useContext(WellnessContext);
  if (!ctx) throw new Error('useWellness must be used inside <WellnessProvider>');
  return ctx;
}
