'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

const SearchBar = () => {
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
                style={{ 
                    width: '100%',
                    height: '49px',
                    paddingLeft: '24px',
                    paddingRight: '16px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                    color: '#111827 !important', 
                    fontSize: '16px !important', 
                    WebkitTextFillColor: '#111827 !important',
                    fontFamily: 'system-ui, -apple-system, sans-serif !important',
                    fontWeight: '400 !important',
                    textShadow: 'none !important',
                    opacity: '1 !important',
                    WebkitAppearance: 'none' as any,
                    MozAppearance: 'textfield' as any
                }}
            />
            <div className='h-[49px] w-[49px] absolute top-[0px] right-0 bg-background-tinted rounded-r-md flex items-center justify-center'>
                <Image className='h-6 w-6 cursor-pointer' src={'/search.svg'} alt='search' height={24} width={24} />
            </div>
        </div>
    );
};

export default SearchBar;
