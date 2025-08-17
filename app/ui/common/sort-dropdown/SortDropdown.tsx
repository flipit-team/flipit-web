'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SortOption {
    value: string;
    label: string;
}

interface SortDropdownProps {
    options: SortOption[];
    defaultSelection?: string;
    onSelectionChange?: (option: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ 
    options, 
    defaultSelection = 'A-Z',
    onSelectionChange 
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(defaultSelection);

    const handleSortSelect = (option: SortOption) => {
        setSelectedSort(option.label);
        setIsDropdownOpen(false);
        onSelectionChange?.(option);
    };

    return (
        <div className='flex items-center gap-2 relative'>
            <span className='typo-body_sr text-text_four'>Sort by</span>
            <div className='relative'>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='w-[166px] typo-body_ss h-[41px] text-text_four border border-border_gray rounded px-4 py-1 focus:outline-none focus:border-border_gray bg-white flex items-center justify-between min-w-[100px]'
                >
                    <span>{selectedSort}</span>
                    <Image
                        src='/arrow-down-gray.svg'
                        height={16}
                        width={16}
                        alt='dropdown'
                        className={`h-4 w-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {isDropdownOpen && (
                    <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-border_gray rounded shadow-lg z-50'>
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSortSelect(option)}
                                className='w-full px-4 py-2 text-left typo-body_ss text-text_four hover:bg-gray-50 first:rounded-t last:rounded-b'
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SortDropdown;