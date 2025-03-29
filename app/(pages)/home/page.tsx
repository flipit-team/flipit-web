import Image from 'next/image';
import Link from 'next/link';
import React, {useState} from 'react';
import UsedBadge from '~/ui/common/badges/UsedBadge';
import Header from '~/ui/common/layout/header';

const page = () => {
    const menu = ['vehicles', 'apparel', 'Electronics', 'Entertainment', 'Home Appliances', 'Phones', 'Fashion'];
    return (
        <div className='flex flex-col relative'>
            <div className='xs:px-4 h-[206px] xs:h-[184px] bg-[#005f73f5] flex flex-col gap-7 xs:gap-6 py-11 xs:pt-[36px] xs:pb-[29px]'>
                <div className='flex items-center gap-4 mx-auto text-white'>
                    <p className='typo-body_large_regular'>Items near me</p>
                    <div className='border border-border_gray h-[37px] px-4 flex items-center rounded-md'>
                        <Image src={'/location.svg'} height={24} width={24} alt='bell' className='h-6 w-6 mr-2' />
                        <p className='typo-body_medium_regular'>Ogude,Lagos</p>
                        <Image src={'/arrow-down.svg'} height={16} width={16} alt='bell' className='h-4 wl4 ml-2' />
                    </div>
                </div>
                <div className='relative h-[49px] w-[586px] xs:w-full xs:flex-none mx-auto my-auto outline-none border-none'>
                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-full h-[49px] pl-6 pr-4 py-2 typo-body_mr text-text-primary bg-odds-buttons-bg-primary-color border border-none outline-none rounded-md focus:outline-none  focus:ring-transparent focus:border-none'
                    />
                    <div className='h-[49px] w-[49px] absolute top-[0px] right-0 bg-[#e0f0f0] rounded-r-md flex items-center justify-center'>
                        <Image
                            className='h-6 w-6 cursor-pointer'
                            src={'/search.svg'}
                            alt='search'
                            height={24}
                            width={24}
                        />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-[260px_1fr] xs:grid-cols-1 gap-6 px-[120px] xs:px-0'>
                <div className='w-full flex flex-col mt-7 xs:hidden'>
                    <div className='h-[58px] flex items-center gap-2'>
                        <Image
                            className='h-5 w-5 cursor-pointer'
                            src={'/shop.svg'}
                            alt='search'
                            height={20}
                            width={20}
                        />
                        <p className='typo-body_medium_medium text-primary'>Browse all</p>
                    </div>
                    <p className='h-[58px] typo-heading_small_semibold'>Categories</p>
                    {menu.map((item, i) => {
                        return (
                            <p key={i} className='h-[58px] typo-body_medium_medium capitalize'>
                                {item}
                            </p>
                        );
                    })}
                </div>

                <div className='xs:grid-sizes xs:w-full'>
                    <div className='hidden mt-5 mb-5 xs:flex items-center justify-center bg-[#005f732b] text-[#333333] typo-body_large_semibold w-max px-[10px] rounded-lg h-[36px]'>
                        Categories
                    </div>
                    <div className='py-9 xs:py-0 xs:mb-4 typo-heading_medium_semibold'>Available Items</div>
                    <div className='grid grid-cols-3 xs:grid-cols-2 gap-6 xs:gap-4'>
                        {Array.from('111111111111111').map((item, i) => {
                            return (
                                <Link
                                    href={'/home/camera'}
                                    key={i}
                                    className='h-[400px] w-[349px] xs:w-full xs:h-[260px] border border-border_gray rounded-md'
                                >
                                    <Image
                                        className='h-[302px] w-[349px] xs:w-full xs:h-[128px] cursor-pointer'
                                        src={'/camera.png'}
                                        alt='search'
                                        height={302}
                                        width={349}
                                    />
                                    <div className='p-4 xs:p-3 h-[98px] xs:h-[132px]'>
                                        <p className='typo-body_medium_regular xs:typo-body_small_regular xs:mb-2'>
                                            Canon EOS RP Camera +Small Rig | Clean U...{' '}
                                        </p>
                                        <p className='typo-body_large_medium xs:typo-body_medium_medium xs:mb-1'>
                                            ₦1,300,000
                                        </p>
                                        <div className='flex xs:flex-col justify-between items-center xs:items-start rounded'>
                                            <p className='typo-body_small_regular xs:text-[11px] xs:mb-1'>
                                                Cash/Item offers
                                            </p>
                                            <UsedBadge text='Fairly Used' />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
