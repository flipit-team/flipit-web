import {redirect} from 'next/navigation';
import React, {Suspense} from 'react';
import Profile from '~/ui/wrappers/Profile';
import Loading from '~/ui/common/loading/Loading';

const page = () => {
    try {
        return (
            <Suspense fallback={<Loading size="md" text="Loading..." />}>
                <Profile />
            </Suspense>
        );
    } catch {
        redirect('/error-page');
    }
};

export default page;
