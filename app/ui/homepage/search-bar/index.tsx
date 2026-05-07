'use client';
import Image from 'next/image';
import React, {useEffect, useState, useTransition, useRef} from 'react';
import {useSearchParams, useRouter, usePathname} from 'next/navigation';
import { MapPin, ChevronDown } from 'lucide-react';

interface SearchBarProps {
    onLocationChange?: (location: string) => void;
    currentLocation?: string;
}

const SearchBar = ({ onLocationChange, currentLocation = '' }: SearchBarProps) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const initialQuery = searchParams.get('q') || '';
    const inputRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState(initialQuery);
    const [isInitialMount, setIsInitialMount] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    useEffect(() => {
        if (isInitialMount) return;

        const timeout = setTimeout(() => {
            if (query.length >= 1) {
                const params = new URLSearchParams(searchParams.toString());
                params.set('q', query);
                startTransition(() => {
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                });
            } else if (query.length === 0 && initialQuery) {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('q');
                const queryString = params.toString();
                startTransition(() => {
                    router.replace(`${pathname}${queryString ? '?' + queryString : ''}`, { scroll: false });
                });
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [query, router, pathname, isInitialMount, searchParams, initialQuery]);

    return (
        <div className='w-full h-[116px] xs:h-auto bg-primary flex flex-col items-center justify-center gap-[7px] xs:gap-3 xs:px-4 xs:py-4'>
            <div className='flex items-center gap-4 xs:flex-col xs:gap-2 xs:w-full'>
                <span className='font-poppins text-[12px] leading-[1.6] text-white'>Items near me</span>
                <button
                    onClick={() => onLocationChange?.('')}
                    className='flex items-center gap-2 border border-white/30 rounded px-3 py-1.5 text-white hover:bg-white/10 transition-colors'
                >
                    <MapPin size={16} className='text-white' />
                    <span className='font-poppins text-[12px] leading-[1.5] font-medium text-white'>
                        {currentLocation || 'Select location'}
                    </span>
                    <ChevronDown size={14} className='text-white' />
                </button>
            </div>
            <div className='relative h-[49px] w-[586px] xs:w-full'>
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type='text'
                    placeholder='Search for items'
                    className='w-full h-[49px] pl-6 pr-[50px] bg-white border border-gray-300 rounded-md outline-none text-[14px] text-gray-900 font-poppins placeholder:text-gray-500'
                />
                <div className='h-[49px] w-[49px] absolute top-0 right-0 bg-background-tinted rounded-r-md flex items-center justify-center'>
                    <Image className='h-6 w-6 cursor-pointer' src={'/search.svg'} alt='search' height={24} width={24} />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
