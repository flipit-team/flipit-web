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
    forLiveAuction?: boolean;
}

const GridSwiper = (props: Props) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className='relative'>
            {/* Navigation buttons */}
            <button
                ref={prevRef}
                className='absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200'
            >
                <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
                ref={nextRef}
                className='absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200'
            >
                <ChevronRight size={20} className="text-gray-700" />
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
                className='grid-swiper xs:!pr-0 !overflow-visible lg:!overflow-hidden'
                slideToClickedSlide
                mousewheel
                updateOnWindowResize={false}
                breakpoints={{
                    320: {
                        spaceBetween: 16,
                    },
                    768: {
                        spaceBetween: 24,
                    }
                }}
            >
                {props.items?.map((item, i) => (
                    <SwiperSlide
                        key={i}
                        className='!h-[400px] w-[359px] max-w-[349px] xs:!h-[260px] xs:w-auto xs:max-w-none border border-border_gray rounded-md xs:border-none !p-0'
                    >
                        <ItemCard
                            item={item}
                            forEdit={props.forEdit}
                            forLiveAuction={props.forLiveAuction}
                            className='h-full w-full'
                            imageClassName='h-[302px] w-full xs:h-[160px] cursor-pointer xs:object-cover'
                            contentClassName={props.forLiveAuction ? 'p-4 xs:py-3 xs:px-0 h-[120px] xs:h-[100px] xs:flex xs:flex-col xs:justify-between xs:overflow-hidden' : 'p-4 xs:py-3 xs:px-0 h-[98px] xs:h-[100px] xs:flex xs:flex-col xs:justify-between xs:overflow-hidden'}
                            showSaveButton={false}
                            showPromotedBadge={false}
                            showVerifiedBadge={false}
                            showAuctionBadge={props.forLiveAuction}
                            auctionBidCount={12}
                            customFooter={props.forLiveAuction ? undefined : <Countdown />}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default GridSwiper;
