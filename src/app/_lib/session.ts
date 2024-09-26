'use server'
import 'server-only'

import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SessionPayload } from './definitions'
import { get } from '@vercel/edge-config';
import { SESSION_UPDATE_THRESHOLD } from './constants'


const KEY = new TextEncoder().encode(String(get('JWT_SECRET')))


export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4hr')
      .sign(KEY);
  }
  
export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, KEY, {
        algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function createSession(userId: string, isAdmin: boolean, tenantId: string, stripeSubscriptionId: string | null) {
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt, isAdmin, tenantId, stripeSubscriptionId });

    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'strict',
        path: '/',
    });
    
}

async function authorizeSession(session: JWTPayload | null, adminOnly: boolean){
    if (!session) return {
        success: false,
        message: "Unauthorized"
    };
    if (!(session.expiresAt instanceof Date)) {
        throw new Error('Invalid expiresAt date');
    }

    if (adminOnly && session.isAdmin === false)return {
        success: false,
        message: "Unauthorized"
    };
    if(session.expiresAt.getTime() - SESSION_UPDATE_THRESHOLD >= Date.now() - session.expiresAt.getTime()){
        await updateSession()
    }

    return session
}

export async function verifySession(adminOnly: boolean) {
    const cookie = cookies().get('session')?.value;
    const session = await decrypt(cookie);

    const authSession: JWTPayload = await authorizeSession(session, adminOnly)
    
    if (!authSession.userId) {
        cookies().delete('session');
        redirect('/login');
    }
    

    return { 
        isAuth: true, 
        expiresAt: authSession.expiresAt, 
        userId: String(authSession.userId), 
        isAdmin: authSession.isAdmin, 
        tenantId: authSession.tenantId
    };
}

export async function updateSession() {
    const session = cookies().get('session')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
        return null;
    }

    const expires = new Date(Date.now() + 4 * 60 * 60 * 1000);
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'strict',
        path: '/',
    });
}

export async function deleteSession() {
    cookies().delete('session');

}