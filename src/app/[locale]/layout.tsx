import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { LocaleProvider } from '@/contexts/locale-context';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale and provide fallback
  const validLocales = ['en', 'hi', 'pa', 'mr'];
  if (!validLocales.includes(locale)) {
    console.warn(`Invalid locale: ${locale}, falling back to 'en'`);
  }

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error('Failed to load messages:', error);
    messages = {};
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleProvider>{children}</LocaleProvider>
    </NextIntlClientProvider>
  );
}
