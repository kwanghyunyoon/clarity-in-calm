import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { secureRead, secureWrite } from '@/lib/secure-storage';
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

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    secureRead<AppSettings>(STORAGE_KEY)
      .then(saved => {
        if (saved) setSettings({ ...DEFAULT_SETTINGS, ...saved });
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    secureWrite(STORAGE_KEY, settings);
  }, [settings, isLoaded]);

  const setNotificationSettings = useCallback((n: NotificationSettings) => {
    setSettings(prev => ({ ...prev, notifications: n }));
  }, []);

  const setIAPStatus = useCallback((s: IAPStatus) => {
    setSettings(prev => ({ ...prev, iap: s }));
  }, []);

  const setThemeOverride = useCallback((t: ThemeOverride) => {
    setSettings(prev => ({ ...prev, themeOverride: t }));
  }, []);

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
