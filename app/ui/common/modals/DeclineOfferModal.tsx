'use client';
import Image from 'next/image';
import React from 'react';
import {AlertTriangle} from 'lucide-react';

interface DeclineOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bidderName: string;
}

const DeclineOfferModal: React.FC<DeclineOfferModalProps> = ({isOpen, onClose, onConfirm, bidderName}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-[1001]'>
            <div
                className='relative bg-white rounded-2xl w-[558px] h-max xs:w-full py-[48px] px-[56px] xs:px-8 xs:py-8 mx-6 text-text-primary'
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className='absolute top-6 right-6'>
                    <Image
                        src={'/cancel-grey.svg'}
                        height={30}
                        width={30}
                        alt='close'
                        className='h-[30px] w-[30px] cursor-pointer'
                    />
                </button>

                {/* Warning Icon */}
                <div className='flex justify-center mb-6'>
                    <div className='w-[72px] h-[72px] bg-orange-100 rounded-full flex items-center justify-center'>
                        <AlertTriangle className='w-10 h-10 text-orange-600' />
                    </div>
                </div>

                <h3 className='typo-heading_ms text-center mb-4'>Decline This Offer?</h3>

                <p className='typo-body_mr text-text-secondary text-center mb-6'>
                    Are you sure you want to decline the offer from <span className='font-semibold'>{bidderName}</span>?
                    This action cannot be undone and the buyer will be notified.
                </p>

                {/* Buttons */}
                <div className='flex gap-4 justify-center'>
                    <div className='w-[140px]'>
                        <button
                            onClick={onClose}
                            className='w-full h-[51px] border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium typo-body_ls'
                        >
                            Cancel
                        </button>
                    </div>

                    <div className='w-[140px]'>
                        <button
                            onClick={onConfirm}
                            className='w-full h-[51px] bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium typo-body_ls'
                        >
                            Decline Offer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeclineOfferModal;
