import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect('/login?error=missing_code');
    }

    try {
        // Fetch token as plain text (not JSON)
        const res = await fetch(`https://flipit-api.onrender.com/api/v1/auth/google/callback?code=${code}`);

        if (!res.ok) {
            return NextResponse.redirect('/login?error=callback_failed');
        }

        const token = (await res.text()).trim(); // 🌟 handle plain string response

        if (!token) {
            return NextResponse.redirect('/login?error=empty_token');
        }

        const response = NextResponse.redirect('/home');

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;
    } catch (err) {
        console.error('Callback processing failed:', err);
        return NextResponse.redirect('/login?error=unexpected');
    }
}
