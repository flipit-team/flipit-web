'use client';
import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangeDropdownProps {
    selectedRange: string;
    onRangeChange: (range: string) => void;
}

const DateRangeDropdown = ({ selectedRange, onRangeChange }: DateRangeDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const dateRanges = [
        'Apr 30, 2025 - Mar 14, 2024',
        'Last 7 days',
        'Last 30 days',
        'Last 90 days',
        'Last 6 months',
        'Last year',
        'Custom range'
    ];

    const handleSelect = (range: string) => {
        onRangeChange(range);
        setIsOpen(false);
    };

    return (
        <div className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2 px-3 py-2 border border-border_gray rounded-md bg-white hover:bg-gray-50 transition-colors'
            >
                <Calendar className='w-4 h-4 text-gray-500' />
                <span className='text-sm text-gray-700 whitespace-nowrap'>
                    {selectedRange}
                </span>
                <ChevronDown className='w-4 h-4 text-gray-500' />
            </button>

            {isOpen && (
                <div className='absolute top-full mt-1 right-0 bg-white border border-border_gray rounded-md shadow-lg z-10 min-w-[200px]'>
                    {dateRanges.map((range, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(range)}
                            className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md'
                        >
                            {range}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DateRangeDropdown;