import React, { createContext, useCallback, useContext } from 'react';
import { DataKeySpec } from '@/lib/data-keys';
import { usePersistedState } from '@/lib/use-persisted-state';
import { AppSettings, DEFAULT_SETTINGS, NotificationSettings, ThemeOverride } from '@/types';

interface SettingsContextType {
  settings: AppSettings;
  setNotificationSettings: (n: NotificationSettings) => void;
  setThemeOverride: (t: ThemeOverride) => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const STORAGE_KEY = 'wellness_settings_v1';
export const SETTINGS_DATA_KEYS: DataKeySpec[] = [{ key: STORAGE_KEY, backend: 'secure' }];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings, isLoaded] = usePersistedState<AppSettings>(STORAGE_KEY, DEFAULT_SETTINGS, {
    transform: saved => ({ ...DEFAULT_SETTINGS, ...saved }),
  });

  const setNotificationSettings = useCallback((n: NotificationSettings) => {
    setSettings(prev => ({ ...prev, notifications: n }));
  }, [setSettings]);

  const setThemeOverride = useCallback((t: ThemeOverride) => {
    setSettings(prev => ({ ...prev, themeOverride: t }));
  }, [setSettings]);

  return (
    <SettingsContext.Provider value={{ settings, setNotificationSettings, setThemeOverride, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
