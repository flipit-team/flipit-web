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
                bidderId: actualUserId,
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

    return (
        <div className='grid-sizes grid grid-cols-[712px_1fr] xs:grid-cols-1 gap-6 h-full mt-10 xs:mb-6'>
            <div className='p-6 xs:p-0 shadow-lg'>
                <ImageGallery
                    images={item?.imageUrls || ['/camera-large.png']}
                    overlayElements={
                        <>
                            <div className='w-[76px] h-[26px] typo-body_sb text-white bg-primary absolute top-7 left-3 flex items-center justify-center rounded'>
                                Live
                            </div>
                            <div className='h-[44px] w-[88px] typo-body_ls rounded-[35px] text-primary bg-white absolute top-4 right-3 flex items-center justify-center gap-2'>
                                <Image className='h-5 w-5' src={'/gavel.svg'} alt='auction' height={20} width={20} />
                                <div className='text-primary'>{auctionBidCount}</div>
                            </div>
                        </>
                    }
                />
                <div className='flex items-center justify-between mt-4'>
                    <div className='flex items-center gap-1'>
                        <Image src={'/eye.svg'} height={22} width={22} alt='views' className='h-[22px] w-[22px]' />
                        <p className='typo-body_mr text-text_four'>250 views</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <p className='typo-body_mr text-text_one'>Share with friends</p>
                        <div className='flex items-center gap-3'>
                            <Image
                                src={'/facebook.svg'}
                                height={24}
                                width={24}
                                alt='facebook'
                                className='h-[24px] w-[24px] cursor-pointer'
                            />
                            <Image
                                src={'/whatsapp.svg'}
                                height={24}
                                width={24}
                                alt='whatsapp'
                                className='h-[24px] w-[24px] cursor-pointer'
                            />
                            <Image
                                src={'/x.svg'}
                                height={24}
                                width={24}
                                alt='twitter'
                                className='h-[24px] w-[24px] cursor-pointer'
                            />
                        </div>
                    </div>
                </div>
                <div className='mt-6 mb-4'>
                    <div className='typo-body_lm text-text_one'>Details</div>
                    <p className='typo-body_mr text-text_one mt-2'>{item?.description}</p>
                </div>

                <div>
                    <div className='typo-body_lm'>Specifications</div>
                    <table className='w-full mt-2 typo-body_sr'>
                        <tbody>
                            <tr>
                                <td className='pr-8 py-1'>Type</td>
                                <td>{item?.itemCategories[0].name}</td>
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
            </div>

            <div className='p-6 xs:p-0 shadow-lg'>
                <CountdownTimer 
                    endTime={endTime} 
                    startTime={startTime || undefined} 
                    variant='auction-details' 
                    className='mb-4 w-max h-[44px]' 
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
                        src={'/camera-large.png'}
                        height={32}
                        width={32}
                        alt='bidder'
                        className='h-[32px] w-[32px] rounded-full'
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
        </div>
    );
};

export default LiveAuctionDetails;
