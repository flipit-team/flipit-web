import Link from 'next/link';
import React from 'react';

interface Props {
    setHovered: React.Dispatch<React.SetStateAction<boolean>>;
    pointer?: boolean;
    notifications?: {
        id: number;
        type: string;
        title: string;
        message: string;
        resourceLink: string;
        read: boolean;
        dateCreated: Date;
    }[];
}

const Notifications = (props: Props) => {
    const {pointer, notifications} = props;
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

            <div className='min-w-[200px] bg-white typo-body_medium_medium'>
                {notifications?.map((item, i) => {
                    if (i > 2) return;
                    return (
                        <Link
                            prefetch={false}
                            href={`/notifications/${item.id}`}
                            key={i}
                            className={`whitespace-nowrap py-[8px] px-[12px] text-text_one h-[36px] cursor-pointer
                         flex items-center hover:text-form-text-active hover-state-300`}
                        >
                            {item.title}
                        </Link>
                    );
                })}
                <Link href={'/notifications'} className='text-text_one'>
                    See all notifications
                </Link>
            </div>
        </div>
    );
};

export default Notifications;
