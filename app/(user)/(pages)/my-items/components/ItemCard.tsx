'use client';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useState, useRef, useEffect} from 'react';
import {MyItem} from '../types';
import {ItemsService} from '~/services/items.service';
import {useToast} from '~/contexts/ToastContext';
import DeleteConfirmationModal from '~/ui/common/delete-confirmation-modal/DeleteConfirmationModal';
import TransactionTypeBadge from '~/ui/common/badges/TransactionTypeBadge';
import {MoreVertical} from 'lucide-react';

interface ItemCardProps {
    item: MyItem;
    onItemDeleted?: (itemId: number) => void;
    onItemUpdated?: (itemId: number) => void;
}

const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount);
};

// Countdown helper
function getCountdown(endDate?: string): string {
    if (!endDate) return '';
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return 'Ended';
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `Closes in ${d}d ${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export default function ItemCard({item, onItemDeleted, onItemUpdated}: ItemCardProps) {
    const router = useRouter();
    const {showSuccess, showError} = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isUpdatingAuction, setIsUpdatingAuction] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCardClick = () => {
        router.push(`/manage-item/${item.id}`);
    };

    const handleDeleteItem = () => {
        setShowDropdown(false);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await ItemsService.deleteItem(item.id);
            if (result.data) {
                showSuccess('Item deleted successfully!');
                onItemDeleted?.(item.id);
            } else {
                showError(result.error || 'Failed to delete item');
            }
        } catch {
            showError('An error occurred while deleting the item');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleToggleAuction = async () => {
        if (!item.isAuction) return;
        setShowDropdown(false);
        setIsUpdatingAuction(true);
        try {
            // TODO: Replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            showSuccess(`Auction ${item.auctionActive ? 'deactivated' : 'activated'} successfully!`);
            onItemUpdated?.(item.id);
        } catch {
            showError('Failed to update auction. Please try again.');
        } finally {
            setIsUpdatingAuction(false);
        }
    };

    // Determine auction state for display
    const isAuctionClosed = item.isAuction && !item.auctionActive;
    const isAuctionFailed = item.auctionStatus === 'closed_failed';
    const isAuctionSuccessful = item.auctionStatus === 'closed_successful';
    const isAuctionActive = item.auctionStatus === 'active';

    return (
        <div className='border border-[#E8E8E8] rounded-2xl flex xs:flex-col overflow-hidden'>
            {/* Image */}
            <div
                className='p-4 xs:p-3 flex-shrink-0 cursor-pointer'
                onClick={handleCardClick}
            >
                <Image
                    src={item.image}
                    alt={item.title}
                    width={140}
                    height={140}
                    className='rounded-xl object-cover w-[140px] h-[140px] xs:w-full xs:h-[180px]'
                />
            </div>

            {/* Content */}
            <div className='py-4 pr-4 xs:px-3 xs:pb-3 xs:pt-0 flex-1 flex flex-col justify-between min-w-0'>
                <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0 cursor-pointer' onClick={handleCardClick}>
                        <h3 className='font-poppins text-[14px] text-[#4D4D4D] leading-[1.4]'>
                            {item.title}
                        </h3>

                        {/* Auction items */}
                        {item.isAuction && (
                            <>
                                <p className='font-poppins font-bold text-[16px] text-text_one mt-1'>
                                    Current bid: {formatAmount(item.currentBid || item.amount)}
                                </p>
                                {item.type !== 'deactivated' && (
                                    <div className='flex items-center gap-2 mt-1'>
                                        {isAuctionClosed && (
                                            <>
                                                <span className='font-poppins text-[13px] text-[#FF674B]'>Auction Closed</span>
                                                <span className='text-[#A49E9E]'>|</span>
                                            </>
                                        )}
                                        {isAuctionActive && (
                                            <>
                                                <span className='font-poppins text-[13px] text-primary'>
                                                    {getCountdown(item.auctionEndDate)}
                                                </span>
                                                <span className='text-[#A49E9E]'>|</span>
                                            </>
                                        )}
                                        <span className='font-poppins text-[13px] text-[#4D4D4D]'>Views : {item.views}</span>
                                    </div>
                                )}
                                {item.type === 'deactivated' && (
                                    <p className='font-poppins text-[13px] text-[#4D4D4D] mt-1'>Views : {item.views}</p>
                                )}
                                {isAuctionFailed && (
                                    <span className='inline-block mt-2 px-3 py-0.5 bg-[#FF674B]/10 text-[#FF674B] rounded font-poppins text-[12px] font-medium border border-[#FF674B]/20'>
                                        Failed
                                    </span>
                                )}
                                {isAuctionSuccessful && (
                                    <span className='inline-block mt-2 px-3 py-0.5 bg-[#08973F]/10 text-[#08973F] rounded font-poppins text-[12px] font-medium border border-[#08973F]/20'>
                                        Successful
                                    </span>
                                )}
                            </>
                        )}

                        {/* Listed / Deactivated items */}
                        {!item.isAuction && (
                            <>
                                {(item.tradeType === 'cash' || item.tradeType === 'mixed') && item.amount > 0 && (
                                    <p className='font-poppins font-bold text-[16px] text-text_one mt-1'>
                                        Price: {formatAmount(item.amount)}
                                    </p>
                                )}
                                {(item.tradeType === 'swap' || item.tradeType === 'mixed') && item.swapCategory && (
                                    <p className='font-poppins font-bold text-[16px] text-text_one mt-1'>
                                        Swap category: {item.swapCategory}
                                    </p>
                                )}
                                <p className='font-poppins text-[13px] text-[#4D4D4D] mt-1'>Views : {item.views}</p>
                            </>
                        )}
                    </div>

                    {/* Trade type badge + Three-dot menu */}
                    <div className='flex items-center gap-3 flex-shrink-0'>
                        {!item.isAuction && item.tradeType && (
                            <div className='w-fit'>
                                <TransactionTypeBadge
                                    acceptCash={item.tradeType === 'cash' || item.tradeType === 'mixed'}
                                    hasSwapItems={item.tradeType === 'swap' || item.tradeType === 'mixed'}
                                />
                            </div>
                        )}

                        {/* Three-dot menu — hidden for deactivated items */}
                        {item.type !== 'deactivated' && (
                            <div className='relative' ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className='p-1 text-[#A49E9E] hover:text-text_one transition-colors'
                                >
                                    <MoreVertical className='w-5 h-5' />
                                </button>

                                {showDropdown && (
                                    <div className='absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10'>
                                        <button
                                            onClick={() => { setShowDropdown(false); router.push(`/edit-item/${item.id}`); }}
                                            className='w-full px-4 py-2 text-left font-poppins text-[13px] text-text_one hover:bg-gray-50'
                                        >
                                            Edit Item
                                        </button>
                                        {item.isAuction && (
                                            <button
                                                onClick={handleToggleAuction}
                                                disabled={isUpdatingAuction}
                                                className='w-full px-4 py-2 text-left font-poppins text-[13px] text-text_one hover:bg-gray-50 disabled:opacity-50'
                                            >
                                                {item.auctionActive ? 'Deactivate Auction' : 'Activate Auction'}
                                            </button>
                                        )}
                                        <button
                                            onClick={handleDeleteItem}
                                            disabled={isDeleting}
                                            className='w-full px-4 py-2 text-left font-poppins text-[13px] text-[#FF674B] hover:bg-red-50 disabled:opacity-50'
                                        >
                                            Delete Item
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action buttons */}
                <div className='flex items-center gap-3 mt-3'>
                    {isAuctionFailed && (
                        <>
                            <button
                                onClick={() => router.push(`/post-an-item/form?from=${item.id}`)}
                                className='px-4 py-1.5 border border-[#A49E9E] rounded-lg font-poppins text-[12px] text-[#A49E9E] hover:border-primary hover:text-primary transition-colors'
                            >
                                List Item
                            </button>
                            <button
                                className='px-4 py-1.5 border border-[#A49E9E] rounded-lg font-poppins text-[12px] text-[#A49E9E] hover:border-primary hover:text-primary transition-colors'
                            >
                                Post auction again
                            </button>
                        </>
                    )}
                    {isAuctionActive && (
                        <>
                            <button
                                onClick={() => router.push(`/post-an-item/form?from=${item.id}`)}
                                className='px-4 py-1.5 border border-[#A49E9E] rounded-lg font-poppins text-[12px] text-[#A49E9E] hover:border-primary hover:text-primary transition-colors'
                            >
                                List Item
                            </button>
                            <button
                                onClick={handleToggleAuction}
                                disabled={isUpdatingAuction}
                                className='px-4 py-1.5 border border-[#A49E9E] rounded-lg font-poppins text-[12px] text-[#A49E9E] hover:border-primary hover:text-primary transition-colors disabled:opacity-50'
                            >
                                Deactivate Item
                            </button>
                        </>
                    )}
                    {!item.isAuction && item.type === 'listed' && (
                        <>
                            <button
                                className='px-4 py-1.5 border border-[#A49E9E] rounded-lg font-poppins text-[12px] text-[#A49E9E] hover:border-primary hover:text-primary transition-colors'
                            >
                                Post as Auction
                            </button>
                            <button
                                className='px-4 py-1.5 border border-[#A49E9E] rounded-lg font-poppins text-[12px] text-[#A49E9E] hover:border-primary hover:text-primary transition-colors'
                            >
                                Deactivate Item
                            </button>
                        </>
                    )}
                    {item.type === 'deactivated' && (
                        <button
                            className='px-4 py-1.5 border border-[#A49E9E] rounded-lg font-poppins text-[12px] text-[#A49E9E] hover:border-primary hover:text-primary transition-colors'
                        >
                            Reactivate
                        </button>
                    )}
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                title='Delete Item'
                message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                isDeleting={isDeleting}
            />
        </div>
    );
}
