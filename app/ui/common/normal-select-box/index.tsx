'use client';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';

interface Props {
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
    selectedOption: string;
    options: {name: string; description: string | null}[];
    title?: string;
}

const NormalSelectBox = (props: Props) => {
    const {selectedOption, options, setSelectedOption, title} = props;
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='relative w-full xs:flex-none mx-auto outline-none border-none'>
            <label htmlFor='category' className='typo-body_lr block mb-2'>
                {title || 'Category'}
            </label>

            <div className='relative w-full h-[49px]'>
                <div
                    className='flex items-center justify-between border p-2 rounded-lg cursor-pointer bg-white shadow-sm'
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className='flex items-center gap-2'>
                        {selectedOption ? (
                            <span>{selectedOption}</span>
                        ) : (
                            <span className='typo-body_lr text-text_one '>Select option</span>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        {isOpen ? (
                            <Image
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOption(options[0].name);
                                    setIsOpen(false);
                                }}
                                src={'/cancel-circle.svg'}
                                height={20}
                                width={20}
                                alt='cancel'
                            />
                        ) : (
                            <Image src={'/chevron-down.svg'} height={14} width={14} alt='chevron down' />
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className='absolute left-0 p-[22px] w-full bg-white border rounded-lg shadow-md z-10'>
                        <ul className='max-h-48 overflow-auto'>
                            {options.map((option, i) => (
                                <li
                                    key={i}
                                    className='flex items-center gap-4 mb-[24px] xs:mb-0 hover:bg-gray-100 cursor-pointer'
                                    onClick={() => {
                                        setSelectedOption(option.name);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className='xs:typo-body_mr'>{option.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NormalSelectBox;
