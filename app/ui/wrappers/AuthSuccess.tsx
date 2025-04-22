// app/auth-success/page.tsx
'use client';

import {useEffect} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('t');
    const userId = searchParams.get('userId');

    useEffect(() => {
        if (!token || !userId) return;

        // Set cookies (expires in 7 days)
        Cookies.set('token', token, {expires: 7});
        Cookies.set('userId', userId, {expires: 7});

        // Redirect to dashboard or home
        router.push('/home');
    }, [token, userId, router]);

    return (
        <div className='flex items-center justify-center h-screen'>
            <p>Logging you in...</p>
        </div>
    );
}
