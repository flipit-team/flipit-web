'use client';

import Form from '~/ui/post-an-item/Form';

const page = () => {
    return (
        <div className='w-full h-full'>
            <div className='flex flex-col items-center mt-[35px] xs:mt-0 py-6 mx-auto h-max w-[648px] xs:w-full lg:shadow-[0px_4px_10px_rgba(0,0,0,0.2)] px-[30px]'>
                <h1 className='typo-heading_medium_semibold xs:hidden'>Post an Item</h1>
                <Form />
            </div>
        </div>
    );
};

export default page;
