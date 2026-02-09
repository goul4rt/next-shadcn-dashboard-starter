import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default async function middleware(request: NextRequest) {
  // Check if the request is for a protected route (/dashboard/*)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    // If no session, redirect to sign-in
    if (!session) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
