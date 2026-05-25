/**
 * LanguageContext — stores the user's chosen locale and exposes a setter.
 * Auto-detects the device language on first load; the user can override it
 * manually via the language picker.
 */

import * as Localization from 'expo-localization';
import React, { createContext, useContext, useState } from 'react';

import { type Locale, TRANSLATIONS } from '@/i18n/translations';

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
  const [locale, setLocale] = useState<Locale>(detectLocale);
  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  return useContext(LanguageContext);
}
