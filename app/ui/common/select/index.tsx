'use client';
import Image from 'next/image';
import React, {useState, useRef, useEffect} from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface Props {
    label?: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

const Select = (props: Props) => {
    const {label, options, value, onChange, placeholder = 'Select option', required, disabled} = props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className='relative w-full' ref={dropdownRef}>
            {label && (
                <label className='typo-body_lr block mb-2'>
                    {label}
                    {required && <span className='text-error ml-1'>*</span>}
                </label>
            )}

            <div className='relative w-full min-h-[49px]'>
                <button
                    type='button'
                    className='flex items-center justify-between w-full border p-3 rounded-lg cursor-pointer bg-white shadow-sm hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    <span className={`typo-body_lr ${selectedOption ? 'text-text_one' : 'text-text_four'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className='flex items-center gap-2'>
                        {isOpen && !disabled ? (
                            <Image
                                src={'/cancel-circle.svg'}
                                height={20}
                                width={20}
                                alt='close'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                            />
                        ) : (
                            <Image src={'/chevron-down.svg'} height={14} width={14} alt='chevron down' />
                        )}
                    </div>
                </button>

                {isOpen && !disabled && (
                    <div className='absolute left-0 mt-1 p-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-auto'>
                        <ul>
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    className={`flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer rounded transition-colors ${
                                        value === option.value ? 'bg-gray-50' : ''
                                    }`}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span className='typo-body_mr'>{option.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Select;
