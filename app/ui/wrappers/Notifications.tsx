'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import {formatToMonthDay} from '~/utils/helpers';
import NoData from '../common/no-data/NoData';
import NotificationsService from '~/services/notifications.service';
import {useRouter} from 'next/navigation';

const Notifications = () => {
    const {notifications, refreshNotifications} = useAppContext();
    const router = useRouter();
    const [localNotifications, setLocalNotifications] = useState(notifications?.content || []);

    useEffect(() => {
        setLocalNotifications(notifications?.content || []);
    }, [notifications]);

    // Mark all as seen when component mounts
    useEffect(() => {
        const markAllAsSeen = async () => {
            try {
                await NotificationsService.markAllAsSeen();
                // Refresh notifications to update counts
                await refreshNotifications();
            } catch (error) {
                console.error('Failed to mark notifications as seen:', error);
            }
        };

        if (notifications?.content && notifications.content.length > 0) {
            markAllAsSeen();
        }
    }, []);

    const handleNotificationClick = async (notificationId: number, resourceLink: string) => {
        try {
            // Mark as read when clicked
            await NotificationsService.markAsRead(notificationId);

            // Update local state
            setLocalNotifications(prev =>
                prev.map(n => n.id === notificationId ? {...n, read: true} : n)
            );

            // Navigate to resource link
            if (resourceLink) {
                router.push(resourceLink);
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    if (!localNotifications.length) {
        return (
            <div className='h-full my-auto'>
                <NoData text='No Notifications Available' />;
            </div>
        );
    }
    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            <h1 className='typo-heading_ms my-6 xs:mx-4'>Notifications</h1>
            <div className='shadow-lg xs:shadow-transparent flex flex-col gap-6'>
                {localNotifications.map((item, i) => {
                    return (
                        <div
                            key={i}
                            onClick={() => handleNotificationClick(item.id, item.resourceLink)}
                            className={`flex items-center border-b border-border_gray w-full p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                                !item.read ? 'bg-surface-primary-10' : ''
                            } ${!item.seen ? 'border-l-4 border-l-secondary' : ''}`}
                        >
                            <Image
                                src={'/speaker.svg'}
                                height={24}
                                width={24}
                                alt='notification'
                                className='mr-[18px] rounded h-[24px] w-[24px]'
                            />
                            <div className='flex-1'>
                                <p className={`typo-body_lr xs:typo-body_mr ${!item.read ? 'font-semibold' : ''}`}>
                                    {item.title}
                                </p>
                                <p className='typo-body_mr text-text_four'>
                                    {item.message}
                                </p>
                                <p className='typo-body_sr text-text_four mt-1'>
                                    {formatToMonthDay(item.dateCreated)}
                                </p>
                            </div>
                            {!item.read && (
                                <div className='h-2 w-2 rounded-full bg-secondary ml-4' title='Unread' />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Notifications;
