'use client';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useState, useRef, useEffect} from 'react';
import Button from '~/ui/common/button';
import {MyItem} from '../types';
import {ItemsService} from '~/services/items.service';
import {useToast} from '~/contexts/ToastContext';
import DeleteConfirmationModal from '~/ui/common/delete-confirmation-modal/DeleteConfirmationModal';
import {MoreVertical, Edit, Trash2, CheckCircle, Play, Square} from 'lucide-react';

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

export default function ItemCard({item, onItemDeleted, onItemUpdated}: ItemCardProps) {
    const router = useRouter();
    const {showSuccess, showError} = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isMarkingSold, setIsMarkingSold] = useState(false);
    const [isUpdatingAuction, setIsUpdatingAuction] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEditItem = () => {
        setShowDropdown(false);
        router.push(`/edit-item/${item.id}`);
    };

    const handleMarkAsSold = async () => {
        setShowDropdown(false);
        setIsMarkingSold(true);

        try {
            // Placeholder - will be replaced with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            showSuccess('Item marked as sold successfully!');
            onItemUpdated?.(item.id);
        } catch (error) {
            showError('Failed to mark item as sold. Please try again.');
        } finally {
            setIsMarkingSold(false);
        }
    };

    const handleDeleteItem = () => {
        setShowDropdown(false);
        console.log('Delete button clicked for item:', item.id);
        setShowDeleteModal(true);
        console.log('showDeleteModal set to true');
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        console.log('Starting delete process for item:', item.id);

        try {
            const result = await ItemsService.deleteItem(item.id);
            console.log('Delete result:', result);

            if (result.data) {
                console.log('Delete successful');
                showSuccess('Item deleted successfully!');
                onItemDeleted?.(item.id);
            } else {
                console.log('Delete failed with error:', result.error);
                showError(result.error || 'Failed to delete item');
            }
        } catch (error) {
            console.error('Delete exception:', error);
            showError('An error occurred while deleting the item');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleToggleAuction = async () => {
        if (!item.isAuction) return;

        setShowDropdown(false);
        setIsUpdatingAuction(true);

        try {
            // TODO: Replace with actual API call when auction endpoints are available
            const action = item.auctionActive ? 'deactivate' : 'activate';

            // Placeholder - will be replaced with actual API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            showSuccess(`Auction ${action}d successfully!`);
            onItemUpdated?.(item.id);
        } catch (error) {
            showError(`Failed to ${item.auctionActive ? 'deactivate' : 'activate'} auction. Please try again.`);
        } finally {
            setIsUpdatingAuction(false);
        }
    };

    return (
        <div className='w-full sm:border sm:border-border_gray sm:rounded-md flex flex-col sm:flex-row sm:p-4 sm:h-[179px]'>
            <div className='w-full h-48 sm:w-[157px] sm:h-full bg-gray-200 rounded-t-md sm:rounded-md overflow-hidden flex-shrink-0 relative mb-2 sm:mb-0'>
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 157px"
                    quality={75}
                    className='object-cover'
                />
            </div>

            <div className='flex-1 sm:ml-[22px] flex flex-col justify-between'>
                <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                        <h3 className='text-gray-700 typo-body-lg-regular mb-1 sm:mb-2'>{item.title}</h3>
                        <div className='text-text_one typo-heading-md-medium mb-0.5 sm:mb-1'>
                            {formatAmount(item.amount)}
                        </div>
                        <div className='text-gray-700 typo-body-md-regular mb-2 sm:mb-0'>Views: {item.views}</div>
                    </div>

                    {/* Mobile dropdown menu */}
                    <div className='sm:hidden relative' ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className='p-2 text-gray-500 hover:text-gray-700 transition-colors'
                        >
                            <MoreVertical className='w-5 h-5' />
                        </button>

                        {showDropdown && (
                            <div className='absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10'>
                                <button
                                    onClick={handleEditItem}
                                    className='w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                    <Edit className='w-4 h-4' />
                                    Edit Item
                                </button>

                                {item.isAuction ? (
                                    <button
                                        onClick={handleToggleAuction}
                                        disabled={isUpdatingAuction}
                                        className='w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50'
                                    >
                                        {item.auctionActive ? (
                                            <>
                                                <Square className='w-4 h-4' />
                                                {isUpdatingAuction ? 'Deactivating...' : 'Cancel Auction'}
                                            </>
                                        ) : (
                                            <>
                                                <Play className='w-4 h-4' />
                                                {isUpdatingAuction ? 'Activating...' : 'Activate Auction'}
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleMarkAsSold}
                                        disabled={isMarkingSold}
                                        className='w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50'
                                    >
                                        <CheckCircle className='w-4 h-4' />
                                        {isMarkingSold ? 'Marking...' : 'Mark as Sold'}
                                    </button>
                                )}

                                <div className='border-t border-gray-100 my-1' />

                                <button
                                    onClick={handleDeleteItem}
                                    disabled={isDeleting}
                                    className='w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50'
                                >
                                    <Trash2 className='w-4 h-4' />
                                    Delete Item
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop buttons */}
                <div className='hidden sm:flex gap-3 mt-[21px]'>
                    <Button variant='outline' size='sm' onClick={handleEditItem}>
                        Edit Item
                    </Button>

                    {/* Show auction controls for auction items */}
                    {item.isAuction ? (
                        <Button
                            variant={item.auctionActive ? 'danger' : 'primary'}
                            size='sm'
                            onClick={handleToggleAuction}
                            loading={isUpdatingAuction}
                        >
                            {item.auctionActive ? 'Cancel Auction' : 'Activate Auction'}
                        </Button>
                    ) : (
                        <Button variant='outline' size='sm' onClick={handleMarkAsSold} loading={isMarkingSold}>
                            Mark as Sold
                        </Button>
                    )}

                    <Button variant='danger' size='sm' onClick={handleDeleteItem} loading={isDeleting}>
                        Delete Item
                    </Button>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                title='Delete Item'
                message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isDeleting={isDeleting}
            />
            {/* Debug: showDeleteModal is {showDeleteModal ? 'true' : 'false'} */}
        </div>
    );
}
