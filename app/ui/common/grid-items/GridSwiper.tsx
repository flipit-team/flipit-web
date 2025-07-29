'use client';
import Image from 'next/image';
import React, {useRef} from 'react';
import {formatToNaira} from '~/utils/helpers';
import UsedBadge from '../badges/UsedBadge';
import Link from 'next/link';
import {Item} from '~/utils/interface';
import NoData from '../no-data/NoData';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Countdown from '../badges/Countdown';

interface Props {
    items: Item[];
    forEdit?: boolean;
}

const GridSwiper = (props: Props) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className='relative'>
            {/* Navigation buttons */}
            <button
                ref={prevRef}
                className='absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hidden lg:flex'
            >
                <ChevronLeft size={20} />
            </button>
            <button
                ref={nextRef}
                className='absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hidden lg:flex'
            >
                <ChevronRight size={20} />
            </button>

            <Swiper
                modules={[Navigation]}
                navigation={{
                    prevEl: prevRef.current!,
                    nextEl: nextRef.current!
                }}
                onBeforeInit={(swiper) => {
                    // @ts-ignore
                    swiper.params.navigation.prevEl = prevRef.current;
                    // @ts-ignore
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                slidesPerView={'auto'}
                spaceBetween={24}
                className='grid-swiper xs:!pr-6 !overflow-visible lg:!overflow-hidden'
                slideToClickedSlide
                mousewheel
                updateOnWindowResize={false}
            >
                {props.items?.map((item, i) => {
                    const url = `/camera.png`;

                    return (
                        <SwiperSlide
                            key={i}
                            className='h-[400px] w-[349px] xs:h-[260px] border border-border_gray rounded-md'
                        >
                            <Link href={`/${props.forEdit ? 'edit-item' : 'home'}/${item.id}`}>
                                <Image
                                    className='h-[302px] w-full xs:h-[128px] cursor-pointer'
                                    src={url}
                                    alt='search'
                                    height={302}
                                    width={349}
                                    unoptimized
                                />
                                <div className='h-[44px] w-[88px] typo-body_ls rounded-[35px] text-primary bg-white absolute top-4 right-3 flex items-center justify-center gap-2'>
                                    <Image className='h-5 w-5' src={'/gavel.svg'} alt='search' height={20} width={20} />
                                    <div className='text-primary'>12</div>
                                </div>
                                <div className='p-4 xs:p-3 h-[98px] xs:h-[132px]'>
                                    <p className='typo-body_mr xs:typo-body_sr xs:mb-2 capitalize'>{item.title}</p>
                                    <p className='typo-body_lm xs:typo-body_mm xs:mb-1'>
                                        {formatToNaira(item.cashAmount)}
                                    </p>
                                    <div className='flex xs:flex-col justify-between items-center xs:items-start rounded'>
                                        <p className='typo-body_sr xs:text-[11px] xs:mb-1 capitalize'>
                                            {item.acceptCash ? 'cash' : 'item'} offers
                                        </p>
                                        <Countdown />
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default GridSwiper;
