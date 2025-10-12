'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, STORAGE_KEY, type SupportedLocale } from '@/lib/supported-locales';

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  availableLocales: readonly SupportedLocale[];
  getLocalizedPath: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialLocale = (params.locale as SupportedLocale) || DEFAULT_LOCALE;
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY) as SupportedLocale;
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale)) return;
    
    localStorage.setItem(STORAGE_KEY, newLocale);
    setLocaleState(newLocale);
    
    const currentPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const newPath = `/${newLocale}${currentPath}`;
    router.push(newPath);
  };

  const getLocalizedPath = (path: string): string => {
    if (path.startsWith('/')) {
      return `/${locale}${path}`;
    }
    return path;
  };

  return (
    <LocaleContext.Provider value={{ 
      locale, 
      setLocale, 
      availableLocales: SUPPORTED_LOCALES,
      getLocalizedPath 
    }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}