/**
 * LanguageContext — stores the user's chosen locale and exposes a setter.
 * Auto-detects the device language on first load; the user can override it
 * manually via the language picker. Choice is persisted to AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { type Locale, TRANSLATIONS } from '@/i18n/translations';

const STORAGE_KEY = '@cic_locale';

function detectLocale(): Locale {
  try {
    const code = Localization.getLocales()[0]?.languageCode ?? 'en';
    if (code in TRANSLATIONS) return code as Locale;
  } catch {}
  return 'en';
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  // Load persisted locale on mount
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (mounted && saved && saved in TRANSLATIONS) {
        setLocaleState(saved as Locale);
      }
    });
    return () => { mounted = false; };
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    AsyncStorage.setItem(STORAGE_KEY, l);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  return useContext(LanguageContext);
}
