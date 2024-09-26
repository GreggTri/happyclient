'use server'
import 'server-only'

import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/_lib/session';

//const SESSION_UPDATE_THRESHOLD = 30 * 60 * 1000; 

export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;

  // Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value;  
  const session = cookie && await decrypt(cookie);


  if (session && path.startsWith('/login')){
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl), { status: 303 });
  }

  // Check if the token exists
  if (!session && path.startsWith('/login')) {
    return null;
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
  }

  if (session.isAuth === false) {
    
    return NextResponse.redirect(new URL('/login', req.nextUrl), { status: 303 });
  }
    

  // Check if the session is about to expire (within the threshold)
  // const timeRemaining = Date.now() - new Date(session.exp!).getTime();

  // if (timeRemaining < (session.exp! - SESSION_UPDATE_THRESHOLD)) {
  //   // Update session (create a new one)
    
  //   await updateSession()

  // }

  return NextResponse.next();
     
  
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/login'], // Routes that require authorization
};