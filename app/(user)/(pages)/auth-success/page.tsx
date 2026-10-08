import React, {Suspense} from 'react';
import AuthSuccessPage from '~/ui/wrappers/AuthSuccess';
import LogoLoader from '~/ui/common/logo-loader/LogoLoader';

const page = () => {
    return (
        <Suspense fallback={<LogoLoader />}>
            <AuthSuccessPage />
        </Suspense>
    );
};

export default page;
