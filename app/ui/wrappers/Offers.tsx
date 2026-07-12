'use client';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import NoData from '../common/no-data/NoData';
import TransactionTypeBadge from '../common/badges/TransactionTypeBadge';
import LogoLoader from '../common/logo-loader/LogoLoader';
import {Check} from 'lucide-react';
import {ClockFilledIcon} from '../icons';
import {OfferDTO} from '~/types/api';
import {formatToNaira} from '~/utils/helpers';
import OffersService from '~/services/offers.service';
import TransactionService from '~/services/transaction.service';
import {TransactionStatus} from '~/types/transaction';
import ErrorModal from '../common/modals/Error';

// Helpers
const getOfferTradeType = (offer: OfferDTO): 'cash' | 'swap' | 'mixed' => {
    if (offer.offeredItem && offer.withCash) return 'mixed';
    if (offer.offeredItem) return 'swap';
    return 'cash';
};

const getTradeTypeProps = (type: string) => {
    switch (type) {
        case 'cash': return {acceptCash: true, hasSwapItems: false};
        case 'swap': return {acceptCash: false, hasSwapItems: true};
        case 'mixed': return {acceptCash: true, hasSwapItems: true};
        default: return {acceptCash: true, hasSwapItems: false};
    }
};

const getOfferText = (offer: OfferDTO): string => {
    const parts: string[] = [];
    if (offer.cashAmount && offer.withCash) parts.push(formatToNaira(offer.cashAmount));
    if (offer.offeredItem) parts.push(offer.offeredItem.title);
    return parts.join(' + ') || 'Offer';
};

const normalizeStatus = (status: string): string => {
    const s = status?.toUpperCase();
    if (s === 'HIGHEST') return 'PENDING';
    return s;
};

const getStatusStyle = (status: string) => {
    switch (normalizeStatus(status)) {
        case 'ACCEPTED': return 'text-success-dark';
        case 'PENDING': return 'text-text-muted-alt';
        case 'REJECTED': return 'text-accent-coral';
        default: return 'text-text_four';
    }
};

const getStatusLabel = (status: string) => {
    switch (normalizeStatus(status)) {
        case 'ACCEPTED': return 'Accepted';
        case 'PENDING': return 'Pending';
        case 'REJECTED': return 'Rejected';
        case 'WITHDRAWN': return 'Withdrawn';
        default: return status;
    }
};

const formatTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} Hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} Day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

const getItemImage = (offer: OfferDTO): string => {
    return (offer.item?.imageUrls ?? [])[0] || '/images/placeholders/placeholder-product.svg';
};

// User bid from API
interface UserBid {
    auctionId: number;
    amount: number;
    bidTime: string;
    status: 'PENDING' | 'WON' | 'OUT_BID';
    auction: {
        id: number;
        item: any;
        status: string;
        endDate: string;
        startingBid: number;
        currentBid: number;
    } | null;
}

const getBidStatusLabel = (status: string) => {
    switch (status) {
        case 'WON': return 'Won';
        case 'OUT_BID': return 'Out Bid';
        case 'PENDING': return 'Pending';
        default: return status;
    }
};

const getBidStatusStyle = (status: string) => {
    switch (status) {
        case 'OUT_BID': return 'bg-accent-coral/10 text-accent-coral';
        case 'WON': return 'bg-success-dark/10 text-success-dark';
        case 'PENDING': return 'bg-gray-100 text-text_one';
        default: return 'bg-gray-100 text-text_four';
    }
};

interface Props {
    sentOffers: OfferDTO[];
    receivedOffers: OfferDTO[];
    currentUserId: number;
    userBids?: UserBid[];
}

const Offers = ({sentOffers: initialSent, receivedOffers: initialReceived, userBids = []}: Props) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'my-offers' | 'offers-on-items' | 'my-bids'>('my-offers');
    const [sentOffers, setSentOffers] = useState<OfferDTO[]>(initialSent);
    const [receivedOffers, setReceivedOffers] = useState<OfferDTO[]>(initialReceived);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Maps offerId → {txId, status} for accepted offers that have a transaction
    const [txStatuses, setTxStatuses] = useState<Record<number, {txId: number; status: TransactionStatus}>>({});

    // On mount: first read cached status from localStorage (instant, no flash),
    // then fetch live status from the API to stay in sync.
    useEffect(() => {
        // Step 1 — synchronous localStorage read for both sent and received offers
        const cached: Record<number, {txId: number; status: TransactionStatus}> = {};
        for (const offer of [...initialSent, ...initialReceived]) {
            const stored = localStorage.getItem(`offer_tx_${offer.id}`);
            if (!stored) continue;
            const txId = Number(stored);
            const cachedStatus = localStorage.getItem(`tx_status_${txId}`) as TransactionStatus | null;
            cached[offer.id] = {txId, status: cachedStatus || 'PENDING'};
        }
        if (Object.keys(cached).length > 0) setTxStatuses(cached);

        // Step 2 — async API fetch to get the real current status (parallel)
        const fetchStatuses = async () => {
            const offersWithTx = [...initialSent, ...initialReceived].filter(o =>
                localStorage.getItem(`offer_tx_${o.id}`)
            );
            if (offersWithTx.length === 0) return;

            const results = await Promise.all(offersWithTx.map(async (offer) => {
                const txId = Number(localStorage.getItem(`offer_tx_${offer.id}`));
                const {data} = await TransactionService.getTransactionById(txId);
                if (!data) return null;
                localStorage.setItem(`tx_status_${txId}`, data.status);
                return [offer.id, {txId, status: data.status as TransactionStatus}] as const;
            }));

            const updates = Object.fromEntries(results.filter((r): r is NonNullable<typeof r> => r !== null));
            if (Object.keys(updates).length > 0) setTxStatuses(prev => ({...prev, ...updates}));
        };
        fetchStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Compute stats from real data
    const stats = {
        acceptedOffers: receivedOffers.filter(o => normalizeStatus(o.status) === 'ACCEPTED').length,
        rejectedOffers: receivedOffers.filter(o => normalizeStatus(o.status) === 'REJECTED').length,
        pendingOffers: receivedOffers.filter(o => normalizeStatus(o.status) === 'PENDING').length,
        totalReceived: receivedOffers.length,
    };

    const handleAcceptOffer = async (offerId: number) => {
        setLoadingId(offerId);
        const {error} = await OffersService.acceptOffer(offerId);
        if (error) { setLoadingId(null); setErrorMessage('Failed to accept offer. Please try again.'); return; }

        const offer = receivedOffers.find(o => o.id === offerId);
        if (!offer) { setLoadingId(null); return; }

        setReceivedOffers(prev => prev.map(o => o.id === offerId ? {...o, status: 'ACCEPTED'} : o));

        const txType = (offer.offeredItem && offer.withCash) ? 'SWAP_WITH_CASH' : offer.offeredItem ? 'SWAP' : 'CASH_ONLY';
        const {data, error: txError} = await TransactionService.createTransaction({
            buyerId: offer.sentBy.id,
            sellerId: offer.item.seller.id,
            amount: offer.cashAmount || 0,
            type: txType,
            description: offer.item.title,
        });
        setLoadingId(null);
        if (!txError && data) {
            localStorage.setItem(`offer_tx_${offerId}`, String(data.id));
            localStorage.setItem(`tx_status_${data.id}`, data.status || 'SUCCESS');
            setTxStatuses(prev => ({...prev, [offerId]: {txId: data.id, status: data.status as TransactionStatus || 'SUCCESS'}}));
            setIsNavigating(true);
            router.push(`/transaction/${data.id}`);
        }
    };

    const handleRejectOffer = async (offerId: number) => {
        setLoadingId(offerId);
        const {error} = await OffersService.rejectOffer(offerId);
        setLoadingId(null);
        if (error) { setErrorMessage('Failed to decline offer. Please try again.'); return; }
        setReceivedOffers(prev => prev.map(o => o.id === offerId ? {...o, status: 'REJECTED'} : o));
    };

    const handleDeleteOffer = async (offerId: number) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        setLoadingId(offerId);
        const {error} = await OffersService.deleteOffer(offerId);
        setLoadingId(null);
        if (error) { alert('Failed to delete offer.'); return; }
        setSentOffers(prev => prev.filter(o => o.id !== offerId));
    };

    const handleProceedToCheckout = async (offer: OfferDTO) => {
        const tradeType = getOfferTradeType(offer);
        const txType = tradeType === 'mixed' ? 'SWAP_WITH_CASH' : tradeType === 'swap' ? 'SWAP' : 'CASH_ONLY';
        setLoadingId(offer.id);
        const {data, error} = await TransactionService.createTransaction({
            buyerId: offer.sentBy.id,
            sellerId: offer.item.seller.id,
            amount: offer.cashAmount || 0,
            type: txType,
            description: offer.item.title,
        });
        setLoadingId(null);
        if (!error && data) {
            localStorage.setItem(`offer_tx_${offer.id}`, String(data.id));
            // Signal the transaction page to open the payment overlay immediately
            sessionStorage.setItem(`checkout_pending_${data.id}`, '1');
            setIsNavigating(true);
            router.push(`/transaction/${data.id}`);
        }
    };

    return (
        <div className='mx-[120px] xs:mx-4 my-6 xs:my-0 xs:pt-4 xs:pb-24'>
            {isNavigating && <LogoLoader />}
            {errorMessage && (
                <div className='fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-modal'>
                    <div className='relative bg-white rounded-2xl w-[558px] h-max xs:w-full py-[48px] px-[56px] xs:px-8 xs:py-8 mx-6'>
                        <ErrorModal message={errorMessage} onClose={() => setErrorMessage('')} />
                    </div>
                </div>
            )}
            {/* Mobile header with back button */}
            <div className='hidden xs:flex items-center gap-3 mb-4'>
                <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h1 className='font-poppins typo-heading-md-semibold text-text_one'>
                    {activeTab === 'my-bids' ? 'My Bids' : 'Offers Dashboard'}
                </h1>
            </div>

            {/* Desktop Page Title */}
            <h1 className='font-poppins typo-heading-md-semibold text-text_one mb-4 xs:hidden'>
                {activeTab === 'my-bids' ? 'My Bids' : 'Offers Dashboard'}
            </h1>

            {/* Tab Navigation */}
            <div className='flex border-b border-border_gray mb-8 xs:mb-4 overflow-x-auto scrollbar-hide'>
                <button
                    onClick={() => setActiveTab('my-offers')}
                    className={`px-6 xs:px-3 py-3 xs:py-2 font-poppins typo-body-md-semibold xs:typo-body-sm-semibold transition-all whitespace-nowrap ${
                        activeTab === 'my-offers'
                            ? 'text-primary border-b-2 border-primary -mb-[1px]'
                            : 'text-text_four hover:text-text_one'
                    }`}
                >
                    My Offers
                </button>
                <button
                    onClick={() => setActiveTab('offers-on-items')}
                    className={`px-6 xs:px-3 py-3 xs:py-2 font-poppins typo-body-md-semibold xs:typo-body-sm-semibold transition-all whitespace-nowrap ${
                        activeTab === 'offers-on-items'
                            ? 'text-primary border-b-2 border-primary -mb-[1px]'
                            : 'text-text_four hover:text-text_one'
                    }`}
                >
                    Offers on my Items
                </button>
                <button
                    onClick={() => setActiveTab('my-bids')}
                    className={`px-6 xs:px-3 py-3 xs:py-2 font-poppins typo-body-md-semibold xs:typo-body-sm-semibold transition-all whitespace-nowrap ${
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
                    {sentOffers.length > 0 ? (
                        sentOffers.map((offer) => {
                            const tradeType = getOfferTradeType(offer);
                            const tradeProps = getTradeTypeProps(tradeType);
                            const isLoading = loadingId === offer.id;
                            const status = normalizeStatus(offer.status);
                            const txInfo = txStatuses[offer.id];
                            const txId = txInfo?.txId;
                            const isDone = ['COMPLETED', 'RELEASED'].includes(txInfo?.status ?? '');
                            return (
                                <div key={offer.id} className='border border-border-DEFAULT rounded-2xl overflow-hidden bg-white'>
                                    <div className='flex'>
                                        {/* Image with badge overlay */}
                                        <div className='p-3 flex-shrink-0 relative'>
                                            <Image
                                                src={getItemImage(offer)}
                                                alt={offer.item?.title || 'Item'}
                                                width={120}
                                                height={120}
                                                className='rounded-xl object-cover w-[120px] h-[120px]'
                                            />
                                            <div className='absolute top-4 left-4'>
                                                <TransactionTypeBadge acceptCash={tradeProps.acceptCash} hasSwapItems={tradeProps.hasSwapItems} />
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className='py-3 pr-3 flex flex-col justify-center flex-1 min-w-0'>
                                            <h3 className='font-poppins typo-body-md-semibold text-text_one line-clamp-2 leading-tight'>
                                                {offer.item?.title}
                                            </h3>
                                            <p className='font-poppins typo-body-xs-regular text-text-muted-alt mt-1'>Your Offer</p>
                                            <p className='font-poppins typo-body-sm-regular text-text_one truncate'>
                                                {getOfferText(offer)}
                                            </p>
                                            {status === 'ACCEPTED' && (
                                                <p className='font-poppins typo-body-sm-regular text-success-dark mt-1 flex items-center gap-1'>
                                                    <Check size={14} /> {isDone ? 'Completed' : 'Accepted'}
                                                </p>
                                            )}
                                            {status === 'REJECTED' && (
                                                <p className='font-poppins typo-body-sm-regular text-accent-coral mt-1'>Rejected</p>
                                            )}
                                            {status === 'PENDING' && (
                                                isDone
                                                    ? <p className='font-poppins typo-body-sm-regular text-success-dark mt-1 flex items-center gap-1'><Check size={14} /> Completed</p>
                                                    : <p className='font-poppins typo-body-sm-regular text-text-muted-alt mt-1'>Pending</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className='flex gap-2 px-3 pb-3'>
                                        {(status === 'ACCEPTED' || status === 'PENDING') && (
                                            txId ? (
                                                <button
                                                    onClick={() => { setIsNavigating(true); router.push(`/transaction/${txId}`); }}
                                                    className='flex-1 py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-xs-medium'
                                                >
                                                    {isDone ? 'View Transaction' : 'Continue Transaction'}
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleProceedToCheckout(offer)}
                                                        disabled={isLoading}
                                                        className='flex-1 py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-xs-medium disabled:opacity-50'
                                                    >
                                                        {isLoading ? 'Loading...' : 'Proceed to checkout'}
                                                    </button>
                                                    {status === 'PENDING' && (
                                                        <button
                                                            onClick={() => handleDeleteOffer(offer.id)}
                                                            disabled={isLoading}
                                                            className='flex-1 py-2.5 border border-primary rounded-lg font-poppins typo-body-xs-medium text-primary disabled:opacity-50'
                                                        >
                                                            {isLoading ? 'Deleting...' : 'Delete Offer'}
                                                        </button>
                                                    )}
                                                </>
                                            )
                                        )}
                                        {status === 'REJECTED' && (
                                            <>
                                                <button
                                                    onClick={() => handleDeleteOffer(offer.id)}
                                                    disabled={isLoading}
                                                    className='flex-1 py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-xs-medium disabled:opacity-50'
                                                >
                                                    {isLoading ? 'Deleting...' : 'Delete Offer'}
                                                </button>
                                                <button className='flex-1 py-2.5 border border-primary rounded-lg font-poppins typo-body-xs-medium text-primary'>
                                                    Resubmit Offer
                                                </button>
                                            </>
                                        )}
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
                    {/* Stats cards — desktop only */}
                    <div className='grid grid-cols-4 gap-4 mb-8 xs:hidden'>
                        {[
                            {label: 'TOTAL RECEIVED', value: stats.totalReceived},
                            {label: 'ACCEPTED OFFERS', value: stats.acceptedOffers},
                            {label: 'REJECTED OFFERS', value: stats.rejectedOffers},
                            {label: 'PENDING OFFERS', value: stats.pendingOffers},
                        ].map((stat, idx) => (
                            <div key={idx} className='bg-white border border-border_gray rounded-lg p-4 text-center'>
                                <p className='font-poppins typo-caption text-text_four uppercase tracking-wider'>
                                    {stat.label}
                                </p>
                                <p className='font-poppins typo-heading-xl-bold text-text_one mt-1'>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Received offers */}
                    <div className='space-y-3'>
                        {receivedOffers.length > 0 ? (
                            receivedOffers.map((offer) => {
                                const tradeType = getOfferTradeType(offer);
                                const tradeProps = getTradeTypeProps(tradeType);
                                const isLoading = loadingId === offer.id;
                                const isPending = normalizeStatus(offer.status) === 'PENDING';
                                const txInfo = txStatuses[offer.id];
                                const txId = txInfo?.txId;
                                const isDone = ['COMPLETED', 'RELEASED'].includes(txInfo?.status ?? '');
                                return (
                                    <div
                                        key={offer.id}
                                        className='border border-border-DEFAULT rounded-2xl overflow-hidden bg-white'
                                    >
                                        {/* Mobile card layout */}
                                        <div className='hidden xs:block'>
                                            <div className='flex'>
                                                {/* Image with badge */}
                                                <div className='p-3 flex-shrink-0 relative'>
                                                    <Image
                                                        src={getItemImage(offer)}
                                                        alt={offer.item?.title || 'Item'}
                                                        width={120}
                                                        height={120}
                                                        className='rounded-xl object-cover w-[120px] h-[120px]'
                                                    />
                                                    <div className='absolute top-4 left-4'>
                                                        <TransactionTypeBadge acceptCash={tradeProps.acceptCash} hasSwapItems={tradeProps.hasSwapItems} />
                                                    </div>
                                                </div>
                                                {/* Details */}
                                                <div className='py-3 pr-3 flex flex-col justify-center flex-1 min-w-0'>
                                                    <h3 className='font-poppins typo-body-md-semibold text-text_one line-clamp-2'>{offer.item?.title}</h3>
                                                    <div className='flex items-center gap-2 mt-2'>
                                                        <Image
                                                            src={offer.sentBy?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                                            alt={`${offer.sentBy?.firstName || ''}`}
                                                            width={24}
                                                            height={24}
                                                            className='rounded-full w-6 h-6 object-cover flex-shrink-0'
                                                        />
                                                        <div className='min-w-0'>
                                                            <p className='font-poppins typo-body-xs-medium text-text_one'>{offer.sentBy?.firstName} {offer.sentBy?.lastName}</p>
                                                            <p className='font-poppins typo-body-xs-regular text-primary truncate'>{getOfferText(offer)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Buttons */}
                                            <div className='flex gap-2 px-3 pb-3'>
                                                {isPending ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleAcceptOffer(offer.id)}
                                                            disabled={isLoading}
                                                            className='flex-1 py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-xs-medium disabled:opacity-50'
                                                        >
                                                            {isLoading ? 'Accepting...' : 'Accept Offer'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectOffer(offer.id)}
                                                            disabled={isLoading}
                                                            className='flex-1 py-2.5 border border-primary text-primary rounded-lg font-poppins typo-body-xs-medium disabled:opacity-50'
                                                        >
                                                            {isLoading ? 'Declining...' : 'Decline Offer'}
                                                        </button>
                                                    </>
                                                ) : txId ? (
                                                    <button
                                                        onClick={() => { setIsNavigating(true); router.push(`/transaction/${txId}`); }}
                                                        className='flex-1 py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-xs-medium'
                                                    >
                                                        {isDone ? 'View Transaction' : 'Continue Transaction'}
                                                    </button>
                                                ) : (
                                                    <span className={`font-poppins typo-body-sm-semibold ${getStatusStyle(offer.status)}`}>
                                                        {isDone ? 'Completed' : getStatusLabel(offer.status)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Desktop card layout */}
                                        <div className='xs:hidden flex'>
                                            {/* Image */}
                                            <div className='p-[26px] flex-shrink-0'>
                                                <Image
                                                    src={getItemImage(offer)}
                                                    alt={offer.item?.title || 'Item'}
                                                    width={180}
                                                    height={180}
                                                    className='rounded-2xl object-cover w-[180px] h-[180px]'
                                                />
                                            </div>

                                            {/* Middle — title, offerer box, buttons */}
                                            <div className='py-[26px] flex flex-col justify-between flex-1 min-w-0'>
                                                <div>
                                                    <h3 className='font-poppins typo-body-lg-bold text-text-secondary'>
                                                        {offer.item?.title}
                                                    </h3>

                                                    {/* Offerer info box */}
                                                    <div className='border border-border-DEFAULT rounded-2xl p-3 mt-3 flex items-start gap-3'>
                                                        <Image
                                                            src={offer.sentBy?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                                            alt={`${offer.sentBy?.firstName} ${offer.sentBy?.lastName}`}
                                                            width={44}
                                                            height={44}
                                                            className='rounded-full w-[44px] h-[44px] object-cover flex-shrink-0'
                                                        />
                                                        <div className='min-w-0'>
                                                            <p className='font-poppins typo-body-lg-semibold text-text-primary'>
                                                                {offer.sentBy?.firstName} {offer.sentBy?.lastName}
                                                            </p>
                                                            {offer.sentBy?.avgRating !== undefined && (
                                                                <div className='flex items-center gap-1'>
                                                                    <Image src='/icons/action/star.svg' alt='star' width={16} height={16} className='w-4 h-4' />
                                                                    <span className='font-poppins typo-body-md-semibold text-rating'>{offer.sentBy.avgRating?.toFixed(1) || '0.0'}</span>
                                                                </div>
                                                            )}
                                                            <p className='font-poppins typo-body-sm-regular text-text-muted-alt uppercase tracking-wide mt-1'>
                                                                OFFER
                                                            </p>
                                                            <p className='font-poppins typo-body-md-medium text-primary'>
                                                                {getOfferText(offer)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Accept / Decline buttons — only for pending offers */}
                                                {isPending ? (
                                                    <div className='flex gap-4 mt-4'>
                                                        <button
                                                            onClick={() => handleAcceptOffer(offer.id)}
                                                            disabled={isLoading}
                                                            className='px-8 py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-md-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
                                                        >
                                                            {isLoading ? 'Accepting...' : 'Accept'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectOffer(offer.id)}
                                                            disabled={isLoading}
                                                            className='px-8 py-2.5 border-2 border-primary text-primary rounded-lg font-poppins typo-body-md-medium hover:bg-gray-50 transition-colors disabled:opacity-50'
                                                        >
                                                            {isLoading ? 'Declining...' : 'Decline'}
                                                        </button>
                                                    </div>
                                                ) : txId ? (
                                                    <div className='flex items-center gap-4 mt-4'>
                                                        <button
                                                            onClick={() => { setIsNavigating(true); router.push(`/transaction/${txId}`); }}
                                                            className='px-8 py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-md-medium hover:bg-primary/90 transition-colors'
                                                        >
                                                            {isDone ? 'View Transaction' : 'Continue Transaction'}
                                                        </button>
                                                        <span className={`font-poppins typo-body-md-semibold ${isDone ? 'text-success-dark' : 'text-primary'}`}>
                                                            {isDone ? 'Completed' : getStatusLabel(offer.status)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className='mt-4'>
                                                        <span className={`font-poppins typo-body-md-semibold ${getStatusStyle(offer.status)}`}>
                                                            {getStatusLabel(offer.status)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right — badge, time */}
                                            <div className='py-[26px] pr-[50px] flex flex-col items-end justify-between flex-shrink-0'>
                                                <div className='w-fit'>
                                                    <TransactionTypeBadge acceptCash={tradeProps.acceptCash} hasSwapItems={tradeProps.hasSwapItems} />
                                                </div>
                                                <p className='font-poppins typo-body-md-regular text-text-muted-alt italic'>
                                                    {formatTimeAgo(offer.dateCreated)}
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
                    {userBids.length > 0 ? (
                        userBids.map((bid, i) => {
                            const item = bid.auction?.item;
                            const imageUrl = item?.imageUrls?.[0] || '/images/placeholders/placeholder-product.svg';
                            const title = item?.title || 'Auction Item';
                            const auctionEnded = bid.auction ? new Date(bid.auction.endDate) < new Date() : false;
                            const timeLeft = bid.auction ? formatTimeAgo(bid.auction.endDate) : '';

                            return (
                                <div key={i} className='border border-border-DEFAULT rounded-2xl overflow-hidden bg-white'>
                                    <div className='flex p-3'>
                                        {/* Image */}
                                        <div className='flex-shrink-0'>
                                            <Image
                                                src={imageUrl}
                                                alt={title}
                                                width={120}
                                                height={120}
                                                className='rounded-xl object-cover w-[120px] h-[120px]'
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className='pl-3 flex flex-col justify-center flex-1 min-w-0'>
                                            <h3 className='font-poppins typo-body-md-semibold text-text_one line-clamp-2'>
                                                {title}
                                            </h3>
                                            <div className='bg-gray-50 rounded-lg px-3 py-1.5 mt-2'>
                                                <p className='font-poppins typo-body-xs-regular text-text_four'>Your Bid</p>
                                                <p className='font-poppins typo-body-sm-bold text-text_one'>{formatToNaira(bid.amount)}</p>
                                            </div>
                                            <div className='flex items-center gap-1 mt-1.5'>
                                                <ClockFilledIcon className={`w-4 h-4 ${auctionEnded ? 'text-accent-coral' : 'text-primary'}`} />
                                                <span className={`font-poppins typo-body-xs-regular ${auctionEnded ? 'text-accent-coral' : 'text-primary'}`}>
                                                    {auctionEnded ? 'Closed' : timeLeft}
                                                </span>
                                            </div>
                                            <span className={`mt-1 px-2.5 py-0.5 rounded font-poppins typo-body-xs-medium w-fit ${getBidStatusStyle(bid.status)}`}>
                                                {getBidStatusLabel(bid.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    <div className='px-3 pb-3'>
                                        {bid.status === 'WON' && (
                                            <button className='w-full py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-xs-medium'>
                                                Proceed to checkout
                                            </button>
                                        )}
                                        {bid.status === 'OUT_BID' && (
                                            <button className='w-full py-2.5 border border-primary text-primary rounded-lg font-poppins typo-body-xs-medium'>
                                                Delete
                                            </button>
                                        )}
                                        {bid.status === 'PENDING' && (
                                            <button className='w-full py-2.5 bg-primary text-white rounded-lg font-poppins typo-body-xs-medium'>
                                                Delete Bid
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <NoData text='No bids placed yet' />
                    )}
                </div>
            )}
        </div>
    );
};

export default Offers;
