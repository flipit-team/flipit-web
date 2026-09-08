// lib/auth.ts
export async function getGoogleLoginUrl(): Promise<string> {
    const res = await fetch('/api/auth/google-login');
    const data = await res.json();
    return data.url;
}
