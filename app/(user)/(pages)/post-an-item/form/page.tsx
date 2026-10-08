import {redirect} from 'next/navigation';
import {Suspense} from 'react';
import GoBack from '~/ui/common/go-back';
import Form from '~/ui/post-an-item/Form';
import LogoLoader from '~/ui/common/logo-loader/LogoLoader';
import {getSingleItemServerSide} from '~/lib/server-api';

const page = async ({searchParams}: {searchParams: Promise<{type?: string; from?: string}>}) => {
    const resolvedSearchParams = await searchParams;
    const formType = resolvedSearchParams.type === 'auction' ? 'auction' : 'listing';
    const fromItemId = resolvedSearchParams.from;

    // If converting from an existing item, fetch its data for prefill
    let prefillItem;
    if (fromItemId) {
        const result = await getSingleItemServerSide(fromItemId);
        if (result.data) {
            prefillItem = result.data;
        }
    }

    try {
        return (
            <div className='w-full h-full px-[120px] xs:px-4'>
                <div className='mt-6 xs:mt-4'>
                    <GoBack />
                </div>
                <div className='flex flex-col items-center mt-[35px] xs:mt-6 py-6 xs:py-4 mx-auto h-max w-[648px] xs:w-full lg:shadow-lg xs:shadow-none px-[30px] xs:px-0'>
                    <Suspense fallback={<LogoLoader inline />}>
                        <Form formType={formType} existingItem={prefillItem} />
                    </Suspense>
                </div>
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default page;
