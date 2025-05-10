import {Suspense} from 'react';
import Verify from '~/ui/wrappers/Verify';

export default function page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Verify />
        </Suspense>
    );
}
