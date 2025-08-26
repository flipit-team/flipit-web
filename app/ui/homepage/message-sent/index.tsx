import {useSearchParams} from 'next/navigation';
import React from 'react';
import Image from 'next/image';

interface MessageSentProps {
    title: string;
    onClose: () => void;
}

const MessageSent = ({title, onClose}: MessageSentProps) => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    
    if (query === 'message-sent')
        return (
            <div className='w-full max-w-[527px] bg-white p-8 rounded-lg mx-auto text-center'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='typo-heading_sb'>{title}</h2>
                    <button
                        type='button'
                        onClick={onClose}
                        className='text-2xl text-gray-500 hover:text-gray-700'
                        aria-label='Close'
                    >
                        &times;
                    </button>
                </div>

                <div className='mb-6'>
                    <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg 
                            className='w-8 h-8 text-green-600' 
                            fill='none' 
                            stroke='currentColor' 
                            viewBox='0 0 24 24'
                        >
                            <path 
                                strokeLinecap='round' 
                                strokeLinejoin='round' 
                                strokeWidth={2} 
                                d='M5 13l4 4L19 7' 
                            />
                        </svg>
                    </div>
                    <h3 className='typo-heading_sm text-text_one mb-2'>Message Sent Successfully!</h3>
                    <p className='typo-body_mr text-text_four'>
                        Your message has been sent to the seller. They will receive a notification and can respond to you directly.
                    </p>
                </div>

                <button
                    type='button'
                    onClick={onClose}
                    className='w-full bg-primary text-white py-3 rounded font-semibold text-lg hover:bg-primary-dark transition'
                >
                    Done
                </button>
            </div>
        );
};

export default MessageSent;