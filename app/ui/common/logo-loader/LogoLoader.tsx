'use client';
import React from 'react';
import Image from 'next/image';

interface LogoLoaderProps {
    inline?: boolean;
}

const LogoLoader = ({ inline = false }: LogoLoaderProps) => {
    return (
        <div className={inline
            ? 'flex items-center justify-center min-h-[40vh]'
            : 'fixed inset-0 flex items-center justify-center bg-white z-40'
        }>
            <div className={`flex flex-col items-center ${inline ? 'gap-2' : 'gap-4'}`}>
                <div className='animate-pulse-smooth'>
                    <Image
                        src='/logos/logo-text-cropped.png'
                        alt='Flipit Logo'
                        width={inline ? 80 : 120}
                        height={inline ? 31 : 47}
                        priority
                        className='object-contain'
                    />
                </div>
                <div className='flex gap-1.5'>
                    {[0, 150, 300, 450, 600].map((delay) => (
                        <div
                            key={delay}
                            className={`${inline ? 'w-1 h-1' : 'w-1.5 h-1.5'} bg-primary rounded-full animate-bounce-dot`}
                            style={{animationDelay: `${delay}ms`}}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogoLoader;
