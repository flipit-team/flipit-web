'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import Loader from '../common/loader/Loader';
import {useAppContext} from '~/contexts/AppContext';
import {Chat} from '~/utils/interface';

const MainChats = () => {
    const [chats, setChats] = useState<Chat[] | null>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {userId} = useAppContext();

    useEffect(() => {
        setLoading(true);
        const fetchItems = async () => {
            try {
                const res = await fetch(`/api/chats/get-user-chats?userId=${userId}`, {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.apierror?.message || 'Failed to fetch items');
                }

                const data = await res.json();
                setChats(data);
                console.log(data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchItems();
        }
    }, [userId]);

    if (loading)
        return (
            <div className='w-full py-10'>
                <Loader color='green' />
            </div>
        );
    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            <h1 className='typo-heading_medium_semibold my-6 xs:hidden'>My Messages</h1>
            <div className='grid grid-cols-[424px_1fr] xs:grid-cols-1 gap-6'>
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent xs:hidden'>
                    <div className='px-6 flex items-center gap-[34px] typo-body_large_medium'>
                        <div className='text-primary py-6 border-b border-primary'>Selling</div>
                        <div className='text-text_four py-6'>Buying</div>
                    </div>
                    <div className='h-[130px] bg-[rgba(0,95,115,0.1)] flex p-6 border-b border-[#EEEEE9]'>
                        <Image
                            src={'/profile-picture.svg'}
                            height={50}
                            width={50}
                            alt='picture'
                            className='h-[50px] w-[50px] mr-4'
                        />
                        <div>
                            <p className='text-primary typo-body_large_medium'>John Okoro</p>
                            <p className='typo-body_medium_regular w-[203px] line-clamp-2'>
                                Nice! I’m open to the trade. Would you like to meet up to inspect the items?
                            </p>
                        </div>
                        <p className='typo-body_small_regular xs:hidden'>4:23pm</p>
                    </div>
                    <div className='h-[130px] flex p-6 border-b border-[#EEEEE9]'>
                        <Image
                            src={'/profile-picture.svg'}
                            height={50}
                            width={50}
                            alt='picture'
                            className='h-[50px] w-[50px] mr-4'
                        />
                        <div>
                            <p className='text-primary typo-body_large_medium'>John Okoro</p>
                            <p className='typo-body_medium_regular w-[203px] line-clamp-2'>
                                Nice! I’m open to the trade. Would you like to meet up to inspect the items?
                            </p>
                        </div>
                        <p className='typo-body_small_regular xs:hidden'>4:23pm</p>
                    </div>
                    <div className='h-[130px] flex p-6 border-b border-[#EEEEE9]'>
                        <Image
                            src={'/profile-picture.svg'}
                            height={50}
                            width={50}
                            alt='picture'
                            className='h-[50px] w-[50px] mr-4'
                        />
                        <div>
                            <p className='text-primary typo-body_large_medium'>John Okoro</p>
                            <p className='typo-body_medium_regular w-[203px] line-clamp-2'>
                                Nice! I’m open to the trade. Would you like to meet up to inspect the items?
                            </p>
                        </div>
                        <p className='typo-body_small_regular xs:hidden'>4:23pm</p>
                    </div>
                </div>
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent hidden xs:block'>
                    <div className='px-6 flex items-center gap-[34px] typo-body_large_medium'>
                        <div className='text-primary py-6 border-b border-primary'>Selling</div>
                        <div className='text-text_four py-6'>Buying</div>
                    </div>
                    <Link
                        href={'/messages/m'}
                        className='h-[130px] bg-[rgba(0,95,115,0.1)] flex p-6 border-b border-[#EEEEE9]'
                    >
                        <Image
                            src={'/profile-picture.svg'}
                            height={50}
                            width={50}
                            alt='picture'
                            className='h-[50px] w-[50px] mr-4'
                        />
                        <div>
                            <p className='text-primary typo-body_large_medium'>John Okoro</p>
                            <p className='typo-body_medium_regular w-[203px] line-clamp-2'>
                                Nice! I’m open to the trade. Would you like to meet up to inspect the items?
                            </p>
                        </div>
                        <p className='typo-body_small_regular xs:hidden'>4:23pm</p>
                    </Link>
                    <Link href={'/messages/m'} className='h-[130px] flex p-6 border-b border-[#EEEEE9]'>
                        <Image
                            src={'/profile-picture.svg'}
                            height={50}
                            width={50}
                            alt='picture'
                            className='h-[50px] w-[50px] mr-4'
                        />
                        <div>
                            <p className='text-primary typo-body_large_medium'>John Okoro</p>
                            <p className='typo-body_medium_regular w-[203px] line-clamp-2'>
                                Nice! I’m open to the trade. Would you like to meet up to inspect the items?
                            </p>
                        </div>
                        <p className='typo-body_small_regular xs:hidden'>4:23pm</p>
                    </Link>
                    <Link href={'/messages/m'} className='h-[130px] flex p-6 border-b border-[#EEEEE9]'>
                        <Image
                            src={'/profile-picture.svg'}
                            height={50}
                            width={50}
                            alt='picture'
                            className='h-[50px] w-[50px] mr-4'
                        />
                        <div>
                            <p className='text-primary typo-body_large_medium'>John Okoro</p>
                            <p className='typo-body_medium_regular w-[203px] line-clamp-2'>
                                Nice! I’m open to the trade. Would you like to meet up to inspect the items?
                            </p>
                        </div>
                        <p className='typo-body_small_regular xs:hidden'>4:23pm</p>
                    </Link>
                </div>
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent xs:hidden'>
                    <div className='flex items-center p-6'>
                        <Image
                            src={'/profile-picture.svg'}
                            height={50}
                            width={50}
                            alt='picture'
                            className='h-[50px] w-[50px] mr-4'
                        />
                        <p className='typo-body_large_medium'>John Okoro</p>
                    </div>
                    <div className='flex items-center justify-center typo-heading_small_medium text-primary bg-[rgba(0,95,115,0.2)] h-[42px]'>
                        iPhone 12 promax
                    </div>
                    <div className='p-[40px] flex flex-col gap-2'>
                        <div className='w-2/4 mr-auto'>
                            <div className='bg-[#f8f8f7] p-3 rounded-lg'>
                                Hi Jane! I’m interested in your iPhone 12 promax. Would you consider trading it for a
                                PlayStation 4? It’s in great condition
                            </div>
                            <p className='text-[#87928A] typo-body_medium_regular'>3:45PM</p>
                        </div>
                        <div className='w-2/4 ml-auto'>
                            <div className='bg-[rgba(0,95,115,0.1)] p-3 rounded-lg'>
                                Hi Jane! I’m interested in your iPhone 12 promax. Would you consider trading it for a
                                PlayStation 4? It’s in great condition
                            </div>
                            <p className='text-[#87928A] typo-body_medium_regular text-right'>3:45PM</p>
                        </div>
                    </div>
                    <div className='h-[96px] border-t border-border_gray flex items-center px-[40px]'>
                        <Image
                            src={'/microphone.svg'}
                            height={24}
                            width={24}
                            alt='mic'
                            className='h-[24px] w-[24px] mr-2'
                        />
                        <input
                            type='text'
                            className='h-full w-full typo-body_large_regular focus:ring-transparent outline-none'
                            placeholder='Type in your message here'
                        />
                        <Image src={'/send.svg'} height={39} width={87} alt='mic' className='h-[39px] w-[87px]' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainChats;
