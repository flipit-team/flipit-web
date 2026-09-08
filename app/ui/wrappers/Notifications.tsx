'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {formatToMonthDay} from '~/utils/helpers';
import NoData from '../common/no-data/NoData';
import NotificationsService from '~/services/notifications.service';
import {NotificationDTO} from '~/types/api';
import {useRouter} from 'next/navigation';
import {X} from 'lucide-react';
import {useUnreadCount} from '~/contexts/UnreadCountContext';

const Notifications = () => {
    const router = useRouter();
    const {decrementNotificationCount} = useUnreadCount();
    const [localNotifications, setLocalNotifications] = useState<NotificationDTO[]>([]);

    // Fetch notifications on mount
    useEffect(() => {
        NotificationsService.getNotifications({ page: 0, size: 50 }).then(result => {
            if (result.data) {
                const content = Array.isArray(result.data) ? result.data : result.data.content || [];
                setLocalNotifications(content);
            }
        });
    }, []);

    const handleNotificationClick = async (notificationId: number, resourceLink: string) => {
        try {
            // Mark as read when clicked
            await NotificationsService.markAsRead(notificationId);
            decrementNotificationCount();

            // Update local state
            setLocalNotifications(prev =>
                prev.map(n => n.id === notificationId ? {...n, read: true} : n)
            );

            // Navigate to resource link
            if (resourceLink) {
                // If resource link contains "offer" or points to offer-related pages, redirect to offers page
                if (resourceLink.toLowerCase().includes('offer')) {
                    router.push('/offers');
                } else {
                    router.push(resourceLink);
                }
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleDismiss = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setLocalNotifications(prev => prev.filter((_, i) => i !== index));
    };

    const handleClearAll = () => {
        setLocalNotifications([]);
    };

    if (!localNotifications.length) {
        return (
            <div className='h-full my-auto xs:bg-[#FFFFF0] xs:min-h-screen'>
                {/* Mobile header */}
                <div className='hidden xs:flex items-center gap-3 mb-4 px-4 pt-4'>
                    <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <h1 className='font-poppins typo-heading-md-semibold text-text_one'>Notifications</h1>
                </div>
                <NoData text='No Notifications Available' />
            </div>
        );
    }
    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0 xs:bg-[#FFFFF0] xs:min-h-screen'>
            {/* Mobile header */}
            <div className='hidden xs:flex items-center gap-3 mb-4 px-4 pt-4'>
                <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h1 className='font-poppins typo-heading-md-semibold text-text_one flex-1'>Notifications</h1>
                <button onClick={handleClearAll} className='typo-body_mr text-primary-light'>
                    Clear All
                </button>
            </div>

            {/* Desktop heading */}
            <div className='flex items-center justify-between my-6 xs:hidden'>
                <h1 className='typo-heading_ms'>Notifications</h1>
                <button onClick={handleClearAll} className='typo-body_mr text-primary cursor-pointer'>
                    Clear all
                </button>
            </div>

            <div className='bg-white rounded-lg shadow-sm xs:bg-transparent xs:rounded-none xs:shadow-none flex flex-col xs:gap-0 gap-6'>
                {localNotifications.map((item, i) => {
                    return (
                        <div
                            key={i}
                            onClick={() => handleNotificationClick(item.id, item.resourceLink)}
                            className={`flex items-center border-b border-border_gray w-full p-6 xs:px-4 xs:py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                !item.read ? 'bg-surface-primary-10 border-l-4 border-l-secondary xs:border-l-0' : ''
                            }`}
                        >
                            <Image
                                src={item.avatar || '/icons/ui/speaker.svg'}
                                height={24}
                                width={24}
                                alt='notification'
                                className='mr-[18px] xs:mr-3 rounded h-[24px] w-[24px] xs:h-[32px] xs:w-[32px] xs:self-start xs:mt-0.5'
                            />
                            <div className='flex-1 min-w-0'>
                                <p className={`typo-body_lr xs:typo-body_mr ${!item.read ? 'font-semibold' : ''}`}>
                                    {item.title}
                                </p>
                                <p className='typo-body_mr xs:typo-body_sr text-text_four'>
                                    {item.message}
                                </p>
                                <p className='typo-body_sr text-text_four mt-1'>
                                    {formatToMonthDay(item.dateCreated)}
                                </p>
                            </div>
                            {/* Desktop: unread dot */}
                            {!item.read && (
                                <div className='h-2 w-2 rounded-full bg-secondary ml-4 xs:hidden' title='Unread' />
                            )}
                            {/* Dismiss button */}
                            <button
                                onClick={(e) => handleDismiss(e, i)}
                                className='flex items-center justify-center ml-3 text-text_four hover:text-text_two flex-shrink-0'
                                aria-label='Dismiss notification'
                            >
                                <X size={18} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Notifications;
