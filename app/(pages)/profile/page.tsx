import {redirect} from 'next/navigation';
import React, {Suspense} from 'react';
import Profile from '~/ui/wrappers/Profile';

const page = () => {
    try {
        return (
            <Suspense fallback={<p>Loading...</p>}>
                <Profile />
            </Suspense>
        );
    } catch {
        redirect('/error-page');
    }
};

export default page;
