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
  saveError: boolean;
  clearSaveError: () => void;
}

const WellnessContext = createContext<WellnessContextType | null>(null);

// ─── Storage keys ────────────────────────────────────────────────────────────
const STORAGE_KEY_ENTRIES   = 'wellness_entries_v1';
const STORAGE_KEY_SESSIONS  = 'wellness_sessions_v1';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns a YYYY-MM-DD string in the device's LOCAL timezone.
 * Using local date arithmetic avoids DST bugs (a day isn't always 86400s).
 */
function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const uniqueDays = [
    ...new Set(entries.map((e) => toLocalDateStr(new Date(e.date)))),
  ].sort((a, b) => (a < b ? 1 : -1)); // descending

  const today = toLocalDateStr(new Date());
  const yd    = new Date(); yd.setDate(yd.getDate() - 1);
  const yesterday = toLocalDateStr(yd);

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;

  let count = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    // Compare consecutive YYYY-MM-DD strings by subtracting dates
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
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
  const [saveError,         setSaveError]          = useState(false);

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
    load().catch(() => {
      // Storage completely unavailable — start fresh rather than freezing
      setIsLoaded(true);
    });
  }, []);

  // ── Persist entries whenever they change (skip first render) ──────────────
  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY_ENTRIES, entries).then((ok) => {
      if (!ok) setSaveError(true);
    });
  }, [entries, isLoaded]);

  // ── Persist sessions whenever they change ─────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY_SESSIONS, breathingSessions).then((ok) => {
      if (!ok) setSaveError(true);
    });
  }, [breathingSessions, isLoaded]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const addEntry = useCallback((mood: MoodValue, note: string) => {
    // Guard: don't write before storage has loaded — would be overwritten on load completion
    if (!isLoaded) return;
    setEntries((prev) => [
      {
        id:   `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: new Date().toISOString(),
        mood,
        note,
      },
      ...prev,
    ]);
  }, [isLoaded]);

  const deleteEntry = useCallback((id: string) => {
    if (!isLoaded) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, [isLoaded]);

  const addBreathingSession = useCallback(() => {
    if (!isLoaded) return;
    setBreathingSessions((prev) => prev + 1);
  }, [isLoaded]);

  const clearSaveError = useCallback(() => setSaveError(false), []);

  // ── Derived ───────────────────────────────────────────────────────────────

  // Use the LAST entry today (most recent update) — entries are newest-first.
  // Validate the raw value is in [1, 5] before asserting MoodValue; corrupt data → null.
  const todayMood: MoodValue | null = (() => {
    const raw = entries.find(
      (e) => toLocalDateStr(new Date(e.date)) === toLocalDateStr(new Date()),
    )?.mood;
    return raw !== undefined && raw >= 1 && raw <= 5 ? (raw as MoodValue) : null;
  })();

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
        saveError,
        clearSaveError,
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
