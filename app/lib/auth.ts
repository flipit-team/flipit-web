// lib/auth.ts
export async function getGoogleLoginUrl(): Promise<string> {
    const res = await fetch('/api/auth/google-login');
    const data = await res.json();
    return data.url;
}

export async function handleGoogleCallback(code: string): Promise<any> {
    const res = await fetch(`https://flipit-api.onrender.com/api/v1/auth/google/callback?code=${code}`);
    if (!res.ok) throw new Error('Failed to handle callback');
    return res.json();
}

import {cookies} from 'next/headers';
import {API_BASE_URL} from '~/lib/config';

export async function getUserFromServer() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userId = cookieStore.get('userId')?.value;
    const userName = cookieStore.get('userName')?.value;

    if (!token) return null;

    try {
        const res = await fetch(`${API_BASE_URL}/checkJwt`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            // No need for credentials in server-side fetch
            cache: 'no-store'
        });

        if (!res.ok) return null;

        return {token, userId, userName};
    } catch (err) {
        console.error('Auth check failed:', err);
        return null;
    }
}
