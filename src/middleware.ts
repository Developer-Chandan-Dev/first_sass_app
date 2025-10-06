import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';

interface UserMetadata {
  isAdmin?: boolean;
}

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'hi', 'pa', 'mr'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

const isApiRoute = createRouteMatcher(['/api(.*)']);
const isProtectedRoute = createRouteMatcher(['/(en|hi|pa|mr)/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/(en|hi|pa|mr)/admin(.*)']);
// const isAuthRoute = createRouteMatcher(['/(en|hi|pa|mr)/login(.*)', '/(en|hi|pa|mr)/register(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Skip locale handling for API routes
  if (isApiRoute(req)) {
    return;
  }

  // Always run intl middleware first for locale handling
  const intlResponse = intlMiddleware(req);
  
  // If intl middleware returns a response (redirect), use it
  if (intlResponse) {
    return intlResponse;
  }

  const { userId, sessionClaims } = await auth();
  
  // Extract locale from pathname
  const pathSegments = pathname.split('/');
  const localeCandidate = pathSegments.length > 1 ? pathSegments[1] : '';
  const validLocales = ['en', 'hi', 'pa', 'mr'];
  const locale = validLocales.includes(localeCandidate) ? localeCandidate : 'en';

  // Handle protected routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      return Response.redirect(new URL(`/${locale}/login`, req.url));
    }
  }
  
  // Handle admin routes
  if (isAdminRoute(req)) {
    if (!userId) {
      return Response.redirect(new URL(`/${locale}/login`, req.url));
    }
    if (!(sessionClaims?.metadata as UserMetadata)?.isAdmin) {
      return Response.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
