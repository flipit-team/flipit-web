'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthSuccessPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('t');
    const userId = searchParams.get('userId');

    useEffect(() => {
        if (!token || !userId) {
            window.location.href = '/login?error=auth_failed';
            return;
        }

        // Set httpOnly cookies server-side, then redirect home
        fetch('/api/auth/set-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, userId }),
        }).then(() => {
            window.location.href = '/';
        }).catch(() => {
            window.location.href = '/login?error=auth_failed';
        });
    }, [token, userId]);

    return (
        <div className='flex items-center justify-center h-screen'>
            <p>Logging you in...</p>
        </div>
    );
}
