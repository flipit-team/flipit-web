'use client';
import React from 'react';
import NoData from '../common/no-data/NoData';
import {Item} from '~/utils/interface';
import FilterSidebar from '../homepage/FilterSidebar';
import GridItems from '../common/grid-items/GridItems';
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
}

const LiveAuctionWrapper = (props: Props) => {
    const {items: serverItems, defaultCategories: serverCategories, onSortChange, currentSort = 'recent', filters, onFilterChange, searchQuery = '', loading = false} = props;

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
            <div className='xs:px-4 h-[206px] xs:h-[184px] bg-surface-primary-95 flex flex-col gap-7 xs:gap-6 py-11 xs:pt-[36px] xs:pb-[29px]'>
                <div className='flex items-center gap-4 mx-auto text-white xs:flex-col xs:gap-3'>
                    <p className='typo-body_lr xs:typo-body_sr capitalize'>
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

                    <div className='py-9 xs:py-4 xs:mb-4 flex items-center justify-between'>
                        <div className='typo-heading_ms xs:typo-heading_sr'>Live Auctions</div>
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
