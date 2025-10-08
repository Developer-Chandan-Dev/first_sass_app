import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { apiRateLimit, authRateLimit } from '@/lib/rate-limiter';
import { validateSecurityHeaders } from '@/lib/security-validator';

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

// SSRF protection: Validate URLs to prevent internal network access
const isValidRedirectUrl = (url: string, requestOrigin: string): boolean => {
  try {
    const parsedUrl = new URL(url, requestOrigin);
    
    // Ensure the URL is from the same origin
    if (parsedUrl.origin !== requestOrigin) {
      return false;
    }
    
    // Block URLs with IP addresses to prevent SSRF
    const hostname = parsedUrl.hostname;
    
    // Check for IP addresses (IPv4 and IPv6)
    const ipv4Pattern = /^(\d+\.){3}\d+$/;
    const ipv6Pattern = /^[0-9a-fA-F:]+$/;
    
    if (ipv4Pattern.test(hostname) || ipv6Pattern.test(hostname)) {
      return false;
    }
    
    // Block common SSRF targets and internal domains
    const blockedHostnames = [
      'localhost',
      '127.0.0.1',
      '::1',
      '0.0.0.0',
      '169.254.169.254', // AWS metadata service
      'metadata.google.internal' // GCP metadata service
    ];
    
    if (blockedHostnames.includes(hostname)) {
      return false;
    }
    
    // Allow only specific safe paths
    const allowedPaths = ['/login', '/dashboard', '/admin'];
    const path = parsedUrl.pathname;
    
    // Check if path starts with any allowed path
    const isPathAllowed = allowedPaths.some(allowedPath => 
      path.startsWith(allowedPath) || 
      path.startsWith(`/en${allowedPath}`) ||
      path.startsWith(`/hi${allowedPath}`) ||
      path.startsWith(`/pa${allowedPath}`) ||
      path.startsWith(`/mr${allowedPath}`)
    );
    
    return isPathAllowed;
    
  } catch {
    return false;
  }
};

// Safe redirect function with SSRF protection
const createSafeRedirect = (path: string, req: Request): URL => {
  const requestUrl = new URL(req.url);
  const redirectUrl = new URL(path, requestUrl.origin);
  return redirectUrl;
};

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Security headers validation
  if (!validateSecurityHeaders(req)) {
    return NextResponse.json(
      { error: 'Invalid request headers' },
      { status: 400 }
    );
  }
  
  // Rate limiting for API routes
  if (isApiRoute(req)) {
    const rateLimiter = pathname.includes('/auth') ? authRateLimit : apiRateLimit;
    const rateLimit = rateLimiter(req);
    
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
          }
        }
      );
    }
    
    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());
    return response;
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

  const requestOrigin = new URL(req.url).origin;

  // Handle protected routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      const redirectUrl = createSafeRedirect(`/${locale}/login`, req);
      if (isValidRedirectUrl(redirectUrl.toString(), requestOrigin)) {
        return Response.redirect(redirectUrl.toString());
      }
      // Fallback to safe default redirect
      return Response.redirect(createSafeRedirect('/login', req).toString());
    }
  }
  
  // Handle admin routes
  if (isAdminRoute(req)) {
    if (!userId) {
      const redirectUrl = createSafeRedirect(`/${locale}/login`, req);
      if (isValidRedirectUrl(redirectUrl.toString(), requestOrigin)) {
        return Response.redirect(redirectUrl.toString());
      }
      // Fallback to safe default redirect
      return Response.redirect(createSafeRedirect('/login', req).toString());
    }
    if (!(sessionClaims?.metadata as UserMetadata)?.isAdmin) {
      const redirectUrl = createSafeRedirect(`/${locale}/dashboard`, req);
      if (isValidRedirectUrl(redirectUrl.toString(), requestOrigin)) {
        return Response.redirect(redirectUrl.toString());
      }
      // Fallback to safe default redirect
      return Response.redirect(createSafeRedirect('/dashboard', req).toString());
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};