// components/HorizontalSlider.tsx
'use client';

import {useRef} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';

const ITEMS = Array.from({length: 15}, (_, i) => `Item ${i + 1}`);

export default function HorizontalSlider() {
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollBy = (direction: 'left' | 'right') => {
        if (containerRef.current) {
            const scrollAmount = containerRef.current.offsetWidth / 2;
            containerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className='relative'>
            <Swiper
                slidesPerView={'auto'}
                className={`grid-swiper xs:!pr-6 !overflow-visible lg:!overflow-hidden`}
                slideToClickedSlide
                mousewheel
                updateOnWindowResize={false}
            >
                {ITEMS?.map((item, i) => {
                    return (
                        <SwiperSlide
                            key={i}
                            className='lg:mr-[24px] min-w-[200px] shrink-0 mr-4 bg-blue-200 text-center py-6 rounded-lg'
                        >
                            {item}
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Left Arrow */}
            <button
                onClick={() => scrollBy('left')}
                className='absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow'
            >
                <ChevronLeft className='w-6 h-6' />
            </button>

            {/* Right Arrow */}
            <button
                onClick={() => scrollBy('right')}
                className='absolute top-1/2 right-10 -translate-y-1/2 z-10 bg-white border rounded-full p-2 shadow'
            >
                <ChevronRight className='w-6 h-6' />
            </button>
        </div>
    );
}
