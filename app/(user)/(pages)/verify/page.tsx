import {redirect} from 'next/navigation';
import {Suspense} from 'react';
import Verify from '~/ui/wrappers/Verify';
import LogoLoader from '~/ui/common/logo-loader/LogoLoader';

export default function page() {
    try {
        return (
            <Suspense fallback={<LogoLoader />}>
                <Verify />
            </Suspense>
        );
    } catch {
        redirect('/error-page');
    }
}
