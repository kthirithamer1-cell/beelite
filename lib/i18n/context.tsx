'use client';

import * as React from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.ar) => string;
  isRTL: boolean;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Arabic (Tunisian) as requested
  const [lang, setLangState] = React.useState<Language>('ar');

  React.useEffect(() => {
    const saved = localStorage.getItem('beelite_lang') as Language;
    if (saved && (saved === 'en' || saved === 'fr' || saved === 'ar')) {
      setLangState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('beelite_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const t = (key: keyof typeof translations.ar): string => {
    const dict = translations[lang] || translations.ar;
    return (dict as any)[key] || (translations.ar as any)[key] || (translations.en as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'ar' as Language,
      setLang: () => {},
      t: (key: keyof typeof translations.ar) => (translations.ar as any)[key] || (translations.en as any)[key] || key,
      isRTL: true,
    };
  }
  return context;
}
