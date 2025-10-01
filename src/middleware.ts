import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';

interface UserMetadata {
  isAdmin?: boolean;
}

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'hi', 'pa', 'mr'],
  defaultLocale: 'en'
});

const isApiRoute = createRouteMatcher(['/api(.*)']);
const isProtectedRoute = createRouteMatcher(['/(en|hi|pa|mr)/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/(en|hi|pa|mr)/admin(.*)']);
const isAuthRoute = createRouteMatcher(['/(en|hi|pa|mr)/login(.*)', '/(en|hi|pa|mr)/register(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Skip locale handling for API routes
  if (isApiRoute(req)) {
    return;
  }

  // Skip auth for login/register routes
  if (isAuthRoute(req)) {
    return intlMiddleware(req);
  }

  const { userId, sessionClaims } = await auth();
  
  // Safely extract and validate locale
  const pathSegments = pathname.split('/');
  const localeCandidate = pathSegments.length > 1 ? pathSegments[1] : '';
  const validLocales = ['en', 'hi', 'pa', 'mr'];
  const locale = validLocales.includes(localeCandidate) ? localeCandidate : 'en';

  // Handle protected routes
  if (isProtectedRoute(req) || isAdminRoute(req)) {
    if (!userId) {
      return Response.redirect(new URL(`/${locale}/login`, req.url));
    }
    
    if (isAdminRoute(req) && !(sessionClaims?.metadata as UserMetadata)?.isAdmin) {
      return Response.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
