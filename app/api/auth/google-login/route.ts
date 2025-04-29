// app/api/auth/google-login/route.ts
import {NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function GET() {
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback');
    const res = await fetch(`${API_BASE_PATH}/auth/login/google?redirect_uri=${redirectUri}`);
    const url = await res.text();
    return NextResponse.redirect(url.trim());
}
