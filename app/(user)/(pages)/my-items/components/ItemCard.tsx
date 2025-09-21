'use client';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import Button from '~/ui/common/button';
import {MyItem} from '../types';
import {ItemsService} from '~/services/items.service';
import {useToast} from '~/contexts/ToastContext';
import DeleteConfirmationModal from '~/ui/common/delete-confirmation-modal/DeleteConfirmationModal';

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

    const handleEditItem = () => {
        router.push(`/edit-item/${item.id}`);
    };

    const handleMarkAsSold = async () => {
        // TODO: Implement when API becomes available
        setIsMarkingSold(true);
        
        try {
            // Placeholder - will be replaced with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccess('Item marked as sold successfully!');
            onItemUpdated?.(item.id);
        } catch (error) {
            showError('Failed to mark item as sold. Please try again.');
        } finally {
            setIsMarkingSold(false);
        }
    };

    const handleDeleteItem = () => {
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

        setIsUpdatingAuction(true);

        try {
            // TODO: Replace with actual API call when auction endpoints are available
            const action = item.auctionActive ? 'deactivate' : 'activate';

            // Placeholder - will be replaced with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            showSuccess(`Auction ${action}d successfully!`);
            onItemUpdated?.(item.id);
        } catch (error) {
            showError(`Failed to ${item.auctionActive ? 'deactivate' : 'activate'} auction. Please try again.`);
        } finally {
            setIsUpdatingAuction(false);
        }
    };

    return (
        <div className='w-[833px] h-[179px] border border-border_gray rounded-md flex p-4'>
            <div className='w-[157px] h-full bg-gray-200 rounded-md overflow-hidden flex-shrink-0 relative'>
                <Image src={item.image} alt={item.title} fill className='object-cover' />
            </div>

            <div className='flex-1 ml-[22px] flex flex-col justify-between'>
                <div>
                    <h3 className='text-gray-700 typo-body-lg-regular mb-2'>{item.title}</h3>
                    <div className='text-text_one typo-heading-md-medium mb-1'>{formatAmount(item.amount)}</div>
                    <div className='text-gray-700 typo-body-md-regular'>Views: {item.views}</div>
                </div>

                <div className='flex gap-3 mt-[21px]'>
                    <Button variant='outline' size='sm' onClick={handleEditItem}>
                        Edit Item
                    </Button>

                    {/* Show auction controls for auction items */}
                    {item.isAuction ? (
                        <Button
                            variant={item.auctionActive ? 'danger' : 'primary'}
                            size='sm'
                            onClick={handleToggleAuction}
                            disabled={isUpdatingAuction}
                        >
                            {isUpdatingAuction
                                ? (item.auctionActive ? 'Deactivating...' : 'Activating...')
                                : (item.auctionActive ? 'Cancel Auction' : 'Activate Auction')
                            }
                        </Button>
                    ) : (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleMarkAsSold}
                            disabled={isMarkingSold}
                        >
                            {isMarkingSold ? 'Marking...' : 'Mark as Sold'}
                        </Button>
                    )}

                    <Button
                        variant='danger'
                        size='sm'
                        onClick={handleDeleteItem}
                        disabled={isDeleting}
                    >
                        Delete Item
                    </Button>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Item"
                message={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isDeleting={isDeleting}
            />
            {/* Debug: showDeleteModal is {showDeleteModal ? 'true' : 'false'} */}
        </div>
    );
}
