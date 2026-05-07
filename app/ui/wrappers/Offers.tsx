'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import NoData from '../common/no-data/NoData';
import TransactionTypeBadge from '../common/badges/TransactionTypeBadge';
import {Check} from 'lucide-react';

// Types
interface OfferItem {
    id: number;
    title: string;
    imageUrl: string;
    timeAgo: string;
}

interface MyOffer {
    id: number;
    item: OfferItem;
    offeredText: string;
    tradeType: 'cash' | 'swap' | 'mixed';
    status: 'Accepted' | 'Pending' | 'Rejected';
    actions: string[];
}

interface ReceivedOffer {
    id: number;
    item: OfferItem;
    offerer: {
        name: string;
        avatar: string;
        rating: number;
    };
    offerText: string;
    tradeType: 'cash' | 'swap' | 'mixed' | 'auction';
    viewDetails?: boolean;
}

interface OffersStats {
    acceptedOffers: number;
    rejectedOffers: number;
    completedSwaps: number;
    currentAuctions: number;
}

// Dummy data
const dummyMyOffers: MyOffer[] = [
    {
        id: 1,
        item: {id: 101, title: 'Canon EOS RP Camera +Small Rig | Clean U...', imageUrl: '/placeholder-product.svg', timeAgo: '2 Hours ago'},
        offeredText: '₦200,000 + Iphone 16 Pro',
        tradeType: 'mixed',
        status: 'Accepted',
        actions: ['Proceed to checkout', 'Cancel Transaction'],
    },
    {
        id: 2,
        item: {id: 102, title: 'Canon EOS RP Camera +Small Rig | Clean U...', imageUrl: '/placeholder-product.svg', timeAgo: '2 Hours ago'},
        offeredText: 'Sony Camera',
        tradeType: 'swap',
        status: 'Pending',
        actions: ['Delete Offer'],
    },
    {
        id: 3,
        item: {id: 103, title: 'IPhone 15 Pro Max (Metallic Grey)', imageUrl: '/placeholder-product.svg', timeAgo: '2 Hours ago'},
        offeredText: 'Samsung Flip',
        tradeType: 'swap',
        status: 'Rejected',
        actions: ['Resubmit Offer', 'Delete Offer'],
    },
];

const dummyReceivedOffers: ReceivedOffer[] = [
    {
        id: 201,
        item: {id: 501, title: 'Canon EOS RP Camera +Small Rig | Clean U...', imageUrl: '/placeholder-product.svg', timeAgo: '2 Hours ago'},
        offerer: {name: 'John Doe', avatar: '/placeholder-avatar.svg', rating: 4.9},
        offerText: 'Sony camera',
        tradeType: 'swap',
    },
    {
        id: 202,
        item: {id: 502, title: 'Original Coach Shoulder Bag (Brown)', imageUrl: '/placeholder-product.svg', timeAgo: '4 Hours ago'},
        offerer: {name: 'Sarah Martins', avatar: '/placeholder-avatar.svg', rating: 4.9},
        offerText: 'Coach Tabby 26',
        tradeType: 'swap',
        viewDetails: true,
    },
    {
        id: 203,
        item: {id: 503, title: 'IPhone 15 Pro Max (Metallic Grey)', imageUrl: '/placeholder-product.svg', timeAgo: '4 hours ago'},
        offerer: {name: 'Marcus Fen', avatar: '/placeholder-avatar.svg', rating: 4.9},
        offerText: '₦400,000 + Jbl Bluetooth Speaker',
        tradeType: 'mixed',
    },
];

const dummyStats: OffersStats = {
    acceptedOffers: 12,
    rejectedOffers: 4,
    completedSwaps: 28,
    currentAuctions: 3,
};

interface Props {
    myOffers?: MyOffer[];
    receivedOffers?: ReceivedOffer[];
    stats?: OffersStats;
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Accepted': return 'text-[#08973F]';
        case 'Pending': return 'text-[#A49E9E]';
        case 'Rejected': return 'text-[#FF674B]';
        default: return 'text-text_four';
    }
};

const getTradeTypeProps = (type: string) => {
    switch (type) {
        case 'cash': return {acceptCash: true, hasSwapItems: false};
        case 'swap': return {acceptCash: false, hasSwapItems: true};
        case 'mixed': return {acceptCash: true, hasSwapItems: true};
        default: return {acceptCash: true, hasSwapItems: false};
    }
};

const Offers = ({myOffers = dummyMyOffers, receivedOffers = dummyReceivedOffers, stats = dummyStats}: Props) => {
    const [activeTab, setActiveTab] = useState<'my-offers' | 'offers-on-items'>('my-offers');

    return (
        <div className='mx-[120px] xs:mx-4 my-6'>
            {/* Page Title */}
            <h1 className='font-poppins font-semibold text-[24px] leading-[1.6] text-text_one mb-4'>
                Offers Dashboard
            </h1>

            {/* Tab Navigation */}
            <div className='flex border-b border-border_gray mb-8'>
                <button
                    onClick={() => setActiveTab('my-offers')}
                    className={`px-6 py-3 font-poppins font-semibold text-[14px] leading-[1.5] transition-all ${
                        activeTab === 'my-offers'
                            ? 'text-primary border-b-2 border-primary -mb-[1px]'
                            : 'text-text_four hover:text-text_one'
                    }`}
                >
                    My Offers
                </button>
                <button
                    onClick={() => setActiveTab('offers-on-items')}
                    className={`px-6 py-3 font-poppins font-semibold text-[14px] leading-[1.5] transition-all ${
                        activeTab === 'offers-on-items'
                            ? 'text-primary border-b-2 border-primary -mb-[1px]'
                            : 'text-text_four hover:text-text_one'
                    }`}
                >
                    Offers on My Items
                </button>
            </div>

            {/* MY OFFERS TAB */}
            {activeTab === 'my-offers' && (
                <div className='space-y-3'>
                    {myOffers.length > 0 ? (
                        myOffers.map((offer) => {
                            const tradeProps = getTradeTypeProps(offer.tradeType);
                            return (
                                <div
                                    key={offer.id}
                                    className='border border-[#E8E8E8] rounded-3xl xs:rounded-2xl overflow-hidden flex xs:flex-col'
                                >
                                    <div className='flex flex-1 xs:flex-col'>
                                        {/* Image */}
                                        <div className='p-[26px] xs:p-3 flex-shrink-0'>
                                            <Image
                                                src={offer.item.imageUrl}
                                                alt={offer.item.title}
                                                width={180}
                                                height={180}
                                                className='rounded-2xl object-cover w-[180px] h-[180px] xs:w-full xs:h-[180px]'
                                            />
                                        </div>

                                        {/* Middle — title, offered, buttons */}
                                        <div className='py-[26px] xs:px-3 xs:py-0 xs:pb-3 flex flex-col justify-between flex-1 min-w-0'>
                                            <div>
                                                <h3 className='font-poppins font-bold text-[16px] leading-[1.4] text-[#4D4D4D]'>
                                                    {offer.item.title}
                                                </h3>
                                                <div className='mt-3'>
                                                    <p className='font-poppins text-[12px] text-[#A49E9E] uppercase tracking-wide'>
                                                        YOU OFFERED
                                                    </p>
                                                    <p className='font-poppins font-semibold text-[16px] text-primary'>
                                                        {offer.offeredText}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className='flex items-center gap-4 mt-4'>
                                                {offer.actions.map((action, idx) => (
                                                    <button
                                                        key={idx}
                                                        className='px-4 py-2 border-2 border-[#A49E9E] rounded-lg font-poppins text-[13px] font-medium text-[#A49E9E] hover:border-primary hover:text-primary transition-colors'
                                                    >
                                                        {action}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right — badge, status, time */}
                                        <div className='py-[26px] pr-[50px] xs:px-3 xs:py-3 flex flex-col items-end justify-between flex-shrink-0'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-fit'>
                                                    <TransactionTypeBadge acceptCash={tradeProps.acceptCash} hasSwapItems={tradeProps.hasSwapItems} />
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    {offer.status === 'Accepted' && <Check size={16} className='text-[#08973F]' />}
                                                    <span className={`font-poppins font-semibold text-[16px] ${getStatusStyle(offer.status)}`}>
                                                        {offer.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className='font-poppins text-[14px] text-[#A49E9E] italic'>
                                                {offer.item.timeAgo}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <NoData text='No offers made yet' />
                    )}
                </div>
            )}

            {/* OFFERS ON MY ITEMS TAB */}
            {activeTab === 'offers-on-items' && (
                <>
                    {/* Stats cards */}
                    <div className='grid grid-cols-4 xs:grid-cols-2 gap-4 mb-8'>
                        {[
                            {label: 'ACCEPTED OFFERS', value: stats.acceptedOffers},
                            {label: 'REJECTED OFFERS', value: stats.rejectedOffers},
                            {label: 'COMPLETED SWAPS', value: stats.completedSwaps},
                            {label: 'CURRENT AUCTIONS', value: stats.currentAuctions},
                        ].map((stat, idx) => (
                            <div key={idx} className='bg-white border border-border_gray rounded-lg p-4 text-center'>
                                <p className='font-poppins font-semibold text-[10px] text-text_four uppercase tracking-wider'>
                                    {stat.label}
                                </p>
                                <p className='font-poppins font-bold text-[28px] leading-[1.4] text-text_one mt-1'>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Received offers */}
                    <div className='space-y-3'>
                        {receivedOffers.length > 0 ? (
                            receivedOffers.map((offer) => {
                                const tradeProps = getTradeTypeProps(offer.tradeType);
                                return (
                                    <div
                                        key={offer.id}
                                        className='border border-[#E8E8E8] rounded-3xl xs:rounded-2xl overflow-hidden flex xs:flex-col'
                                    >
                                        <div className='flex flex-1 xs:flex-col'>
                                            {/* Image */}
                                            <div className='p-[26px] xs:p-3 flex-shrink-0'>
                                                <Image
                                                    src={offer.item.imageUrl}
                                                    alt={offer.item.title}
                                                    width={180}
                                                    height={180}
                                                    className='rounded-2xl object-cover w-[180px] h-[180px] xs:w-full xs:h-[180px]'
                                                />
                                            </div>

                                            {/* Middle — title, offerer box, buttons */}
                                            <div className='py-[26px] xs:px-3 xs:py-0 xs:pb-3 flex flex-col justify-between flex-1 min-w-0'>
                                                <div>
                                                    <h3 className='font-poppins font-bold text-[16px] leading-[1.4] text-[#4D4D4D]'>
                                                        {offer.item.title}
                                                    </h3>

                                                    {/* Offerer info box */}
                                                    <div className='border border-[#E8E8E8] rounded-2xl p-3 mt-3 flex items-start gap-3'>
                                                        <Image
                                                            src={offer.offerer.avatar}
                                                            alt={offer.offerer.name}
                                                            width={44}
                                                            height={44}
                                                            className='rounded-full w-[44px] h-[44px] object-cover flex-shrink-0'
                                                        />
                                                        <div className='min-w-0'>
                                                            <p className='font-poppins font-semibold text-[16px] text-[#333333]'>
                                                                {offer.offerer.name}
                                                            </p>
                                                            <div className='flex items-center gap-1'>
                                                                <Image src='/star.svg' alt='star' width={16} height={16} className='w-4 h-4' />
                                                                <span className='font-poppins font-semibold text-[14px] text-[#E4A300]'>{offer.offerer.rating}</span>
                                                            </div>
                                                            <p className='font-poppins text-[12px] text-[#A49E9E] uppercase tracking-wide mt-1'>
                                                                OFFER
                                                            </p>
                                                            <p className='font-poppins font-medium text-[14px] text-primary'>
                                                                {offer.offerText}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Accept / Decline buttons */}
                                                <div className='flex gap-4 mt-4'>
                                                    <button className='px-8 py-2.5 bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors'>
                                                        Accept
                                                    </button>
                                                    <button className='px-8 py-2.5 border-2 border-primary text-primary rounded-lg font-poppins text-[14px] font-medium hover:bg-gray-50 transition-colors'>
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Right — badge, time */}
                                            <div className='py-[26px] pr-[50px] xs:px-3 xs:py-3 flex flex-col items-end justify-between flex-shrink-0'>
                                                <div className='w-fit'>
                                                    <TransactionTypeBadge acceptCash={tradeProps.acceptCash} hasSwapItems={tradeProps.hasSwapItems} />
                                                </div>
                                                <p className='font-poppins text-[14px] text-[#A49E9E] italic'>
                                                    {offer.item.timeAgo}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <NoData text='No offers received on your items yet' />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Offers;
