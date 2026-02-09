import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/designer(.*)',
]);

const isDesignerRoute = createRouteMatcher([
  '/dashboard/designer(.*)',
  '/dashboard/designs(.*)',
  '/dashboard/upload(.*)',
  '/dashboard/services(.*)',
  '/dashboard/orders(.*)',
  '/dashboard/earnings(.*)',
  '/api/designer(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Designer-specific route protection via publicMetadata.role
  if (isDesignerRoute(req)) {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as Record<string, unknown> | undefined)?.role;
    if (role !== 'designer' && role !== 'admin') {
      return Response.redirect(new URL('/dashboard', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
