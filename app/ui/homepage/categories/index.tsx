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
}

const Categories = (props: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const {setDefaultCategories} = useAppContext();

    useEffect(() => {
        setDefaultCategories(props.defaultCategories);
    }, [props.defaultCategories]);

    const pushParam = (name: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('categories', name);
        router.push(`${pathname}?${params.toString()}`);
    };
    return (
        <div className='w-full flex flex-col pt-7 shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:hidden'>
            <div className='h-[58px] flex items-center justify-center gap-2 bg-[#005f7314]'>
                <Image className='h-5 w-5 cursor-pointer' src={'/shop.svg'} alt='search' height={20} width={20} />
                <p className='typo-body_mm text-primary'>Browse all</p>
            </div>
            <p className='h-[58px] pl-[60px] typo-heading_ss'>Categories</p>
            {props.defaultCategories.map((item, i) => {
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
