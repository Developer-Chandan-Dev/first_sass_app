'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLocale as useNextIntlLocale } from 'next-intl';
import {
  useDashboardTranslations,
  formatCurrency,
  formatDate,
  formatNumber,
} from '@/hooks/i18n';

type Locale = 'en' | 'hi' | 'pa' | 'mr';

interface TranslationContextType {
  locale: Locale;
  translations: ReturnType<typeof useDashboardTranslations>;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatNumber: (number: number) => string;
  getLocaleConfig: () => {
    currency: string;
    dateFormat: string;
    numberFormat: string;
  };
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

interface TranslationProviderProps {
  children: ReactNode;
}

const localeConfigs = {
  en: {
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
  },
  hi: {
    currency: 'INR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'hi-IN',
  },
  pa: {
    currency: 'INR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'pa-IN',
  },
  mr: {
    currency: 'INR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'mr-IN',
  },
};

export function TranslationProvider({ children }: TranslationProviderProps) {
  const locale = useNextIntlLocale() as Locale;
  const translations = useDashboardTranslations();
  const config = localeConfigs[locale] || localeConfigs.en;

  const contextValue: TranslationContextType = {
    locale,
    translations,
    formatCurrency: (amount: number, currency?: string) =>
      formatCurrency(amount, currency || config.currency, config.numberFormat),
    formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) =>
      formatDate(date, config.numberFormat, options),
    formatNumber: (number: number) => formatNumber(number, config.numberFormat),
    getLocaleConfig: () => config,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      'useTranslationContext must be used within a TranslationProvider'
    );
  }
  return context;
}

// Convenience hooks
export function useLocalizedFormat() {
  const { formatCurrency, formatDate, formatNumber } = useTranslationContext();
  return { formatCurrency, formatDate, formatNumber };
}

export function useCurrentLocale() {
  const { locale, getLocaleConfig } = useTranslationContext();
  return { locale, config: getLocaleConfig() };
}
