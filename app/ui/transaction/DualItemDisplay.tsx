'use client';
import React from 'react';
import Image from 'next/image';
import {formatToNaira} from '~/utils/helpers';
import {ItemDTO, UserDTO} from '~/types/api';

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
                                src={sellerItem.imageUrls[0] || '/placeholder-product.svg'}
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
                                    src={seller.avatar || '/placeholder-avatar.svg'}
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
                        <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'
                            />
                        </svg>
                    </div>
                </div>

                {/* Buyer's Item */}
                {buyerItem ? (
                    <div className={`${userRole === 'buyer' ? 'order-1' : 'order-2'}`}>
                        <div className='bg-blue-50 rounded-lg p-3 mb-3'>
                            <p className='typo-body_sr text-blue-700 font-medium'>
                                {userRole === 'buyer' ? 'Your Item' : 'Their Item'}
                            </p>
                        </div>

                        <div className='border border-border_gray rounded-lg overflow-hidden'>
                            {/* Item Image */}
                            <div className='aspect-square relative bg-gray-100'>
                                <Image
                                    src={buyerItem.imageUrls[0] || '/placeholder-product.svg'}
                                    alt={buyerItem.title}
                                    fill
                                    className='object-cover'
                                />
                            </div>

                            {/* Item Details */}
                            <div className='p-4'>
                                <h3 className='typo-body_lm text-text_one mb-2 line-clamp-2'>{buyerItem.title}</h3>
                                {buyerItem.cashAmount && (
                                    <p className='typo-body_mm text-blue-600 mb-2'>
                                        {formatToNaira(buyerItem.cashAmount)}
                                    </p>
                                )}
                                <p className='typo-body_sr text-text_four line-clamp-2'>{buyerItem.description}</p>

                                {/* Buyer Info */}
                                <div className='flex items-center gap-2 mt-4 pt-4 border-t border-border_gray'>
                                    <Image
                                        src={buyer.avatar || '/placeholder-avatar.svg'}
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
                        <div className='bg-secondary/10 rounded-lg p-3 mb-3'>
                            <p className='typo-body_sr text-secondary font-medium'>
                                {userRole === 'buyer' ? 'Your Payment' : 'Their Payment'}
                            </p>
                        </div>

                        <div className='border border-border_gray rounded-lg p-8 text-center'>
                            <div className='w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <svg className='w-8 h-8 text-secondary' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                                    <path
                                        fillRule='evenodd'
                                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </div>
                            <p className='typo-heading_sm text-secondary mb-2'>{formatToNaira(cashAmount || 0)}</p>
                            <p className='typo-body_mr text-text_four'>Cash Only Purchase</p>

                            {/* Buyer Info */}
                            <div className='flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border_gray'>
                                <Image
                                    src={buyer.avatar || '/placeholder-avatar.svg'}
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
