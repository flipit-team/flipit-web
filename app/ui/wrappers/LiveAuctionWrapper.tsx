'use client';
import Image from 'next/image';
import React, {useState} from 'react';
import NoData from '../common/no-data/NoData';
import {Item} from '~/utils/interface';
import Categories from '../homepage/categories';
import GridItems from '../common/grid-items/GridItems';
import SearchBar from '../homepage/search-bar';

interface Props {
    items: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
}

const LiveAuctionWrapper = (props: Props) => {
    const {items, defaultCategories} = props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('A-Z');

    const sortOptions = [
        {value: 'alphabetical', label: 'A-Z'},
        {value: 'ending-soon', label: 'Ending Soon'},
        {value: 'newest', label: 'Newest'},
        {value: 'highest-bid', label: 'Highest Bid'}
    ];

    const handleSortSelect = (option: {value: string; label: string}) => {
        setSelectedSort(option.label);
        setIsDropdownOpen(false);
    };

    return (
        <div className='flex flex-col relative'>
            <div className='xs:px-4 h-[103px] xs:h-[184px] bg-[#005f73f5] flex xs:gap-6  xs:pt-[36px] xs:pb-[29px]'>
                <div className='flex items-center mx-auto text-white'>
                    <SearchBar />
                </div>
            </div>

            <div className='grid grid-cols-[260px_1fr] xs:grid-cols-1 gap-6 overflow-hidden max-w-full'>
                <Categories defaultCategories={defaultCategories} forLiveAuction />

                <div className='w-full max-w-full overflow-x-hidden pr-[60px]'>
                    <div className='py-3 xs:py-0 xs:mb-4 flex items-center justify-between'>
                        <div className='typo-heading_ms'>Browse all items</div>
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
                                        {sortOptions.map((option) => (
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
                    </div>

                    {items.length ? <GridItems items={items} forLiveAuction /> : <NoData />}
                </div>
            </div>
        </div>
    );
};

export default LiveAuctionWrapper;
