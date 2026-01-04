'use client';
import Link from 'next/link';
import React from 'react';
import {NotificationDTO} from '~/types/api';
import NotificationsService from '~/services/notifications.service';

interface Props {
    setHovered: React.Dispatch<React.SetStateAction<boolean>>;
    pointer?: boolean;
    notifications?: NotificationDTO[];
}

const Notifications = (props: Props) => {
    const {pointer, notifications} = props;

    const handleNotificationClick = async (notificationId: number) => {
        try {
            // Mark as read when clicked
            await NotificationsService.markAsRead(notificationId);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <div>
            {pointer ? (
                <div
                    className='w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent
            border-b-[10px] border-b-white absolute top-[-7px] right-[30px]'
                />
            ) : (
                <></>
            )}

            <div className='min-w-[200px] bg-white typo-body_mm'>
                {notifications?.map((item, i) => {
                    if (i > 2) return;

                    // Determine the navigation link
                    let navigationLink = item.resourceLink || '/notifications';
                    if (navigationLink.toLowerCase().includes('offer')) {
                        navigationLink = '/offers';
                    }

                    return (
                        <Link
                            prefetch={false}
                            href={navigationLink}
                            key={i}
                            onClick={() => handleNotificationClick(item.id)}
                            className={`whitespace-nowrap py-[8px] px-[12px] text-text_one h-[36px] cursor-pointer
                         flex items-center hover:text-form-text-active hover-state-300 gap-2 ${
                             !item.read ? 'font-semibold' : ''
                         }`}
                        >
                            {!item.read && (
                                <div className='h-2 w-2 rounded-full bg-secondary flex-shrink-0' title='Unread' />
                            )}
                            <span className='truncate'>{item.title}</span>
                        </Link>
                    );
                })}
                <Link href={'/notifications'} className='text-text_one block py-[8px] px-[12px] border-t border-border-primary hover:text-primary'>
                    See all notifications
                </Link>
            </div>
        </div>
    );
};

export default Notifications;
