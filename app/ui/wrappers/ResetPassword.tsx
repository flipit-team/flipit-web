import {useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [message, setMessage] = useState<string | null>(null);
    const {setModalMessage} = useAppContext();

    useEffect(() => {
        const token = searchParams.get('token');
        const messageParam = searchParams.get('message');

        if (token) {
            setModalMessage(messageParam || 'Your account has been verified.');

            // Push new URL param without full page reload
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('modal', 'verified');
            setTimeout(() => {
                router.replace(`/verify?${newParams.toString()}`);
            }, 0);
        } else {
            setModalMessage(messageParam || 'Your account has been verified.');

            // Push new URL param without full page reload
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('modal', 'error');
            setTimeout(() => {
                router.replace(`/verify?${newParams.toString()}`);
            }, 0);
        }
    }, [searchParams, router]);

    return (
        <div className='w-full flex items-center justify-center'>
            <h1>Verifying...</h1>
        </div>
    );
};

export default ResetPassword;
