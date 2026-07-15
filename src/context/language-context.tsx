/**
 * LanguageContext — stores the user's chosen locale and exposes a setter.
 * Auto-detects the device language on first load; the user can override it
 * manually via the language picker. Choice is persisted via secure-storage.
 */

import * as Localization from 'expo-localization';
import React, { createContext, useContext } from 'react';

import { type Locale, TRANSLATIONS } from '@/i18n/translations';
import { usePersistedState } from '@/lib/use-persisted-state';

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
  const [locale, setLocale] = usePersistedState<Locale>(STORAGE_KEY, detectLocale(), {
    transform: saved => (saved in TRANSLATIONS ? saved : detectLocale()),
  });

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  return useContext(LanguageContext);
}
