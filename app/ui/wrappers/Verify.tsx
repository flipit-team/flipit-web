'use client';

import {useEffect} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';

export default function Verify() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const {setModalMessage} = useAppContext();

    useEffect(() => {
        const success = searchParams.get('success');
        const messageParam = searchParams.get('message');

        if (success === 'true') {
            setModalMessage(messageParam || 'Your account has been verified.');

            // Push new URL param without full page reload
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('modal', 'verified');
            setTimeout(() => {
                router.replace(`/home?${newParams.toString()}`);
            }, 0);
        } else {
            setModalMessage(messageParam || 'Link is invalid or expired.');

            // Push new URL param without full page reload
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('modal', 'error');
            setTimeout(() => {
                router.replace(`/home?${newParams.toString()}`);
            }, 0);
        }
    }, [searchParams, router]);

    return (
        <div className='w-full flex items-center justify-center'>
            <h1>Verifying...</h1>
        </div>
    );
}
