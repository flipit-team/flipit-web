'use client';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useState} from 'react';

interface Props {
    menu: string[];
}

const Header = (props: Props) => {
    const {menu} = props;
    const [showFlyout, setShowFlyout] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (pathname === '/') return;

    return (
        <>
            <div className='xs:grid-sizes bg-primary h-[102px] xs:h-[56px] flex items-center xs:justify-between px-[120px] xs:px-0 text-white'>
                <div className='flex items-center'>
                    {pathname.includes('messages/m') ? (
                        <Image
                            src={'/back-white.svg'}
                            height={24}
                            width={24}
                            alt='bell'
                            className='h-6 w-6 mr-[18px] hidden xs:block'
                            onClick={() => router.back()}
                        />
                    ) : (
                        <Image
                            src={'/mobile-nav.svg'}
                            height={24}
                            width={24}
                            alt='bell'
                            className='h-6 w-6 mr-[18px] hidden xs:block'
                            onClick={() => setShowFlyout(true)}
                        />
                    )}

                    <h1 className='typo-heading_medium_bold xs:typo-heading_small_bold xs:text-center'>Flipit</h1>
                </div>

                <div className='flex xs:hidden gap-[42px] typo-body_large_semibold mx-auto'>
                    <Link href={'/'}>Home</Link>
                    <Link href={'/messages'}>Messages</Link>
                    <Link href={'/current-bids'}>Current Bids</Link>
                </div>
                <div className='flex items-center'>
                    <Link href={'/notifications'}>
                        <Image
                            src={'/bell.svg'}
                            height={32}
                            width={32}
                            alt='bell'
                            className='h-7 w-7 mr-[27px] xs:h-6 xs:w-6'
                        />
                    </Link>

                    <Image
                        src={'/profile-picture.svg'}
                        height={32}
                        width={32}
                        alt='bell'
                        className='h-7 w-7 xs:h-[30px] xs:w-[30px]'
                    />
                    <button className='bg-secondary xs:hidden typo-body_medium_semibold h-[45px] w-[145px] text-white rounded-lg ml-[43px]'>
                        Post Item
                    </button>
                </div>
            </div>
            <div
                className={`hidden xs:block fixed h-[100vh] w-full top-0 bg-[#000000b3] px-4 left-[0px] z-[1000] transition-transform transform duration-300 origin-top ${
                    showFlyout ? 'scale-y-100' : 'scale-y-0'
                }`}
            >
                <div className={`bg-white flex flex-col rounded-lg p-6 w-full mt-[50px] shadow-md`}>
                    <div className='mb-10 w-full flex items-center'>
                        <p className='block mx-auto w-max text-[#333333] typo-heading_small_semibold'>
                            Select Category
                        </p>
                        <Image
                            src={'/cancel.svg'}
                            height={13}
                            width={13}
                            alt='bell'
                            className='h-[13px] w-[13px]'
                            onClick={() => setShowFlyout(false)}
                        />
                    </div>
                    <div className={`overflow-auto custom-scrollbar`}>
                        {menu?.map((item, index) => {
                            if (index < 8)
                                return (
                                    <p key={index} className='h-[58px]'>
                                        {item}
                                    </p>
                                );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
