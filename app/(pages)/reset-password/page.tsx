import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import React from 'react';

const page = async ({searchParams}: {searchParams: Promise<{[key: string]: string | undefined}>}) => {
    const resolvedSearchParams = await searchParams;
    const token = resolvedSearchParams.token;

    if (token) {
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        // Optionally redirect after setting the cookie
        redirect('/home'); // or wherever you want
    }
    return <div>page</div>;
};

export default page;
