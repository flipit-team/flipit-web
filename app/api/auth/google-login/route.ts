// app/api/auth/google-login/route.ts
import {NextResponse} from 'next/server';

export async function GET() {
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback');
    const res = await fetch(`https://flipit-api.onrender.com/api/v1/auth/login/google?redirect_uri=${redirectUri}`);
    const url = await res.text();
    return NextResponse.redirect(url.trim());
}
