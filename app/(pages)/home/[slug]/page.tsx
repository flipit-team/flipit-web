import {Suspense} from 'react';
import Home from '~/ui/wrappers/Home';

const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Home />
        </Suspense>
    );
};

export default page;
