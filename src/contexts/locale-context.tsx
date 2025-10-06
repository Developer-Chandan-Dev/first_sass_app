'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useParams } from 'next/navigation';

type Locale = 'en' | 'hi' | 'pa' | 'mr';

interface LocaleContextType {
  locale: Locale;
  getLocalizedPath: (path: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';

  const getLocalizedPath = (path: string): string => {
    if (path.startsWith('/')) {
      return `/${locale}${path}`;
    }
    return path;
  };

  return (
    <LocaleContext.Provider value={{ locale, getLocalizedPath }}>
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