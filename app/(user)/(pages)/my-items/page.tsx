'use client';
import React, {useState, useEffect} from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import GoBack from '~/ui/common/go-back';
import ItemsContainer from './components/ItemsContainer';
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

    const tradeType: 'cash' | 'swap' | 'mixed' =
        item.acceptCash && item.acceptSwap ? 'mixed' :
        item.acceptSwap ? 'swap' : 'cash';

    return {
        id: item.id,
        title: item.title,
        image: item.imageUrls?.[0] || 'https://images.pexels.com/photos/1303084/pexels-photo-1303084.jpeg',
        amount: item.cashAmount,
        views: item.viewsCount ?? 0,
        type,
        isAuction,
        auctionActive,
        tradeType,
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

                // Categorize items, merging with mock data for design preview
                // TODO: Remove mock data merge once API supports all trade types and auction statuses
                const apiItems: Record<TabType, MyItem[]> = {
                    auction: transformedItems.filter(item => item.type === 'auction'),
                    listed: transformedItems.filter(item => item.type === 'listed'),
                    deactivated: transformedItems.filter(item => item.type === 'deactivated')
                };

                setItems(apiItems);
            } else {
                showError(result.error || 'Failed to fetch your items');
            }
        } catch {
            showError('An error occurred while fetching your items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserItems();
    }, [userId]);

    if (loading) {
        return (
            <div className='flex min-h-screen bg-white xs:bg-background'>
                <div className='hidden lg:block xs:hidden'>
                    <Sidebar username={(authenticatedUser as any)?.userName || (authenticatedUser as any)?.firstName || "User"} />
                </div>
                <div className='flex-1 p-4 md:p-6 lg:p-8 xs:p-4 overflow-x-hidden'>
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
        <div className='flex min-h-screen bg-white xs:bg-background no-scrollbar xs:pb-24'>
            {/* Desktop Sidebar - hidden on mobile */}
            <div className='hidden lg:block'>
                <Sidebar username={(authenticatedUser as any)?.userName || (authenticatedUser as any)?.firstName || "User"} />
            </div>

            {/* Main Content Area */}
            <div className='flex-1 p-4 md:p-6 lg:p-8 xs:p-0 xs:px-4 xs:pt-4 overflow-x-hidden no-scrollbar'>
                <div className='max-w-6xl mx-auto'>
                    <div className='xs:hidden'><GoBack /></div>

                    {/* Mobile header */}
                    <div className='hidden xs:flex items-center gap-3 mb-4'>
                        <button onClick={() => window.history.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <h1 className='font-poppins typo-heading-md-semibold text-text_one'>My Items</h1>
                    </div>

                    <div className='py-6 md:py-9 xs:hidden typo-heading-lg-bold text-gray-900'>My Items</div>

                    <ItemsContainer 
                        initialItems={items} 
                        onRefreshItems={fetchUserItems}
                    />
                </div>
            </div>
        </div>
    );
}
