'use client';

import {Suspense} from 'react';
import CurrentBids from '~/ui/wrappers/CurrentBids';

export default function ClientCurrentBidsPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            {/* <CurrentBids /> */}
            <div></div>
        </Suspense>
    );
}
