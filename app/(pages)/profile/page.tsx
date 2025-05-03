import React, {Suspense} from 'react';
import Profile from '~/ui/wrappers/Profile';

const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Profile />
        </Suspense>
    );
};

export default page;
