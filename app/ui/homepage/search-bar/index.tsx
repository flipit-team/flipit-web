'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams();

            if (query.length >= 3) {
                params.set('q', query);
            }

            // router.push(`/home?${params.toString()}`);
        }, 500); // debounce delay

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className='relative h-[49px] w-[586px] xs:w-full xs:flex-none mx-auto my-auto outline-none border-none'>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type='text'
                placeholder='Search...'
                className='w-full h-[49px] pl-6 pr-4 py-2 typo-body_mr text-text-primary bg-odds-buttons-bg-primary-color border border-none outline-none rounded-md focus:outline-none  focus:ring-transparent focus:border-none'
            />
            <div className='h-[49px] w-[49px] absolute top-[0px] right-0 bg-[#e0f0f0] rounded-r-md flex items-center justify-center'>
                <Image className='h-6 w-6 cursor-pointer' src={'/search.svg'} alt='search' height={24} width={24} />
            </div>
        </div>
    );
};

export default SearchBar;
