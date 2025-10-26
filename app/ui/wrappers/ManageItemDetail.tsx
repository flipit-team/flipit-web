'use client';
import Image from 'next/image';
import React, {useState} from 'react';
import {formatToNaira, timeAgo} from '~/utils/helpers';
import UsedBadge from '../common/badges/UsedBadge';
import ImageGallery from '../common/image-gallery/ImageGallery';
import RegularButton from '../common/buttons/RegularButton';
import StarRating from '../common/star-rating/StarRating';

// Dummy data types
interface Offer {
    id: number;
    bidder: {
        id: number;
        name: string;
        avatar: string;
        rating: number;
        verified: boolean;
    };
    withCash: boolean;
    cashAmount?: number;
    offeredItem?: {
        id: number;
        title: string;
        image: string;
        value: number;
    };
    status: 'pending' | 'accepted' | 'declined';
    dateCreated: string;
}

interface ItemData {
    id: number;
    title: string;
    description: string;
    imageUrls: string[];
    cashAmount: number;
    condition: string;
    brand: string;
    location: string;
    category: string;
    subcategory: string;
    dateCreated: string;
    promoted: boolean;
    views: number;
    likes: number;
    isAuction: boolean;
    // Auction specific
    auctionEndDate?: string;
    currentBid?: number;
    totalBids?: number;
    reservePrice?: number;
}

// Dummy data
const dummyItem: ItemData = {
    id: 1,
    title: 'iPhone 13 Pro Max 256GB - Pacific Blue',
    description:
        'Excellent condition iPhone 13 Pro Max. Barely used, comes with original box, charger, and protective case. Screen protector applied since day one. Battery health at 98%. No scratches or dents.',
    imageUrls: ['/placeholder-product.svg', '/placeholder-product.svg', '/placeholder-product.svg'],
    cashAmount: 850000,
    condition: 'Like New',
    brand: 'Apple',
    location: 'LA-IKJ, LA',
    category: 'Electronics & Gadgets',
    subcategory: 'Smartphones',
    dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    promoted: true,
    views: 247,
    likes: 32,
    isAuction: false
};

const dummyAuctionItem: ItemData = {
    ...dummyItem,
    title: 'MacBook Pro M2 16" - Space Gray (Live Auction)',
    isAuction: true,
    auctionEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    currentBid: 1200000,
    totalBids: 15,
    reservePrice: 1500000
};

const dummyOffers: Offer[] = [
    {
        id: 1,
        bidder: {
            id: 101,
            name: 'John Doe',
            avatar: '/placeholder-avatar.svg',
            rating: 4.5,
            verified: true
        },
        withCash: true,
        cashAmount: 800000,
        status: 'pending',
        dateCreated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2,
        bidder: {
            id: 102,
            name: 'Sarah Smith',
            avatar: '/placeholder-avatar.svg',
            rating: 4.8,
            verified: true
        },
        withCash: true,
        cashAmount: 750000,
        offeredItem: {
            id: 201,
            title: 'iPad Pro 12.9" M1',
            image: '/placeholder-product.svg',
            value: 120000
        },
        status: 'pending',
        dateCreated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 3,
        bidder: {
            id: 103,
            name: 'Mike Johnson',
            avatar: '/placeholder-avatar.svg',
            rating: 4.2,
            verified: false
        },
        withCash: true,
        cashAmount: 700000,
        status: 'pending',
        dateCreated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 4,
        bidder: {
            id: 104,
            name: 'Emily Davis',
            avatar: '/placeholder-avatar.svg',
            rating: 4.9,
            verified: true
        },
        withCash: true,
        cashAmount: 820000,
        offeredItem: {
            id: 203,
            title: 'Apple Watch Series 8',
            image: '/placeholder-product.svg',
            value: 80000
        },
        status: 'accepted',
        dateCreated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 5,
        bidder: {
            id: 105,
            name: 'Robert Wilson',
            avatar: '/placeholder-avatar.svg',
            rating: 3.8,
            verified: false
        },
        withCash: false,
        offeredItem: {
            id: 204,
            title: 'Samsung Galaxy S23 Ultra',
            image: '/placeholder-product.svg',
            value: 850000
        },
        status: 'declined',
        dateCreated: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 6,
        bidder: {
            id: 106,
            name: 'Lisa Anderson',
            avatar: '/placeholder-avatar.svg',
            rating: 4.6,
            verified: true
        },
        withCash: true,
        cashAmount: 650000,
        status: 'declined',
        dateCreated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
];

interface Props {
    item?: any;
    offers?: any[];
    isAuction?: boolean;
}

const ManageItemDetail = ({item: propItem, offers: propOffers, isAuction = false}: Props) => {
    // Use provided data or fall back to dummy data
    const item = propItem || (isAuction ? dummyAuctionItem : dummyItem);
    // Use dummy data if no offers provided or if the array is empty
    const [offers, setOffers] = useState<Offer[]>(propOffers && propOffers.length > 0 ? propOffers : dummyOffers);
    const [hasAcceptedOffer, setHasAcceptedOffer] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'offers'>(isAuction ? 'details' : 'offers');

    const handleAcceptOffer = (offerId: number) => {
        // When accepting an offer, set all other accepted offers back to pending
        setOffers(
            offers.map((offer) => {
                if (offer.id === offerId) {
                    return {...offer, status: 'accepted' as const};
                }
                // If this offer was previously accepted, set it back to pending
                if (offer.status === 'accepted') {
                    return {...offer, status: 'pending' as const};
                }
                return offer;
            })
        );
        setHasAcceptedOffer(true);
    };

    const handleDeclineOffer = (offerId: number) => {
        setOffers(offers.map((offer) => (offer.id === offerId ? {...offer, status: 'declined' as const} : offer)));
    };

    const pendingOffers = offers.filter((o) => o.status === 'pending');
    const acceptedOffers = offers.filter((o) => o.status === 'accepted');
    const declinedOffers = offers.filter((o) => o.status === 'declined');

    return (
        <div className='mx-[120px] xs:mx-0 mb-10 mt-10 xs:mt-8 xs:mb-6'>
            {/* Header */}
            <div className='mb-6 xs:px-4'>
                <h1 className='typo-heading_ms xs:typo-heading_ss mb-2'>Manage Your Item</h1>
                <p className='typo-body_mr text-text_four'>View details and manage offers for your listing</p>
            </div>

            {/* Mobile Tabs */}
            <div className='hidden xs:flex border-b border-border_gray mb-4 px-4'>
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 typo-body_lm ${
                        activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-text_four'
                    }`}
                >
                    Details
                </button>
                <button
                    onClick={() => setActiveTab('offers')}
                    className={`flex-1 py-3 typo-body_lm relative ${
                        activeTab === 'offers' ? 'text-primary border-b-2 border-primary' : 'text-text_four'
                    }`}
                >
                    Offers
                    {pendingOffers.length > 0 && (
                        <span className='absolute top-2 right-8 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                            {pendingOffers.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Main Content */}
            <div className='grid grid-cols-[712px_1fr] xs:grid-cols-1 gap-6'>
                {/* Left Column - Item Details */}
                <div className={`${activeTab === 'offers' ? 'xs:hidden' : ''}`}>
                    <div className='shadow-lg xs:shadow-none mb-6'>
                        <ImageGallery
                            images={item.imageUrls}
                            overlayElements={
                                <>
                                    {item.promoted && (
                                        <div className='w-[76px] h-[26px] typo-body_sr text-white bg-primary absolute top-7 left-3 flex items-center justify-center rounded'>
                                            Promoted
                                        </div>
                                    )}
                                </>
                            }
                        />
                    </div>

                    <div className='shadow-lg xs:shadow-none p-6 xs:px-4'>
                        <UsedBadge text={item.condition} />
                        <h2 className='typo-heading_ms xs:typo-heading_ss text-text_one mt-[10px] mb-2'>
                            {item.title}
                        </h2>
                        <p className='typo-heading_sm text-primary xs:typo-body_mm mb-2'>
                            {formatToNaira(item.cashAmount)}
                        </p>
                        <p className='typo-body_mr text-text_four mb-6'>{timeAgo(item.dateCreated)}</p>

                        {/* Stats */}
                        <div className='flex gap-6 mb-6 pb-6 border-b border-border_gray'>
                            <div className='flex items-center gap-2'>
                                <svg
                                    className='w-5 h-5 text-text_four'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                    />
                                </svg>
                                <span className='typo-body_mr text-text_four'>{item.views} views</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <svg
                                    className='w-5 h-5 text-text_four'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                                    />
                                </svg>
                                <span className='typo-body_mr text-text_four'>{item.likes} likes</span>
                            </div>
                        </div>

                        {/* Auction Info */}
                        {item.isAuction && (
                            <div className='bg-surface-primary-10 rounded-lg p-4 mb-6'>
                                <h3 className='typo-body_lm text-primary mb-3'>Auction Details</h3>
                                <div className='space-y-2'>
                                    <div className='flex justify-between'>
                                        <span className='typo-body_mr text-text_four'>Current Bid:</span>
                                        <span className='typo-body_lm text-text_one'>
                                            {formatToNaira(item.currentBid!)}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='typo-body_mr text-text_four'>Total Bids:</span>
                                        <span className='typo-body_lm text-text_one'>{item.totalBids}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='typo-body_mr text-text_four'>Reserve Price:</span>
                                        <span className='typo-body_lm text-text_one'>
                                            {formatToNaira(item.reservePrice!)}
                                        </span>
                                    </div>
                                    <div className='flex justify-between pt-2 border-t border-primary/20'>
                                        <span className='typo-body_mr text-text_four'>Ends In:</span>
                                        <span className='typo-body_lm text-primary'>2 days 14 hours</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className='mb-6'>
                            <h3 className='typo-body_lm text-text_one mb-2'>Description</h3>
                            <p className='typo-body_mr text-text_four'>{item.description}</p>
                        </div>

                        {/* Specifications */}
                        <div>
                            <h3 className='typo-body_lm text-text_one mb-2'>Specifications</h3>
                            <table className='w-full typo-body_sr'>
                                <tbody>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Category</td>
                                        <td className='text-text_one'>{item.category}</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Subcategory</td>
                                        <td className='text-text_one'>{item.subcategory}</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Brand</td>
                                        <td className='text-text_one'>{item.brand}</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Condition</td>
                                        <td className='text-text_one'>{item.condition}</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Location</td>
                                        <td className='text-text_one'>{item.location}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column - Offers */}
                <div className={`${activeTab === 'details' ? 'xs:hidden' : ''}`}>
                    <div className='shadow-lg xs:shadow-none p-6 xs:px-4 xs:pt-0'>
                        <div className='flex items-center justify-between mb-6 xs:mb-4'>
                            <h2 className='typo-heading_ss text-text_one'>{item.isAuction ? 'Bids' : 'Offers'}</h2>
                            <span className='typo-body_mr text-text_four'>{offers.length} total</span>
                        </div>

                        {hasAcceptedOffer && acceptedOffers.length > 0 && (
                            <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                                <p className='typo-body_mr text-green-800'>
                                    ✓ You&apos;ve accepted an offer. The buyer will be notified to proceed with the
                                    transaction.
                                </p>
                            </div>
                        )}

                        {/* Pending Offers */}
                        {pendingOffers.length > 0 && (
                            <div className='mb-6'>
                                <h3 className='typo-body_lm text-text_one mb-4'>Pending ({pendingOffers.length})</h3>
                                <div className='space-y-4'>
                                    {pendingOffers.map((offer) => (
                                        <div
                                            key={offer.id}
                                            className='border border-primary/30 rounded-lg p-4 bg-surface-primary-10'
                                        >
                                            {/* Bidder Info */}
                                            <div className='flex items-start gap-3 mb-4'>
                                                <Image
                                                    src={offer.bidder.avatar}
                                                    alt={offer.bidder.name}
                                                    width={48}
                                                    height={48}
                                                    sizes='48px'
                                                    quality={70}
                                                    className='rounded-full object-cover'
                                                />
                                                <div className='flex-1'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='typo-body_lm text-text_one'>
                                                            {offer.bidder.name}
                                                        </span>
                                                        {offer.bidder.verified && (
                                                            <div className='h-[18px] px-1 bg-surface-primary-16 text-primary flex items-center justify-center rounded typo-body_xs'>
                                                                Verified
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className='flex items-center gap-2 mt-1'>
                                                        <StarRating rating={offer.bidder.rating} size={16} />
                                                        <span className='typo-body_sr text-text_four'>
                                                            {timeAgo(offer.dateCreated)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Offer Details */}
                                            <div className='bg-white rounded-lg p-3 mb-4'>
                                                {offer.withCash && offer.cashAmount && (
                                                    <div className='mb-2'>
                                                        <span className='typo-body_sr text-text_four'>Cash Offer:</span>
                                                        <p className='typo-heading_sm text-primary'>
                                                            {formatToNaira(offer.cashAmount)}
                                                        </p>
                                                    </div>
                                                )}
                                                {offer.offeredItem && (
                                                    <div className='flex items-center gap-3 pt-2 border-t border-border_gray'>
                                                        <Image
                                                            src={offer.offeredItem.image}
                                                            alt={offer.offeredItem.title}
                                                            width={48}
                                                            height={48}
                                                            sizes='48px'
                                                            quality={70}
                                                            className='rounded object-cover'
                                                        />
                                                        <div>
                                                            <p className='typo-body_mr text-text_one'>
                                                                {offer.offeredItem.title}
                                                            </p>
                                                            <p className='typo-body_sr text-text_four'>
                                                                Value: {formatToNaira(offer.offeredItem.value)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className='flex gap-3'>
                                                <button
                                                    onClick={() => handleAcceptOffer(offer.id)}
                                                    disabled={hasAcceptedOffer}
                                                    className={`flex-1 h-[42px] rounded-lg typo-body_lr ${
                                                        hasAcceptedOffer
                                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                            : 'bg-primary text-white hover:bg-primary/90'
                                                    }`}
                                                >
                                                    Accept Offer
                                                </button>
                                                <button
                                                    onClick={() => handleDeclineOffer(offer.id)}
                                                    className='flex-1 h-[42px] border border-text_four text-text_four rounded-lg typo-body_lr hover:bg-gray-50'
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Accepted Offers */}
                        {acceptedOffers.length > 0 && (
                            <div className='mb-6'>
                                <h3 className='typo-body_lm text-text_one mb-4'>Accepted ({acceptedOffers.length})</h3>
                                <div className='space-y-4'>
                                    {acceptedOffers.map((offer) => (
                                        <div
                                            key={offer.id}
                                            className='border border-green-200 rounded-lg p-4 bg-green-50'
                                        >
                                            <div className='flex items-start gap-3 mb-3'>
                                                <Image
                                                    src={offer.bidder.avatar}
                                                    alt={offer.bidder.name}
                                                    width={40}
                                                    height={40}
                                                    sizes='40px'
                                                    quality={70}
                                                    className='rounded-full object-cover'
                                                />
                                                <div className='flex-1'>
                                                    <span className='typo-body_lm text-text_one'>
                                                        {offer.bidder.name}
                                                    </span>
                                                    <p className='typo-body_sr text-text_four'>
                                                        {timeAgo(offer.dateCreated)}
                                                    </p>
                                                </div>
                                                <div className='text-green-600 typo-body_sr'>✓ Accepted</div>
                                            </div>
                                            {offer.withCash && offer.cashAmount && (
                                                <p className='typo-body_mm text-green-800'>
                                                    {formatToNaira(offer.cashAmount)}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Declined Offers */}
                        {declinedOffers.length > 0 && (
                            <div>
                                <h3 className='typo-body_lm text-text_four mb-4'>Declined ({declinedOffers.length})</h3>
                                <div className='space-y-4'>
                                    {declinedOffers.map((offer) => (
                                        <div
                                            key={offer.id}
                                            className='border border-border_gray rounded-lg p-4 bg-gray-50 opacity-60'
                                        >
                                            <div className='flex items-start gap-3'>
                                                <Image
                                                    src={offer.bidder.avatar}
                                                    alt={offer.bidder.name}
                                                    width={40}
                                                    height={40}
                                                    sizes='40px'
                                                    quality={70}
                                                    className='rounded-full object-cover'
                                                />
                                                <div className='flex-1'>
                                                    <span className='typo-body_lr text-text_four'>
                                                        {offer.bidder.name}
                                                    </span>
                                                    <p className='typo-body_sr text-text_four'>
                                                        {timeAgo(offer.dateCreated)}
                                                    </p>
                                                </div>
                                                <div className='text-text_four typo-body_sr'>Declined</div>
                                            </div>
                                            {offer.withCash && offer.cashAmount && (
                                                <p className='typo-body_mr text-text_four mt-2'>
                                                    {formatToNaira(offer.cashAmount)}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {offers.length === 0 && (
                            <div className='text-center py-12'>
                                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <svg
                                        className='w-8 h-8 text-gray-400'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                                        />
                                    </svg>
                                </div>
                                <p className='typo-body_lm text-text_four mb-2'>
                                    No {item.isAuction ? 'bids' : 'offers'} yet
                                </p>
                                <p className='typo-body_sr text-text_four'>
                                    When someone makes an offer, it will appear here
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageItemDetail;
