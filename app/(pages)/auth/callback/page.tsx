// app/auth/callback/page.tsx
'use client';

import {useEffect, Suspense} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

function GoogleCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        const handleAuth = async () => {
            if (!code) return;

            const res = await fetch(`/api/v1/auth/google/callback?code=${code}`);

            if (res.ok) {
                router.push('/home');
            } else {
                router.push('/login?error=auth_failed');
            }
        };

        handleAuth();
    }, [code, router]);

    return <p>Logging you in...</p>;
}

export default function Page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <GoogleCallbackHandler />
        </Suspense>
    );
}
