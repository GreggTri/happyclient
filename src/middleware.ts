'use server'
import 'server-only'

import { NextRequest, NextResponse } from 'next/server';
import { decrypt, updateSession } from '@/app/_lib/session';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard', '/settings'];
const authRoutes = ["/login", "/register"]
//const publicRoutes = ['/', '/pricing', '/contactus', 'bookDemo'];

const SESSION_UPDATE_THRESHOLD = 30 * 60 * 1000; 

export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;
  //const isPublicRoute = publicRoutes.includes(path);
  // Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value;  

  const session = await decrypt(cookie);

  if (session && protectedRoutes.some(route => path.startsWith(route))) {
    // If session is invalid on protected routes, redirect to login
    if (!session.isAuth) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Check if the session is about to expire (within the threshold)
    const timeRemaining = new Date(session!.exp!).getTime() - Date.now();

    if (timeRemaining < SESSION_UPDATE_THRESHOLD) {
      // Update session (create a new one)
      await updateSession()
      
    }

    const response = NextResponse.next();
      return response;
  }

  else if (session && authRoutes.includes(path) && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  } else if (session === null && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/register', req.nextUrl));
  } else {
    return NextResponse.next();
  }
}