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
