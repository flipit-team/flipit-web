'use client';
import React, {useRef} from 'react';
import {Item} from '~/utils/interface';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Countdown from '../badges/Countdown';
import ItemCard from '../item-card/ItemCard';

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
                {props.items?.map((item, i) => (
                    <SwiperSlide
                        key={i}
                        className='!h-[400px] w-[359px] max-w-[349px] xs:!h-[260px] border border-border_gray rounded-md !p-0'
                    >
                        <ItemCard
                            item={item}
                            forEdit={props.forEdit}
                            className='h-full w-full'
                            showSaveButton={false}
                            showPromotedBadge={false}
                            showVerifiedBadge={false}
                            showAuctionBadge={true}
                            auctionBidCount={12}
                            customFooter={<Countdown />}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default GridSwiper;
