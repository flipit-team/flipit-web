'use client';
import React from 'react';
import Image from 'next/image';
import {TransactionDTO} from '~/types/transaction';
import {formatToNaira} from '~/utils/helpers';
import UsedBadge from '../common/badges/UsedBadge';
import StarRating from '../common/star-rating/StarRating';

interface Props {
    transaction: TransactionDTO;
    userRole: 'seller' | 'buyer' | null;
}

const TransactionItems = ({transaction, userRole}: Props) => {
    const sellerItem = transaction.sellerItem;
    const buyerItem = transaction.buyerItem;
    const showBuyerItem = transaction.transactionType === 'ITEM_EXCHANGE' || transaction.transactionType === 'ITEM_PLUS_CASH';

    return (
        <div className='shadow-lg rounded-lg bg-white overflow-hidden'>
            <div className='p-6 xs:px-4'>
                <h2 className='typo-heading_ss text-text_one mb-6'>Transaction Items</h2>

                <div className={`grid ${showBuyerItem ? 'grid-cols-2 xs:grid-cols-1' : 'grid-cols-1'} gap-6`}>
                    {/* Seller's Item */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='typo-body_lm text-text_one'>
                                {userRole === 'seller' ? 'Your Item' : 'Seller\'s Item'}
                            </h3>
                            <UsedBadge text={sellerItem.condition || 'Good'} />
                        </div>

                        <div className='border border-border_gray rounded-lg overflow-hidden'>
                            <div className='relative w-full h-[200px] xs:h-[180px]'>
                                <Image
                                    src={sellerItem.imageUrls?.[0] || '/placeholder-product.svg'}
                                    alt={sellerItem.title}
                                    fill
                                    className='object-cover'
                                />
                            </div>
                            <div className='p-4'>
                                <h4 className='typo-body_mm text-text_one mb-2'>{sellerItem.title}</h4>
                                <p className='typo-body_sr text-text_four mb-3 line-clamp-2'>
                                    {sellerItem.description}
                                </p>
                                <div className='flex items-center justify-between'>
                                    <span className='typo-body_lm text-primary'>
                                        {formatToNaira(sellerItem.cashAmount || 0)}
                                    </span>
                                    {sellerItem.brand && (
                                        <span className='typo-body_sr text-text_four'>Brand: {sellerItem.brand}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className='border border-border_gray rounded-lg p-4'>
                            <p className='typo-body_sr text-text_four mb-2'>
                                {userRole === 'seller' ? 'You' : 'Seller'}
                            </p>
                            <div className='flex items-center gap-3'>
                                <Image
                                    src={transaction.seller.profileImageUrl || '/placeholder-avatar.svg'}
                                    alt={transaction.seller.firstName}
                                    width={40}
                                    height={40}
                                    className='rounded-full object-cover'
                                />
                                <div className='flex-1'>
                                    <p className='typo-body_lr text-text_one'>
                                        {transaction.seller.firstName} {transaction.seller.lastName}
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <StarRating rating={transaction.seller.avgRating || 0} size={14} />
                                        <span className='typo-body_xs text-text_four'>
                                            ({transaction.seller.avgRating?.toFixed(1) || '0.0'})
                                        </span>
                                    </div>
                                </div>
                                {transaction.seller.phoneNumberVerified && (
                                    <div className='h-[18px] px-2 bg-surface-primary-16 text-primary flex items-center justify-center rounded typo-body_xs'>
                                        Verified
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Exchange Arrow / Plus Sign */}
                    {showBuyerItem && buyerItem && (
                        <>
                            <div className='hidden xs:flex items-center justify-center py-4'>
                                <div className='flex items-center gap-2'>
                                    <div className='h-[1px] w-12 bg-border_gray'></div>
                                    <div className='w-8 h-8 rounded-full bg-surface-primary-10 flex items-center justify-center'>
                                        <svg
                                            className='w-5 h-5 text-primary'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
                                            />
                                        </svg>
                                    </div>
                                    <div className='h-[1px] w-12 bg-border_gray'></div>
                                </div>
                            </div>
                            <div className='xs:hidden flex items-center justify-center'>
                                <div className='w-12 h-12 rounded-full bg-surface-primary-10 flex items-center justify-center'>
                                    <svg
                                        className='w-6 h-6 text-primary'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Buyer's Item */}
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='typo-body_lm text-text_one'>
                                        {userRole === 'buyer' ? 'Your Offer' : 'Buyer\'s Offer'}
                                    </h3>
                                    <UsedBadge text={buyerItem.condition || 'Good'} />
                                </div>

                                <div className='border border-border_gray rounded-lg overflow-hidden'>
                                    <div className='relative w-full h-[200px] xs:h-[180px]'>
                                        <Image
                                            src={buyerItem.imageUrls?.[0] || '/placeholder-product.svg'}
                                            alt={buyerItem.title}
                                            fill
                                            className='object-cover'
                                        />
                                    </div>
                                    <div className='p-4'>
                                        <h4 className='typo-body_mm text-text_one mb-2'>{buyerItem.title}</h4>
                                        <p className='typo-body_sr text-text_four mb-3 line-clamp-2'>
                                            {buyerItem.description}
                                        </p>
                                        <div className='flex items-center justify-between'>
                                            <span className='typo-body_lm text-primary'>
                                                {formatToNaira(buyerItem.cashAmount || 0)}
                                            </span>
                                            {buyerItem.brand && (
                                                <span className='typo-body_sr text-text_four'>
                                                    Brand: {buyerItem.brand}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Buyer Info */}
                                <div className='border border-border_gray rounded-lg p-4'>
                                    <p className='typo-body_sr text-text_four mb-2'>
                                        {userRole === 'buyer' ? 'You' : 'Buyer'}
                                    </p>
                                    <div className='flex items-center gap-3'>
                                        <Image
                                            src={transaction.buyer.profileImageUrl || '/placeholder-avatar.svg'}
                                            alt={transaction.buyer.firstName}
                                            width={40}
                                            height={40}
                                            className='rounded-full object-cover'
                                        />
                                        <div className='flex-1'>
                                            <p className='typo-body_lr text-text_one'>
                                                {transaction.buyer.firstName} {transaction.buyer.lastName}
                                            </p>
                                            <div className='flex items-center gap-2'>
                                                <StarRating rating={transaction.buyer.avgRating || 0} size={14} />
                                                <span className='typo-body_xs text-text_four'>
                                                    ({transaction.buyer.avgRating?.toFixed(1) || '0.0'})
                                                </span>
                                            </div>
                                        </div>
                                        {transaction.buyer.phoneNumberVerified && (
                                            <div className='h-[18px] px-2 bg-surface-primary-16 text-primary flex items-center justify-center rounded typo-body_xs'>
                                                Verified
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Cash Only Purchase - Show Buyer Info */}
                    {transaction.transactionType === 'CASH_ONLY' && (
                        <div className='space-y-4'>
                            <h3 className='typo-body_lm text-text_one'>
                                {userRole === 'buyer' ? 'You' : 'Buyer'}
                            </h3>

                            <div className='border border-border_gray rounded-lg p-4'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <Image
                                        src={transaction.buyer.profileImageUrl || '/placeholder-avatar.svg'}
                                        alt={transaction.buyer.firstName}
                                        width={48}
                                        height={48}
                                        className='rounded-full object-cover'
                                    />
                                    <div className='flex-1'>
                                        <p className='typo-body_lm text-text_one'>
                                            {transaction.buyer.firstName} {transaction.buyer.lastName}
                                        </p>
                                        <div className='flex items-center gap-2'>
                                            <StarRating rating={transaction.buyer.avgRating || 0} size={14} />
                                            <span className='typo-body_xs text-text_four'>
                                                ({transaction.buyer.avgRating?.toFixed(1) || '0.0'})
                                            </span>
                                        </div>
                                    </div>
                                    {transaction.buyer.phoneNumberVerified && (
                                        <div className='h-[18px] px-2 bg-surface-primary-16 text-primary flex items-center justify-center rounded typo-body_xs'>
                                            Verified
                                        </div>
                                    )}
                                </div>

                                {transaction.cashAmount && (
                                    <div className='bg-surface-primary-10 rounded-lg p-4'>
                                        <p className='typo-body_sr text-text_four mb-1'>Purchase Amount</p>
                                        <p className='typo-heading_sm text-primary'>
                                            {formatToNaira(transaction.cashAmount)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Cash Amount for Item + Cash Exchange */}
                {transaction.transactionType === 'ITEM_PLUS_CASH' && transaction.cashAmount && (
                    <div className='mt-6 bg-surface-primary-10 rounded-lg p-4'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='typo-body_sr text-text_four mb-1'>Additional Cash Amount</p>
                                <p className='typo-body_mr text-text_one'>
                                    {userRole === 'buyer' ? 'You are paying' : 'Buyer is paying'}
                                </p>
                            </div>
                            <p className='typo-heading_sm text-primary'>{formatToNaira(transaction.cashAmount)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionItems;
