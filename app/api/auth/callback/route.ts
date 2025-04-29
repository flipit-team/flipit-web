// app/api/auth/callback/route.ts
import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function POST(req: NextRequest) {
    const {code} = await req.json();

    const res = await fetch(`${API_BASE_PATH}/auth/google/callback?code=${code}`);
    if (!res.ok) return NextResponse.json({error: 'Invalid code'}, {status: 401});

    const userData = await res.json();

    const response = NextResponse.json({success: true});
    response.cookies.set('user', JSON.stringify(userData), {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
}
