'use client';
import React from 'react';
import NoData from '../common/no-data/NoData';
import {Item} from '~/utils/interface';
import FilterSidebar from '../homepage/FilterSidebar';
import GridItems from '../common/grid-items/GridItems';
import Image from 'next/image';
import Link from 'next/link';
import {Bell} from 'lucide-react';
import SearchBar from '../homepage/search-bar';
import SortDropdown from '../common/sort-dropdown/SortDropdown';
import MobileControlsWrapper from './MobileControlsWrapper';

interface Props {
    items: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    onSortChange?: (sortValue: string) => void;
    currentSort?: string;
    filters: {
        category: string;
        subCategory: string;
        stateCode: string;
        lgaCode: string;
        priceMin: string;
        priceMax: string;
        verifiedSellers: boolean;
        discount: boolean;
        sort: string;
        search?: string;
    };
    onFilterChange: (filters: any) => void;
    searchQuery?: string;
    loading?: boolean;
    userName?: string;
    userAvatar?: string;
}

const LiveAuctionWrapper = (props: Props) => {
    const {items: serverItems, defaultCategories: serverCategories, onSortChange, currentSort = 'recent', filters, onFilterChange, searchQuery = '', loading = false, userName = '', userAvatar = ''} = props;

    // Use only real server-side data (no dummy data)
    const items = serverItems;
    const defaultCategories = serverCategories;

    const sortOptions = [
        {value: 'recent', label: 'Recent'},
        {value: 'ending-soon', label: 'Ending Soon'},
        {value: 'highest-bid', label: 'Highest Bid'},
        {value: 'price-low', label: 'Price: Low to High'},
        {value: 'price-high', label: 'Price: High to Low'}
    ];

    const handleSortSelect = (option: {value: string; label: string}) => {
        onSortChange?.(option.value);
    };

    return (
        <div className='flex flex-col relative no-scrollbar'>
            {/* Mobile teal greeting + search */}
            <div className='hidden xs:flex xs:flex-col bg-primary rounded-b-[28px] pt-3 pb-6 px-5'>
                <div className='flex items-center gap-2 mb-5'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 overflow-hidden'>
                        {userAvatar && <Image src={userAvatar} alt='' width={32} height={32} className='w-full h-full object-cover' />}
                    </div>
                    <p className='font-poppins typo-body-sm-regular text-white'>
                        Good Morning, <span className='font-semibold'>{userName || 'there'}</span>
                    </p>
                </div>
                <form action='/live-auction' method='GET' className='relative h-[44px] w-full'>
                    <input
                        type='text'
                        name='q'
                        defaultValue={searchQuery}
                        placeholder='Search auctions'
                        className='w-full h-[44px] pl-4 pr-[44px] bg-white rounded-lg outline-none typo-body-md-regular text-gray-900 font-poppins placeholder:text-gray-400'
                    />
                    <button type='submit' className='h-[44px] w-[44px] absolute top-0 right-0 flex items-center justify-center'>
                        <Image className='h-5 w-5' src={'/icons/ui/search.svg'} alt='search' height={20} width={20} />
                    </button>
                </form>
            </div>

            {/* Desktop header */}
            <div className='xs:hidden h-[206px] bg-surface-primary-95 flex flex-col gap-7 py-11'>
                <div className='flex items-center gap-4 mx-auto text-white'>
                    <p className='typo-body_lr capitalize'>
                        {filters.category ? `${filters.category} Auctions` : 'All Auctions'}
                    </p>
                </div>
                <SearchBar />
            </div>

            <div className={`grid ${defaultCategories.length > 0 ? 'grid-cols-[260px_1fr]' : 'grid-cols-1'} xs:grid-cols-1 gap-6 xs:gap-0 overflow-hidden max-w-full`}>
                {defaultCategories.length > 0 && (
                    <FilterSidebar
                        categories={defaultCategories}
                        filters={filters}
                        onFilterChange={onFilterChange}
                    />
                )}

                <div className='w-full max-w-full overflow-x-hidden pr-[60px] xs:pr-4 xs:pl-4 no-scrollbar'>
                    <MobileControlsWrapper
                        defaultCategories={defaultCategories}
                        onSortChange={onSortChange}
                        currentSort={currentSort}
                    />

                    <div className='py-9 xs:py-1 xs:mb-2 flex items-center justify-between'>
                        <div className='typo-heading_ms xs:typo-body-lg-semibold xs:text-text_one'>Live Auctions</div>
                        <div className='xs:hidden'>
                            <SortDropdown
                                options={sortOptions}
                                defaultSelection={sortOptions.find(opt => opt.value === currentSort)?.label || "Recent"}
                                onSelectionChange={handleSortSelect}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="flex items-center gap-2 text-text-secondary">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                <span className="typo-body-md-regular">Loading auctions...</span>
                            </div>
                        </div>
                    ) : items.length ? (
                        <GridItems items={items} forLiveAuction />
                    ) : (
                        <NoData />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveAuctionWrapper;
