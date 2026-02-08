import {redirect} from 'next/navigation';
import {Suspense} from 'react';
import Verify from '~/ui/wrappers/Verify';
import Loading from '~/ui/common/loading/Loading';

export default function page() {
    try {
        return (
            <Suspense fallback={<Loading size="md" />}>
                <Verify />
            </Suspense>
        );
    } catch {
        redirect('/error-page');
    }
}
