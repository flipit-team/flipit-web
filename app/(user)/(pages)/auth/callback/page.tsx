import {Suspense} from 'react';
import GoogleCallbackHandler from '~/ui/wrappers/Callback';
import LogoLoader from '~/ui/common/logo-loader/LogoLoader';

export default function page() {
    return (
        <Suspense fallback={<LogoLoader />}>
            <GoogleCallbackHandler />
        </Suspense>
    );
}
