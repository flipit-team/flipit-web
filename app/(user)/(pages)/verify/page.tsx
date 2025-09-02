import {redirect} from 'next/navigation';
import {Suspense} from 'react';
import Verify from '~/ui/wrappers/Verify';

export default function page() {
    try {
        return (
            <Suspense fallback={<p>Loading...</p>}>
                <Verify />
            </Suspense>
        );
    } catch {
        redirect('/error-page');
    }
}
