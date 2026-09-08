import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { token, userId } = await req.json();

    if (!token || !userId) {
        return NextResponse.json({ error: 'Missing token or userId' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    response.cookies.set('token', token, cookieOptions);
    response.cookies.set('userId', userId.toString(), cookieOptions);

    return response;
}
