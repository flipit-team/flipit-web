'use client';
import Image from 'next/image';
import React from 'react';

const Page = () => {
    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            <h1 className='typo-heading_medium_semibold my-6 xs:mx-4'>Current Bids</h1>
            <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent flex flex-col gap-6 p-8 xs:p-4'>
                <div className='flex items-center border border-border_gray rounded-lg w-[672px] xs:w-full p-3'>
                    <Image
                        src={'/camera.png'}
                        height={64}
                        width={64}
                        alt='camera'
                        className='mr-[18px] rounded h-[64px] w-[64px] xs:h-[73px] xs:w-[73px]'
                    />
                    <div>
                        <div className='flex items-center'>
                            <p className='text-primary typo-body_large_semibold xs:typo-body_medium_semibold'>
                                Canon EOS RP Camera +Small Rig{' '}
                            </p>
                            <span className='xs:hidden py-1 px-2 text-[#e40808] typo-body_small_regular bg-[rgba(228,8,8,0.18)] rounded ml-4'>
                                Outbid
                            </span>
                        </div>
                        <p className='typo-body_medium_regular xs:typo-body_medium_regular text-text_one'>
                            Your bid:&nbsp; ₦600,000{' '}
                        </p>
                        <span className='hidden w-max xs:flex py-1 px-2 text-[#e40808] typo-body_small_regular bg-[rgba(228,8,8,0.18)] rounded'>
                            Outbid
                        </span>
                    </div>
                </div>
                <div className='flex items-center border border-border_gray rounded-lg w-[672px] xs:w-full p-3'>
                    <Image
                        src={'/camera.png'}
                        height={64}
                        width={64}
                        alt='camera'
                        className='mr-[18px] rounded xs:h-[73px] xs:w-[73px]'
                    />
                    <div>
                        <div className='flex items-center'>
                            <p className='text-primary typo-body_large_semibold xs:typo-body_medium_semibold'>
                                Canon EOS RP Camera +Small Rig
                            </p>
                            <span className='xs:hidden py-1 px-2 text-[#039509] typo-body_small_regular bg-[rgba(3,149,9,0.18)] rounded ml-4'>
                                Successful
                            </span>
                        </div>
                        <p className='typo-body_medium_regular xs:typo-body_medium_regular text-text_one'>
                            Your bid:&nbsp; ₦600,000{' '}
                        </p>
                        <span className='hidden w-max xs:flex py-1 px-2 text-[#039509] typo-body_small_regular bg-[rgba(3,149,9,0.18)] rounded'>
                            Successful
                        </span>
                    </div>
                </div>
                <div className='flex items-center border border-border_gray rounded-lg w-[672px] xs:w-full p-3'>
                    <Image
                        src={'/camera.png'}
                        height={64}
                        width={64}
                        alt='camera'
                        className='mr-[18px] rounded xs:h-[73px] xs:w-[73px]'
                    />
                    <div>
                        <div className='flex items-center'>
                            <p className='text-primary typo-body_large_semibold xs:typo-body_medium_semibold'>
                                Canon EOS RP Camera +Small Rig{' '}
                            </p>
                            <span className='xs:hidden py-1 px-2 text-[#E47208] typo-body_small_regular bg-[rgba(228,114,8,0.18)] rounded ml-4'>
                                Pending seller’s response
                            </span>
                        </div>
                        <p className='typo-body_medium_regular xs:typo-body_medium_regular text-text_one'>
                            Your bid:&nbsp; ₦600,000{' '}
                        </p>
                        <span className='hidden w-max xs:flex py-1 px-2 text-[#E47208] typo-body_small_regular bg-[rgba(228,114,8,0.18)] rounded'>
                            Pending seller’s response
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
