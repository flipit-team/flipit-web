'use client';
import React from 'react';

interface ConfirmationModalProps {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    isDestructive = false,
    isLoading = false
}) => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
                {/* Header */}
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='typo-heading_ss text-text_one'>{title}</h2>
                    <button onClick={onCancel} className='text-text_four hover:text-text_one text-2xl leading-none'>
                        ×
                    </button>
                </div>

                {/* Message */}
                <p className='typo-body_mr text-text_four mb-6'>{message}</p>

                {/* Actions */}
                <div className='flex gap-3'>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className='flex-1 h-[51px] border border-border_gray text-text_one rounded-lg typo-body_lr hover:bg-gray-50 disabled:opacity-50'
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 h-[51px] rounded-lg typo-body_lr text-white disabled:opacity-50 ${
                            isDestructive
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-primary hover:bg-primary-dark'
                        }`}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
