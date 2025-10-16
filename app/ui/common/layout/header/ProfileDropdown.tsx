'use client';
import Link from 'next/link';
import React from 'react';
import {ShoppingBagIcon, MegaphoneIcon, BarChart3Icon, SettingsIcon} from 'lucide-react';
import LogoutButton from '../../auth/Logout';

interface ProfileDropdownProps {
    setShowFlyout: React.Dispatch<React.SetStateAction<boolean>>;
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const ProfileDropdown = ({setShowFlyout, isVisible, onMouseEnter, onMouseLeave}: ProfileDropdownProps) => {
    if (!isVisible) return null;

    return (
        <div
            className='absolute right-0 top-full pt-3 z-50'
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Invisible bridge to prevent gap between trigger and dropdown */}
            <div className='h-3 w-full absolute top-0'></div>

            <div className='bg-white shadow-lg rounded-lg p-4 min-w-[200px]'>
                {/* Arrow pointer */}
                <div className='absolute top-1 right-6 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white'></div>

                <div className='flex flex-col gap-4'>
                <Link
                    href={'/my-items'}
                    className='text-text_one font-medium flex items-center whitespace-nowrap hover:text-primary transition-colors'
                    style={{ gap: '14px' }}
                >
                    <ShoppingBagIcon height={20} width={20} />
                    My Items
                </Link>
                
                <Link
                    href={'/my-adverts'}
                    className='text-text_one font-medium flex items-center whitespace-nowrap hover:text-primary transition-colors'
                    style={{ gap: '14px' }}
                >
                    <MegaphoneIcon height={20} width={20} />
                    My Advert
                </Link>
                
                <Link
                    href={'/performance'}
                    className='text-text_one font-medium flex items-center whitespace-nowrap hover:text-primary transition-colors'
                    style={{ gap: '14px' }}
                >
                    <BarChart3Icon height={20} width={20} />
                    Performance
                </Link>
                
                <Link
                    href={'/settings'}
                    className='text-text_one font-medium flex items-center whitespace-nowrap hover:text-primary transition-colors'
                    style={{ gap: '14px' }}
                >
                    <SettingsIcon height={20} width={20} />
                    Settings
                </Link>
                
                {/* Separator line */}
                <div className='h-px bg-neutral-400'></div>

                <LogoutButton setShowFlyout={setShowFlyout} />
                </div>
            </div>
        </div>
    );
};

export default ProfileDropdown;