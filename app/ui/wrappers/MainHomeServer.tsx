import Image from 'next/image';
import React from 'react';
import NoData from '../common/no-data/NoData';
import { Item } from '~/utils/interface';
import Categories from '../homepage/categories';
import GridItems from '../common/grid-items/GridItems';
import SearchBar from '../homepage/search-bar';
import GridSwiper from '../common/grid-items/GridSwiper';
import SortDropdown from '../common/sort-dropdown/SortDropdown';
import LocationFilter from '../common/location-filter/LocationFilter';
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
    onLocationFilter?: (stateCode: string, lgaCode?: string) => void;
    currentLocationFilter?: { stateCode: string; lgaCode?: string } | null;
    onSortChange?: (sortValue: string) => void;
    currentSort?: string;
}

const MainHomeServer = ({ items, auctionItems, defaultCategories, loadMoreRef, loading, hasMore, onLocationFilter, currentLocationFilter, onSortChange, currentSort = 'recent' }: Props) => {
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


    return (
        <div className='flex flex-col relative no-scrollbar'>
            <div className='xs:px-4 h-[206px] xs:h-[184px] bg-surface-primary-95 flex flex-col gap-7 xs:gap-6 py-11 xs:pt-[36px] xs:pb-[29px]'>
                <div className='flex items-center gap-4 mx-auto text-white xs:flex-col xs:gap-3'>
                    <p className='typo-body_lr xs:typo-body_sr'>Items near me</p>
                    {onLocationFilter ? (
                        <LocationFilter
                            onLocationChange={onLocationFilter}
                            selectedState={currentLocationFilter?.stateCode}
                            selectedLGA={currentLocationFilter?.lgaCode}
                        />
                    ) : (
                        <div className='border border-border_gray h-[37px] xs:h-[34px] px-4 xs:px-3 flex items-center rounded-md'>
                            <Image src={'/location.svg'} height={24} width={24} alt='location' className='h-6 w-6 xs:h-5 xs:w-5 mr-2' />
                            <p className='typo-body_mr xs:typo-body_sr'>All Nigeria</p>
                            <Image src={'/arrow-down.svg'} height={16} width={16} alt='dropdown' className='h-4 w-4 xs:h-3 xs:w-3 ml-2' />
                        </div>
                    )}
                </div>
                <SearchBar />
            </div>
            <div className={`grid ${defaultCategories.length > 0 ? 'grid-cols-[260px_1fr]' : 'grid-cols-1'} xs:grid-cols-1 gap-6 xs:gap-0 overflow-hidden max-w-full`}>
                {defaultCategories.length > 0 && <Categories defaultCategories={defaultCategories} />}

                <div className='w-full max-w-full overflow-x-hidden pr-[60px] xs:pr-4 xs:pl-4 no-scrollbar'>
                    <MobileControlsWrapper
                        defaultCategories={defaultCategories}
                        onSortChange={onSortChange}
                        currentSort={currentSort}
                    />
                    {auctionItems.length > 0 && (
                        <>
                            <div className='py-9 xs:py-4 xs:mb-4 flex items-center justify-between overflow-hidden'>
                                <div className='typo-heading_ms xs:typo-heading_sr'>Live Auction</div>
                                <div className='flex items-center typo-body_mm xs:typo-body_sr text-text_four border border-border_gray rounded-md h-[31px] xs:h-[28px] px-4 xs:px-3'>
                                    View all
                                </div>
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