import Image from 'next/image';
import React from 'react';
import NoData from '../common/no-data/NoData';
import { Item } from '~/utils/interface';
import Categories from '../homepage/categories';
import GridItems from '../common/grid-items/GridItems';
import SearchBar from '../homepage/search-bar';
import GridSwiper from '../common/grid-items/GridSwiper';
import SortDropdown from '../common/sort-dropdown/SortDropdown';

interface Props {
    items: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
}

const MainHomeServer: React.FC<Props> = ({ items, defaultCategories }) => {
    const sortOptions = [
        {value: 'alphabetical', label: 'A-Z'},
        {value: 'popularity', label: 'Popular'},
        {value: 'recent', label: 'Recent'}
    ];

    const handleSortSelect = (option: {value: string; label: string}) => {
        // TODO: Implement sorting logic
        console.log('Sort selected:', option);
    };

    console.log(items);

    return (
        <div className='flex flex-col relative'>
            <div className='xs:px-4 h-[206px] xs:h-[184px] bg-[#005f73f5] flex flex-col gap-7 xs:gap-6 py-11 xs:pt-[36px] xs:pb-[29px]'>
                <div className='flex items-center gap-4 mx-auto text-white'>
                    <p className='typo-body_lr'>Items near me</p>
                    <div className='border border-border_gray h-[37px] px-4 flex items-center rounded-md'>
                        <Image src={'/location.svg'} height={24} width={24} alt='bell' className='h-6 w-6 mr-2' />
                        <p className='typo-body_mr'>Ogude,Lagos</p>
                        <Image src={'/arrow-down.svg'} height={16} width={16} alt='bell' className='h-4 w-4 ml-2' />
                    </div>
                </div>
                <SearchBar />
            </div>
            <div className='grid grid-cols-[260px_1fr] xs:grid-cols-1 gap-6 overflow-hidden max-w-full'>
                <Categories defaultCategories={defaultCategories} />

                <div className='w-full max-w-full overflow-x-hidden pr-[60px]'>
                    <div className='hidden mt-5 mb-5 xs:flex items-center justify-center bg-[#005f732b] text-[#333333] typo-body_ls w-max px-[10px] rounded-lg h-[36px]'>
                        Categories
                    </div>
                    <div className='py-9 xs:py-0 xs:mb-4 flex items-center justify-between overflow-hidden'>
                        <div className='typo-heading_ms'>Live Auction</div>
                        <div className='flex items-center typo-body_mm text-text_four border border-border_gray rounded-md h-[31px] px-4'>
                            View all
                        </div>
                    </div>
                    <div className=''>
                        <GridSwiper items={items} />
                    </div>
                    <div className='py-9 xs:py-0 xs:mb-4 flex items-center justify-between'>
                        <div className='typo-heading_ms'>Listed Items</div>
                        <SortDropdown 
                            options={sortOptions}
                            defaultSelection="A-Z"
                            onSelectionChange={handleSortSelect}
                        />
                    </div>

                    {items.length ? <GridItems items={items} /> : <NoData />}
                </div>
            </div>
        </div>
    );
};

export default MainHomeServer;