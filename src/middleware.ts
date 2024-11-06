// Explicitly set the runtime for middleware to Edge
export const runtime = 'experimental-edge'; // Separate the runtime key

'use server';
import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/_lib/session';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const hostname = req.headers.get('host'); // Get the request hostname (domain)
  const isDev = process.env.NODE_ENV === 'development'; // Determine if in development mode

  const baseDomain = isDev ? 'localhost:3000' : process.env.BASE_DOMAIN; // Adjust base domain
  const isCustomDomain = hostname !== baseDomain && hostname !== `www.${baseDomain}`;

  // Check if hostname is valid
  if (isCustomDomain) {

    // Extract the token from the path instead of using a query parameter
    const urlPath = req.nextUrl.pathname;
    const token = urlPath.substring(1); // Removes the leading '/' from the path
    const domain = hostname // this is to make some name as routing

    if(token === null){
      return NextResponse.redirect(`${req.nextUrl.protocol}//${baseDomain}/domain/error`);
    }
    if(domain === null){
      return NextResponse.redirect(`${req.nextUrl.protocol}//${baseDomain}/domain/error`);
    }

      // Rewrite the request to the desired internal path
      const rewriteUrl = new URL(`/${domain}/${token}`, req.url);

      return NextResponse.rewrite(rewriteUrl);
  }

  // Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value;  
  const session = cookie && await decrypt(cookie);

  // If a session exists and the path is login, redirect to the dashboard
  if (session && path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl), { status: 303 });
  }

  // Check if the session does not exist and it's the login path
  if (!session && path.startsWith('/login')) {
    return null;
  }

  // Redirect to login if session is not present
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
  }

  // Handle unauthenticated users
  if (session.isAuth === false) {
    return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login'], // Routes that require authorization
};
