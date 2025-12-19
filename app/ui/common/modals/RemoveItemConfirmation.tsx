'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Item } from '~/utils/interface';

interface RemoveItemConfirmationProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRemoving: boolean;
}

const RemoveItemConfirmation: React.FC<RemoveItemConfirmationProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
  isRemoving
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-[1001]"
      onClick={handleOverlayClick}
    >
      <div 
        className="relative bg-white rounded-2xl w-[480px] max-w-[90vw] mx-6 p-8 text-text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isRemoving}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="typo-heading-md-semibold text-text-primary mb-4">
            Remove from Saved Items?
          </h3>
          
          <p className="typo-body-md-regular text-text-secondary mb-2">
            Are you sure you want to remove this item from your saved items?
          </p>
          
          <p className="typo-body-sm-medium text-text-tertiary mb-8">
            &quot;{item.title}&quot;
          </p>

          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isRemoving}
              className="px-6 py-3 border border-border-primary text-text-secondary rounded-lg hover:bg-background-secondary hover:text-primary-light hover:border-primary-light transition-colors font-medium typo-body-md-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={onConfirm}
              disabled={isRemoving}
              className="px-6 py-3 bg-error text-white rounded-lg hover:bg-red-700 transition-colors font-medium typo-body-md-semibold disabled:opacity-50 flex items-center gap-2"
            >
              {isRemoving && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isRemoving ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveItemConfirmation;