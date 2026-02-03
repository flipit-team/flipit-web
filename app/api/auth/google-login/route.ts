// app/api/auth/google-login/route.ts
import {NextRequest, NextResponse} from 'next/server';
import { API_BASE_PATH } from '~/lib/config';

export async function GET(req: NextRequest) {
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const redirectUri = encodeURIComponent(`${baseUrl}/api/v1/auth/google/callback`);

    const res = await fetch(`${API_BASE_PATH}/auth/login/google?redirect_uri=${redirectUri}`);
    const url = await res.text();
    return NextResponse.redirect(url.trim());
}
