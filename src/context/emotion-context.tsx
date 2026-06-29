import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { secureRead, secureWrite } from '@/lib/secure-storage';
import { EmotionLog } from '@/types';

interface EmotionContextType {
  emotionLogs: EmotionLog[];
  addEmotionLog: (log: Omit<EmotionLog, 'id' | 'date'>) => void;
  deleteEmotionLog: (id: string) => void;
  todayEmotions: EmotionLog[];
  isLoaded: boolean;
}

const EmotionContext = createContext<EmotionContextType | null>(null);

const STORAGE_KEY = 'wellness_emotions_v1';

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function EmotionProvider({ children }: { children: React.ReactNode }) {
  const [emotionLogs, setEmotionLogs] = useState<EmotionLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    secureRead<EmotionLog[]>(STORAGE_KEY)
      .then(saved => {
        if (saved) setEmotionLogs(saved);
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY, emotionLogs);
  }, [emotionLogs, isLoaded]);

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
  }, [isLoaded]);

  const deleteEmotionLog = useCallback((id: string) => {
    if (!isLoaded) return;
    setEmotionLogs(prev => prev.filter(e => e.id !== id));
  }, [isLoaded]);

  const todayEmotions = useMemo(() => {
    const today = toLocalDateStr(new Date());
    return emotionLogs.filter(e => toLocalDateStr(new Date(e.date)) === today);
  }, [emotionLogs]);

  return (
    <EmotionContext.Provider value={{ emotionLogs, addEmotionLog, deleteEmotionLog, todayEmotions, isLoaded }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotions(): EmotionContextType {
  const ctx = useContext(EmotionContext);
  if (!ctx) throw new Error('useEmotions must be used inside <EmotionProvider>');
  return ctx;
}
