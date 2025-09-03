import React from 'react';
import { Loader } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isDeleting = false
}) => {
    console.log('DeleteConfirmationModal render - isOpen:', isOpen);
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg'>
                <div className='mb-4'>
                    <h3 className='typo-heading-md-semibold text-gray-900 mb-2'>{title}</h3>
                    <p className='text-gray-600 typo-body-md-regular'>{message}</p>
                </div>
                
                <div className='flex gap-3 justify-end'>
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                    >
                        {isDeleting && <Loader className='h-4 w-4 animate-spin' />}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;