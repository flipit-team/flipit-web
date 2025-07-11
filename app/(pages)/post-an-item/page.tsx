import {redirect} from 'next/navigation';
import {Suspense} from 'react';
import Form from '~/ui/post-an-item/Form';

const page = () => {
    try {
        return (
            <div className='w-full h-full'>
                <div className='flex flex-col items-center mt-[35px] xs:mt-0 py-6 mx-auto h-max w-[648px] xs:w-full lg:shadow-[0px_4px_10px_rgba(0,0,0,0.2)] px-[30px]'>
                    <h1 className='typo-heading_ms xs:hidden'>Post an Item</h1>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Form />
                    </Suspense>
                </div>
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default page;
