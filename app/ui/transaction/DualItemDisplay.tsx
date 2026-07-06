'use client';
import React from 'react';
import Image from 'next/image';
import {formatToNaira} from '~/utils/helpers';
import {ItemDTO, UserDTO} from '~/types/api';
import {SwapArrowsIcon, DollarCircleIcon} from '../icons';

interface Props {
    sellerItem: ItemDTO;
    buyerItem?: ItemDTO;
    seller: UserDTO;
    buyer: UserDTO;
    cashAmount?: number;
    userRole?: 'seller' | 'buyer' | null;
}

const DualItemDisplay: React.FC<Props> = ({sellerItem, buyerItem, seller, buyer, cashAmount, userRole}) => {
    return (
        <div className='shadow-lg rounded-lg bg-white p-6 xs:px-4'>
            <h2 className='typo-heading_ss text-text_one mb-6'>Exchange Details</h2>

            <div className='grid grid-cols-2 xs:grid-cols-1 gap-6'>
                {/* Seller's Item */}
                <div className={`${userRole === 'seller' ? 'order-1' : 'order-2 xs:order-1'}`}>
                    <div className='bg-surface-primary-10 rounded-lg p-3 mb-3'>
                        <p className='typo-body_sr text-primary font-medium'>
                            {userRole === 'seller' ? 'Your Item' : 'Their Item'}
                        </p>
                    </div>

                    <div className='border border-border_gray rounded-lg overflow-hidden'>
                        {/* Item Image */}
                        <div className='aspect-square relative bg-gray-100'>
                            <Image
                                src={sellerItem.imageUrls[0] || '/images/placeholders/placeholder-product.svg'}
                                alt={sellerItem.title}
                                fill
                                className='object-cover'
                            />
                        </div>

                        {/* Item Details */}
                        <div className='p-4'>
                            <h3 className='typo-body_lm text-text_one mb-2 line-clamp-2'>{sellerItem.title}</h3>
                            {sellerItem.cashAmount && (
                                <p className='typo-body_mm text-primary mb-2'>{formatToNaira(sellerItem.cashAmount)}</p>
                            )}
                            <p className='typo-body_sr text-text_four line-clamp-2'>{sellerItem.description}</p>

                            {/* Seller Info */}
                            <div className='flex items-center gap-2 mt-4 pt-4 border-t border-border_gray'>
                                <Image
                                    src={seller.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                    alt={seller.firstName}
                                    width={32}
                                    height={32}
                                    className='rounded-full object-cover'
                                />
                                <div>
                                    <p className='typo-body_sr text-text_one font-medium'>
                                        {seller.firstName} {seller.lastName}
                                    </p>
                                    <p className='typo-body_xs text-text_four'>Seller</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exchange Icon */}
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block z-10'>
                    <div className='w-12 h-12 bg-white border-2 border-primary rounded-full flex items-center justify-center shadow-lg'>
                        <SwapArrowsIcon className='w-6 h-6 text-primary' />
                    </div>
                </div>

                {/* Buyer's Item */}
                {buyerItem ? (
                    <div className={`${userRole === 'buyer' ? 'order-1' : 'order-2'}`}>
                        <div className='bg-accent-navy/5 rounded-lg p-3 mb-3'>
                            <p className='typo-body_sr text-accent-navy font-medium'>
                                {userRole === 'buyer' ? 'Your Item' : 'Their Item'}
                            </p>
                        </div>

                        <div className='border border-border_gray rounded-lg overflow-hidden'>
                            {/* Item Image */}
                            <div className='aspect-square relative bg-gray-100'>
                                <Image
                                    src={buyerItem.imageUrls[0] || '/images/placeholders/placeholder-product.svg'}
                                    alt={buyerItem.title}
                                    fill
                                    className='object-cover'
                                />
                            </div>

                            {/* Item Details */}
                            <div className='p-4'>
                                <h3 className='typo-body_lm text-text_one mb-2 line-clamp-2'>{buyerItem.title}</h3>
                                {buyerItem.cashAmount && (
                                    <p className='typo-body_mm text-accent-navy mb-2'>
                                        {formatToNaira(buyerItem.cashAmount)}
                                    </p>
                                )}
                                <p className='typo-body_sr text-text_four line-clamp-2'>{buyerItem.description}</p>

                                {/* Buyer Info */}
                                <div className='flex items-center gap-2 mt-4 pt-4 border-t border-border_gray'>
                                    <Image
                                        src={buyer.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                        alt={buyer.firstName}
                                        width={32}
                                        height={32}
                                        className='rounded-full object-cover'
                                    />
                                    <div>
                                        <p className='typo-body_sr text-text_one font-medium'>
                                            {buyer.firstName} {buyer.lastName}
                                        </p>
                                        <p className='typo-body_xs text-text_four'>Buyer</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cash Addition */}
                        {cashAmount && cashAmount > 0 && (
                            <div className='mt-3 bg-secondary/10 border border-secondary/30 rounded-lg p-3'>
                                <div className='flex items-center justify-between'>
                                    <span className='typo-body_mr text-text_one'>+ Cash</span>
                                    <span className='typo-body_lm text-secondary font-semibold'>
                                        {formatToNaira(cashAmount)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`${userRole === 'buyer' ? 'order-1' : 'order-2'}`}>
                        <div className='bg-accent-navy/5 rounded-lg p-3 mb-3'>
                            <p className='typo-body_sr text-accent-navy font-medium'>
                                {userRole === 'buyer' ? 'Your Payment' : 'Their Payment'}
                            </p>
                        </div>

                        <div className='border border-border_gray rounded-lg p-8 text-center'>
                            <div className='w-16 h-16 bg-accent-navy/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <DollarCircleIcon className='w-8 h-8 text-accent-navy' />
                            </div>
                            <p className='typo-heading_sm text-accent-navy mb-2'>{formatToNaira(cashAmount || 0)}</p>
                            <p className='typo-body_mr text-text_four'>Cash Only Purchase</p>

                            {/* Buyer Info */}
                            <div className='flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border_gray'>
                                <Image
                                    src={buyer.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                    alt={buyer.firstName}
                                    width={32}
                                    height={32}
                                    className='rounded-full object-cover'
                                />
                                <div className='text-left'>
                                    <p className='typo-body_sr text-text_one font-medium'>
                                        {buyer.firstName} {buyer.lastName}
                                    </p>
                                    <p className='typo-body_xs text-text_four'>Buyer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DualItemDisplay;
