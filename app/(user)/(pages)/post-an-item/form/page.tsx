import {redirect} from 'next/navigation';
import {Suspense} from 'react';
import GoBack from '~/ui/common/go-back';
import Form from '~/ui/post-an-item/Form';
import Loading from '~/ui/common/loading/Loading';

const page = async ({searchParams}: {searchParams: Promise<{type?: string}>}) => {
    const resolvedSearchParams = await searchParams;
    const formType = resolvedSearchParams.type === 'auction' ? 'auction' : 'listing';
    try {
        return (
            <div className='w-full h-full px-[120px] xs:px-4'>
                <div className='mt-6 xs:mt-4'>
                    <GoBack />
                </div>
                <div className='flex flex-col items-center mt-[35px] xs:mt-6 py-6 xs:py-4 mx-auto h-max w-[648px] xs:w-full lg:shadow-lg xs:shadow-none px-[30px] xs:px-0'>
                    <Suspense fallback={<Loading size="md" text="Loading..." />}>
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
