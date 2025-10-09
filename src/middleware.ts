import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'hi', 'pa', 'mr'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

const isProtectedRoute = createRouteMatcher(['/(en|hi|pa|mr)/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/(en|hi|pa|mr)/admin(.*)']);

// SSRF protection: Create safe redirect URLs
const createSafeRedirectUrl = (path: string, baseUrl: string): URL => {
  const url = new URL(baseUrl);
  // Only allow relative paths to prevent SSRF
  const safePath = path.startsWith('/') ? path : `/${path}`;
  url.pathname = safePath;
  url.search = '';
  url.hash = '';
  return url;
};

// Validate locale to prevent path traversal
const validateLocale = (locale: string): string => {
  const validLocales = ['en', 'hi', 'pa', 'mr'];
  return validLocales.includes(locale) ? locale : 'en';
};

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Skip internationalization for API routes
  if (!pathname.startsWith('/api')) {
    const intlResponse = intlMiddleware(req);
    if (intlResponse) return intlResponse;
  }

  const { userId, sessionClaims } = await auth();
  
  const pathSegments = pathname.split('/');
  const locale = validateLocale(pathSegments[1] || 'en');

  if (isProtectedRoute(req) && !userId) {
    return Response.redirect(createSafeRedirectUrl(`/${locale}/login`, req.url));
  }
  
  if (isAdminRoute(req)) {
    if (!userId) {
      return Response.redirect(createSafeRedirectUrl(`/${locale}/login`, req.url));
    }
    if (!(sessionClaims?.metadata as { isAdmin?: boolean })?.isAdmin) {
      return Response.redirect(createSafeRedirectUrl(`/${locale}/dashboard`, req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};