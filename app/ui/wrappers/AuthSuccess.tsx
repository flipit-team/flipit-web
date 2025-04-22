'use client';

import {useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

export default function AuthSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        const sendCodeToBackend = async () => {
            if (!code) return;

            try {
                const res = await fetch('https://flipit-api.onrender.com/api/v1/auth/google/callback', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include', // in case the backend sets httpOnly cookies
                    body: JSON.stringify({code})
                });

                if (!res.ok) throw new Error('Failed to login via Google');

                const data = await res.json();

                // Save tokens or user data if needed. Prefer httpOnly cookies for auth.
                console.log('Login success:', data);

                // router.push('/'); // redirect to home/dashboard
            } catch (err) {
                console.error('Auth error', err);
                router.push('/login'); // fallback
            }
        };

        sendCodeToBackend();
    }, [code, router]);

    return (
        <div className='flex items-center justify-center h-screen'>
            <p>Signing you in...</p>
        </div>
    );
}
