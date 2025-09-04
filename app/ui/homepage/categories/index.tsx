'use client';
import Image from 'next/image';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import React from 'react';
// import {useAppContext} from '~/contexts/AppContext';

interface Props {
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    forLiveAuction?: boolean;
}

const Categories = (props: Props) => {
    const {forLiveAuction, defaultCategories} = props;
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    // const {setDefaultCategories} = useAppContext();

    // Remove this useEffect to prevent infinite loops
    // useEffect(() => {
    //     setDefaultCategories(defaultCategories);
    // }, [defaultCategories, setDefaultCategories]);

    const pushParam = (name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('categories', name);
        router.push(`${pathname}?${params.toString()}`);
    };
    return (
        <div
            className={`w-full flex flex-col ${forLiveAuction ? 'pt-0' : 'pt-7'}  shadow-lg xs:hidden`}
        >
            <div
                className={`h-[58px] flex items-center justify-center gap-2 ${forLiveAuction ? 'bg-surface-primary-95 mb-4' : 'bg-surface-primary'}`}
            >
                {forLiveAuction ? (
                    <p className='typo-heading_ms text-white'>Live Auction</p>
                ) : (
                    <>
                        <Image
                            className='h-5 w-5 cursor-pointer'
                            src={'/shop.svg'}
                            alt='search'
                            height={20}
                            width={20}
                        />
                        <p className='typo-body_mm text-primary'>Browse all</p>
                    </>
                )}
            </div>
            <p className='h-[58px] pl-[60px] typo-heading_ss'>Categories</p>
            {defaultCategories && Array.isArray(defaultCategories) ? defaultCategories.map((item, i) => {
                return (
                    <p
                        onClick={() => pushParam(item.name)}
                        key={i}
                        className='h-[58px] pl-[60px] typo-body_mm capitalize cursor-pointer'
                    >
                        {item.name}
                    </p>
                );
            }) : null}
        </div>
    );
};

export default Categories;
