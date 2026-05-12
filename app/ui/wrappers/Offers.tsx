'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import NoData from '../common/no-data/NoData';
import TransactionTypeBadge from '../common/badges/TransactionTypeBadge';
import {Check} from 'lucide-react';

// Helper to get transaction URL based on trade type and role
const getTransactionUrl = (id: number, tradeType: string, role: 'buyer' | 'seller' = 'buyer') => {
    const typeParam = tradeType === 'swap' ? '?type=exchange' : tradeType === 'mixed' ? '?type=exchange-cash' : '';
    const roleParam = role === 'seller' ? (typeParam ? '&role=seller' : '?role=seller') : '';
    return `/transaction/${id}${typeParam}${roleParam}`;
};

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

interface MyBid {
    id: number;
    item: {
        title: string;
        imageUrl: string;
    };
    currentPrice: number;
    myMaxBid: number;
    status: 'Out Bid' | 'Pending' | 'Won';
    timeRemaining?: string;
    auctionEnded?: boolean;
    actions: string[];
}

const dummyStats: OffersStats = {
    acceptedOffers: 12,
    rejectedOffers: 4,
    completedSwaps: 28,
    currentAuctions: 3,
};

// TODO: Replace with real API data from GET /api/v1/bidding/user/me
const dummyMyBids: MyBid[] = [
    {
        id: 301,
        item: {title: 'Canon EOS RP Camera +Small Rig', imageUrl: '/placeholder-product.svg'},
        currentPrice: 1400000,
        myMaxBid: 1100000,
        status: 'Out Bid',
        timeRemaining: '14m 50s remaining',
        actions: [],
    },
    {
        id: 302,
        item: {title: 'Coach Shoulder Bag', imageUrl: '/placeholder-product.svg'},
        currentPrice: 150000,
        myMaxBid: 170000,
        status: 'Pending',
        timeRemaining: '1d 20h remaining',
        actions: ['Delete Bid'],
    },
    {
        id: 303,
        item: {title: 'MacBook Pro 2017', imageUrl: '/placeholder-product.svg'},
        currentPrice: 900000,
        myMaxBid: 1100000,
        status: 'Won',
        auctionEnded: true,
        actions: ['Proceed to checkout', 'Cancel Transaction'],
    },
];

interface Props {
    myOffers?: MyOffer[];
    receivedOffers?: ReceivedOffer[];
    stats?: OffersStats;
    myBids?: MyBid[];
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

const getBidStatusStyle = (status: string) => {
    switch (status) {
        case 'Out Bid': return 'bg-[#FF674B]/10 text-[#FF674B] border-[#FF674B]/20';
        case 'Pending': return 'bg-[#E8E8E8] text-text_one border-[#E8E8E8]';
        case 'Won': return 'bg-[#08973F]/10 text-[#08973F] border-[#08973F]/20';
        default: return 'bg-[#E8E8E8] text-text_four border-[#E8E8E8]';
    }
};

const Offers = ({myOffers = dummyMyOffers, receivedOffers = dummyReceivedOffers, stats = dummyStats, myBids = dummyMyBids}: Props) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'my-offers' | 'offers-on-items' | 'my-bids'>('my-offers');

    return (
        <div className='mx-[120px] xs:mx-4 my-6'>
            {/* Page Title */}
            <h1 className='font-poppins font-semibold text-[24px] leading-[1.6] text-text_one mb-4'>
                {activeTab === 'my-bids' ? 'My Bids' : 'Offers Dashboard'}
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
                    Offers On My Items
                </button>
                <button
                    onClick={() => setActiveTab('my-bids')}
                    className={`px-6 py-3 font-poppins font-semibold text-[14px] leading-[1.5] transition-all ${
                        activeTab === 'my-bids'
                            ? 'text-primary border-b-2 border-primary -mb-[1px]'
                            : 'text-text_four hover:text-text_one'
                    }`}
                >
                    My Bids
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
                                                        onClick={() => {
                                                            if (action === 'Proceed to checkout') {
                                                                router.push(getTransactionUrl(offer.id, offer.tradeType, 'buyer'));
                                                            }
                                                        }}
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
                                                    <button
                                                        onClick={() => router.push(getTransactionUrl(offer.id, offer.tradeType, 'seller'))}
                                                        className='px-8 py-2.5 bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors'
                                                    >
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

            {/* MY BIDS TAB */}
            {activeTab === 'my-bids' && (
                <div className='space-y-4'>
                    {myBids.length > 0 ? (
                        myBids.map((bid) => (
                            <div
                                key={bid.id}
                                className='border border-[#E8E8E8] rounded-2xl overflow-hidden flex xs:flex-col'
                            >
                                <div className='flex flex-1 xs:flex-col'>
                                    {/* Image */}
                                    <div className='p-4 xs:p-3 flex-shrink-0'>
                                        <Image
                                            src={bid.item.imageUrl}
                                            alt={bid.item.title}
                                            width={100}
                                            height={100}
                                            className='rounded-xl object-cover w-[100px] h-[100px] xs:w-full xs:h-[160px]'
                                        />
                                    </div>

                                    {/* Middle — title, prices, actions */}
                                    <div className='py-4 xs:px-3 xs:py-0 xs:pb-3 flex flex-col justify-between flex-1 min-w-0'>
                                        <div>
                                            <h3 className='font-poppins font-semibold text-[14px] text-primary'>
                                                {bid.item.title}
                                            </h3>
                                            <div className='flex items-center gap-6 mt-2'>
                                                <div>
                                                    <p className='font-poppins font-semibold text-[10px] text-[#A49E9E] uppercase tracking-wider'>CURRENT PRICE</p>
                                                    <p className='font-poppins font-bold text-[14px] text-text_one'>₦{bid.currentPrice.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className='font-poppins font-semibold text-[10px] text-[#A49E9E] uppercase tracking-wider'>MY MAXIMUM BID</p>
                                                    <p className='font-poppins font-bold text-[14px] text-text_one'>₦{bid.myMaxBid.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        {bid.actions.length > 0 && (
                                            <div className='flex items-center gap-3 mt-3'>
                                                {bid.actions.map((action, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            if (action === 'Proceed to checkout') {
                                                                router.push(`/transaction/${bid.id}`);
                                                            }
                                                        }}
                                                        className='px-4 py-1.5 border border-[#A49E9E] rounded-lg font-poppins text-[12px] text-[#A49E9E] hover:border-primary hover:text-primary transition-colors'
                                                    >
                                                        {action}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Right — time remaining + status */}
                                    <div className='py-4 pr-6 xs:px-3 xs:py-3 flex flex-col items-end justify-between flex-shrink-0'>
                                        <div className='flex items-center gap-1.5'>
                                            <svg className={`w-[18px] h-[18px] ${bid.auctionEnded ? 'text-text_four' : bid.timeRemaining?.includes('d') ? 'text-text_one' : 'text-[#FF674B]'}`} fill='currentColor' viewBox='0 0 24 24'>
                                                <path d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 13.5l-4.5-3V7h2v4.67l3.5 2.33-1 1.5z' />
                                            </svg>
                                            <span className={`font-poppins text-[13px] font-medium ${bid.auctionEnded ? 'text-text_four' : bid.timeRemaining?.includes('d') ? 'text-text_one' : 'text-[#FF674B]'}`}>
                                                {bid.auctionEnded ? 'Auction Ended' : bid.timeRemaining}
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1 rounded font-poppins text-[12px] font-medium border ${getBidStatusStyle(bid.status)}`}>
                                            {bid.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <NoData text='No bids placed yet' />
                    )}
                </div>
            )}
        </div>
    );
};

export default Offers;
