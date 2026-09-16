import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { DataKeySpec } from '@/lib/data-keys';
import { toLocalDateStr } from '@/lib/date-utils';
import { usePersistedState } from '@/lib/use-persisted-state';
import { EmotionLog } from '@/types';

interface EmotionContextType {
  emotionLogs: EmotionLog[];
  addEmotionLog: (log: Omit<EmotionLog, 'id' | 'date'>) => void;
  deleteEmotionLog: (id: string) => void;
  todayEmotions: EmotionLog[];
  isLoaded: boolean;
  reload: () => Promise<void>;
}

const EmotionContext = createContext<EmotionContextType | null>(null);

const STORAGE_KEY = 'wellness_emotions_v1';
export const EMOTION_DATA_KEYS: DataKeySpec[] = [{ key: STORAGE_KEY, backend: 'secure' }];

export function EmotionProvider({ children }: { children: React.ReactNode }) {
  const [emotionLogs, setEmotionLogs, isLoaded, reload] = usePersistedState<EmotionLog[]>(STORAGE_KEY, []);

  const addEmotionLog = useCallback((log: Omit<EmotionLog, 'id' | 'date'>) => {
    if (!isLoaded) return;
    setEmotionLogs(prev => [
      {
        ...log,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, [isLoaded, setEmotionLogs]);

  const deleteEmotionLog = useCallback((id: string) => {
    if (!isLoaded) return;
    setEmotionLogs(prev => prev.filter(e => e.id !== id));
  }, [isLoaded, setEmotionLogs]);

  const todayEmotions = useMemo(() => {
    const today = toLocalDateStr(new Date());
    return emotionLogs.filter(e => toLocalDateStr(new Date(e.date)) === today);
  }, [emotionLogs]);

  return (
    <EmotionContext.Provider value={{ emotionLogs, addEmotionLog, deleteEmotionLog, todayEmotions, isLoaded, reload }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotions(): EmotionContextType {
  const ctx = useContext(EmotionContext);
  if (!ctx) throw new Error('useEmotions must be used inside <EmotionProvider>');
  return ctx;
}
