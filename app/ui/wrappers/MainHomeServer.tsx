import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import NoData from '../common/no-data/NoData';
import { Item } from '~/utils/interface';
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
}

const MainHomeServer = ({ items, auctionItems, defaultCategories, loadMoreRef, loading, hasMore, onSortChange, currentSort = 'recent', filters, onFilterChange, searchQuery = '' }: Props) => {
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
    const hasActiveFilters = filters.category !== '' || filters.stateCode !== '' || filters.sort !== 'recent' ||
        filters.search !== '' || filters.priceMin !== '' || filters.priceMax !== '' ||
        filters.verifiedSellers || filters.discount || searchQuery !== '';


    return (
        <div className='flex flex-col relative no-scrollbar'>
            <div className='xs:px-4 h-[206px] xs:h-[184px] bg-surface-primary-95 flex flex-col gap-7 xs:gap-6 py-11 xs:pt-[36px] xs:pb-[29px]'>
                <div className='flex items-center gap-4 mx-auto text-white xs:flex-col xs:gap-3'>
                    <p className='typo-body_lr xs:typo-body_sr capitalize'>
                        {filters.category ? `${filters.category} Items` : 'All Items'}
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
                    {!hasActiveFilters && auctionItems.length > 0 && (
                        <>
                            <div className='py-9 xs:py-4 xs:mb-4 flex items-center justify-between overflow-hidden'>
                                <div className='typo-heading_ms xs:typo-heading_sr'>Live Auction</div>
                                <Link href='/live-auction' className='flex items-center typo-body_mm xs:typo-body_sr text-text_four border border-border_gray rounded-md h-[31px] xs:h-[28px] px-4 xs:px-3 hover:bg-gray-50 hover:text-primary-light hover:border-primary-light transition-colors cursor-pointer'>
                                    View all
                                </Link>
                            </div>
                            <div className='xs:mb-6'>
                                <GridSwiper items={auctionItems} forLiveAuction />
                            </div>
                        </>
                    )}
                    {items.length > 0 ? (
                        <>
                            <div className='py-9 xs:py-4 xs:mb-4 flex items-center justify-between'>
                                <div className='typo-heading_ms xs:typo-heading_sr'>Listed Items</div>
                                <div className='xs:hidden'>
                                    <SortDropdown
                                        options={sortOptions}
                                        defaultSelection={sortOptions.find(opt => opt.value === currentSort)?.label || "Recent"}
                                        onSelectionChange={handleSortSelect}
                                    />
                                </div>
                            </div>
                            <GridItems items={items} />

                            {/* Infinite scroll loading indicator */}
                            <div ref={loadMoreRef} className="flex justify-center items-center py-8">
                                {loading && hasMore && (
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                        <span className="typo-body-md-regular">Loading more items...</span>
                                    </div>
                                )}
                                {!hasMore && items.length > 0 && (
                                    <p className="typo-body-sm-regular text-text-tertiary">No more items to load</p>
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
