import Image from 'next/image';
import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import {formatToNaira} from '~/utils/helpers';
import UsedBadge from '../badges/UsedBadge';
import AuctionCountdown from '../badges/AuctionCountdown';
import {Item} from '~/utils/interface';

interface ItemCardProps {
    item: Item;
    forEdit?: boolean;
    forLiveAuction?: boolean;
    className?: string;
    imageClassName?: string;
    contentClassName?: string;
    showSaveButton?: boolean;
    showPromotedBadge?: boolean;
    showVerifiedBadge?: boolean;
    showAuctionBadge?: boolean;
    auctionBidCount?: number;
    customFooter?: React.ReactNode;
}

const ItemCard: React.FC<ItemCardProps> = memo(({
    item,
    forEdit = false,
    forLiveAuction = false,
    className = 'h-[400px] w-full xs:h-[260px] border border-border_gray rounded-md',
    imageClassName = 'h-[302px] w-full xs:h-[128px] cursor-pointer',
    contentClassName = 'p-4 xs:p-3 h-[98px] xs:h-[132px]',
    showSaveButton = true,
    showPromotedBadge = true,
    showVerifiedBadge = true,
    showAuctionBadge = false,
    auctionBidCount = 0,
    customFooter
}: ItemCardProps) => {
    const url = useMemo(() => item.imageUrls?.[0] || '/camera.png', [item.imageUrls]);

    const href = useMemo(() => {
        if (forEdit) return `/edit-item/${item.id}`;
        if (forLiveAuction) return `/live-auction/${item.auctionId || item.id}`;
        return `/home/${item.id}`;
    }, [forEdit, forLiveAuction, item.id, item.auctionId]);

    return (
        <Link href={href} className={className}>
            <div className='relative h-[302px] w-full'>
                <Image className={imageClassName} src={url} alt='item image' height={302} width={349} unoptimized />

                {/* Save button */}
                {showSaveButton && (
                    <div className='absolute bottom-3 right-3'>
                        <Image
                            className='h-[46px] w-[43px] cursor-pointer'
                            src={'/save-item.svg'}
                            alt='save item'
                            height={46}
                            width={43}
                        />
                    </div>
                )}

                {/* Promoted badge */}
                {showPromotedBadge && (
                    <div className='w-[76px] h-[26px] typo-body_sr text-white bg-primary absolute bottom-5 left-3 flex items-center justify-center rounded'>
                        Promoted
                    </div>
                )}

                {/* Verified ID badge */}
                {showVerifiedBadge && (
                    <div className='h-[26px] px-[6px] typo-body_sr text-primary bg-white absolute top-4 left-3 flex items-center justify-center gap-1 rounded'>
                        <Image className='h-4 w-4' src={'/verified.svg'} alt='verified' height={16} width={16} />
                        <div>Verified ID</div>
                    </div>
                )}

                {/* Auction badge */}
                {showAuctionBadge && (
                    <div className='h-[44px] w-[88px] typo-body_ls rounded-[35px] text-primary bg-white absolute top-4 right-3 flex items-center justify-center gap-2'>
                        <Image className='h-5 w-5' src={'/gavel.svg'} alt='auction' height={20} width={20} />
                        <div className='text-primary'>{item.biddingsCount ?? auctionBidCount}</div>
                    </div>
                )}
            </div>

            <div className={contentClassName}>
                <p className='typo-body_mr xs:typo-body_sr xs:mb-2 capitalize'>{item.title}</p>

                {forLiveAuction ? (
                    <div className='flex justify-between'>
                        {/* Current bid section - positioned like original cash amount */}
                        <div className=''>
                            <p className='text-[12px] text-[#999999] mt-1'>Current bid</p>
                            <p className='typo-body_lm xs:typo-body_mm xs:mb-1'>
                                {formatToNaira(item.currentBid || item.startingBid || item.cashAmount)}
                            </p>
                        </div>

                        {/* Countdown positioned where UsedBadge was */}
                        <div className='mt-auto rounded'>
                            {item.endDate ? (
                                <AuctionCountdown 
                                    endTime={item.endDate} 
                                    startTime={item.startDate}
                                />
                            ) : (
                                <span className='flex items-center px-2 h-[26px] w-max xs:h-[18px] typo-body_sr bg-[#D4E4E7] text-primary capitalize'>
                                    Live auction
                                </span>
                            )}
                            {customFooter}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Regular item display */}
                        <p className='typo-body_lm xs:typo-body_mm xs:mb-1'>{formatToNaira(item.cashAmount)}</p>
                        <div className='flex xs:flex-col justify-between items-center xs:items-start rounded'>
                            <p className='typo-body_sr xs:text-[11px] xs:mb-1 capitalize'>
                                {item.acceptCash ? 'cash' : 'item'} offers
                            </p>
                            {customFooter || <UsedBadge text={item.condition} />}
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
});

ItemCard.displayName = 'ItemCard';

export default ItemCard;
