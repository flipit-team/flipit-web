'use client';
import Image from 'next/image';
import React, {useEffect, useState, useTransition, useRef} from 'react';
import {useSearchParams, useRouter, usePathname} from 'next/navigation';

const SearchBar = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const initialQuery = searchParams.get('q') || '';
    const inputRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState(initialQuery);
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [isPending, startTransition] = useTransition();

    // Skip the initial mount to prevent redirect on page load
    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    useEffect(() => {
        // Don't navigate on initial mount
        if (isInitialMount) return;

        const timeout = setTimeout(() => {
            if (query.length >= 1) {
                // Add search query to current URL using startTransition for non-blocking update
                const params = new URLSearchParams(searchParams.toString());
                params.set('q', query);
                startTransition(() => {
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                });
            } else if (query.length === 0 && initialQuery) {
                // Only clear search if there was a previous query
                const params = new URLSearchParams(searchParams.toString());
                params.delete('q');
                const queryString = params.toString();
                startTransition(() => {
                    router.replace(`${pathname}${queryString ? '?' + queryString : ''}`, { scroll: false });
                });
            }
        }, 500); // debounce delay

        return () => clearTimeout(timeout);
    }, [query, router, pathname, isInitialMount, searchParams, initialQuery]);

    return (
        <div className='relative h-[49px] w-[586px] xs:w-full xs:flex-none mx-auto my-auto outline-none border-none'>
            <input
                ref={inputRef}
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
