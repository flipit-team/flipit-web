'use client';
import Image from 'next/image';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ChevronLeft} from 'lucide-react';
import {formatToNaira, timeAgo} from '~/utils/helpers';
import {useAppContext} from '~/contexts/AppContext';
import UsedBadge from '../common/badges/UsedBadge';
import TransactionTypeBadge from '../common/badges/TransactionTypeBadge';
import SafetyTips from '../common/safety-tips/SafetyTips';
import ImageGallery from '../common/image-gallery/ImageGallery';
import RegularButton from '../common/buttons/RegularButton';
import StarRating from '../common/star-rating/StarRating';
import TransactionService from '~/services/transaction.service';
import ItemsService from '~/services/items.service';
import {OffersService} from '~/services/offers.service';
import {TransactionType} from '~/types/transaction';
import AcceptOfferModal from '../common/modals/AcceptOfferModal';
import DeclineOfferModal from '../common/modals/DeclineOfferModal';
import SuccessModal from '../common/modals/Success';
import ErrorModal from '../common/modals/Error';
import {EyeIcon, CheckIcon, InboxIcon} from '../icons';

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
    imageUrls: [
        '/images/placeholders/placeholder-product.svg',
        '/images/placeholders/placeholder-product.svg',
        '/images/placeholders/placeholder-product.svg'
    ],
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
            avatar: '/images/placeholders/placeholder-avatar.svg',
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
            avatar: '/images/placeholders/placeholder-avatar.svg',
            rating: 4.8,
            verified: true
        },
        withCash: true,
        cashAmount: 750000,
        offeredItem: {
            id: 201,
            title: 'iPad Pro 12.9" M1',
            image: '/images/placeholders/placeholder-product.svg',
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
            avatar: '/images/placeholders/placeholder-avatar.svg',
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
            avatar: '/images/placeholders/placeholder-avatar.svg',
            rating: 4.9,
            verified: true
        },
        withCash: true,
        cashAmount: 820000,
        offeredItem: {
            id: 203,
            title: 'Apple Watch Series 8',
            image: '/images/placeholders/placeholder-product.svg',
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
            avatar: '/images/placeholders/placeholder-avatar.svg',
            rating: 3.8,
            verified: false
        },
        withCash: false,
        offeredItem: {
            id: 204,
            title: 'Samsung Galaxy S23 Ultra',
            image: '/images/placeholders/placeholder-product.svg',
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
            avatar: '/images/placeholders/placeholder-avatar.svg',
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
    // TODO: Replace with real API data once offer endpoints return matching shape
    // Currently using dummy data so the UI can be previewed
    const [offers, setOffers] = useState<Offer[]>(propOffers || []);
    const [hasAcceptedOffer, setHasAcceptedOffer] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'offers'>('details');
    const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
    const [isMarkingAsSold, setIsMarkingAsSold] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();
    const {user} = useAppContext();

    const handleAcceptOfferClick = (offerId: number) => {
        const offer = offers.find((o) => o.id === offerId);
        if (!offer) return;
        setSelectedOffer(offer);
        setShowAcceptModal(true);
    };

    const handleAcceptOfferConfirm = async () => {
        if (!selectedOffer) return;

        setIsCreatingTransaction(true);

        try {
            const result = await OffersService.acceptOffer(selectedOffer.id);

            if (result.error) {
                setErrorMessage(result.error.message || 'Failed to accept offer');
                setShowAcceptModal(false);
                setShowErrorModal(true);
                setIsCreatingTransaction(false);
                return;
            }

            // Update offer status locally
            setOffers(
                offers.map((o) => {
                    if (o.id === selectedOffer.id) {
                        return {...o, status: 'accepted' as const};
                    }
                    if (o.status === 'accepted') {
                        return {...o, status: 'pending' as const};
                    }
                    return o;
                })
            );
            setHasAcceptedOffer(true);
            setShowAcceptModal(false);
            setShowSuccessModal(true);
            setIsCreatingTransaction(false);

            setTimeout(() => {
                router.push('/offers');
            }, 2000);
        } catch (err) {
            setErrorMessage('An error occurred while accepting the offer');
            setShowAcceptModal(false);
            setShowErrorModal(true);
            setIsCreatingTransaction(false);
        }
    };

    const handleDeclineOfferClick = (offerId: number) => {
        const offer = offers.find((o) => o.id === offerId);
        if (!offer) return;
        setSelectedOffer(offer);
        setShowDeclineModal(true);
    };

    const handleDeclineOfferConfirm = () => {
        if (!selectedOffer) return;
        setOffers(
            offers.map((offer) => (offer.id === selectedOffer.id ? {...offer, status: 'declined' as const} : offer))
        );
        setShowDeclineModal(false);
        setSelectedOffer(null);
    };

    const handleMarkAsSold = async () => {
        if (!item?.id) return;

        setIsMarkingAsSold(true);

        try {
            const result = await ItemsService.markAsSold(item.id);

            if (result.data) {
                setShowSuccessModal(true);
                setErrorMessage('');
                // Redirect to my adverts page after a delay
                setTimeout(() => {
                    router.push('/my-adverts');
                }, 2000);
            } else if (result.error) {
                setErrorMessage(result.error.message || 'Failed to mark item as sold');
                setShowErrorModal(true);
            }
        } catch (err) {
            setErrorMessage('An error occurred while marking item as sold');
            setShowErrorModal(true);
        } finally {
            setIsMarkingAsSold(false);
        }
    };

    const pendingOffers = offers.filter((o) => o.status === 'pending');
    const acceptedOffers = offers.filter((o) => o.status === 'accepted');
    const declinedOffers = offers.filter((o) => o.status === 'declined');

    return (
        <div className='mx-[120px] xs:mx-0 mb-10 mt-6 xs:mt-0 xs:mb-0 xs:bg-[#FFFFF0] xs:pb-24 xs:min-h-screen'>
            {/* Mobile Header */}
            <div className='hidden xs:flex items-center justify-between px-4 pt-4 pb-2'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => router.back()}
                        className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'
                    >
                        <ChevronLeft size={20} className='text-text_one' />
                    </button>
                    <h1 className='font-poppins typo-heading-md-semibold text-text_one'>Manage your item</h1>
                </div>
            </div>

            {/* Desktop Go Back */}
            <button
                onClick={() => router.back()}
                className='flex items-center gap-1 text-primary font-poppins typo-body-md-regular mb-6 xs:hidden cursor-pointer hover:opacity-80 transition-opacity'
            >
                <ChevronLeft size={18} />
                <span>Go Back</span>
            </button>

            {/* Header */}
            <div className='mb-2 xs:px-4 flex justify-between items-center'>
                <h1 className='font-poppins typo-heading-md-semibold text-text_one xs:hidden'>
                    Manage your Listed Items
                </h1>
                <button
                    onClick={handleMarkAsSold}
                    disabled={isMarkingAsSold}
                    className='px-4 py-2 border border-primary text-primary rounded-lg font-poppins typo-body-xs-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed xs:hidden'
                >
                    {isMarkingAsSold ? 'Marking...' : 'Mark as sold'}
                </button>
            </div>
            <p className='font-poppins typo-body-md-regular text-text_four mb-6 xs:px-4 xs:hidden'>
                View details and manage offers for your listing
            </p>

            {/* Mobile Mark as Sold button */}
            <div className='hidden xs:flex xs:justify-end xs:px-4 xs:mb-4'>
                <button
                    onClick={handleMarkAsSold}
                    disabled={isMarkingAsSold}
                    className='px-4 py-1.5 bg-transparent border border-primary text-primary rounded-lg font-poppins typo-body-xs-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isMarkingAsSold ? 'Marking...' : 'Mark as sold'}
                </button>
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
            <div className='grid grid-cols-[2fr_1fr] xs:grid-cols-1 gap-6'>
                {/* Left Column - Item Details */}
                <div className={`${activeTab === 'offers' ? 'xs:hidden' : ''}`}>
                    <div className='shadow-lg xs:shadow-none mb-6 xs:mb-0'>
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

                    {/* Views + Share — mobile */}
                    <div className='hidden xs:flex items-center justify-between px-4 py-2'>
                        <div className='flex items-center gap-1'>
                            <EyeIcon className='w-4 h-4 text-text_four' />
                            <span className='typo-body_sr text-text_four'>{item.views || 0} views</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='typo-body_sr text-text_one'>Share with friends</span>
                            <Image
                                src='/icons/social/facebook.svg'
                                height={20}
                                width={20}
                                alt='facebook'
                                className='w-5 h-5 cursor-pointer'
                                onClick={() =>
                                    window.open(
                                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                                        '_blank'
                                    )
                                }
                            />
                            <Image
                                src='/icons/social/whatsapp.svg'
                                height={20}
                                width={20}
                                alt='whatsapp'
                                className='w-5 h-5 cursor-pointer'
                                onClick={() =>
                                    window.open(
                                        `https://wa.me/?text=${encodeURIComponent(item.title + ' ' + window.location.href)}`,
                                        '_blank'
                                    )
                                }
                            />
                            <Image
                                src='/icons/social/x.svg'
                                height={20}
                                width={20}
                                alt='x'
                                className='w-5 h-5 cursor-pointer'
                                onClick={() =>
                                    window.open(
                                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(item.title)}`,
                                        '_blank'
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className='shadow-lg xs:shadow-none p-6 xs:px-4 xs:pt-2'>
                        <div className='flex items-center gap-2'>
                            <TransactionTypeBadge acceptCash={item.acceptCash} hasSwapItems={false} />
                            <UsedBadge text={item.condition} />
                        </div>
                        <h2 className='typo-heading_ms xs:typo-heading_ss text-text_one mt-[10px] mb-2'>
                            {item.title}
                        </h2>
                        <p className='typo-heading_sm text-primary xs:typo-body_mm mb-2'>
                            {formatToNaira(item.cashAmount)}
                        </p>
                        <p className='typo-body_mr text-text_four mb-6'>{timeAgo(item.dateCreated)}</p>

                        <div className='mb-6 border-b border-border_gray'></div>

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
                                        <span className='typo-body_lm text-primary'>
                                            {item.auctionEndDate ? timeAgo(item.auctionEndDate) : 'N/A'}
                                        </span>
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
                                        <td className='text-text_one text-right'>
                                            {item.itemCategory?.name || item.category}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>SubCategory</td>
                                        <td className='text-text_one text-right'>{item.subcategory}</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Brand</td>
                                        <td className='text-text_one text-right'>{item.brand}</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Condition</td>
                                        <td className='text-text_one text-right'>{item.condition}</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Location</td>
                                        <td className='text-text_one text-right'>{item.location}</td>
                                    </tr>
                                    <tr>
                                        <td className='pr-8 py-1 text-text_four'>Trade Type</td>
                                        <td className='text-text_one text-right'>
                                            {item.acceptCash ? 'Cash accepted' : 'Swap only'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Safety Tips */}
                        <div className='mt-6'>
                            <SafetyTips />
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
                                <p className='typo-body_mr text-green-800 mb-2'>
                                    ✓ You&apos;ve accepted an offer. Redirecting to transaction page...
                                </p>
                                <div className='flex items-center gap-2'>
                                    <div className='w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin'></div>
                                    <span className='typo-body_sr text-green-700'>Creating transaction...</span>
                                </div>
                            </div>
                        )}

                        {/* Pending Offers */}
                        {pendingOffers.length > 0 && (
                            <div className='mb-6'>
                                <div className='flex items-center justify-between mb-4'>
                                    <h3 className='font-poppins typo-body-md-regular text-text_four'>
                                        Pending ({pendingOffers.length})
                                    </h3>
                                    <span className='font-poppins typo-body-xs-medium text-text_one cursor-pointer hover:text-primary'>
                                        View All
                                    </span>
                                </div>
                                <div className='space-y-4'>
                                    {pendingOffers.map((offer) => (
                                        <div
                                            key={offer.id}
                                            className='border-2 border-primary rounded-2xl bg-surface-teal px-[40px] xs:px-4 py-[18px] flex flex-col items-end gap-3'
                                        >
                                            {/* Posted time */}
                                            <p className='font-poppins typo-body-lg-semibold text-text-muted-alt'>
                                                {timeAgo(offer.dateCreated)}
                                            </p>

                                            {/* Bidder Info row */}
                                            <div className='flex items-center w-full'>
                                                <div className='flex items-center gap-2'>
                                                    <Image
                                                        src={offer.bidder.avatar}
                                                        alt={offer.bidder.name}
                                                        width={40}
                                                        height={40}
                                                        sizes='40px'
                                                        quality={70}
                                                        className='rounded-full w-[40px] h-[40px] object-cover'
                                                    />
                                                    <div>
                                                        <span className='font-poppins typo-body-lg-semibold text-text-primary'>
                                                            {offer.bidder.name}
                                                        </span>
                                                        <div className='flex items-center gap-1'>
                                                            <Image
                                                                src='/icons/action/star.svg'
                                                                alt='star'
                                                                width={16}
                                                                height={16}
                                                                className='w-4 h-4'
                                                            />
                                                            <span className='font-poppins typo-body-lg-semibold text-text-secondary'>
                                                                {offer.bidder.rating}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {offer.bidder.verified && (
                                                    <span className='font-poppins typo-body-lg-semibold text-primary ml-8'>
                                                        Verified profile
                                                    </span>
                                                )}
                                            </div>

                                            {/* Offer Details Box */}
                                            <div className='bg-white rounded-lg w-full py-3 px-4'>
                                                {offer.offeredItem ? (
                                                    <>
                                                        <p className='font-poppins typo-body-lg-semibold text-text-primary'>
                                                            Swap Offer
                                                        </p>
                                                        <p className='font-poppins typo-body-lg-semibold text-primary'>
                                                            {offer.offeredItem.title}
                                                        </p>
                                                    </>
                                                ) : offer.withCash && offer.cashAmount ? (
                                                    <>
                                                        <p className='font-poppins typo-body-lg-semibold text-text-primary'>
                                                            Cash Offer
                                                        </p>
                                                        <p className='font-poppins typo-body-lg-semibold text-primary'>
                                                            {formatToNaira(offer.cashAmount)}
                                                        </p>
                                                    </>
                                                ) : null}
                                            </div>

                                            {/* Actions */}
                                            <div className='flex gap-6 xs:gap-3 justify-end w-full'>
                                                <button
                                                    onClick={() => handleAcceptOfferClick(offer.id)}
                                                    disabled={hasAcceptedOffer || isCreatingTransaction}
                                                    className={`px-10 xs:px-6 xs:flex-1 py-2.5 rounded-lg font-poppins typo-body-lg-semibold ${
                                                        hasAcceptedOffer || isCreatingTransaction
                                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                            : 'bg-primary text-white hover:bg-primary/90'
                                                    }`}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleDeclineOfferClick(offer.id)}
                                                    className='px-10 xs:px-6 xs:flex-1 py-2.5 border border-primary text-primary rounded-lg font-poppins typo-body-lg-semibold hover:bg-white/50 transition-colors'
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
                                <h3 className='font-poppins typo-body-md-regular text-text_four mb-4'>Accepted</h3>
                                <div className='space-y-4'>
                                    {acceptedOffers.map((offer) => (
                                        <div
                                            key={offer.id}
                                            className='border-2 border-success-dark rounded-2xl bg-surface-success px-[40px] xs:px-4 py-[18px] flex flex-col gap-3'
                                        >
                                            {/* Top row: posted time + accepted badge */}
                                            <div className='flex items-center justify-between'>
                                                <p className='font-poppins typo-body-lg-semibold text-text-muted-alt'>
                                                    {timeAgo(offer.dateCreated)}
                                                </p>
                                                <div className='flex items-center gap-1 text-success-dark'>
                                                    <CheckIcon className='w-5 h-5' />
                                                    <span className='font-poppins typo-body-lg-semibold'>Accepted</span>
                                                </div>
                                            </div>

                                            {/* Bidder info */}
                                            <div className='flex items-center w-full'>
                                                <div className='flex items-center gap-2'>
                                                    <Image
                                                        src={offer.bidder.avatar}
                                                        alt={offer.bidder.name}
                                                        width={40}
                                                        height={40}
                                                        sizes='40px'
                                                        quality={70}
                                                        className='rounded-full w-[40px] h-[40px] object-cover'
                                                    />
                                                    <div>
                                                        <span className='font-poppins typo-body-lg-semibold text-text-primary'>
                                                            {offer.bidder.name}
                                                        </span>
                                                        <div className='flex items-center gap-1'>
                                                            <Image
                                                                src='/icons/action/star.svg'
                                                                alt='star'
                                                                width={16}
                                                                height={16}
                                                                className='w-4 h-4'
                                                            />
                                                            <span className='font-poppins typo-body-lg-semibold text-text-secondary'>
                                                                {offer.bidder.rating}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {offer.bidder.verified && (
                                                    <span className='font-poppins typo-body-lg-semibold text-primary ml-8'>
                                                        Verified profile
                                                    </span>
                                                )}
                                            </div>

                                            {/* Offered item */}
                                            {offer.offeredItem && (
                                                <p className='font-poppins typo-body-lg-semibold text-success-dark'>
                                                    {offer.offeredItem.title}
                                                </p>
                                            )}
                                            {offer.withCash && offer.cashAmount && !offer.offeredItem && (
                                                <p className='font-poppins typo-body-lg-semibold text-success-dark'>
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
                                <h3 className='font-poppins typo-body-md-regular text-text_four mb-4'>
                                    Declined ({declinedOffers.length})
                                </h3>
                                <div className='space-y-3'>
                                    {declinedOffers.map((offer) => (
                                        <div key={offer.id} className='border border-border-DEFAULT rounded-2xl p-4'>
                                            <div className='flex items-center gap-3'>
                                                <Image
                                                    src={offer.bidder.avatar}
                                                    alt={offer.bidder.name}
                                                    width={44}
                                                    height={44}
                                                    sizes='44px'
                                                    quality={70}
                                                    className='rounded-full w-[44px] h-[44px] object-cover'
                                                />
                                                <div className='flex-1'>
                                                    <p className='font-poppins typo-body-md-semibold text-text_one'>
                                                        {offer.bidder.name}
                                                    </p>
                                                    <p className='font-poppins typo-body-sm-regular text-text_four'>
                                                        {offer.offeredItem
                                                            ? offer.offeredItem.title
                                                            : offer.cashAmount
                                                              ? formatToNaira(offer.cashAmount)
                                                              : ''}
                                                    </p>
                                                    <p className='font-poppins typo-caption text-text_four'>
                                                        {timeAgo(offer.dateCreated)}
                                                    </p>
                                                </div>
                                                <span className='font-poppins typo-body-xs-medium text-text_four'>
                                                    Declined
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {offers.length === 0 && (
                            <div className='text-center py-12'>
                                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <InboxIcon className='w-8 h-8 text-gray-400' />
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

            {/* Modals */}
            {selectedOffer && (
                <>
                    <AcceptOfferModal
                        isOpen={showAcceptModal}
                        onClose={() => setShowAcceptModal(false)}
                        onConfirm={handleAcceptOfferConfirm}
                        bidderName={selectedOffer.bidder.name}
                        bidderAvatar={selectedOffer.bidder.avatar}
                        cashAmount={selectedOffer.cashAmount}
                        offeredItem={selectedOffer.offeredItem}
                        isLoading={isCreatingTransaction}
                    />
                    <DeclineOfferModal
                        isOpen={showDeclineModal}
                        onClose={() => setShowDeclineModal(false)}
                        onConfirm={handleDeclineOfferConfirm}
                        bidderName={selectedOffer.bidder.name}
                    />
                </>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-modal'>
                    <div className='relative bg-white rounded-2xl w-[558px] h-max xs:w-full py-[48px] px-[56px] xs:px-8 xs:py-8 mx-6'>
                        <SuccessModal
                            onClose={() => setShowSuccessModal(false)}
                            message='Offer accepted! Redirecting to offers...'
                        />
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-modal'>
                    <div className='relative bg-white rounded-2xl w-[558px] h-max xs:w-full py-[48px] px-[56px] xs:px-8 xs:py-8 mx-6'>
                        <ErrorModal onClose={() => setShowErrorModal(false)} message={errorMessage} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageItemDetail;
