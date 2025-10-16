import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'hi', 'pa', 'mr'] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  try {
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default,
    };
  } catch {
    notFound();
  }
});
