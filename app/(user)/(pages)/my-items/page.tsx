'use client';
import React, {useState, useEffect} from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import GoBack from '~/ui/common/go-back';
import ItemsContainer from './components/ItemsContainer';
import {mockItems} from './data/mockItems';
import {ItemsService} from '~/services/items.service';
import {useAuth} from '~/hooks/useAuth';
import {useAppContext} from '~/contexts/AppContext';
import {MyItem, TabType} from './types';
import {ItemDTO} from '~/types/api';
import Loading from '~/ui/common/loading/Loading';
import {useToast} from '~/contexts/ToastContext';

// Transform ItemDTO to MyItem
function transformItemToMyItem(item: ItemDTO): MyItem {
    // Check if item is an auction based on auction-related fields
    const isAuction = !!((item as any).auctionId || (item as any).startingBid || (item as any).currentBid || (item as any).startDate || (item as any).endDate);
    const auctionActive = isAuction && item.published && !(item as any).auctionEnded;

    // Determine item type
    let type: 'auction' | 'listed' | 'deactivated';
    if (isAuction) {
        type = auctionActive ? 'auction' : 'deactivated';
    } else {
        type = item.published ? 'listed' : 'deactivated';
    }

    return {
        id: item.id,
        title: item.title,
        image: item.imageUrls?.[0] || '/placeholder-product.png',
        amount: item.cashAmount,
        views: 0, // API doesn't provide views yet
        type,
        isAuction,
        auctionActive
    };
}

export default function MyItemsPage() {
    const {user} = useAuth();
    const {user: contextUser} = useAppContext();
    const {showError} = useToast();
    const [items, setItems] = useState<Record<TabType, MyItem[]>>({
        auction: [],
        listed: [],
        deactivated: []
    });
    const [loading, setLoading] = useState(true);
    
    // Use authenticated user ID
    const authenticatedUser = user || contextUser;
    const userId = authenticatedUser ? parseInt(
        (authenticatedUser as any).userId || 
        (authenticatedUser as any).id?.toString() || 
        '0'
    ) : null;

    const fetchUserItems = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const result = await ItemsService.getUserItems(userId);
            
            if (result.data) {
                const transformedItems = result.data.map(transformItemToMyItem);
                
                // Categorize items
                const categorizedItems: Record<TabType, MyItem[]> = {
                    auction: transformedItems.filter(item => item.type === 'auction'),
                    listed: transformedItems.filter(item => item.type === 'listed'),
                    deactivated: transformedItems.filter(item => item.type === 'deactivated')
                };
                
                setItems(categorizedItems);
            } else {
                showError(result.error || 'Failed to fetch your items');
                // Fall back to mock items on error
                setItems(mockItems);
            }
        } catch {
            showError('An error occurred while fetching your items');
            // Fall back to mock items on error
            setItems(mockItems);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserItems();
    }, [userId]);

    if (loading) {
        return (
            <div className='flex min-h-screen bg-gray-50'>
                <div className='hidden lg:block'>
                    <Sidebar username={(authenticatedUser as any)?.userName || (authenticatedUser as any)?.firstName || "User"} />
                </div>
                <div className='flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='flex items-center justify-center h-64'>
                            <Loading size='lg' text='Loading your items...' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen bg-gray-50 no-scrollbar'>
            {/* Desktop Sidebar - hidden on mobile/tablet */}
            <div className='hidden lg:block'>
                <Sidebar username={(authenticatedUser as any)?.userName || (authenticatedUser as any)?.firstName || "User"} />
            </div>
            
            {/* Main Content Area */}
            <div className='flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden no-scrollbar'>
                <div className='max-w-6xl mx-auto'>
                    <GoBack />

                    <div className='py-6 md:py-9 xs:pt-6 xs:py-0 xs:mb-4 typo-heading-lg-bold md:typo-display-lg text-gray-900'>My Items</div>

                    <ItemsContainer 
                        initialItems={items} 
                        onRefreshItems={fetchUserItems}
                    />
                </div>
            </div>
        </div>
    );
}
