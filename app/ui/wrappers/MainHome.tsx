import Image from 'next/image';
import React from 'react';
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

const MainHome = (props: Props) => {
    const {items, defaultCategories} = props;

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
            <div className='grid grid-cols-[260px_1fr] xs:grid-cols-1 gap-6'>
                <Categories defaultCategories={defaultCategories} />

                <div className='xs:grid-sizes xs:w-full pr-[60px]'>
                    <div className='hidden mt-5 mb-5 xs:flex items-center justify-center bg-[#005f732b] text-[#333333] typo-body_ls w-max px-[10px] rounded-lg h-[36px]'>
                        Categories
                    </div>
                    <div className='py-9 xs:py-0 xs:mb-4 typo-heading_ms'>Available Items</div>
                    {items.length ? <GridItems items={items} /> : <NoData />}
                </div>
            </div>
        </div>
    );
};

export default MainHome;
