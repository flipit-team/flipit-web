import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {Bell} from 'lucide-react';
import NoData from '../common/no-data/NoData';
import {Item} from '~/utils/interface';
import FilterSidebar from '../homepage/FilterSidebar';
import GridItems from '../common/grid-items/GridItems';
import SearchBar from '../homepage/search-bar';
import GridSwiper from '../common/grid-items/GridSwiper';
import SortDropdown from '../common/sort-dropdown/SortDropdown';
import MobileControlsWrapper from './MobileControlsWrapper';

interface Props {
    items: Item[];
    auctionItems: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    loadMoreRef?: React.RefObject<HTMLDivElement>;
    loading?: boolean;
    hasMore?: boolean;
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
    userName?: string;
    userAvatar?: string;
}

const MainHomeServer = ({
    items,
    auctionItems,
    defaultCategories,
    loadMoreRef,
    loading,
    hasMore,
    onSortChange,
    currentSort = 'recent',
    filters,
    onFilterChange,
    searchQuery = '',
    userName = '',
    userAvatar = ''
}: Props) => {
    const sortOptions = [
        {value: 'recent', label: 'Recent'},
        {value: 'popular', label: 'Popular'},
        {value: 'a-z', label: 'A-Z (ascending)'},
        {value: 'z-a', label: 'Z-A (descending)'},
        {value: 'low-high', label: 'Price: Low to High'},
        {value: 'high-low', label: 'Price: High to Low'}
    ];

    const handleSortSelect = (option: {value: string; label: string}) => {
        onSortChange?.(option.value);
    };

    // Check if any filters are active or search is being used
    const hasActiveFilters =
        filters.category !== '' ||
        filters.stateCode !== '' ||
        filters.sort !== 'recent' ||
        filters.search !== '' ||
        filters.priceMin !== '' ||
        filters.priceMax !== '' ||
        filters.verifiedSellers ||
        filters.discount ||
        searchQuery !== '';

    return (
        <div className='flex flex-col relative no-scrollbar'>
            {/* Mobile teal header — greeting + search in one block */}
            <div className='hidden xs:flex xs:flex-col bg-primary rounded-b-[28px] pt-3 pb-6 px-5'>
                <div className='flex items-center gap-2 mb-5'>
                    <div className='w-8 h-8 rounded-full bg-gray-200 overflow-hidden'>
                        {userAvatar && (
                            <Image
                                src={userAvatar}
                                alt=''
                                width={32}
                                height={32}
                                className='w-full h-full object-cover'
                            />
                        )}
                    </div>
                    <p className='font-poppins typo-body-sm-regular text-white'>
                        Good Morning, <span className='font-semibold'>{userName || 'there'}</span>
                    </p>
                </div>
                {/* Search bar inside teal header on mobile */}
                <form action='/' method='GET' className='relative h-[44px] w-full'>
                    <input
                        type='text'
                        name='q'
                        defaultValue={searchQuery}
                        placeholder='Search for items'
                        className='w-full h-[44px] pl-4 pr-[44px] bg-white rounded-lg outline-none typo-body-md-regular text-gray-900 font-poppins placeholder:text-gray-400'
                    />
                    <button
                        type='submit'
                        className='h-[44px] w-[44px] absolute top-0 right-0 flex items-center justify-center'
                    >
                        <Image className='h-5 w-5' src={'/icons/ui/search.svg'} alt='search' height={20} width={20} />
                    </button>
                </form>
            </div>
            <SearchBar />
            <div
                className={`grid ${defaultCategories.length > 0 ? 'grid-cols-[260px_1fr]' : 'grid-cols-1'} xs:grid-cols-1 gap-6 xs:gap-0 overflow-hidden max-w-full`}
            >
                {defaultCategories.length > 0 && (
                    <FilterSidebar categories={defaultCategories} filters={filters} onFilterChange={onFilterChange} />
                )}

                <div className='w-full max-w-full overflow-x-hidden pr-[60px] xs:pr-4 xs:pl-4 no-scrollbar'>
                    <MobileControlsWrapper
                        defaultCategories={defaultCategories}
                        onSortChange={onSortChange}
                        currentSort={currentSort}
                    />
                    {!hasActiveFilters && auctionItems.length > 0 && (
                        <>
                            <div className='py-9 xs:py-4 xs:mb-0 flex items-center justify-between overflow-hidden px-4 xs:px-0'>
                                <div className='font-poppins font-semibold text-[20px] leading-[1.6] text-text_one xs:text-[18px] xs:font-bold'>
                                    Live Auction
                                </div>
                                <Link
                                    href='/live-auction'
                                    className='flex items-center font-inter typo-body-lg-medium text-text_four border border-text_four rounded-lg h-[31px] xs:h-[28px] px-4 xs:px-3 hover:bg-gray-50 hover:text-primary-light hover:border-primary-light transition-colors cursor-pointer'
                                >
                                    View all
                                </Link>
                            </div>
                            <div className='xs:mb-14'>
                                <GridSwiper items={auctionItems} forLiveAuction />
                            </div>
                        </>
                    )}
                    {items.length > 0 ? (
                        <>
                            <div className='py-9 xs:py-1 xs:mb-2 flex items-center justify-between px-2 xs:px-0'>
                                <div className='font-poppins font-semibold text-[24px] leading-[1.6] text-text_one xs:text-[18px]'>
                                    <span className='xs:hidden'>Listed Items</span>
                                    <span className='hidden xs:inline'>Special for You</span>
                                </div>
                                <div className='xs:hidden'>
                                    <SortDropdown
                                        options={sortOptions}
                                        defaultSelection={
                                            sortOptions.find((opt) => opt.value === currentSort)?.label || 'Recent'
                                        }
                                        onSelectionChange={handleSortSelect}
                                    />
                                </div>
                            </div>
                            <GridItems items={items} />

                            {/* Infinite scroll loading indicator */}
                            <div ref={loadMoreRef} className='flex justify-center items-center py-8'>
                                {loading && hasMore && (
                                    <div className='flex items-center gap-2 text-text-secondary'>
                                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
                                        <span className='typo-body-md-regular'>Loading more items...</span>
                                    </div>
                                )}
                                {!hasMore && items.length > 0 && (
                                    <p className='typo-body-sm-regular text-text-tertiary'>No more items to load</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <NoData />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainHomeServer;
