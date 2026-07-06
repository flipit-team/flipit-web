'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {UserService} from '~/services/user.service';
import {
    Package,
    HandCoins,
    Bookmark,
    User,
    ShieldCheck,
    Lock,
    Globe,
    Bell,
    Headphones,
    HelpCircle,
    Trash2,
    LogOut,
    ChevronRight,
    Pencil,
    Star,
    BadgeCheck,
} from 'lucide-react';
import {useAppContext} from '~/contexts/AppContext';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    destructive?: boolean;
}

const iconClass = 'h-5 w-5 text-text_four';
const destructiveIconClass = 'h-5 w-5 text-red-500';

const sectionOne: MenuItem[] = [
    {icon: <Package className={iconClass} />, label: 'My Items', href: '/my-items'},
    {icon: <HandCoins className={iconClass} />, label: 'My Offers & Bids', href: '/offers'},
    {icon: <Bookmark className={iconClass} />, label: 'Saved Items', href: '/saved-items'},
];

const sectionTwo: MenuItem[] = [
    {icon: <User className={iconClass} />, label: 'Personal details', href: '/settings'},
    {icon: <ShieldCheck className={iconClass} />, label: 'Verification', href: '/settings?tab=verification'},
    {icon: <Lock className={iconClass} />, label: 'Change Password', href: '/settings?tab=password'},
    {icon: <Globe className={iconClass} />, label: 'Change Language', href: '/settings?tab=language'},
    {icon: <Bell className={iconClass} />, label: 'Manage Notifications', href: '/settings?tab=notifications'},
];

const sectionThree: MenuItem[] = [
    {icon: <Headphones className={iconClass} />, label: 'Contact Us', href: '/support'},
    {icon: <HelpCircle className={iconClass} />, label: 'Frequently asked questions', href: '/faq'},
    {icon: <Trash2 className={destructiveIconClass} />, label: 'Delete Account', href: '/settings?tab=delete-account', destructive: true},
];

const MenuSection = ({items}: {items: MenuItem[]}) => (
    <div className='bg-white rounded-xl overflow-hidden'>
        {items.map((item, index) => (
            <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between py-3.5 px-4 active:bg-gray-50 ${index < items.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
                <div className='flex items-center gap-3.5'>
                    {item.icon}
                    <span className={`font-poppins typo-body-md-regular ${item.destructive ? 'text-red-500' : 'text-text_one'}`}>
                        {item.label}
                    </span>
                </div>
                <ChevronRight className='h-4 w-4 text-gray-300' />
            </Link>
        ))}
    </div>
);

const MobileProfileMenu = () => {
    const {profile, user} = useAppContext();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', {method: 'POST', credentials: 'include'});
        window.location.href = '/login';
    };

    const avatarSrc = (profile as any)?.avatar || '/images/placeholders/placeholder-avatar.svg';
    const fullName = (profile as any)?.firstName
        ? `${(profile as any).firstName} ${(profile as any).lastName || ''}`.trim()
        : (user?.userName || 'User');
    const email = (profile as any)?.email || '';
    const rating = (profile as any)?.avgRating || 0;
    const isVerified = (profile as any)?.phoneNumberVerified || false;

    return (
        <div className='min-h-screen pb-28 px-4 pt-4'>
            {/* Header */}
            <h1 className='font-poppins typo-heading-md-semibold text-text_one text-center mb-4'>Profile</h1>

            {/* User Card */}
            <div className='rounded-2xl p-6 mb-8 shadow-md'>
                <div className='flex flex-col items-center'>
                    <Image
                        src={avatarSrc}
                        height={72}
                        width={72}
                        alt={fullName}
                        className='h-[72px] w-[72px] rounded-full object-cover'
                    />
                    <h2 className='font-poppins typo-body-lg-bold text-text_one mt-2'>{fullName}</h2>
                    <p className='font-poppins typo-body-xs-regular text-text_four mt-0.5'>{email}</p>

                    <div className='flex items-center gap-0.5 mt-1.5'>
                        <Star size={14} className='text-secondary fill-secondary' />
                        <span className='font-poppins typo-body-xs-regular text-text_one'>({rating.toFixed(1)})</span>
                        {isVerified && (
                            <BadgeCheck size={16} className='text-primary fill-primary ml-0.5' />
                        )}
                    </div>

                    <Link
                        href='/settings'
                        className='mt-3 flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-primary text-white font-poppins typo-body-xs-medium'
                    >
                        <Pencil size={12} />
                        Edit Profile
                    </Link>
                </div>
            </div>

            {/* Section 1 */}
            <MenuSection items={sectionOne} />

            <div className='h-4' />

            {/* Section 2 */}
            <MenuSection items={sectionTwo} />

            <div className='h-4' />

            {/* Section 3 */}
            <MenuSection items={sectionThree} />

            {/* Logout */}
            <button
                onClick={handleLogout}
                className='w-full flex items-center justify-between py-3.5 px-4 active:opacity-70'
            >
                <div className='flex items-center gap-3'>
                    <LogOut className='h-5 w-5 text-red-500' />
                    <span className='font-poppins typo-body-md-regular text-red-500'>Log Out</span>
                </div>
                <ChevronRight className='h-4 w-4 text-gray-400' />
            </button>
        </div>
    );
};

export default MobileProfileMenu;
