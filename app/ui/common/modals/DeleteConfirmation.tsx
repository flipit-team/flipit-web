'use client';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

type DeleteConfirmationProps = {
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteConfirmation = ({ onClose, onConfirm }: DeleteConfirmationProps) => {
    const [confirmText, setConfirmText] = useState('');

    const handleConfirmDelete = () => {
        if (confirmText.toLowerCase() === 'delete') {
            onConfirm();
            onClose();
        } else {
            // Show visual feedback instead of alert
            // You could add visual feedback here like red border on input
            return;
        }
    };

    return (
        <div className=''>
            {/* Delete Icon */}
            <div className='flex justify-center mb-6'>
                <div className='w-[72px] h-[72px] bg-red-100 rounded-full flex items-center justify-center'>
                    <AlertTriangle className='w-10 h-10 text-red-600' />
                </div>
            </div>
            
            <h3 className='typo-heading_ms text-center mb-4'>Confirm Account Deletion</h3>
            
            <p className='typo-heading_xsr text-text-secondary text-center mb-6'>
                To confirm deletion, type &quot;delete&quot; below
            </p>
            
            {/* Input Box */}
            <div className='mb-9'>
                <input
                    type='text'
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder='Type "delete" here'
                    className='w-full h-[49px] px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none focus:border-primary text-center'
                />
            </div>
            
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
                        onClick={handleConfirmDelete}
                        className='w-full h-[51px] bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium typo-body_ls'
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;