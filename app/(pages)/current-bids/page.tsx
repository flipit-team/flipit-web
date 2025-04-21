import {Suspense} from 'react';
import CurrentBids from '~/ui/wrappers/CurrentBids';

const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <CurrentBids />
        </Suspense>
    );
};

export default page;
