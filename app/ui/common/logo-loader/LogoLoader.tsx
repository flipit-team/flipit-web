'use client';
import React from 'react';
import Image from 'next/image';

const LogoLoader = () => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
            <div className='flex flex-col items-center gap-4'>
                <div className='animate-pulse-smooth'>
                    <Image
                        src='/logos/logo-text-cropped.png'
                        alt='Flipit Logo'
                        width={200}
                        height={79}
                        priority
                        className='object-contain'
                    />
                </div>
                <div className='flex gap-3'>
                    <div
                        className='w-2 h-2 bg-primary rounded-full animate-bounce-dot'
                        style={{animationDelay: '0ms'}}
                    ></div>
                    <div
                        className='w-2 h-2 bg-primary rounded-full animate-bounce-dot'
                        style={{animationDelay: '150ms'}}
                    ></div>
                    <div
                        className='w-2 h-2 bg-primary rounded-full animate-bounce-dot'
                        style={{animationDelay: '300ms'}}
                    ></div>
                    <div
                        className='w-2 h-2 bg-primary rounded-full animate-bounce-dot'
                        style={{animationDelay: '450ms'}}
                    ></div>
                    <div
                        className='w-2 h-2 bg-primary rounded-full animate-bounce-dot'
                        style={{animationDelay: '600ms'}}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default LogoLoader;
