'use client';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import React from 'react';
import RegularButton from '~/ui/common/buttons/RegularButton';
import {Item} from '~/utils/interface';

interface Props {
    item?: Item | null;
    bidAmount: string;
    currentBid: number;
    endTime: Date | string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

const ConfirmBid = (props: Props) => {
    const {item, bidAmount, currentBid, endTime, onClose, onConfirm, isLoading = false} = props;
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    const getTimeLeft = () => {
        const now = new Date().getTime();
        const distance = new Date(endTime).getTime() - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) return `${days}d ${hours}h ${minutes}m`;
            if (hours > 0) return `${hours}h ${minutes}m`;
            return `${minutes}m`;
        }
        return 'Ended';
    };

    if (query === 'confirm-bid') {
        return (
            <div className='w-[572px] flex flex-col justify-center items-center xs:w-full xs:px-4'>
                {/* <div className='w-full xs:hidden'>
                    <Image
                        src={'/close-white.svg'}
                        height={45}
                        width={45}
                        alt='close'
                        className='h-[45px] w-[45px] ml-auto cursor-pointer'
                        onClick={() => onClose()}
                    />
                </div> */}
                <div className='w-full bg-white rounded-lg p-[32px] xs:p-0 xs:py-[32px]'>
                    <div className='hidden xs:block'>
                        <Image
                            src={'/cancel.svg'}
                            height={16}
                            width={16}
                            alt='close'
                            className='h-[16px] w-[16px] ml-auto mr-4 cursor-pointer'
                            onClick={() => onClose()}
                        />
                    </div>

                    <div className='flex flex-col xs:px-4'>
                        {/* Header */}
                        <div className='flex justify-between items-center mb-6 xs:hidden'>
                            <h2 className='typo-heading_ms text-text_one'>Confirm your bid</h2>
                            <Image
                                src={'/cancel.svg'}
                                height={13}
                                width={13}
                                alt='close'
                                className='h-[13px] w-[13px] cursor-pointer'
                                onClick={() => onClose()}
                            />
                        </div>

                        {/* Mobile header */}
                        <div className='hidden xs:block mb-6'>
                            <h2 className='typo-body_ls text-text_one'>Confirm your bid</h2>
                        </div>

                        {/* Item Image */}
                        <div className='flex justify-center mb-6'>
                            <Image
                                src={item?.imageUrls?.[0] || '/placeholder-product-large.png'}
                                height={99}
                                width={128}
                                alt='item'
                                className='h-[99px] w-[128px] rounded-lg object-cover'
                                sizes="128px"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Kic6LbJ7djdjvj28J7vD94nSRnr/Z/9k="
                            />
                        </div>

                        {/* Bid Details */}
                        <div className='grid grid-cols-2 gap-4 mb-8'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='typo-body_mr text-text_four'>Item</p>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_four'>Current bid</p>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_four'>Time left</p>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_four'>Your bid</p>
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <div>
                                    <p className='typo-body_mr text-text_one'>
                                        {item?.title || 'Canon EOS RP Camera +Small Rig'}
                                    </p>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_one'>{formatCurrency(currentBid)}</p>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_one'>{getTimeLeft()}</p>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_one font-semibold'>
                                        {formatCurrency(Number(bidAmount))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-4 xs:flex-col'>
                            <div className='flex-1'>
                                <RegularButton text='Cancel' isLight={true} action={onClose} />
                            </div>
                            <div className='flex-1'>
                                <RegularButton
                                    text='Place Bid'
                                    action={() => {
                                        onConfirm();
                                    }}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default ConfirmBid;
