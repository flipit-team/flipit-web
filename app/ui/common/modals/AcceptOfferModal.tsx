'use client';
import Image from 'next/image';
import React from 'react';
import {formatToNaira} from '~/utils/helpers';
import RegularButton from '../buttons/RegularButton';

interface AcceptOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bidderName: string;
    bidderAvatar: string;
    cashAmount?: number;
    offeredItem?: {
        title: string;
        image: string;
        value: number;
    };
    isLoading?: boolean;
}

const AcceptOfferModal: React.FC<AcceptOfferModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    bidderName,
    bidderAvatar,
    cashAmount,
    offeredItem,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-[1001]'>
            <div
                className='relative bg-white rounded-2xl w-[558px] h-max xs:w-full py-[48px] px-[56px] xs:px-8 xs:py-8 mx-6 text-text-primary'
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className='absolute top-6 right-6' disabled={isLoading}>
                    <Image
                        src={'/cancel-grey.svg'}
                        height={30}
                        width={30}
                        alt='close'
                        className='h-[30px] w-[30px] cursor-pointer'
                    />
                </button>

                {/* Success Check Icon */}
                <div className='flex justify-center mb-6'>
                    <div className='w-[72px] h-[72px] bg-green-100 rounded-full flex items-center justify-center'>
                        <svg className='w-10 h-10 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 13l4 4L19 7'
                            />
                        </svg>
                    </div>
                </div>

                <h3 className='typo-heading_ms text-center mb-4'>Accept This Offer?</h3>

                {/* Bidder Info */}
                <div className='flex items-center justify-center gap-3 mb-6'>
                    <Image
                        src={bidderAvatar}
                        alt={bidderName}
                        width={48}
                        height={48}
                        className='rounded-full object-cover'
                    />
                    <div>
                        <p className='typo-body_lm text-text_one'>{bidderName}</p>
                        <p className='typo-body_sr text-text_four'>Buyer</p>
                    </div>
                </div>

                {/* Offer Details */}
                <div className='bg-surface-primary-10 rounded-lg p-4 mb-6'>
                    {cashAmount && (
                        <div className='mb-2'>
                            <p className='typo-body_sr text-text_four mb-1'>Cash Offer</p>
                            <p className='typo-heading_sm text-primary'>{formatToNaira(cashAmount)}</p>
                        </div>
                    )}
                    {offeredItem && (
                        <div className='flex items-center gap-3 pt-3 border-t border-border_gray'>
                            <Image
                                src={offeredItem.image}
                                alt={offeredItem.title}
                                width={48}
                                height={48}
                                className='rounded object-cover'
                            />
                            <div>
                                <p className='typo-body_mr text-text_one'>{offeredItem.title}</p>
                                <p className='typo-body_sr text-text_four'>
                                    Value: {formatToNaira(offeredItem.value)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <p className='typo-body_mr text-text-secondary text-center mb-6'>
                    This will create a transaction and notify the buyer. You can coordinate delivery details in the
                    transaction page.
                </p>

                {/* Buttons */}
                <div className='flex gap-4 justify-center'>
                    <div className='w-[140px]'>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className='w-full h-[51px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium typo-body_ls disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Cancel
                        </button>
                    </div>

                    <div className='w-[140px]'>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className='w-full h-[51px] bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium typo-body_ls disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                        >
                            {isLoading ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                                    Accepting...
                                </>
                            ) : (
                                'Accept Offer'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcceptOfferModal;
