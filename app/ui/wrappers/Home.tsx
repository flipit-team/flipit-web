'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import SellersInfo from '../homepage/sellers-info';
import RegularButton from '../common/buttons/RegularButton';
import {formatToNaira, timeAgo} from '~/utils/helpers';
import UsedBadge from '../common/badges/UsedBadge';
import Loader from '../common/loader/Loader';
import {Item} from '~/utils/interface';
import {useParams} from 'next/navigation';
import PopupSheet from '../common/popup-sheet/PopupSheet';
import ProfilePopup from '../homepage/profile-popup';
import MakeAnOffer from '../homepage/make-an-offer';

const Home = () => {
    const params = useParams();
    const slug = params?.slug;
    const [item, setItem] = useState<Item | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewPhone, setViewPhone] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`/api/items/get-item?id=${slug}`, {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.apierror?.message || 'Failed to fetch items');
                }

                const data = await res.json();
                setItem(data);
                console.log(data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading)
        return (
            <div className='py-10'>
                <Loader color='green' />
            </div>
        );
    return (
        <>
            <div className='grid-sizes grid grid-cols-[712px_1fr] xs:grid-cols-1 gap-6 h-full mt-10 xs:mb-6'>
                <div className='p-6 xs:p-0'>
                    <Image
                        src={'/camera-large.png'}
                        height={443}
                        width={712}
                        alt='picture'
                        className='h-[443px] w-[712px] xs:w-full xs:h-[222px] mb-6'
                    />
                    <div className='grid grid-cols-3 gap-6'>
                        <Image
                            src={'/camera-large.png'}
                            height={150}
                            width={222}
                            alt='picture'
                            className='h-[150px] w-[222px] xs:h-[76px] xs:w-[112px]'
                        />{' '}
                        <Image
                            src={'/camera-large.png'}
                            height={150}
                            width={222}
                            alt='picture'
                            className='h-[150px] w-[222px] xs:h-[76px] xs:w-[112px]'
                        />{' '}
                        <Image
                            src={'/camera-large.png'}
                            height={150}
                            width={222}
                            alt='picture'
                            className='h-[150px] w-[222px] xs:h-[76px] xs:w-[112px]'
                        />
                    </div>
                </div>
                <div className='p-6 xs:p-0'>
                    <UsedBadge text={item?.condition} />
                    <div className='typo-heading_medium_semibold xs:typo-heading_small_semibold text-text_one mt-[10px] capitalize'>
                        {item?.title}
                    </div>
                    <p className='typo-heading_small_medium text-primary xs:typo-body_medium_medium xs:mb-1'>
                        {formatToNaira(item?.cashAmount ?? 0)}
                    </p>
                    <p className='typo-body_medium_regular text-text_four mb-[42px]'>{timeAgo(item?.dateCreated)}</p>
                    <RegularButton text='Make an offer' slug='make-an-offer' usePopup />
                    <div className='h-6'></div>
                    <RegularButton text='Buy right away' isLight slug={`/messages?id=${item?.seller.id}`} />
                    <div className='typo-body_large_medium text-text_one mt-6'>Details</div>
                    <p className='typo-body_medium_regular text-text_one mt-2 mb-4'>{item?.description}</p>
                    <div className='typo-body_medium_medium text-text_one'>Location</div>
                    <div className='typo-body_medium_regular text-text_four mb-8'>{item?.location}</div>
                    <SellersInfo />
                    <div className='flex mb-4'>
                        <Image
                            src={'/camera-large.png'}
                            height={52}
                            width={52}
                            alt='picture'
                            className='h-[52px] w-[52px] rounded-full'
                        />
                        <div className='w-full ml-2'>
                            <div className='typo-body_large_medium'>
                                {item?.seller.firstName + ' ' + item?.seller.lastName}
                            </div>
                            <div className='h-[23px] w-max px-[2px] bg-[#005f7329] text-primary  flex items-center justify-center rounded typo-body_small_regular'>
                                {item?.seller.dateVerified ? 'Verified profile' : 'Unverified profile'}
                            </div>
                            <div className='flex my-1'>
                                {Array.from('11111').map((item, i) => {
                                    return (
                                        <Image
                                            key={i}
                                            src={'/full-star.svg'}
                                            height={20}
                                            width={20}
                                            alt='picture'
                                            className='h-[20px] w-[20px] rounded-full'
                                        />
                                    );
                                })}
                            </div>
                            <p className='typo-body_small_regular text-text_four'>Responds within minutes</p>
                            <p className='typo-body_small_regular text-text_four'>Joined Flipit in 2024</p>
                        </div>
                    </div>
                    <div
                        onClick={() => setViewPhone(!viewPhone)}
                        className={`w-full flex items-center justify-center h-[51px] bg-[#005f7329] rounded-lg text-primary typo-body_large_semibold`}
                    >
                        {viewPhone ? item?.seller.phoneNumber : 'Contact via Phone'}
                    </div>
                </div>
            </div>
            <PopupSheet>
                <ProfilePopup seller={item?.seller} />
                <MakeAnOffer item={item} />
            </PopupSheet>
        </>
    );
};

export default Home;
