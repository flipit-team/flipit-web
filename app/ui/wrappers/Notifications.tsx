'use client';
import Image from 'next/image';
import React from 'react';
import {useAppContext} from '~/contexts/AppContext';
import {formatToMonthDay} from '~/utils/helpers';
import NoData from '../common/no-data/NoData';

const Notifications = () => {
    const {notifications} = useAppContext();
    if (!notifications?.content.length) {
        return (
            <div className='h-full my-auto'>
                <NoData text='No Notifications Available' />;
            </div>
        );
    }
    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            <h1 className='typo-heading_ms my-6 xs:mx-4'>Notifications</h1>
            <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent flex flex-col gap-6'>
                {notifications?.content.map((item, i) => {
                    return (
                        <div key={i} className='flex items-center border-b border-border_gray w-full p-6'>
                            <Image
                                src={'/speaker.svg'}
                                height={24}
                                width={24}
                                alt='camera'
                                className='mr-[18px] rounded h-[24px] w-[24px]'
                            />
                            <div>
                                <p className='typo-body_lr xs:typo-body_mr'>{item.title}</p>
                                <p className='typo-body_lr xs:typo-body_mr text-text_four'>
                                    {formatToMonthDay(item.dateCreated)}
                                </p>
                            </div>
                            <Image
                                src={'/cancel-grey.svg'}
                                height={24}
                                width={24}
                                alt='cancel'
                                className='h-6 w-6 ml-auto'
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Notifications;
