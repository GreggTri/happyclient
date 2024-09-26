'use server'
import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SessionPayload } from './definitions'
import { get } from '@vercel/edge-config';

const KEY = new TextEncoder().encode(get('JWT_SECRET'))


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

    if (stripeSubscriptionId) {
        const sessionWithSubscription = await encrypt({ userId, expiresAt, isAdmin, tenantId, stripeSubscriptionId });
    
        cookies().set('session', sessionWithSubscription, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'strict',
            path: '/',
        });
    
    } else {
        const sessionWithoutSubscription = await encrypt({ userId, expiresAt, isAdmin, tenantId });

        cookies().set('session', sessionWithoutSubscription, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            sameSite: 'strict',
            path: '/',
        });
    }
}

export async function verifySession() {
    const cookie = cookies().get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
        redirect('/login');
    }

    return { isAuth: true, userId: String(session.userId), isAdmin: session.isAdmin, tenantId: session.tenantId};
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