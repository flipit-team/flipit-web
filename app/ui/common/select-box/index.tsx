'use client';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';

const options = [
    {id: 1, title: 'iPhone 12 Promax', img: '/camera.png'},
    {id: 2, title: 'Sony Camera', img: '/camera.png'}
];

const SelectBox = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [selected, setSelected] = useState('with-cash');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<
        | {
              id: number;
              title: string;
              img: string;
          }
        | undefined
    >();
    return (
        <div className='relative w-full xs:flex-none mx-auto outline-none border-none'>
            <label htmlFor='category' className='typo-body_lr block mb-2'>
                Category
            </label>

            <div className='relative w-full h-[49px]'>
                <div
                    className='flex items-center justify-between border p-2 rounded-lg cursor-pointer bg-white shadow-sm'
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className='flex items-center gap-2'>
                        {selectedOption ? (
                            <>
                                <Image
                                    src={selectedOption.img}
                                    alt={selectedOption.title}
                                    width={24}
                                    height={24}
                                    className='rounded-full'
                                />
                                <span>{selectedOption.title}</span>
                            </>
                        ) : (
                            <span className='typo-body_lr text-text_one '>Select option</span>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        {isOpen ? (
                            <Image
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOption(options[0]);
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
                            {options.map((option) => (
                                <li
                                    key={option.id}
                                    className='flex h-[54px] items-center gap-4 mb-[24px] xs:mb-0 hover:bg-gray-100 cursor-pointer'
                                    onClick={() => {
                                        setSelectedOption(option);
                                        setIsOpen(false);
                                    }}
                                >
                                    <Image
                                        src={option.img}
                                        alt={option.title}
                                        width={54}
                                        height={54}
                                        className='h-[54px] w-[54px] xs:h-[32px] xs:w-[32px]'
                                    />
                                    <span className='xs:typo-body_mr'>{option.title}</span>
                                </li>
                            ))}
                        </ul>
                        <button className='w-max mt-[20px] text-center typo-heading_sm xs:typo-body_lm text-primary'>
                            + Add New Item
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectBox;
