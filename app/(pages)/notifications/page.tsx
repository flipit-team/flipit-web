import Image from 'next/image';
import React from 'react';

const page = () => {
    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            <h1 className='typo-heading_medium_semibold my-6 xs:mx-4'>Notifications</h1>
            <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent flex flex-col gap-6'>
                <div className='flex items-center border-b border-border_gray w-full p-6'>
                    <Image
                        src={'/speaker.svg'}
                        height={24}
                        width={24}
                        alt='camera'
                        className='mr-[18px] rounded h-[24px] w-[24px]'
                    />
                    <div>
                        <p className='typo-body_large_regular xs:typo-body_medium_regular'>
                            Your bid on Samsung Galaxy S21 was surpassed.
                        </p>
                        <p className='typo-body_large_regular xs:typo-body_medium_regular text-text_four'>Dec 17</p>
                    </div>
                    <Image src={'/cancel-grey.svg'} height={24} width={24} alt='cancel' className='h-6 w-6 ml-auto' />
                </div>
                <div className='flex items-center border-b border-border_gray w-full p-6'>
                    <Image
                        src={'/speaker.svg'}
                        height={24}
                        width={24}
                        alt='camera'
                        className='mr-[18px] rounded h-[24px] w-[24px]'
                    />
                    <div>
                        <p className='typo-body_large_regular xs:typo-body_medium_regular'>
                            Your bid on Samsung Galaxy S21 was surpassed.
                        </p>
                        <p className='typo-body_large_regular xs:typo-body_medium_regular text-text_four'>Dec 17</p>
                    </div>
                    <Image src={'/cancel-grey.svg'} height={24} width={24} alt='cancel' className='h-6 w-6 ml-auto' />
                </div>
                <div className='flex items-center border-b border-border_gray w-full p-6'>
                    <Image
                        src={'/speaker.svg'}
                        height={24}
                        width={24}
                        alt='camera'
                        className='mr-[18px] rounded h-[24px] w-[24px]'
                    />
                    <div>
                        <p className='typo-body_large_regular xs:typo-body_medium_regular'>
                            Your bid on Samsung Galaxy S21 was surpassed.
                        </p>
                        <p className='typo-body_large_regular xs:typo-body_medium_regular text-text_four'>Dec 17</p>
                    </div>
                    <Image src={'/cancel-grey.svg'} height={24} width={24} alt='cancel' className='h-6 w-6 ml-auto' />
                </div>
            </div>
        </div>
    );
};

export default page;
