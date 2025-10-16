// Supported locales based on available message files
export const SUPPORTED_LOCALES = ['en', 'hi', 'pa', 'mr'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  hi: 'हिंदी',
  pa: 'ਪੰਜਾਬੀ',
  mr: 'मराठी',
};

export const DEFAULT_LOCALE: SupportedLocale = 'en';
export const STORAGE_KEY = 'trackwise-language-preference';
