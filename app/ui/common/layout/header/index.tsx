'use client';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import React, {useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import useAuth from '~/hooks/useAuth';
import LogoutButton from '../../auth/Logout';
import Notifications from '../../modals/Notifications';
import {ShoppingBagIcon} from 'lucide-react';

interface Props {
    avatar?: string;
    user: {
        token: string;
        userId: string | undefined;
        userName: string | undefined;
    } | null;
}

const Header = (props: Props) => {
    const {user} = props;
    const [showFlyout, setShowFlyout] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const {defaultCategories, notifications, profile} = useAppContext();
    const searchParams = useSearchParams();
    const [hovered, setHovered] = useState(false);

    const pushParam = (name: string) => {
        setShowFlyout(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set('categories', name);
        router.push(`/home?${params.toString()}`);
    };

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

                    <Link href={'/home'} className='typo-heading_mb xs:typo-heading_sb xs:text-center'>
                        Flipit
                    </Link>
                </div>

                <div className='flex xs:hidden gap-[42px] typo-body_ls ml-[70px]'>
                    <Link href={'#'}>Live Auction</Link>
                    <Link href={'/messages'}>Messages</Link>
                    <Link href={'/current-bids'}>Current Bids</Link>
                </div>
                {user ? (
                    <div className='flex items-center ml-auto'>
                        <div className='relative group'>
                            <Link href={'/faq'}>
                                <Image
                                    src={'/help.svg'}
                                    height={32}
                                    width={32}
                                    alt='bell'
                                    className='h-7 w-7 mr-[27px] xs:h-6 xs:w-6'
                                />
                            </Link>
                        </div>
                        <div className='relative group'>
                            <Link href={'#'}>
                                <Image
                                    src={'/save.svg'}
                                    height={32}
                                    width={32}
                                    alt='bell'
                                    className='h-7 w-7 mr-[27px] xs:h-6 xs:w-6'
                                />
                            </Link>
                        </div>
                        <div className='relative group'>
                            <Link href={'/notifications'}>
                                <Image
                                    src={'/bell.svg'}
                                    height={32}
                                    width={32}
                                    alt='bell'
                                    className='h-6 w-6 mr-[27px] xs:h-6 xs:w-6'
                                />
                            </Link>
                            <div className='absolute right-0 mt-2 xs:hidden bg-white shadow-md rounded px-4 py-2 text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto'>
                                <Notifications setHovered={setHovered} notifications={notifications?.content} pointer />
                            </div>
                        </div>
                        <div className='relative group'>
                            {/* Profile Icon */}
                            <div className='flex items-center gap-2 cursor-pointer p-2 rounded-full transition'>
                                <Image
                                    src={profile?.avatar ? profile.avatar : '/profile-picture.svg'}
                                    height={32}
                                    width={32}
                                    alt='bell'
                                    className='h-7 w-7 xs:h-[30px] xs:w-[30px] rounded-full'
                                />
                                <div className='typo-body_ls capitalize'>{user.userName ?? 'John Doe'}</div>
                                <Image
                                    src={'/arrow-down.svg'}
                                    height={32}
                                    width={32}
                                    alt='bell'
                                    className='h-4 w-4 xs:h-4 xs:w-4 rounded-full'
                                />
                            </div>

                            {/* Logout Button (stays visible when hovering over it) */}
                            {user && (
                                <div className='flex flex-col gap-2 absolute right-0  bg-white shadow-md rounded px-4 py-2 text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto'>
                                    <Link
                                        href={'/my-items'}
                                        className='text-text_one font-medium flex items-center gap-2 whitespace-nowrap'
                                    >
                                        <ShoppingBagIcon height={16} width={16} />
                                        My Items
                                    </Link>
                                    <Link
                                        href={'/profile'}
                                        className='text-text_one font-medium flex items-center gap-2 whitespace-nowrap'
                                    >
                                        <ShoppingBagIcon height={16} width={16} />
                                        My Profile
                                    </Link>
                                    <LogoutButton setShowFlyout={setShowFlyout} />
                                </div>
                            )}
                        </div>

                        <Link
                            href={user ? '/post-an-item/entry' : '/'}
                            className='flex items-center justify-center bg-secondary xs:hidden typo-body_ms h-[45px] w-[145px] text-white rounded-lg ml-[43px]'
                        >
                            Post Item
                        </Link>
                    </div>
                ) : (
                    <div className='flex items-center ml-auto'>
                        <Image
                            src={'/help.svg'}
                            height={32}
                            width={32}
                            alt='bell'
                            className='h-7 w-7 xs:h-4 xs:w-4 rounded-full'
                        />
                        <Link
                            href={'/'}
                            className='flex items-center justify-center xs:hidden typo-body_ms h-[45px] w-[145px] text-white rounded-lg'
                        >
                            Sign In
                        </Link>
                        <Link
                            href={user ? '/post-an-item/entry' : '/'}
                            className='flex items-center justify-center bg-secondary xs:hidden typo-body_ms h-[45px] w-[145px] text-white rounded-lg ml-[43px]'
                        >
                            Post Item
                        </Link>
                    </div>
                )}
            </div>
            <div
                className={`hidden xs:block fixed h-[100vh] w-full top-0 bg-[#000000b3] px-4 left-[0px] z-[1000] transition-transform transform duration-300 origin-top ${
                    showFlyout ? 'scale-y-100' : 'scale-y-0'
                }`}
            >
                <div className={`bg-white flex flex-col rounded-lg p-6 w-full mt-[50px] shadow-md`}>
                    <div className='mb-10 w-full flex items-center'>
                        <p className='block mx-auto w-max text-[#333333] typo-heading_ss'>Select Category</p>
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
                        {defaultCategories?.map((item, index) => {
                            if (index < 8)
                                return (
                                    <p onClick={() => pushParam(item.name)} key={index} className='h-[58px]'>
                                        {item.name}
                                    </p>
                                );
                        })}
                        {user && <LogoutButton setShowFlyout={setShowFlyout} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
