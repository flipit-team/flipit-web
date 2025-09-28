import React, {Suspense} from 'react';
import AuthSuccessPage from '~/ui/wrappers/AuthSuccess';
import Loading from '~/ui/common/loading/Loading';

const page = () => {
    return (
        <Suspense fallback={<Loading size="md" text="Loading..." />}>
            <AuthSuccessPage />
        </Suspense>
    );
};

export default page;
