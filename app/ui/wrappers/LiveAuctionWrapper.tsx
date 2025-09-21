'use client';
import Image from 'next/image';
import React from 'react';
import NoData from '../common/no-data/NoData';
import {Item} from '~/utils/interface';
import Categories from '../homepage/categories';
import GridItems from '../common/grid-items/GridItems';
import SearchBar from '../homepage/search-bar';
import SortDropdown from '../common/sort-dropdown/SortDropdown';
import MobileControlsWrapper from './MobileControlsWrapper';
import LocationFilter from '../common/location-filter/LocationFilter';
import {useAppContext} from '~/contexts/AppContext';
import {dummyItems} from '~/utils/dummy';

interface Props {
    items: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    onLocationFilter?: (stateCode: string, lgaCode?: string) => void;
    onSortChange?: (sortValue: string) => void;
    currentSort?: string;
}

const LiveAuctionWrapper = (props: Props) => {
    const {items: serverItems, defaultCategories: serverCategories, onLocationFilter, onSortChange, currentSort = 'recent'} = props;
    const {debugMode} = useAppContext();

    // Use server-side data or dummy data for debug mode only
    const items = debugMode ? dummyItems : serverItems;
    const defaultCategories = debugMode ? [
        {name: 'Electronics', description: 'Devices like phones, laptops, gadgets, etc.'},
        {name: 'Mobile Phones', description: 'Smartphones and related accessories'},
        {name: 'Clothing', description: 'Fashion items and apparel'},
        {name: 'Home & Garden', description: 'Home improvement and garden items'},
        {name: 'Sports', description: 'Sports equipment and accessories'}
    ] : serverCategories;

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
                    <p className='typo-body_lr xs:typo-body_sr'>Auctions near me</p>
                    {onLocationFilter ? (
                        <LocationFilter onLocationChange={onLocationFilter} />
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

            <div className='grid grid-cols-[260px_1fr] xs:grid-cols-1 gap-6 xs:gap-0 overflow-hidden max-w-full'>
                <Categories defaultCategories={defaultCategories} forLiveAuction />

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

                    {items.length ? <GridItems items={items} forLiveAuction /> : <NoData />}
                </div>
            </div>
        </div>
    );
};

export default LiveAuctionWrapper;
