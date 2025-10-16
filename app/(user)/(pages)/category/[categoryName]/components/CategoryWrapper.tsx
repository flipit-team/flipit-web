'use client';

import React from 'react';
import { Item } from '~/utils/interface';
import CategorySidebar from './CategorySidebar';
import GridItems from '~/ui/common/grid-items/GridItems';
import SearchBar from '~/ui/homepage/search-bar';
import SortDropdown from '~/ui/common/sort-dropdown/SortDropdown';
import MobileControlsWrapper from '~/ui/wrappers/MobileControlsWrapper';
import NoData from '~/ui/common/no-data/NoData';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';

interface CategoryWrapperProps {
    categoryName: string;
    items: Item[];
    categories: Array<{ id?: number; name: string; description: string | null; subcategories?: string[]; }>;
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
    loading?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
}

const CategoryWrapper: React.FC<CategoryWrapperProps> = ({
    categoryName,
    items,
    categories,
    filters,
    onFilterChange,
    loading = false,
    hasMore = false,
    onLoadMore
}) => {
    // Set up infinite scroll
    const { loadMoreRef } = useInfiniteScroll({
        hasMore,
        loading,
        onLoadMore: onLoadMore || (() => {})
    });


    const sortOptions = [
        { value: 'recent', label: 'Recent' },
        { value: 'popular', label: 'Popular' },
        { value: 'a-z', label: 'A-Z (ascending)' },
        { value: 'z-a', label: 'Z-A (descending)' },
        { value: 'low-high', label: 'Price: Low to High' },
        { value: 'high-low', label: 'Price: High to Low' }
    ];

    const handleSortChange = (option: { value: string; label: string }) => {
        const newFilters = { ...filters, sort: option.value };
        onFilterChange(newFilters);
    };

    const handleMobileSortChange = (sortValue: string) => {
        const newFilters = { ...filters, sort: sortValue };
        onFilterChange(newFilters);
    };

    const currentSortLabel = sortOptions.find(opt => opt.value === filters.sort)?.label || 'Recent';

    // Use the current filter category or fall back to the URL category name
    const displayCategoryName = filters.category || categoryName;

    return (
        <div className='flex flex-col relative no-scrollbar'>
            {/* Header section - Same as home page */}
            <div className='xs:px-4 h-[206px] xs:h-[184px] bg-surface-primary-95 flex flex-col gap-7 xs:gap-6 py-11 xs:pt-[36px] xs:pb-[29px]'>
                <div className='flex items-center gap-4 mx-auto text-white xs:flex-col xs:gap-3'>
                    <p className='typo-body_lr xs:typo-body_sr'>{displayCategoryName} items</p>
                </div>
                <SearchBar />
            </div>

            {/* Main grid - Same as home page */}
            <div className='grid grid-cols-[260px_1fr] xs:grid-cols-1 gap-6 xs:gap-0 overflow-hidden max-w-full'>
                {/* Sidebar with modern filters */}
                <CategorySidebar
                    categories={categories}
                    filters={filters}
                    onFilterChange={onFilterChange}
                    categoryName={displayCategoryName}
                />

                {/* Main content area - Same structure as home page */}
                <div className='w-full max-w-full overflow-x-hidden pr-[60px] xs:pr-4 xs:pl-4 no-scrollbar'>
                    <MobileControlsWrapper
                        defaultCategories={categories}
                        onSortChange={handleMobileSortChange}
                        currentSort={filters.sort}
                    />

                    {/* Category items section */}
                    {items.length > 0 ? (
                        <>
                            <div className='py-9 xs:py-4 xs:mb-4 flex items-center justify-between'>
                                <div className='typo-heading_ms xs:typo-heading_sr'>{displayCategoryName} Items</div>
                                <div className='xs:hidden'>
                                    <SortDropdown
                                        options={sortOptions}
                                        defaultSelection={currentSortLabel}
                                        onSelectionChange={handleSortChange}
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

export default CategoryWrapper;