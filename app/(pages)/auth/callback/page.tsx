// app/auth/callback/page.tsx
'use client';

import {useEffect} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';

export default function GoogleCallback() {
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const code = params.get('code');
        if (!code) return;

        const exchangeCode = async () => {
            try {
                const res = await fetch('/api/auth/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({code})
                });

                const data = await res.json();

                if (data.token) {
                    // Store token in localStorage, cookie, etc.
                    localStorage.setItem('auth_token', data.token);

                    // Redirect to dashboard or homepage
                    router.replace('/home');
                } else {
                    console.error('No token returned');
                }
            } catch (err) {
                console.error('Callback error:', err);
            }
        };

        exchangeCode();
    }, [params, router]);

    return <p>Signing you in with Google...</p>;
}
