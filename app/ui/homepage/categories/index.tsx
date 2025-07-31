'use client';
import Image from 'next/image';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect} from 'react';
import {useAppContext} from '~/contexts/AppContext';

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
    const {setDefaultCategories} = useAppContext();

    useEffect(() => {
        setDefaultCategories(defaultCategories);
    }, [defaultCategories]);

    const pushParam = (name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('categories', name);
        router.push(`${pathname}?${params.toString()}`);
    };
    return (
        <div
            className={`w-full flex flex-col ${forLiveAuction ? 'pt-0' : 'pt-7'}  shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:hidden`}
        >
            <div
                className={`h-[58px] flex items-center justify-center gap-2 ${forLiveAuction ? 'bg-[#005f73f5] mb-4' : 'bg-[#005f7314]'}`}
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
            {defaultCategories.map((item, i) => {
                return (
                    <p
                        onClick={() => pushParam(item.name)}
                        key={i}
                        className='h-[58px] pl-[60px] typo-body_mm capitalize cursor-pointer'
                    >
                        {item.name}
                    </p>
                );
            })}
        </div>
    );
};

export default Categories;
