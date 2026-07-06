'use client';
import React, {useMemo} from 'react';
import NavItem from './NavItem';
import {HomeIcon} from './tab-icons.tsx/HomeIcon';
import {usePathname} from 'next/navigation';
import {MessagesIcon} from './tab-icons.tsx/MessagesIcon';
import {PostItemIcon} from './tab-icons.tsx/PostItemIcon';
import clsx from 'clsx';
import {ProfileIcon} from './tab-icons.tsx/ProfileIcon';
import {AuctionIcon} from './tab-icons.tsx/AuctionIcon';
import {useUnreadCount} from '~/contexts/UnreadCountContext';

interface Tab {
    id: number;
    link: string;
    icon(isActive: boolean): React.ReactNode;
    label: string;
    listForActiveLink: string[];
    badgeKey?: 'messagesCount' | 'notificationsCount';
}

const BottomNavBar: React.FC = () => {
    const pathName: string = usePathname();
    const {counts} = useUnreadCount();

    const tabs: Tab[] = useMemo(() => [
        {
            id: 1,
            link: '/',
            icon: (isActive: boolean) => <HomeIcon isActive={isActive} />,
            label: 'Home',
            listForActiveLink: ['/']
        },
        {
            id: 2,
            link: '/live-auction',
            icon: (isActive: boolean) => <AuctionIcon isActive={isActive} />,
            label: 'Auction',
            listForActiveLink: ['/live-auction']
        },
        {
            id: 3,
            link: '/post-an-item/entry',
            icon: (isActive: boolean) => <PostItemIcon isActive={isActive} />,
            label: 'Post Item',
            listForActiveLink: ['/post-an-item']
        },
        {
            id: 4,
            link: '/messages',
            icon: (isActive: boolean) => <MessagesIcon isActive={isActive} />,
            label: 'Messages',
            listForActiveLink: ['/messages'],
            badgeKey: 'messagesCount' as const,
        },
        {
            id: 5,
            link: '/profile',
            icon: (isActive: boolean) => <ProfileIcon isActive={isActive} />,
            label: 'Profile',
            listForActiveLink: ['/profile']
        }
    ], []);

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 w-[100vw] bg-white border-t border-gray-200 shadow-lg p-2 z-popover pb-7'
            )}
        >
            <div className='flex justify-around items-center'>
                {tabs.map((item, index) => {
                    const activeTab = item.listForActiveLink.some((activePath) =>
                        activePath === '/' ? pathName === '/' : pathName.startsWith(activePath)
                    );

                    return (
                        <NavItem
                            key={index}
                            href={item.link}
                            icon={item.icon(activeTab)}
                            label={item.label}
                            activeTab={activeTab}
                            badge={item.badgeKey ? counts[item.badgeKey] : undefined}
                        />
                    );
                })}
            </div>
        </div>
    );
};
export default BottomNavBar;
