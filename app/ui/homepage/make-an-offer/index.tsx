'use client';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import RegularButton from '~/ui/common/buttons/RegularButton';

const options = [
    {id: 1, title: 'iPhone 12 Promax', img: '/camera.png'},
    {id: 2, title: 'Sony Camera', img: '/camera.png'}
];

const MakeAnOffer = () => {
    const {setShowPopup} = useAppContext();
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

    if (query === 'make-an-offer')
        return (
            <div className='w-[1096px] flex flex-col justify-center items-center xs:w-full xs:px-4'>
                <div className='w-full xs:hidden'>
                    <Image
                        src={'/close-white.svg'}
                        height={45}
                        width={45}
                        alt='bell'
                        className='h-[45px] w-[45px] ml-auto'
                        onClick={() => setShowPopup(false)}
                    />
                </div>
                <div className='h-[625px] w-full bg-white rounded-lg p-[50px] xs:p-0 xs:h-max xs:w-full xs:py-[32px]'>
                    <div className='hidden xs:block'>
                        <Image
                            src={'/cancel.svg'}
                            height={16}
                            width={16}
                            alt='bell'
                            className='h-[16px] w-[16px] ml-auto mr-4'
                            onClick={() => setShowPopup(false)}
                        />
                    </div>
                    <div className='flex flex-col  mb-4 xs:px-4'>
                        <div className='mb-4'>
                            <p className='typo-heading_medium_semibold xs:typo-body_large_semibold'>
                                Canon EOS RP Camera +Small Rig{' '}
                            </p>
                            <p className='typo-heading_medium_semibold xs:typo-body_large_semibold text-primary'>
                                ₦1,300,000
                            </p>
                        </div>
                        <div className='grid grid-cols-[443px_1fr] xs:flex xs:flex-col gap-[44px] xs:gap-[22px] '>
                            <Image
                                src={'/camera-large.png'}
                                height={439}
                                width={443}
                                alt='picture'
                                className='h-[439px] w-[443px] xs:h-[327px] xs:w-full'
                            />
                            <div className='flex flex-col gap-6'>
                                <p className='typo-heading_small_semibold xs:typo-body_large_semibold'>
                                    How do you want to bid?
                                </p>
                                <div className='flex space-x-6'>
                                    {/* Radio Button 1 */}
                                    <label className='flex items-center space-x-2 cursor-pointer'>
                                        <input
                                            type='radio'
                                            name='toggle'
                                            value='with-cash'
                                            checked={selected === 'with-cash'}
                                            onChange={() => setSelected('with-cash')}
                                            className='hidden'
                                        />
                                        <div
                                            className={`w-6 h-6 flex items-center justify-center border-8 rounded-full transition ${
                                                selected === 'with-cash' ? 'border-green-500' : 'border-gray-400'
                                            }`}
                                        >
                                            {selected === 'with-cash' && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <span className='typo-body_large_regular xs:typo-body_medium_regular'>
                                            With Cash
                                        </span>
                                    </label>

                                    {/* Radio Button 2 */}
                                    <label className='flex items-center space-x-2 cursor-pointer'>
                                        <input
                                            type='radio'
                                            name='toggle'
                                            value='with-an-item'
                                            checked={selected === 'with-an-item'}
                                            onChange={() => setSelected('with-an-item')}
                                            className='hidden'
                                        />
                                        <div
                                            className={`w-6 h-6 flex items-center justify-center border-8 rounded-full transition ${
                                                selected === 'with-an-item' ? 'border-green-500' : 'border-gray-400'
                                            }`}
                                        >
                                            {selected === 'with-an-item' && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <span className='typo-body_large_regular xs:typo-body_medium_regular'>
                                            With an Item
                                        </span>
                                    </label>
                                </div>
                                <div className='relative w-full xs:flex-none mx-auto outline-none border-none'>
                                    <label
                                        htmlFor='Offer your price'
                                        className='typo-body_medium_regular xs:typo-body_medium_regular'
                                    >
                                        {selected === 'with-cash' ? 'Offer your price' : 'Select an Item'}
                                    </label>
                                    {selected === 'with-cash' ? (
                                        <input
                                            type='text'
                                            placeholder='Search...'
                                            className='w-full h-[49px] pl-6 pr-4 py-2 typo-body_large_regular xs:typo-body_medium_regular text-text_one border border-border_gray outline-none rounded-md focus:outline-none  focus:ring-transparent focus:border-none'
                                        />
                                    ) : (
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
                                                        <span className='typo-body_large_regular text-text_one '>
                                                            Select option
                                                        </span>
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
                                                        <Image
                                                            src={'/chevron-down.svg'}
                                                            height={14}
                                                            width={14}
                                                            alt='chevron down'
                                                        />
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
                                                                <span className='xs:typo-body_medium_regular'>
                                                                    {option.title}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <button className='w-max mt-[20px] text-center typo-heading_small_medium xs:typo-body_large_medium text-primary'>
                                                        + Add New Item
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className='w-full'>
                                    <RegularButton text='Place offer' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default MakeAnOffer;
