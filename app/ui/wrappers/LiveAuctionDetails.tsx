'use client';
import Image from 'next/image';
import React, {useState} from 'react';
import {formatToNaira} from '~/utils/helpers';
import {Item} from '~/utils/interface';
import ImageGallery from '../common/image-gallery/ImageGallery';
import CountdownTimer from '../common/countdown-timer/CountdownTimer';
import BidHistory from '../common/bid-history/BidHistory';
import RegularButton from '../common/buttons/RegularButton';
import PopupSheet from '../common/popup-sheet/PopupSheet';
import ConfirmBid from '../live-auction/confirm-bid';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';

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
    const {setShowPopup} = useAppContext();

    // Mock data for demonstration
    const mockEndTime = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000 + 3 * 60 * 1000 + 59 * 1000);
    const mockCurrentBid = 1300000;
    const mockBids = [
        {bidderName: 'Bidder 3054', timeAgo: '3h ago', amount: 1300000},
        {bidderName: 'Bidder 2890', timeAgo: '5h ago', amount: 1250000},
        {bidderName: 'Bidder 1567', timeAgo: '1 day ago', amount: 1200000}
        // {bidderName: 'Bidder 4521', timeAgo: '1 day ago', amount: 1150000},
        // {bidderName: 'Bidder 7834', timeAgo: '2 days ago', amount: 1100000}
    ];

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

    const handleBidSubmit = () => {
        if (!bidAmount) return;
        pushParam('confirm-bid');
    };

    const handleConfirmBid = () => {
        setPlacingBid(true);
        // Simulate bid placement
        setTimeout(() => {
            setPlacingBid(false);
            setBidAmount('');
            removeParam();
        }, 1500);
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    return (
        <div className='grid-sizes grid grid-cols-[712px_1fr] xs:grid-cols-1 gap-6 h-full mt-10 xs:mb-6'>
            <div className='p-6 xs:p-0 shadow-[0px_4px_10px_rgba(0,0,0,0.2)]'>
                <ImageGallery
                    mainImage={{
                        src: '/camera-large.png',
                        alt: 'picture',
                        width: 516,
                        height: 400
                    }}
                    thumbnails={[
                        {src: '/camera-large.png', alt: 'picture', width: 172, height: 117},
                        {src: '/camera-large.png', alt: 'picture', width: 172, height: 117},
                        {src: '/camera-large.png', alt: 'picture', width: 172, height: 117}
                    ]}
                    thumbnailPosition='left'
                    overlayElements={
                        <>
                            <div className='w-[76px] h-[26px] typo-body_sb text-white bg-primary absolute top-7 left-3 flex items-center justify-center rounded'>
                                Live
                            </div>
                            <div className='h-[44px] w-[88px] typo-body_ls rounded-[35px] text-primary bg-white absolute top-4 right-3 flex items-center justify-center gap-2'>
                                <Image className='h-5 w-5' src={'/gavel.svg'} alt='auction' height={20} width={20} />
                                <div className='text-primary'>{mockBids.length}</div>
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
                                <td>Camera</td>
                            </tr>
                            <tr>
                                <td className='pr-8 py-1'>Brand</td>
                                <td>Canon</td>
                            </tr>
                            <tr>
                                <td className='pr-8 py-1'>Condition</td>
                                <td>Fairly used</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='p-6 xs:p-0 shadow-[0px_4px_10px_rgba(0,0,0,0.2)]'>
                <CountdownTimer endTime={mockEndTime} className='mb-4 w-[212px] h-[44px]' />

                <div className='border-b border-border_gray mb-4'></div>

                <div className='typo-heading_ms xs:typo-heading_ss text-text_one mb-4 capitalize'>
                    {item?.title || 'Canon EOS RP Camera +Small Rig'}
                </div>

                <div className='mb-2'>
                    <p className='typo-body_mr text-text_four'>Current Bid</p>
                    <p className='typo-heading_sm text-primary xs:typo-body_mm'>{formatCurrency(mockCurrentBid)}</p>
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
                        <div className='flex'>
                            {Array.from('11111').map((_, i) => (
                                <Image
                                    key={i}
                                    src={'/full-star.svg'}
                                    height={16}
                                    width={16}
                                    alt='star'
                                    className='h-[16px] w-[16px]'
                                />
                            ))}
                        </div>
                        <span className='typo-body_mr text-text_four'>15 reviews</span>
                    </div>
                </div>

                <div className='mb-4'>
                    <p className='typo-body_mr text-text_four'>Location</p>
                    <p className='typo-body_mr text-text_one'>{item?.location || 'Lagos, Nigeria'}</p>
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
                    />
                </div>

                <div className='border-b border-border_gray mb-4'></div>

                <BidHistory bids={mockBids} totalBids={16} bidderCount={12} itemId={item?.id?.toString()} />
            </div>
            
            <PopupSheet>
                <ConfirmBid
                    item={item}
                    bidAmount={bidAmount}
                    currentBid={mockCurrentBid}
                    endTime={mockEndTime}
                    onClose={removeParam}
                    onConfirm={handleConfirmBid}
                    isLoading={placingBid}
                />
            </PopupSheet>
        </div>
    );
};

export default LiveAuctionDetails;
