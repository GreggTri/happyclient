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

  // Check if hostname is valid and contains at least one dot
  if (hostname && hostname.includes('.')) {
    // Handle custom domain and subdomain logic
    let subdomain, customDomain;

    const hostnameParts = hostname.split('.');

    // Ignore 'www' as a subdomain
    if (hostnameParts[0] === 'www') {
      hostnameParts.shift(); // Remove 'www' from the parts array
    }

    // Determine if it's a custom domain with a subdomain
    if (hostnameParts.length > 2) {
      // If there are more than two parts, assume the first is a subdomain
      subdomain = hostnameParts[0];
      customDomain = hostnameParts.slice(1).join('.');
    } else {
      // If there are only two parts, treat this as a custom domain without a subdomain
      customDomain = hostname;
    }

    // Handle custom domain-specific logic
    if (isCustomDomain || customDomain) {
      const customer = await getCustomerByDomain(customDomain); // Fetch customer data by custom domain

      if (!customer) {
        return NextResponse.redirect(new URL('/404', req.nextUrl), { status: 404 });
      }

      // Optionally: Handle subdomain-specific logic if applicable
      if (subdomain && subdomain !== 'www') {
        const subdomainCustomer = await getCustomerBySubdomain(subdomain);

        if (!subdomainCustomer) {
          return NextResponse.redirect(new URL('/404', req.nextUrl), { status: 404 });
        }
      }

      // Proceed with custom domain or subdomain-based logic
    }
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
