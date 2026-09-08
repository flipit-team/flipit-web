import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('t');
    const userId = req.nextUrl.searchParams.get('userId');

    if (!token || !userId) {
        return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
    }

    const response = NextResponse.redirect(new URL('/', req.url));

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    response.cookies.set('token', token, cookieOptions);
    response.cookies.set('userId', userId, cookieOptions);

    return response;
}
