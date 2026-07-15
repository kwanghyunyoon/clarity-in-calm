import React, { createContext, useCallback, useContext } from 'react';
import { usePersistedState } from '@/lib/use-persisted-state';
import { AppSettings, DEFAULT_SETTINGS, IAPStatus, NotificationSettings, ThemeOverride } from '@/types';

interface SettingsContextType {
  settings: AppSettings;
  setNotificationSettings: (n: NotificationSettings) => void;
  setIAPStatus: (s: IAPStatus) => void;
  setThemeOverride: (t: ThemeOverride) => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const STORAGE_KEY = 'wellness_settings_v1';
export const SETTINGS_STORAGE_KEY = STORAGE_KEY;

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings, isLoaded] = usePersistedState<AppSettings>(STORAGE_KEY, DEFAULT_SETTINGS, {
    transform: saved => ({ ...DEFAULT_SETTINGS, ...saved }),
  });

  const setNotificationSettings = useCallback((n: NotificationSettings) => {
    setSettings(prev => ({ ...prev, notifications: n }));
  }, [setSettings]);

  const setIAPStatus = useCallback((s: IAPStatus) => {
    setSettings(prev => ({ ...prev, iap: s }));
  }, [setSettings]);

  const setThemeOverride = useCallback((t: ThemeOverride) => {
    setSettings(prev => ({ ...prev, themeOverride: t }));
  }, [setSettings]);

  return (
    <SettingsContext.Provider value={{ settings, setNotificationSettings, setIAPStatus, setThemeOverride, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
