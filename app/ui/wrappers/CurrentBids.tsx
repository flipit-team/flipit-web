'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import Loader from '../common/loader/Loader';
import {useAppContext} from '~/contexts/AppContext';
import {Bid} from '~/utils/interface';
import NoData from '../common/no-data/NoData';
import {formatToNaira} from '~/utils/helpers';

const CurrentBids = () => {
    const [bids, setBids] = useState<Bid[] | null>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const {userId} = useAppContext();

    // useEffect(() => {
    //     setLoading(true);

    //     const fetchItems = async () => {
    //         try {
    //             const res = await fetch(`/api/bids/get-user-bids?userId=${userId}`, {
    //                 cache: 'no-store'
    //             });

    //             if (!res.ok) {
    //                 const errData = await res.json();
    //                 throw new Error(errData.apierror?.message || 'Failed to fetch items');
    //             }

    //             const data = await res.json();
    //             setBids(data);
    //             console.log(data);
    //         } catch (err: any) {
    //             setError(err.message || 'Something went wrong');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     if (userId) {
    //         fetchItems();
    //     }
    // }, [userId]);

    if (loading)
        return (
            <div className='py-10'>
                <Loader color='green' />
            </div>
        );
    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            <h1 className='typo-heading_medium_semibold my-6 xs:mx-4'>Current Bids</h1>
            {bids?.length ? (
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent flex flex-col gap-6 p-8 xs:p-4'>
                    {bids?.map((bid, i) => {
                        return (
                            <div
                                key={i}
                                className='flex items-center border border-border_gray rounded-lg w-[672px] xs:w-full p-3'
                            >
                                <Image
                                    src={'/camera.png'}
                                    height={64}
                                    width={64}
                                    alt='camera'
                                    className='mr-[18px] rounded h-[64px] w-[64px] xs:h-[73px] xs:w-[73px]'
                                />
                                <div>
                                    <div className='flex items-center'>
                                        <p className='text-primary typo-body_large_semibold xs:typo-body_medium_semibold'>
                                            {bid.auctionItem.title}
                                        </p>
                                        <span className='xs:hidden py-1 px-2 text-[#e40808] typo-body_small_regular bg-[rgba(228,8,8,0.18)] rounded ml-4'>
                                            {bid.status}
                                        </span>
                                    </div>
                                    <p className='typo-body_medium_regular xs:typo-body_medium_regular text-text_one'>
                                        Your bid:&nbsp;{' '}
                                        {`${bid.offeredItem.title} ${bid.offeredItem && bid.cashAmount && '+'} ${formatToNaira(bid.cashAmount)}`}
                                    </p>
                                    <span className='hidden w-max xs:flex py-1 px-2 text-[#e40808] typo-body_small_regular bg-[rgba(228,8,8,0.18)] rounded'>
                                        {bid.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <NoData />
            )}
        </div>
    );
};

export default CurrentBids;
