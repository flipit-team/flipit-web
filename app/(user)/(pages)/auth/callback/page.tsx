import {Suspense} from 'react';
import GoogleCallbackHandler from '~/ui/wrappers/Callback';
import Loading from '~/ui/common/loading/Loading';

export default function page() {
    return (
        <Suspense fallback={<Loading size="md" text="Loading..." />}>
            <GoogleCallbackHandler />
        </Suspense>
    );
}
