import React, {Suspense} from 'react';
import AuthSuccessPage from '~/ui/wrappers/AuthSuccess';

const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <AuthSuccessPage />
        </Suspense>
    );
};

export default page;
