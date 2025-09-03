import {redirect} from 'next/navigation';
import {Suspense} from 'react';
import GoBack from '~/ui/common/go-back';
import Form from '~/ui/post-an-item/Form';

const page = async ({searchParams}: {searchParams: Promise<{type?: string}>}) => {
    const resolvedSearchParams = await searchParams;
    const formType = resolvedSearchParams.type === 'auction' ? 'auction' : 'listing';
    try {
        return (
            <div className='w-full h-full px-[120px]'>
                <div className='mt-6'>
                    <GoBack />
                </div>
                <div className='flex flex-col items-center mt-[35px] xs:mt-0 py-6 mx-auto h-max w-[648px] xs:w-full lg:shadow-lg px-[30px]'>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Form formType={formType} />
                    </Suspense>
                </div>
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default page;
