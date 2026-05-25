import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { translate } from '../i18n/translations';

const STORAGE_KEY = 'quran_lang';

const LanguageContext = createContext(null);

function getStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'ar' || v === 'en' ? v : 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getStoredLang);

  const setLang = useCallback((next) => {
    const value = next === 'ar' ? 'ar' : 'en';
    localStorage.setItem(STORAGE_KEY, value);
    setLangState(value);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = useCallback(
    (key, vars) => translate(lang, key, vars),
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      isRtl: lang === 'ar',
    }),
    [lang, setLang, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
