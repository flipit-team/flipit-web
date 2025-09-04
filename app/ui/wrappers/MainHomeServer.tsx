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
}

const MainHomeServer = ({ items, auctionItems, defaultCategories, loadMoreRef, loading, hasMore, onLocationFilter }: Props) => {
    const sortOptions = [
        {value: 'alphabetical', label: 'A-Z'},
        {value: 'popularity', label: 'Popular'},
        {value: 'recent', label: 'Recent'}
    ];

    const handleSortSelect = (option: {value: string; label: string}) => {
        // TODO: Implement sorting logic
    };


    return (
        <div className='flex flex-col relative no-scrollbar'>
            <div className='xs:px-4 h-[206px] xs:h-[184px] bg-surface-primary-95 flex flex-col gap-7 xs:gap-6 py-11 xs:pt-[36px] xs:pb-[29px]'>
                <div className='flex items-center gap-4 mx-auto text-white'>
                    <p className='typo-body_lr'>Items near me</p>
                    {onLocationFilter ? (
                        <LocationFilter onLocationChange={onLocationFilter} />
                    ) : (
                        <div className='border border-border_gray h-[37px] px-4 flex items-center rounded-md'>
                            <Image src={'/location.svg'} height={24} width={24} alt='location' className='h-6 w-6 mr-2' />
                            <p className='typo-body_mr'>All Nigeria</p>
                            <Image src={'/arrow-down.svg'} height={16} width={16} alt='dropdown' className='h-4 w-4 ml-2' />
                        </div>
                    )}
                </div>
                <SearchBar />
            </div>
            <div className='grid grid-cols-[260px_1fr] xs:grid-cols-1 gap-6 overflow-hidden max-w-full'>
                <Categories defaultCategories={defaultCategories} />

                <div className='w-full max-w-full overflow-x-hidden pr-[60px] no-scrollbar'>
                    <div className='hidden mt-5 mb-5 xs:flex items-center justify-center bg-surface-primary-16 text-text_one typo-body_ls w-max px-[10px] rounded-lg h-[36px]'>
                        Categories
                    </div>
                    {auctionItems.length > 0 && (
                        <>
                            <div className='py-9 xs:py-0 xs:mb-4 flex items-center justify-between overflow-hidden'>
                                <div className='typo-heading_ms'>Live Auction</div>
                                <div className='flex items-center typo-body_mm text-text_four border border-border_gray rounded-md h-[31px] px-4'>
                                    View all
                                </div>
                            </div>
                            <div className=''>
                                <GridSwiper items={auctionItems} forLiveAuction />
                            </div>
                        </>
                    )}
                    {items.length > 0 ? (
                        <>
                            <div className='py-9 xs:py-0 xs:mb-4 flex items-center justify-between'>
                                <div className='typo-heading_ms'>Listed Items</div>
                                <SortDropdown 
                                    options={sortOptions}
                                    defaultSelection="A-Z"
                                    onSelectionChange={handleSortSelect}
                                />
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