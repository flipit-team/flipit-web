'use client';
import Image from 'next/image';
import React, {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import {formatToNaira, timeAgo} from '~/utils/helpers';
import {useAppContext} from '~/contexts/AppContext';
import UsedBadge from '../common/badges/UsedBadge';
import ImageGallery from '../common/image-gallery/ImageGallery';
import RegularButton from '../common/buttons/RegularButton';
import StarRating from '../common/star-rating/StarRating';
import CountdownTimer from '../common/countdown-timer/CountdownTimer';
import Success from '../common/modals/Success';
import Error from '../common/modals/Error';
import ConfirmationModal from '../common/modals/ConfirmationModal';
import confetti from 'canvas-confetti';

// Bid interface
interface Bid {
    id: number;
    bidder: {
        id: number;
        name: string;
        avatar: string;
        rating: number;
        verified: boolean;
        joinedDate: string;
    };
    amount: number;
    bidTime: string;
    isWinning: boolean;
}

// Auction data interface
interface AuctionData {
    id: number;
    title: string;
    description: string;
    imageUrls: string[];
    condition: string;
    brand: string;
    location: string;
    category: string;
    subcategory: string;
    dateCreated: string;
    promoted: boolean;
    views: number;

    // Auction specific
    startingBid: number;
    currentBid: number;
    bidIncrement: number;
    reservePrice: number;
    startDate: string;
    endDate: string;
    status: 'CREATED' | 'ACTIVE' | 'ENDED' | 'CANCELLED' | 'PAUSED';
    totalBids: number;
    uniqueBidders: number;

    // Auctioneer info
    auctioneer: {
        id: number;
        name: string;
        avatar: string;
        rating: number;
        verified: boolean;
        joinedDate: string;
        responseTime: string;
        totalSales: number;
    };
}

// Dummy auction data - Owner's auction
const dummyOwnerAuction: AuctionData = {
    id: 1,
    title: 'MacBook Pro M2 16" - Space Gray',
    description:
        'Excellent condition MacBook Pro with M2 Max chip. Used for less than 6 months. Comes with original box, charger, and Apple Care+ valid until 2025. Perfect for professionals and creatives. No scratches or dents, battery health at 100%.',
    imageUrls: ['/placeholder-product.svg', '/placeholder-product.svg', '/placeholder-product.svg'],
    condition: 'Like New',
    brand: 'Apple',
    location: 'LA-IKJ, LA',
    category: 'Electronics & Gadgets',
    subcategory: 'Laptops',
    dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    promoted: true,
    views: 347,

    startingBid: 1000000,
    currentBid: 1450000,
    bidIncrement: 50000,
    reservePrice: 1500000,
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
    status: 'ACTIVE',
    totalBids: 18,
    uniqueBidders: 7,

    auctioneer: {
        id: 201,
        name: 'You',
        avatar: '/placeholder-avatar.svg',
        rating: 4.8,
        verified: true,
        joinedDate: '2023-06-15',
        responseTime: 'within minutes',
        totalSales: 45
    }
};

// Dummy auction data - Someone else's auction
const dummyBidderAuction: AuctionData = {
    ...dummyOwnerAuction,
    auctioneer: {
        id: 202,
        name: 'Sarah Johnson',
        avatar: '/placeholder-avatar.svg',
        rating: 4.9,
        verified: true,
        joinedDate: '2022-03-10',
        responseTime: 'within hours',
        totalSales: 128
    }
};

// Dummy bids data
const dummyBids: Bid[] = [
    {
        id: 1,
        bidder: {
            id: 301,
            name: 'John D.',
            avatar: '/placeholder-avatar.svg',
            rating: 4.7,
            verified: true,
            joinedDate: '2023-01-15'
        },
        amount: 1450000,
        bidTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isWinning: true
    },
    {
        id: 2,
        bidder: {
            id: 302,
            name: 'Emily S.',
            avatar: '/placeholder-avatar.svg',
            rating: 4.5,
            verified: true,
            joinedDate: '2023-05-20'
        },
        amount: 1400000,
        bidTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        isWinning: false
    },
    {
        id: 3,
        bidder: {
            id: 303,
            name: 'Michael B.',
            avatar: '/placeholder-avatar.svg',
            rating: 4.3,
            verified: false,
            joinedDate: '2024-01-10'
        },
        amount: 1350000,
        bidTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        isWinning: false
    },
    {
        id: 4,
        bidder: {
            id: 304,
            name: 'Lisa W.',
            avatar: '/placeholder-avatar.svg',
            rating: 4.9,
            verified: true,
            joinedDate: '2022-11-05'
        },
        amount: 1300000,
        bidTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isWinning: false
    },
    {
        id: 5,
        bidder: {
            id: 305,
            name: 'David K.',
            avatar: '/placeholder-avatar.svg',
            rating: 4.6,
            verified: true,
            joinedDate: '2023-08-22'
        },
        amount: 1250000,
        bidTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isWinning: false
    }
];

interface Props {
    auction?: AuctionData;
    bids?: Bid[];
    isOwner?: boolean;
}

const ManageAuctionDetail = ({auction: propAuction, bids: propBids, isOwner = true}: Props) => {
    // Use provided data or fall back to dummy data
    const auction = propAuction || (isOwner ? dummyOwnerAuction : dummyBidderAuction);
    const [bids, setBids] = useState<Bid[]>(propBids || dummyBids);
    const [activeTab, setActiveTab] = useState<'bids' | 'details'>('bids');
    const [bidAmount, setBidAmount] = useState('');
    const [isPlacingBid, setIsPlacingBid] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [auctionEnded, setAuctionEnded] = useState(false);
    const router = useRouter();
    const {user} = useAppContext();

    // Auto-refresh bids every 10 seconds (simulating live updates)
    useEffect(() => {
        if (auction.status === 'ACTIVE') {
            const interval = setInterval(() => {
                // Simulate new bid coming in (in real app, this would be from WebSocket or polling)
                console.log('Checking for new bids...');
                // In production, you'd call: refetchBids()
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [auction.status]);

    // Handle placing a bid
    const handlePlaceBid = async () => {
        // Get current highest bid
        const currentHighest = bids.length > 0 ? bids[0].amount : auction.currentBid;
        const minBid = currentHighest + auction.bidIncrement;

        if (!bidAmount || parseFloat(bidAmount) < minBid) {
            setErrorMessage(`Minimum bid is ${formatToNaira(minBid)}`);
            setShowErrorModal(true);
            return;
        }

        setIsPlacingBid(true);

        // Simulate API call
        setTimeout(() => {
            const newBid: Bid = {
                id: bids.length + 1,
                bidder: {
                    id: 999,
                    name: 'You',
                    avatar: '/placeholder-avatar.svg',
                    rating: 4.5,
                    verified: true,
                    joinedDate: '2023-01-01'
                },
                amount: parseFloat(bidAmount),
                bidTime: new Date().toISOString(),
                isWinning: true
            };

            // Update bids list
            setBids([newBid, ...bids.map(b => ({...b, isWinning: false}))]);
            setBidAmount('');
            setSuccessMessage('Bid placed successfully! You are now the highest bidder.');
            setShowSuccessModal(true);
            setIsPlacingBid(false);
        }, 1500);
    };

    // Handle canceling auction
    const handleCancelAuction = async () => {
        setShowCancelModal(false);

        // Simulate API call
        setTimeout(() => {
            setSuccessMessage('Auction cancelled successfully. Bidders will be notified.');
            setShowSuccessModal(true);
        }, 1000);
    };

    // Celebration function for winner
    const celebrateWin = useCallback(() => {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            // Confetti animation - multiple bursts for excitement
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            };

            const interval: any = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // Fire confetti from two points
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);
        }

        // Play celebration sound
        try {
            // Create a simple success sound using Web Audio API
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Create a series of ascending notes for a "success" sound
            const playNote = (frequency: number, startTime: number, duration: number) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };

            // Play a cheerful ascending melody
            const now = audioContext.currentTime;
            playNote(523.25, now, 0.15); // C5
            playNote(659.25, now + 0.15, 0.15); // E5
            playNote(783.99, now + 0.3, 0.3); // G5
        } catch (error) {
            console.log('Could not play celebration sound:', error);
        }
    }, []);

    // Navigate to transaction page when auction ends (for winner)
    const handleAuctionEnd = useCallback(() => {
        setAuctionEnded(true);
        console.log('Auction ended! Reserve met:', reserveMet);

        // If bidder view and user is winning, celebrate!
        if (!isOwner && bids.length > 0 && bids[0].bidder.name === 'You') {
            setTimeout(() => {
                celebrateWin();
            }, 500); // Small delay for better UX
        }
    }, [isOwner, bids, celebrateWin]);

    // Check if auction already ended on load
    useEffect(() => {
        if (new Date(auction.endDate) < new Date()) {
            setAuctionEnded(true);
        }
    }, [auction.endDate]);

    // Calculate current highest bid (from bids array or auction data)
    const currentHighestBid = bids.length > 0 ? bids[0].amount : auction.currentBid;

    // Calculate if reserve price is met
    const reserveMet = currentHighestBid >= auction.reservePrice;
    const hasEnded = auctionEnded || new Date(auction.endDate) < new Date();
    const hasStarted = new Date(auction.startDate) < new Date();

    // Get auction status badge
    const getStatusBadge = () => {
        if (auction.status === 'CANCELLED') {
            return <div className='px-3 py-1 bg-red-100 text-red-600 rounded typo-body_sr'>Cancelled</div>;
        }
        if (hasEnded) {
            return <div className='px-3 py-1 bg-gray-100 text-gray-600 rounded typo-body_sr'>Ended</div>;
        }
        if (!hasStarted) {
            return <div className='px-3 py-1 bg-yellow-100 text-yellow-600 rounded typo-body_sr'>Not Started</div>;
        }
        if (auction.status === 'ACTIVE') {
            return <div className='px-3 py-1 bg-green-100 text-green-600 rounded typo-body_sr'>Live</div>;
        }
        return null;
    };

    return (
        <>
            <div className='grid-sizes grid grid-cols-[712px_1fr] xs:grid-cols-1 gap-6 h-full mt-10 xs:mb-6 px-[120px] xs:px-4'>
                {/* Left Column - Image and Details */}
                <div className='p-6 xs:p-0 shadow-lg xs:shadow-none bg-white rounded-lg'>
                    <ImageGallery
                        images={auction.imageUrls}
                        overlayElements={
                            <>
                                {auction.promoted && (
                                    <div className='w-[76px] h-[26px] typo-body_sr text-white bg-primary absolute top-7 left-3 flex items-center justify-center rounded'>
                                        Promoted
                                    </div>
                                )}
                                {auction.status === 'ACTIVE' && (
                                    <div className='w-[76px] h-[26px] typo-body_sb text-white bg-green-500 absolute top-7 right-3 flex items-center justify-center rounded'>
                                        Live
                                    </div>
                                )}
                            </>
                        }
                    />

                    {/* View and Share Stats */}
                    <div className='flex items-center justify-between mt-4'>
                        <div className='flex items-center gap-1'>
                            <Image src={'/eye.svg'} height={22} width={22} alt='views' className='h-[22px] w-[22px]' />
                            <p className='typo-body_mr text-text_four'>{auction.views} views</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <p className='typo-body_mr text-text_one'>Share auction</p>
                            <div className='flex items-center gap-3'>
                                <Image src={'/facebook.svg'} height={24} width={24} alt='facebook' className='h-[24px] w-[24px] cursor-pointer' />
                                <Image src={'/whatsapp.svg'} height={24} width={24} alt='whatsapp' className='h-[24px] w-[24px] cursor-pointer' />
                                <Image src={'/x.svg'} height={24} width={24} alt='twitter' className='h-[24px] w-[24px] cursor-pointer' />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className='flex gap-6 mt-6 border-b border-border_gray'>
                        <button
                            onClick={() => setActiveTab('bids')}
                            className={`pb-2 typo-body_lm ${
                                activeTab === 'bids'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-text_four'
                            }`}
                        >
                            Bids ({bids.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`pb-2 typo-body_lm ${
                                activeTab === 'details'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-text_four'
                            }`}
                        >
                            Details
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'bids' && (
                        <div className='mt-4'>
                            {bids.length === 0 ? (
                                <div className='text-center py-8 text-text_four typo-body_mr'>
                                    No bids yet. Be the first to bid!
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    {bids.map((bid) => (
                                        <div
                                            key={bid.id}
                                            className={`p-4 rounded-lg border ${
                                                bid.isWinning ? 'border-primary bg-surface-primary-16' : 'border-border_gray'
                                            }`}
                                        >
                                            <div className='flex items-start justify-between'>
                                                <div className='flex gap-3'>
                                                    <Image
                                                        src={bid.bidder.avatar}
                                                        alt={bid.bidder.name}
                                                        width={48}
                                                        height={48}
                                                        className='rounded-full w-12 h-12 object-cover'
                                                    />
                                                    <div>
                                                        <div className='flex items-center gap-2'>
                                                            <span className='typo-body_lm'>{bid.bidder.name}</span>
                                                            {bid.bidder.verified && (
                                                                <Image src={'/verified.svg'} alt='verified' width={16} height={16} />
                                                            )}
                                                            {bid.isWinning && (
                                                                <span className='px-2 py-0.5 bg-primary text-white rounded typo-body_sr'>
                                                                    Winning
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className='flex items-center gap-1 mt-1'>
                                                            <StarRating rating={bid.bidder.rating} size={14} />
                                                            <span className='typo-body_sr text-text_four ml-1'>
                                                                ({bid.bidder.rating})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='text-right'>
                                                    <div className='typo-body_lm text-primary'>{formatToNaira(bid.amount)}</div>
                                                    <div className='typo-body_sr text-text_four'>{timeAgo(bid.bidTime)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className='mt-4'>
                            <div className='mb-6'>
                                <div className='typo-body_lm text-text_one mb-2'>Description</div>
                                <p className='typo-body_mr text-text_four'>{auction.description}</p>
                            </div>

                            <div>
                                <div className='typo-body_lm mb-2'>Specifications</div>
                                <table className='w-full typo-body_sr'>
                                    <tbody>
                                        <tr className='border-b border-border_gray'>
                                            <td className='py-2 text-text_four'>Category</td>
                                            <td className='py-2 text-text_one'>{auction.category}</td>
                                        </tr>
                                        <tr className='border-b border-border_gray'>
                                            <td className='py-2 text-text_four'>Subcategory</td>
                                            <td className='py-2 text-text_one'>{auction.subcategory}</td>
                                        </tr>
                                        <tr className='border-b border-border_gray'>
                                            <td className='py-2 text-text_four'>Brand</td>
                                            <td className='py-2 text-text_one'>{auction.brand}</td>
                                        </tr>
                                        <tr className='border-b border-border_gray'>
                                            <td className='py-2 text-text_four'>Condition</td>
                                            <td className='py-2 text-text_one'>{auction.condition}</td>
                                        </tr>
                                        <tr className='border-b border-border_gray'>
                                            <td className='py-2 text-text_four'>Location</td>
                                            <td className='py-2 text-text_one'>{auction.location}</td>
                                        </tr>
                                        <tr className='border-b border-border_gray'>
                                            <td className='py-2 text-text_four'>Bid Increment</td>
                                            <td className='py-2 text-text_one'>{formatToNaira(auction.bidIncrement)}</td>
                                        </tr>
                                        <tr className='border-b border-border_gray'>
                                            <td className='py-2 text-text_four'>Reserve Price</td>
                                            <td className='py-2 text-text_one'>
                                                {formatToNaira(auction.reservePrice)}
                                                {reserveMet && <span className='ml-2 text-green-600'>(Met)</span>}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Auction Info and Actions */}
                <div className='p-6 xs:p-0 shadow-lg xs:shadow-none bg-white rounded-lg h-fit'>
                    <div className='flex items-center gap-2 mb-2'>
                        <UsedBadge text={auction.condition} />
                        {getStatusBadge()}
                    </div>

                    <div className='typo-heading_ms xs:typo-heading_ss text-text_one mt-2 capitalize'>
                        {auction.title}
                    </div>

                    {/* Current Bid */}
                    <div className='mt-4 p-4 bg-surface-primary-16 rounded-lg'>
                        <div className='typo-body_mr text-text_four'>Current Bid</div>
                        <div className='typo-heading_sm text-primary'>{formatToNaira(currentHighestBid)}</div>
                        <div className='typo-body_sr text-text_four mt-1'>
                            {bids.length} bids from {auction.uniqueBidders} bidders
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    {auction.status === 'ACTIVE' && !hasEnded && (
                        <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                            <div className='typo-body_mr text-text_four mb-2'>Time Remaining</div>
                            <CountdownTimer endTime={new Date(auction.endDate)} onComplete={handleAuctionEnd} />
                        </div>
                    )}

                    {/* Starting Bid Info */}
                    <div className='mt-4 flex justify-between items-center text-sm'>
                        <span className='text-text_four'>Starting Bid:</span>
                        <span className='text-text_one typo-body_lr'>{formatToNaira(auction.startingBid)}</span>
                    </div>

                    {/* Reserve Price Status */}
                    <div className='mt-2 p-3 rounded-lg bg-gray-50'>
                        <div className='flex items-center justify-between'>
                            <span className='typo-body_sr text-text_four'>Reserve Price:</span>
                            <span className='typo-body_lr text-text_one'>{formatToNaira(auction.reservePrice)}</span>
                        </div>
                        <div className='mt-2 w-full bg-gray-200 rounded-full h-2'>
                            <div
                                className={`h-2 rounded-full ${reserveMet ? 'bg-green-500' : 'bg-yellow-500'}`}
                                style={{width: `${Math.min((currentHighestBid / auction.reservePrice) * 100, 100)}%`}}
                            />
                        </div>
                        <div className='typo-body_sr text-text_four mt-1'>
                            {reserveMet ? 'Reserve price met!' : `${formatToNaira(auction.reservePrice - currentHighestBid)} to reserve`}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isOwner ? (
                        // Owner View Actions
                        <div className='mt-6 space-y-3'>
                            <RegularButton
                                text='View All Bids'
                                action={() => setActiveTab('bids')}
                            />

                            {auction.status === 'ACTIVE' && !hasEnded && (
                                <RegularButton
                                    text='Cancel Auction'
                                    isLight
                                    action={() => setShowCancelModal(true)}
                                />
                            )}

                            {hasEnded && (
                                <>
                                    {bids.length > 0 ? (
                                        <div className='space-y-3'>
                                            <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                                                <div className='typo-body_lm text-green-700 mb-2 text-center'>
                                                    ✓ Auction Successful!
                                                </div>
                                                <div className='flex justify-between items-center mb-1'>
                                                    <span className='typo-body_sr text-text_four'>Winning Bid:</span>
                                                    <span className='typo-body_lr text-green-700'>
                                                        {formatToNaira(bids[0].amount)}
                                                    </span>
                                                </div>
                                                <div className='flex justify-between items-center'>
                                                    <span className='typo-body_sr text-text_four'>Winner:</span>
                                                    <span className='typo-body_lr text-text_one'>{bids[0].bidder.name}</span>
                                                </div>
                                                {!reserveMet && (
                                                    <div className='mt-2 pt-2 border-t border-green-300'>
                                                        <p className='typo-body_sr text-green-600 text-center'>
                                                            Reserve not met, but highest bidder wins
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <RegularButton
                                                text='Complete Transaction'
                                                action={() => router.push(`/transaction/1?type=auction&auctionId=${auction.id}`)}
                                            />
                                        </div>
                                    ) : (
                                        <div className='p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                                            <div className='typo-body_lm text-yellow-700 mb-1 text-center'>
                                                Auction Ended
                                            </div>
                                            <div className='typo-body_sr text-yellow-600 text-center'>
                                                No bids were placed.
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Auction Stats */}
                            <div className='mt-6 p-4 bg-gray-50 rounded-lg space-y-2'>
                                <div className='typo-body_lm text-text_one mb-3'>Auction Statistics</div>
                                <div className='flex justify-between typo-body_sr'>
                                    <span className='text-text_four'>Total Bids:</span>
                                    <span className='text-text_one'>{auction.totalBids}</span>
                                </div>
                                <div className='flex justify-between typo-body_sr'>
                                    <span className='text-text_four'>Unique Bidders:</span>
                                    <span className='text-text_one'>{auction.uniqueBidders}</span>
                                </div>
                                <div className='flex justify-between typo-body_sr'>
                                    <span className='text-text_four'>Views:</span>
                                    <span className='text-text_one'>{auction.views}</span>
                                </div>
                                <div className='flex justify-between typo-body_sr'>
                                    <span className='text-text_four'>Started:</span>
                                    <span className='text-text_one'>{timeAgo(auction.startDate)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Bidder View Actions
                        <div className='mt-6'>
                            {auction.status === 'ACTIVE' && !hasEnded ? (
                                <>
                                    <div className='mb-4'>
                                        <label className='typo-body_lr text-text_one mb-2 block'>Place Your Bid</label>
                                        <div className='flex gap-2'>
                                            <input
                                                type='number'
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                placeholder={`Min: ${formatToNaira(currentHighestBid + auction.bidIncrement)}`}
                                                className='flex-1 h-[51px] px-4 border border-border_gray rounded-lg typo-body_mr'
                                                min={currentHighestBid + auction.bidIncrement}
                                                step={auction.bidIncrement}
                                            />
                                        </div>
                                        <div className='typo-body_sr text-text_four mt-2'>
                                            Minimum bid: {formatToNaira(currentHighestBid + auction.bidIncrement)}
                                        </div>
                                    </div>

                                    <RegularButton
                                        text={isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                                        action={handlePlaceBid}
                                        disabled={isPlacingBid || !bidAmount}
                                    />

                                    <div className='mt-3'>
                                        <RegularButton
                                            text='View Bid History'
                                            isLight
                                            action={() => setActiveTab('bids')}
                                        />
                                    </div>

                                    {/* Bidding Tips */}
                                    <div className='mt-6 p-4 bg-yellow-50 rounded-lg'>
                                        <div className='flex gap-2'>
                                            <div className='w-5 h-5 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0'>
                                                i
                                            </div>
                                            <div>
                                                <div className='typo-body_lm text-text_one mb-2'>Bidding Tips</div>
                                                <ul className='typo-body_sr text-text_four space-y-1 list-disc list-inside'>
                                                    <li>Bids are binding commitments</li>
                                                    <li>You have 4 days to pay if you win</li>
                                                    <li>Set a maximum bid to avoid overspending</li>
                                                    <li>Monitor the auction closely near end time</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {hasEnded ? (
                                        <>
                                            {/* Check if user won the auction */}
                                            {bids.length > 0 && bids[0].bidder.name === 'You' ? (
                                                <div className='space-y-3'>
                                                    <div className='p-4 bg-green-50 rounded-lg text-center border border-green-200'>
                                                        <div className='text-4xl mb-2'>🎉</div>
                                                        <div className='typo-body_lm text-green-700 mb-1'>
                                                            Congratulations! You Won!
                                                        </div>
                                                        <div className='typo-body_sr text-green-600'>
                                                            Winning bid: {formatToNaira(bids[0].amount)}
                                                        </div>
                                                        {!reserveMet && (
                                                            <div className='mt-2 pt-2 border-t border-green-300'>
                                                                <p className='typo-body_sr text-green-600'>
                                                                    Reserve not met, but you&apos;re the highest bidder
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <RegularButton
                                                        text='Proceed to Payment'
                                                        action={() => router.push(`/transaction/1?type=auction&auctionId=${auction.id}`)}
                                                    />

                                                    <div className='p-3 bg-yellow-50 rounded-lg'>
                                                        <div className='typo-body_sr text-text_four text-center'>
                                                            ⏰ You have 4 days to complete payment
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='p-4 bg-gray-50 rounded-lg text-center'>
                                                    <div className='typo-body_lm text-text_one mb-2'>
                                                        Auction Ended
                                                    </div>
                                                    <div className='typo-body_sr text-text_four'>
                                                        This auction has ended. Check back for similar items.
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className='p-4 bg-gray-50 rounded-lg text-center'>
                                            <div className='typo-body_lm text-text_one mb-2'>
                                                Auction Not Started
                                            </div>
                                            <div className='typo-body_sr text-text_four'>
                                                Auction starts {timeAgo(auction.startDate)}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Auctioneer Info */}
                    <div className='mt-6 pt-6 border-t border-border_gray'>
                        <div className='typo-body_lm text-text_one mb-4'>
                            {isOwner ? 'Your Profile' : 'Auctioneer'}
                        </div>
                        <div className='flex gap-3'>
                            <Image
                                src={auction.auctioneer.avatar}
                                alt={auction.auctioneer.name}
                                width={52}
                                height={52}
                                className='rounded-full w-[52px] h-[52px] object-cover'
                            />
                            <div className='flex-1'>
                                <div className='flex items-center gap-2'>
                                    <span className='typo-body_lm'>{auction.auctioneer.name}</span>
                                    {auction.auctioneer.verified && (
                                        <div className='h-[23px] px-2 bg-surface-primary-16 text-primary flex items-center justify-center rounded typo-body_sr'>
                                            Verified
                                        </div>
                                    )}
                                </div>
                                <div className='flex items-center gap-1 mt-1'>
                                    <StarRating rating={auction.auctioneer.rating} size={18} />
                                    <span className='typo-body_sr text-text_four ml-1'>
                                        ({auction.auctioneer.rating})
                                    </span>
                                </div>
                                <div className='typo-body_sr text-text_four mt-1'>
                                    Responds {auction.auctioneer.responseTime}
                                </div>
                                <div className='typo-body_sr text-text_four'>
                                    {auction.auctioneer.totalSales} successful sales
                                </div>
                            </div>
                        </div>

                        {!isOwner && (
                            <div className='flex gap-3 mt-4'>
                                <button className='flex-1 h-[44px] border border-primary bg-surface-primary-16 text-primary rounded-lg typo-body_lr'>
                                    Send Message
                                </button>
                                <button className='flex-1 h-[44px] border border-border_gray text-text_four rounded-lg typo-body_lr'>
                                    View Profile
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Safety Tips */}
                    <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                        <div className='flex gap-2'>
                            <div className='w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0'>
                                ✓
                            </div>
                            <div>
                                <div className='typo-body_lm text-text_one mb-2'>Safety Tips</div>
                                <ul className='typo-body_sr text-text_four space-y-1 list-disc list-inside'>
                                    <li>Only transact through Flipit</li>
                                    <li>Inspect items before confirming delivery</li>
                                    <li>Report suspicious activity</li>
                                    <li>Keep communication on platform</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Auction Modal */}
            {showCancelModal && (
                <ConfirmationModal
                    title='Cancel Auction'
                    message='Are you sure you want to cancel this auction? All bidders will be notified and this action cannot be undone.'
                    confirmText='Yes, Cancel Auction'
                    cancelText='Keep Auction'
                    onConfirm={handleCancelAuction}
                    onCancel={() => setShowCancelModal(false)}
                    isDestructive
                />
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
                        <Success
                            onClose={() => setShowSuccessModal(false)}
                            message={successMessage}
                        />
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
                        <Error
                            onClose={() => setShowErrorModal(false)}
                            message={errorMessage}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageAuctionDetail;
