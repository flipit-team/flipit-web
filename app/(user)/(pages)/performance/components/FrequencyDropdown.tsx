'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FrequencyDropdownProps {
    selectedFrequency: string;
    onFrequencyChange: (frequency: string) => void;
}

const FrequencyDropdown = ({ selectedFrequency, onFrequencyChange }: FrequencyDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const frequencies = [
        'Daily',
        'Weekly',
        'Monthly',
        'Quarterly',
        'Yearly'
    ];

    const handleSelect = (frequency: string) => {
        onFrequencyChange(frequency);
        setIsOpen(false);
    };

    return (
        <div className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2 px-3 py-2 border border-border_gray rounded-md bg-white hover:bg-gray-50 transition-colors'
            >
                <span className='text-sm text-gray-700'>
                    {selectedFrequency}
                </span>
                <ChevronDown className='w-4 h-4 text-gray-500' />
            </button>

            {isOpen && (
                <div className='absolute top-full mt-1 right-0 bg-white border border-border_gray rounded-md shadow-lg z-10 min-w-[100px]'>
                    {frequencies.map((frequency, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(frequency)}
                            className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md'
                        >
                            {frequency}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FrequencyDropdown;