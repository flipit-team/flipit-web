import {Suspense} from 'react';
import GoogleCallbackHandler from '~/ui/wrappers/Callback';

export default function page() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <GoogleCallbackHandler />
        </Suspense>
    );
}
