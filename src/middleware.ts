import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

interface UserMetadata {
  isAdmin?: boolean;
}

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.redirect(new URL('/login', req.url));
    }
    if (!(sessionClaims?.metadata as UserMetadata)?.isAdmin) {
      return Response.redirect(new URL('/dashboard', req.url));
    }
  } else if (isProtectedRoute(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL('/login', req.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
