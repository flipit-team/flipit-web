'use client';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useState, useEffect, Suspense} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import Notifications from '../../modals/Notifications';
import {ShoppingBag, Megaphone, BarChart3, Settings, LogOut} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';

interface Props {
    avatar?: string;
    user: {
        token: string;
        userId: string | undefined;
        userName: string | undefined;
    } | null;
}

function HeaderContent(props: Props) {
    const {user: serverUser} = props;
    const [showFlyout, setShowFlyout] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [profileDropdownTimeout, setProfileDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const {notifications, profile, user: clientUser, debugMode, toggleDebugMode} = useAppContext();

    // Dummy user data for testing (only when debug mode is enabled)
    const dummyUser = debugMode ? {
        token: 'dummy-token-123',
        userId: '1',
        userName: 'John Doe'
    } : null;

    // Use debug mode from context to determine which user data to use
    const user = dummyUser || clientUser || serverUser;

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Profile dropdown handlers with delay to prevent accidental closures
    const handleProfileMouseEnter = () => {
        if (profileDropdownTimeout) {
            clearTimeout(profileDropdownTimeout);
            setProfileDropdownTimeout(null);
        }
        setShowProfileDropdown(true);
    };

    const handleProfileMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowProfileDropdown(false);
        }, 300); // 300ms delay before closing
        setProfileDropdownTimeout(timeout);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (profileDropdownTimeout) {
                clearTimeout(profileDropdownTimeout);
            }
        };
    }, [profileDropdownTimeout]);

    // Log header user state for debugging
    useEffect(() => {
        // Debug logging removed
    }, [debugMode, serverUser, clientUser, user]);

    // Main sidebar menu items
    const mainMenuItems = [
        {
            href: '/my-items',
            label: 'My Items',
            icon: ShoppingBag,
        },
        {
            href: '/my-adverts',
            label: 'My Adverts',
            icon: Megaphone,
        },
        {
            href: '/performance',
            label: 'Performance',
            icon: BarChart3,
        },
        {
            href: '/settings',
            label: 'Settings',
            icon: Settings,
        }
    ];

    const handleLogout = async () => {
        setShowFlyout(false);
        
        try {
            // Call logout API to clear cookies
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                // Redirect to login page
                window.location.href = '/';
            } else {
                // Still redirect even if logout API fails
                window.location.href = '/';
            }
        } catch (error) {
            // Still redirect even if there's an error
            window.location.href = '/';
        }
    };

    if (!isClient || pathname === '/') return null;

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
                    <Link
                        href={'/live-auction'}
                        className={pathname === '/live-auction' ? 'text-secondary' : 'text-white'}
                    >
                        Live Auction
                    </Link>
                    <Link
                        href={'/messages'}
                        className={pathname.startsWith('/messages') ? 'text-secondary' : 'text-white'}
                    >
                        Messages
                    </Link>
                    <Link
                        href={'/current-bids'}
                        className={pathname === '/current-bids' ? 'text-secondary' : 'text-white'}
                    >
                        Current Bids
                    </Link>
                </div>
                {user ? (
                    <div className='flex items-center ml-auto'>
                        {/* Debug Mode Toggle - Only visible on desktop */}
                        <div className='relative group xs:hidden mr-[27px]'>
                            <button
                                onClick={toggleDebugMode}
                                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    debugMode 
                                        ? 'bg-red-500 text-white' 
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                                title={`Debug mode: ${debugMode ? 'ON' : 'OFF'}`}
                            >
                                D
                            </button>
                        </div>
                        
                        {/* FAQ Icon */}
                        <div className='relative group'>
                            <Link href={'/faq'}>
                                <Image
                                    src={pathname === '/faq' ? '/help-yellow.svg' : '/help.svg'}
                                    height={32}
                                    width={32}
                                    alt='help'
                                    className='h-7 w-7 mr-[27px] xs:h-6 xs:w-6 xs:mr-[16px]'
                                />
                            </Link>
                        </div>
                        
                        {/* Saved Items - Hidden on mobile */}
                        <div className='relative group xs:hidden'>
                            <Link href={'/saved-items'}>
                                <Image
                                    src={pathname === '/saved-items' ? '/save-yellow.svg' : '/save.svg'}
                                    height={32}
                                    width={32}
                                    alt='saved items'
                                    className='h-7 w-7 mr-[27px]'
                                />
                            </Link>
                        </div>
                        
                        {/* Notifications Icon */}
                        <div className='relative group'>
                            <Link href={'/notifications'}>
                                <Image
                                    src={pathname === '/notifications' ? '/bell-yellow.svg' : '/bell.svg'}
                                    height={32}
                                    width={32}
                                    alt='notifications'
                                    className='h-6 w-6 mr-[27px] xs:h-6 xs:w-6 xs:mr-[16px]'
                                />
                            </Link>
                            {!hovered && (
                                <div className='absolute right-0 mt-2 xs:hidden bg-white shadow-md rounded px-4 py-2 text-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto'>
                                    <Notifications setHovered={setHovered} notifications={notifications?.content} pointer />
                                </div>
                            )}
                        </div>
                        
                        {/* Profile Icon */}
                        <div className='relative'>
                            <div
                                className='flex items-center gap-2 cursor-pointer p-2 rounded-full transition'
                                onMouseEnter={handleProfileMouseEnter}
                                onMouseLeave={handleProfileMouseLeave}
                            >
                                <Image
                                    src={profile?.avatar ? profile.avatar : '/profile-picture.svg'}
                                    height={32}
                                    width={32}
                                    alt='profile'
                                    className='h-7 w-7 xs:h-[30px] xs:w-[30px] rounded-full'
                                />
                                {/* Username - Hidden on mobile */}
                                <div className='typo-body_ls capitalize xs:hidden'>{user.userName ?? 'John Doe'}</div>
                                {/* Dropdown Arrow - Hidden on mobile */}
                                <Image
                                    src={'/arrow-down.svg'}
                                    height={32}
                                    width={32}
                                    alt='dropdown'
                                    className='h-4 w-4 rounded-full xs:hidden'
                                />
                            </div>

                            {/* Profile Dropdown */}
                            {user && (
                                <ProfileDropdown
                                    setShowFlyout={setShowFlyout}
                                    isVisible={showProfileDropdown}
                                    onMouseEnter={handleProfileMouseEnter}
                                    onMouseLeave={handleProfileMouseLeave}
                                />
                            )}
                        </div>

                        {/* Post Item Button - Hidden on mobile */}
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
            
            {/* Mobile Hamburger Menu - Slides in from right */}
            <div
                className={`hidden xs:block fixed w-full bg-white shadow-lg z-[50] transition-transform transform duration-300 ${
                    showFlyout ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{
                    top: '56px', // Height of mobile header
                    bottom: '80px' // Space for mobile nav (estimated height)
                }}
            >
                <div className='w-full h-full p-6 flex flex-col'>
                    <div className='mb-6 w-full flex items-center justify-between'>
                        <p className='text-text_one typo-heading_ss'>Menu</p>
                        <Image
                            src={'/cancel.svg'}
                            height={13}
                            width={13}
                            alt='close'
                            className='h-[13px] w-[13px] cursor-pointer'
                            onClick={() => setShowFlyout(false)}
                        />
                    </div>
                    <div className='flex-1 overflow-auto custom-scrollbar space-y-2'>
                        {/* Main Menu Items */}
                        {mainMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setShowFlyout(false)}
                                    className={`
                                        flex items-center gap-3 h-[50px] px-4 rounded-md transition-colors duration-200 w-full
                                        ${isActive 
                                            ? 'bg-primary bg-opacity-10 text-primary' 
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                        }
                                    `}
                                >
                                    <Icon className='w-5 h-5' />
                                    <span className='font-medium'>{item.label}</span>
                                </Link>
                            );
                        })}
                        
                        {/* Logout Button */}
                        {user && (
                            <button
                                onClick={handleLogout}
                                className='w-full flex items-center gap-3 h-[50px] px-4 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200'
                            >
                                <LogOut className='w-5 h-5' />
                                <span className='font-medium'>Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

const Header = (props: Props) => {
    return (
        <Suspense fallback={null}>
            <HeaderContent {...props} />
        </Suspense>
    );
};

export default Header;
