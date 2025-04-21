import {Suspense} from 'react';
import MainChats from '~/ui/wrappers/MainChats';

const page = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <MainChats />
        </Suspense>
    );
};

export default page;
