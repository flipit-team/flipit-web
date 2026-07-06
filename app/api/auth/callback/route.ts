// app/api/auth/callback/route.ts
import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.json({error: 'Missing code parameter'}, {status: 400});
    }

    const res = await fetch(`${API_BASE_PATH}/auth/google/callback?code=${code}`);
    if (!res.ok) return NextResponse.json({error: 'Invalid code'}, {status: 401});

    const apiData = await res.json();

    const token = apiData.token || apiData.jwt;
    const user = apiData.user;

    if (!token) {
        return NextResponse.json({error: 'No token received from server'}, {status: 500});
    }

    if (!user || !user.id) {
        return NextResponse.json({error: 'No user data received from server'}, {status: 500});
    }

    const response = NextResponse.redirect(new URL('/', req.url));

    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax'
    });

    response.cookies.set('userId', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax'
    });

    response.cookies.set('userName', user.firstName || user.username || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax'
    });

    return response;
}
