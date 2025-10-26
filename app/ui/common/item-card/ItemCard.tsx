import Image from 'next/image';
import React, {memo, useMemo, useCallback, useState} from 'react';
import Link from 'next/link';
import {formatToNaira} from '~/utils/helpers';
import UsedBadge from '../badges/UsedBadge';
import AuctionCountdown from '../badges/AuctionCountdown';
import {Item} from '~/utils/interface';
import {useItemLike} from '~/hooks/useLikes';
import RemoveItemConfirmation from '../modals/RemoveItemConfirmation';
import {useAppContext} from '~/contexts/AppContext';

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
    priority?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = memo(
    ({
        item,
        forEdit = false,
        forLiveAuction = false,
        className = 'h-[400px] w-full xs:h-[280px] border border-border_gray rounded-md xs:border-none xs:rounded-lg xs:overflow-hidden',
        imageClassName = 'h-[302px] w-full xs:h-[180px] cursor-pointer xs:object-cover',
        contentClassName = 'p-4 xs:p-3 h-[98px] xs:h-[100px] xs:flex xs:flex-col xs:justify-between',
        showSaveButton = true,
        showPromotedBadge = true,
        showVerifiedBadge = true,
        showAuctionBadge = false,
        auctionBidCount = 0,
        customFooter,
        priority = false
    }: ItemCardProps) => {
        const {user} = useAppContext();
        const url = useMemo(() => item.imageUrls?.[0] || 'https://images.pexels.com/photos/1303084/pexels-photo-1303084.jpeg', [item.imageUrls]);

        // Like functionality
        const {isLiked, toggleLike, loading} = useItemLike(item.id);

        // Modal state for unlike confirmation
        const [showUnlikeModal, setShowUnlikeModal] = useState(false);

        const href = useMemo(() => {
            if (forEdit) return `/edit-item/${item.id}`;
            if (forLiveAuction) return `/live-auction/${item.auctionId || item.id}`;

            // Check if this item belongs to the current user
            const isOwnItem = user?.userId && item.seller?.id?.toString() === user.userId;
            if (isOwnItem) return `/manage-item/${item.id}`;

            return `/${item.id}`;
        }, [forEdit, forLiveAuction, item.id, item.auctionId, item.seller?.id, user?.userId]);

        const handleLikeClick = useCallback(
            async (e: React.MouseEvent) => {
                e.preventDefault(); // Prevent navigation
                e.stopPropagation(); // Stop event bubbling

                if (!loading) {
                    if (isLiked) {
                        // If item is liked, show confirmation modal instead of immediately unliking
                        setShowUnlikeModal(true);
                    } else {
                        // If item is not liked, like it directly
                        try {
                            await toggleLike();
                        } catch (error) {
                            console.error('Failed to like item:', error);
                        }
                    }
                }
            },
            [isLiked, toggleLike, loading]
        );

        const handleConfirmUnlike = useCallback(async () => {
            setShowUnlikeModal(false);
            try {
                await toggleLike();
            } catch (error) {
                console.error('Failed to unlike item:', error);
            }
        }, [toggleLike]);

        return (
            <>
                <Link href={href} className={className}>
                    <div className='relative h-[302px] w-full xs:h-max xs:bg-gray-100'>
                        <Image
                            className={imageClassName}
                            src={url}
                            alt='item image'
                            height={302}
                            width={349}
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            placeholder='blur'
                            blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ5IiBoZWlnaHQ9IjMwMiIgdmlld0JveD0iMCAwIDM0OSAzMDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNDkiIGhlaWdodD0iMzAyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzQuNSAxNTFMMTQ5IDE3NkwyMDAgMTc2TDE3NC41IDE1MVoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTE3NC41IDE1MUwxMjMuNSAxMjZMMjI1LjUgMTI2TDE3NC41IDE1MVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+'
                            {...(priority ? {priority: true} : {loading: 'lazy' as const})}
                        />

                        {/* Save/Like button */}
                        {showSaveButton && (
                            <div className='absolute bottom-3 right-3 xs:bottom-2 xs:right-2'>
                                <button
                                    onClick={handleLikeClick}
                                    disabled={loading}
                                    className={`h-[46px] w-[43px] xs:h-[36px] xs:w-[36px] xs:bg-white/95 xs:backdrop-blur-sm xs:rounded-full xs:shadow-lg xs:flex xs:items-center xs:justify-center cursor-pointer transition-opacity duration-200 ${
                                        loading
                                            ? 'opacity-50'
                                            : 'hover:opacity-80 xs:hover:bg-white xs:hover:scale-105 xs:active:scale-95'
                                    }`}
                                    title={isLiked ? 'Remove from saved items' : 'Save item'}
                                >
                                    <Image
                                        src={isLiked ? '/liked.svg' : '/save-item.svg'}
                                        alt={isLiked ? 'liked item' : 'save item'}
                                        height={46}
                                        width={43}
                                        className='w-full h-full xs:h-5 xs:w-5'
                                    />
                                </button>
                            </div>
                        )}

                        {/* Promoted badge */}
                        {showPromotedBadge && item.promoted && (
                            <div className='w-[76px] h-[26px] xs:h-[22px] xs:px-2 typo-body_sr xs:typo-caption text-white bg-primary absolute bottom-5 left-3 xs:bottom-2 xs:left-2 xs:bg-primary/90 xs:backdrop-blur-sm flex items-center justify-center rounded xs:rounded-md xs:shadow-sm'>
                                Promoted
                            </div>
                        )}

                        {/* Verified ID badge */}
                        {showVerifiedBadge && item.seller.idVerified && (
                            <div className='h-[26px] px-[6px] xs:h-[22px] xs:px-1 typo-body_sr xs:typo-caption text-primary bg-white absolute top-4 left-3 xs:top-2 xs:left-2 xs:bg-white/95 xs:backdrop-blur-sm flex items-center justify-center gap-1 rounded xs:rounded-md xs:shadow-sm'>
                                <Image
                                    className='h-4 w-4 xs:h-3 xs:w-3'
                                    src={'/verified.svg'}
                                    alt='verified'
                                    height={16}
                                    width={16}
                                />
                                <div className='xs:hidden'>Verified ID</div>
                            </div>
                        )}

                        {/* Auction badge */}
                        {showAuctionBadge && (
                            <div className='h-[44px] w-[88px] xs:h-[30px] xs:px-2 typo-body_ls xs:typo-caption rounded-[35px] xs:rounded-full text-primary bg-white absolute top-4 right-3 xs:top-2 xs:right-2 xs:bg-white/95 xs:backdrop-blur-sm flex items-center justify-center gap-2 xs:shadow-sm'>
                                <Image
                                    className='h-5 w-5 xs:h-3 xs:w-3'
                                    src={'/gavel.svg'}
                                    alt='auction'
                                    height={20}
                                    width={20}
                                />
                                <div className='text-primary'>{item.biddingsCount ?? auctionBidCount}</div>
                            </div>
                        )}
                    </div>

                    <div className={contentClassName}>
                        {forLiveAuction ? (
                            <p className='typo-body_mr xs:typo-body_sr xs:mb-0 xs:font-medium xs:text-gray-900 capitalize xs:line-clamp-2 xs:leading-tight'>
                                {item.title}
                            </p>
                        ) : (
                            <p className='typo-body_mr xs:typo-body_sr xs:mb-1 xs:font-medium xs:text-gray-900 capitalize xs:line-clamp-2 xs:leading-tight'>
                                {item.title}
                            </p>
                        )}

                        {forLiveAuction ? (
                            <div className='flex justify-between items-end'>
                                <div className=''>
                                    <p className='typo-body-sm-regular text-text_four'>Current bid</p>
                                    <p className='typo-body_lm xs:typo-body_mm'>
                                        {formatToNaira(item.currentBid || item.startingBid || item.cashAmount)}
                                    </p>
                                </div>

                                <div className='xs:flex-shrink-0 flex items-end pb-1 xs:pb-0'>
                                    {item.endDate ? (
                                        <AuctionCountdown
                                            endTime={item.endDate}
                                            startTime={item.startDate}
                                            className='xs:text-xs xs:px-1.5 xs:h-[16px]'
                                        />
                                    ) : (
                                        <span className='flex items-center px-2 h-[26px] w-max xs:h-[16px] xs:px-1.5 xs:text-xs typo-body_sr bg-surface-light text-primary capitalize'>
                                            Live auction
                                        </span>
                                    )}
                                    {customFooter}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Regular item display */}
                                <p className='typo-body_lm xs:typo-body_sm xs:font-semibold xs:text-gray-900 xs:mb-1'>
                                    {formatToNaira(item.cashAmount)}
                                </p>
                                <div className='flex justify-between items-center xs:items-center rounded'>
                                    <p className='typo-body_sr xs:typo-caption xs:text-gray-500 capitalize'>
                                        {item.acceptCash ? 'cash' : 'item'} offers
                                    </p>
                                    <div className='xs:flex-shrink-0'>
                                        {customFooter || <UsedBadge text={item.condition} />}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Link>

                {/* Unlike confirmation modal - Outside Link to prevent navigation */}
                <RemoveItemConfirmation
                    item={item}
                    isOpen={showUnlikeModal}
                    onClose={() => setShowUnlikeModal(false)}
                    onConfirm={handleConfirmUnlike}
                    isRemoving={loading}
                />
            </>
        );
    }
);

ItemCard.displayName = 'ItemCard';

export default ItemCard;
