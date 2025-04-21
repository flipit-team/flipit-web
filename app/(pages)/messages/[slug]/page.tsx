import React from 'react';

const page = () => {
    return (
        <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent'>
            <div className='flex items-center justify-center typo-heading_small_medium xs:typo-body_large_medium text-primary bg-[rgba(0,95,115,0.2)] h-[42px]'>
                iPhone 12 promax
            </div>
            <div className='p-[40px] flex flex-col gap-2'>
                <div className='w-[90%] mr-auto'>
                    <div className='bg-[#f8f8f7] p-3 rounded-lg'>
                        Hi Jane! I’m interested in your iPhone 12 promax. Would you consider trading it for a
                        PlayStation 4? It’s in great condition
                    </div>
                    <p className='text-[#87928A] typo-body_medium_regular'>3:45PM</p>
                </div>
                <div className='w-[90%] ml-auto'>
                    <div className='bg-[rgba(0,95,115,0.1)] p-3 rounded-lg'>
                        Hi Jane! I’m interested in your iPhone 12 promax. Would you consider trading it for a
                        PlayStation 4? It’s in great condition
                    </div>
                    <p className='text-[#87928A] typo-body_medium_regular text-right'>3:45PM</p>
                </div>
            </div>
        </div>
    );
};

export default page;
