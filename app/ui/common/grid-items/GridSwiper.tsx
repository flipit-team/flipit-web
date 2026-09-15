'use client';
import React, {useRef, useState, useCallback} from 'react';
import {Item} from '~/utils/interface';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Countdown from '../badges/Countdown';
import ItemCard from '../item-card/ItemCard';
import type {Swiper as SwiperType} from 'swiper';

interface Props {
    items: Item[];
    forEdit?: boolean;
    forLiveAuction?: boolean;
}

const GridSwiper = (props: Props) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handleSlideChange = useCallback((swiper: SwiperType) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    }, []);

    // Horizontal-only mask — fades left/right edges while keeping top/bottom fully visible
    const getMaskStyle = (): React.CSSProperties => {
        if (isBeginning && isEnd) return {};
        if (isBeginning) return {
            maskImage: 'linear-gradient(to right, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent)',
        };
        if (isEnd) return {
            maskImage: 'linear-gradient(to left, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to left, black 90%, transparent)',
        };
        return {
            maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
        };
    };

    return (
        <div className='relative overflow-hidden pb-[120px] xs:pb-[90px] -mb-[120px] xs:-mb-[90px]' style={getMaskStyle()}>
            {/* Navigation buttons */}
            <button
                ref={prevRef}
                className={`absolute z-10 left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-2.5 flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200 xs:hidden ${isBeginning ? 'opacity-0 pointer-events-none' : ''}`}
            >
                <ChevronLeft size={18} className="text-gray-700" />
            </button>
            <button
                ref={nextRef}
                className={`absolute z-10 right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-2.5 flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-200 xs:hidden ${isEnd ? 'opacity-0 pointer-events-none' : ''}`}
            >
                <ChevronRight size={18} className="text-gray-700" />
            </button>

            <Swiper
                modules={[Navigation, Autoplay]}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true,
                }}
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
                onSlideChange={handleSlideChange}
                onReachBeginning={() => setIsBeginning(true)}
                onReachEnd={() => setIsEnd(true)}
                onFromEdge={() => { setIsBeginning(false); setIsEnd(false); }}
                slidesPerView={'auto'}
                spaceBetween={16}
                className='grid-swiper xs:!pr-0 !overflow-visible lg:!overflow-hidden'
                slideToClickedSlide
                mousewheel
                updateOnWindowResize={false}
                breakpoints={{
                    320: {
                        spaceBetween: 12,
                    },
                    768: {
                        spaceBetween: 16,
                    }
                }}
            >
                {props.items?.map((item) => (
                    <SwiperSlide
                        key={item.id}
                        className='!h-[300px] w-[260px] max-w-[260px] xs:!h-[220px] xs:w-[180px] xs:max-w-[180px] border border-border_gray rounded-lg xs:border-none !p-0'
                    >
                        <ItemCard
                            item={item}
                            forEdit={props.forEdit}
                            forLiveAuction={props.forLiveAuction}
                            className='h-full w-full'
                            imageClassName='h-[200px] w-full xs:h-[140px] cursor-pointer object-cover rounded-t-lg'
                            imageContainerClassName='h-[200px] xs:h-[140px] rounded-lg overflow-hidden'
                            contentClassName={props.forLiveAuction ? 'p-3 xs:py-2 xs:px-0 h-[100px] xs:h-auto xs:flex xs:flex-col xs:gap-0.5 xs:overflow-hidden' : 'p-3 xs:py-2 xs:px-0 h-[80px] xs:h-[80px] xs:flex xs:flex-col xs:justify-between xs:overflow-hidden'}
                            showSaveButton={true}
                            showPromotedBadge={false}
                            showVerifiedBadge={false}
                            showAuctionBadge={props.forLiveAuction}
                            showTradeBadge={!props.forLiveAuction}
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
