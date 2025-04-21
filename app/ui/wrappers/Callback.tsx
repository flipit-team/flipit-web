'use client';

import {useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

export default function GoogleCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        const login = async () => {
            if (!code) return;

            const res = await fetch(`/api/v1/auth/google/callback?code=${code}`);
            if (res.ok) {
                router.push('/home');
            } else {
                router.push('/login?error=auth_failed');
            }
        };

        login();
    }, [code, router]);

    return <p>Logging you in...</p>;
}
