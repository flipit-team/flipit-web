'use client';
import Image from 'next/image';
import React, {useState} from 'react';
import {Item} from '~/utils/interface';
import ImageGallery from '../common/image-gallery/ImageGallery';
import CountdownTimer from '../common/countdown-timer/CountdownTimer';
import BidHistory from '../common/bid-history/BidHistory';
import RegularButton from '../common/buttons/RegularButton';
import PopupSheet from '../common/popup-sheet/PopupSheet';
import ConfirmBid from '../live-auction/confirm-bid';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';
import {BiddingService} from '~/services/bidding.service';
import {useAuth} from '~/hooks/useAuth';
import Success from '../common/modals/Success';
import StarRating from '../common/star-rating/StarRating';
import {useToast} from '~/contexts/ToastContext';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {timeAgo} from '~/utils/helpers';

interface Props {
    item: Item;
}

const LiveAuctionDetails = (props: Props) => {
    const {item} = props;
    const [bidAmount, setBidAmount] = useState('');
    const [placingBid, setPlacingBid] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {setShowPopup, user: contextUser} = useAppContext();
    const {user} = useAuth();
    const {showError} = useToast();
    const [expandedSection, setExpandedSection] = useState<string | null>(null);


    // Use real auction data from item
    const endTime = item.endDate ? new Date(item.endDate) : new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const startTime = item.startDate ? new Date(item.startDate) : null;
    const currentBid = item.currentBid || item.startingBid || 0;
    const auctionBidCount = item.biddingsCount || 0;
    
    // Transform real bidding data for BidHistory component
    const formatTimeAgo = (bidTime: string) => {
        const now = new Date();
        const bidDate = new Date(bidTime);
        const diffInHours = Math.floor((now.getTime() - bidDate.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    const realBids = item.biddings ? item.biddings.map(bid => ({
        bidderName: `${bid.bidder.firstName} ${bid.bidder.lastName.charAt(0)}.`, // Privacy protection
        timeAgo: formatTimeAgo(bid.bidTime),
        amount: bid.amount
    })).sort((a, b) => b.amount - a.amount) : []; // Sort by amount descending

    // Get unique bidder count
    const uniqueBidders = item.biddings ? 
        new Set(item.biddings.map(bid => bid.bidder.id)).size : 0;

    const pushParam = (param: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('q', param);
        router.replace(`${pathname}?${params.toString()}`);
        setShowPopup(true);
    };

    const removeParam = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        setShowPopup(false);

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
        router.refresh();
    };

    const handleSuccessClose = () => {
        removeParam();
        router.push('/live-auction');
    };

    const handleBidSubmit = () => {
        if (!bidAmount) return;
        pushParam('confirm-bid');
    };

    const handleConfirmBid = async () => {
        if (!bidAmount) {
            return;
        }
        if (!item.auctionId) {
            return;
        }
        // Check if user is authenticated - use contextUser as fallback
        const authenticatedUser = user || contextUser;
        
        if (!authenticatedUser) {
            showError('Please sign in to place a bid.');
            setPlacingBid(false);
            return;
        }

        // Check if auction is in a biddable state
        if (item.auctionStatus !== 'ACTIVE') {
            let message = 'This auction is not currently accepting bids.';
            
            if (item.auctionStatus === 'CREATED') {
                message = 'This auction has not started yet. Bidding will be available once the auction goes live.';
            } else if (item.auctionStatus === 'ENDED') {
                message = 'This auction has ended. Bidding is no longer available.';
            } else if (item.auctionStatus === 'PAUSED') {
                message = 'This auction is currently paused. Please try again later.';
            }
            
            showError(message);
            setPlacingBid(false);
            return;
        }
        
        // Get user ID from either source
        const actualUserId = (authenticatedUser as any).id || parseInt((authenticatedUser as any).userId || '0');

        setPlacingBid(true);
        
        try {
            const result = await BiddingService.placeBid({
                auctionId: item.auctionId,
                amount: parseFloat(bidAmount)
            });

            if (result.data) {
                // Show success modal and navigate to auctions page
                removeParam();
                pushParam('bid-success');
            } else {
                // Check if it's a specific error type
                if ((result.error as any)?.status === 401 || result.error?.message?.includes('Authentication required')) {
                    showError('Please log in to place a bid.');
                } else if (result.error?.message?.includes('Auction is not active')) {
                    showError('This auction is not currently accepting bids. Please check the auction status.');
                } else {
                    showError(result.error);
                }
            }
        } catch (error) {
            // Check if it's an authentication error
            if (error instanceof Error && (error.message?.includes('Authentication required') || error.message?.includes('401'))) {
                showError('Please log in to place a bid.');
            } else {
                showError(error);
            }
        } finally {
            setPlacingBid(false);
            setBidAmount('');
        }
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    // TODO: Implement auction win flow
    // When the countdown timer ends and the user is the winning bidder,
    // this function should redirect them to the transaction page
    const handleAuctionEnd = () => {
        // Check if current user is the winning bidder
        // If so, redirect to: router.push(`/transaction/1?type=auction&auctionId=${item.auctionId}`);
        // Backend should handle creating the transaction when auction ends
        // TODO: Check if current user is winning bidder and redirect to transaction flow
    };

    return (
        <>
        {/* Mobile header */}
        <div className='hidden xs:flex items-center gap-3 px-4 pt-4 mb-2'>
            <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
                <ChevronLeft size={20} />
            </button>
            <h1 className='font-poppins typo-heading-md-semibold text-text_one'>Auction Details</h1>
        </div>

        <div className='grid-sizes grid grid-cols-[2fr_1fr] xs:grid-cols-1 gap-6 h-full mt-10 xs:mt-0 xs:mb-6 xs:pb-24'>
            <div className='p-6 xs:p-0 shadow-lg xs:shadow-none'>
                <ImageGallery
                    images={item?.imageUrls || []}
                    overlayElements={
                        <>
                            <div className='w-[76px] h-[26px] typo-body_sb text-white bg-primary absolute top-7 left-3 flex items-center justify-center rounded'>
                                Live
                            </div>
                            <div className='h-[44px] w-[88px] typo-body_ls rounded-[35px] text-primary bg-white absolute top-4 right-3 flex items-center justify-center gap-2'>
                                <Image className='h-5 w-5' src={'/icons/action/gavel.svg'} alt='auction' height={20} width={20} />
                                <div className='text-primary'>{auctionBidCount}</div>
                            </div>
                        </>
                    }
                />
                <div className='flex items-center justify-between mt-4 xs:px-4'>
                    <div className='flex items-center gap-1'>
                        <Image src={'/icons/ui/eye.svg'} height={22} width={22} alt='views' className='h-[22px] w-[22px]' />
                        <p className='typo-body_mr text-text_four'>{item.biddingsCount || 0} bids</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <p className='typo-body_mr text-text_one'>Share with friends</p>
                        <div className='flex items-center gap-3'>
                            <Image
                                src={'/icons/social/facebook.svg'}
                                height={24}
                                width={24}
                                alt='facebook'
                                className='h-[24px] w-[24px] cursor-pointer'
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                            />
                            <Image
                                src={'/icons/social/whatsapp.svg'}
                                height={24}
                                width={24}
                                alt='whatsapp'
                                className='h-[24px] w-[24px] cursor-pointer'
                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent((item?.title || '') + ' ' + window.location.href)}`, '_blank')}
                            />
                            <Image
                                src={'/icons/social/x.svg'}
                                height={24}
                                width={24}
                                alt='twitter'
                                className='h-[24px] w-[24px] cursor-pointer'
                                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(item?.title || '')}`, '_blank')}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile: Title + current bid below image */}
                <div className='hidden xs:block px-4 mt-4'>
                    <h2 className='font-poppins font-semibold text-[20px] text-text_one capitalize'>{item?.title}</h2>
                    <p className='typo-heading_sm text-primary mt-1'>{formatCurrency(currentBid)}</p>
                    <p className='font-poppins typo-body-xs-regular text-text_four mt-1'>{timeAgo(item?.dateCreated)}</p>
                </div>

                {/* Desktop: Details section */}
                <div className='mt-6 mb-4 xs:hidden'>
                    <div className='typo-body_lm text-text_one'>Details</div>
                    <p className='typo-body_mr text-text_one mt-2'>{item?.description}</p>
                </div>

                {/* Desktop: Specifications section */}
                <div className='xs:hidden'>
                    <div className='typo-body_lm'>Specifications</div>
                    <table className='w-full mt-2 typo-body_sr'>
                        <tbody>
                            <tr>
                                <td className='pr-8 py-1'>Type</td>
                                <td>{item?.itemCategory?.name}</td>
                            </tr>
                            <tr>
                                <td className='pr-8 py-1'>Brand</td>
                                <td>{item.brand}</td>
                            </tr>
                            <tr>
                                <td className='pr-8 py-1'>Condition</td>
                                <td>{item.condition}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Mobile: Collapsible sections */}
                <div className='hidden xs:flex flex-col gap-2 px-4 mt-4'>
                    <button
                        onClick={() => setExpandedSection(expandedSection === 'description' ? null : 'description')}
                        className='w-full flex items-center justify-between bg-surface-primary rounded-lg px-4 py-3'
                    >
                        <span className='font-poppins typo-body-md-medium text-text_one'>Description</span>
                        <ChevronRight size={18} className={`text-primary transition-transform ${expandedSection === 'description' ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedSection === 'description' && (
                        <div className='px-4 pb-3'>
                            <p className='typo-body_mr text-text_one'>{item?.description}</p>
                        </div>
                    )}

                    <button
                        onClick={() => setExpandedSection(expandedSection === 'specification' ? null : 'specification')}
                        className='w-full flex items-center justify-between bg-surface-primary rounded-lg px-4 py-3'
                    >
                        <span className='font-poppins typo-body-md-medium text-text_one'>Specification</span>
                        <ChevronRight size={18} className={`text-primary transition-transform ${expandedSection === 'specification' ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedSection === 'specification' && (
                        <div className='px-4 pb-3'>
                            <table className='w-full typo-body_sr'>
                                <tbody>
                                    <tr><td className='pr-8 py-1'>Type</td><td>{item?.itemCategory?.name}</td></tr>
                                    <tr><td className='pr-8 py-1'>Brand</td><td>{item.brand}</td></tr>
                                    <tr><td className='pr-8 py-1'>Condition</td><td>{item.condition}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button
                        onClick={() => setExpandedSection(expandedSection === 'seller' ? null : 'seller')}
                        className='w-full flex items-center justify-between bg-surface-primary rounded-lg px-4 py-3'
                    >
                        <span className='font-poppins typo-body-md-medium text-text_one'>Seller Information</span>
                        <ChevronRight size={18} className={`text-primary transition-transform ${expandedSection === 'seller' ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedSection === 'seller' && (
                        <div className='px-4 pb-3'>
                            <div className='flex mb-3'>
                                <Image
                                    src={item?.seller?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                    height={44}
                                    width={44}
                                    sizes="44px"
                                    quality={70}
                                    alt={`${item?.seller.firstName} ${item?.seller.lastName}`}
                                    className='h-[44px] w-[44px] rounded-full object-cover'
                                />
                                <div className='ml-2'>
                                    <div className='typo-body_lm'>{item?.seller.firstName + ' ' + item?.seller.lastName}</div>
                                    <div className='flex items-center gap-1'>
                                        <StarRating rating={item?.seller.avgRating || item?.seller.avg_rating || 0} size={16} />
                                        <span className='typo-body_sr text-text_four'>{item?.seller.reviewCount || 0} reviews</span>
                                    </div>
                                    <p className='typo-body_sr text-text_four'>{item?.location}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='p-6 xs:hidden shadow-lg'>
                <CountdownTimer
                    endTime={endTime}
                    startTime={startTime || undefined}
                    variant='auction-details'
                    className='mb-4 w-max h-[44px]'
                    onComplete={handleAuctionEnd}
                />

                <div className='border-b border-border_gray mb-4'></div>

                <div className='typo-heading_ms xs:typo-heading_ss text-text_one mb-4 capitalize'>
                    {item?.title || 'Canon EOS RP Camera +Small Rig'}
                </div>

                <div className='mb-2'>
                    <p className='typo-body_mr text-text_four'>Current Bid</p>
                    <p className='typo-heading_sm text-primary xs:typo-body_mm'>{formatCurrency(currentBid)}</p>
                </div>

                <div className='flex items-center gap-3 mb-4'>
                    <Image
                        src={item?.seller?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                        height={32}
                        width={32}
                        alt={`${item?.seller.firstName} ${item?.seller.lastName}`}
                        className='h-[32px] w-[32px] rounded-full object-cover'
                    />
                    <div className='flex items-center gap-2'>
                        <span className='typo-body_mr text-text_one'>
                            {item?.seller.firstName + ' ' + item?.seller.lastName}
                        </span>
                        <StarRating 
                            rating={item?.seller.avgRating || item?.seller.avg_rating || 0}
                            size={16}
                        />
                        <span className='typo-body_mr text-text_four'>
                            {item?.seller.reviewCount || 0} reviews
                        </span>
                    </div>
                </div>

                <div className='mb-4'>
                    <p className='typo-body_mr text-text_four'>Location</p>
                    <p className='typo-body_mr text-text_one'>{item?.location}</p>
                </div>

                <div className='mb-4'>
                    <input
                        type='number'
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder='Enter Bid Amount'
                        className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none typo-body_mr'
                    />
                </div>

                <div className='mb-6'>
                    <RegularButton
                        text='Place Bid'
                        action={handleBidSubmit}
                        disabled={!bidAmount}
                        isLoading={placingBid}
                    />
                </div>

                <div className='border-b border-border_gray mb-4'></div>

                <BidHistory 
                    bids={realBids} 
                    totalBids={auctionBidCount} 
                    bidderCount={uniqueBidders} 
                    itemId={item?.id?.toString()} 
                />
            </div>

            {/* Mobile: Auction info (countdown + bid input) */}
            <div className='hidden xs:block px-4 mt-4'>
                <CountdownTimer
                    endTime={endTime}
                    startTime={startTime || undefined}
                    variant='auction-details'
                    className='mb-4 w-max h-[44px]'
                    onComplete={handleAuctionEnd}
                />
                <div className='flex items-center gap-3 mb-4'>
                    <Image
                        src={item?.seller?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                        height={32}
                        width={32}
                        alt={`${item?.seller.firstName} ${item?.seller.lastName}`}
                        className='h-[32px] w-[32px] rounded-full object-cover'
                    />
                    <div className='flex items-center gap-2 flex-wrap'>
                        <span className='typo-body_mr text-text_one'>
                            {item?.seller.firstName + ' ' + item?.seller.lastName}
                        </span>
                        <StarRating rating={item?.seller.avgRating || item?.seller.avg_rating || 0} size={16} />
                    </div>
                </div>
                <div className='mb-4'>
                    <input
                        type='number'
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder='Enter Bid Amount'
                        className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none typo-body_mr'
                    />
                </div>
            </div>

            <PopupSheet>
                {searchParams.get('q') === 'confirm-bid' && (
                    <ConfirmBid
                        item={item}
                        bidAmount={bidAmount}
                        currentBid={currentBid}
                        endTime={endTime}
                        onClose={removeParam}
                        onConfirm={handleConfirmBid}
                        isLoading={placingBid}
                    />
                )}
                {searchParams.get('q') === 'bid-success' && (
                    <Success
                        message='Your bid has been placed successfully! You will be notified if you win.'
                        onClose={handleSuccessClose}
                    />
                )}
            </PopupSheet>

            {/* Mobile fixed bottom action bar */}
            <div className='hidden xs:flex fixed bottom-0 left-0 right-0 bg-white border-t border-border-DEFAULT px-4 py-3 z-popover gap-3'>
                <button
                    onClick={handleBidSubmit}
                    disabled={!bidAmount || placingBid}
                    className='flex-1 h-12 bg-primary text-white rounded-full font-poppins typo-body-md-medium disabled:opacity-50'
                >
                    Place Bid
                </button>
            </div>
        </div>
        </>
    );
};

export default LiveAuctionDetails;
