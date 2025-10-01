import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ReduxProvider } from '@/components/common/providers';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { seoConfig } from '@/lib/seo';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: `${seoConfig.siteName} - Smart Expense Management & Budget Tracking`,
  description: `${seoConfig.siteDescription}. Track expenses, manage budgets, and gain insights with our powerful expense management platform.`,
  keywords: 'expense tracker, budget management, personal finance, expense management, financial planning, money tracker, budget planner, expense app',
  authors: [{ name: `${seoConfig.siteName} Team` }],
  creator: seoConfig.siteName,
  publisher: seoConfig.siteName,
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: `${seoConfig.siteName} - Smart Expense Management & Budget Tracking`,
    description: seoConfig.siteDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${seoConfig.siteName} - Smart Expense Management`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${seoConfig.siteName} - Smart Expense Management & Budget Tracking`,
    description: seoConfig.siteDescription,
    images: ['/og-image.jpg'],
    creator: seoConfig.twitterHandle,
  },
  alternates: {
    canonical: seoConfig.siteUrl,
  },
  ...(seoConfig.googleVerification && {
    verification: {
      google: seoConfig.googleVerification,
    },
  }),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/favicon.ico' },
    ],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Validate locale and provide fallback
  const validLocales = ['en', 'hi', 'pa', 'mr'];
  const validatedLocale = validLocales.includes(locale) ? locale : 'en';
  
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error('Failed to load messages:', error);
    messages = {};
  }

  return (
    <ClerkProvider>
      <html lang={validatedLocale} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ReduxProvider>{children}</ReduxProvider>
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
