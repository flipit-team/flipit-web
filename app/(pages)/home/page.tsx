import {Suspense} from 'react';
import MainHome from '~/ui/wrappers/MainHome';

const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <MainHome />
        </Suspense>
    );
};

export default page;
