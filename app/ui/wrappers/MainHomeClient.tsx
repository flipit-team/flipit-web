'use client';

import React, { useState } from 'react';
import { Item } from '~/utils/interface';
import { useItems, useCategories } from '~/hooks/useItems';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import MainHomeServer from './MainHomeServer';

interface Props {
    items: Item[];
    auctionItems: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    authStatus?: {
        isAuthenticated: boolean;
        user: any | null;
    };
}

const MainHomeClient = ({ items: serverItems, auctionItems: serverAuctionItems, defaultCategories: serverCategories, authStatus }: Props) => {
    const [locationFilter, setLocationFilter] = useState<{ stateCode: string; lgaCode?: string } | null>(null);
    const [currentSort, setCurrentSort] = useState<string>('recent');

    // Fetch client-side data with infinite scroll support
    // Don't fetch on mount - we already have server items
    const { items: apiItems, loading: itemsLoading, hasMore, loadMore, updateParams, initialized } = useItems({ page: 0, size: 15, sort: 'recent' });
    const { categories: apiCategories } = useCategories();
    
    // Set up infinite scroll
    const { loadMoreRef } = useInfiniteScroll({
        hasMore,
        loading: itemsLoading,
        onLoadMore: loadMore
    });

    // Log authentication status for debugging
    React.useEffect(() => {
        if (authStatus) {
            if (authStatus.user) {
            }
        }
    }, [authStatus]);

    // Transform API items to legacy format
    const transformedApiItems: Item[] = (apiItems && Array.isArray(apiItems)) ? apiItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrls: item.imageUrls || [],
        flipForImgUrls: [], // This field doesn't exist in new API
        acceptCash: item.acceptCash,
        cashAmount: item.cashAmount,
        condition: item.condition,
        published: item.published,
        location: item.location,
        dateCreated: new Date(item.dateCreated),
        promoted: item.promoted || false,
        liked: item.liked || false,
        seller: {
            id: item.seller?.id?.toString() || '',
            title: '', // This field doesn't exist in new API
            firstName: item.seller?.firstName || '',
            middleName: '', // This field doesn't exist in new API
            lastName: item.seller?.lastName || '',
            email: item.seller?.email || '',
            phoneNumber: item.seller?.phoneNumber || '',
            avatar: item.seller?.profileImageUrl || '',
            avg_rating: item.seller?.avgRating || 0,
            status: item.seller?.status || 'active',
            phoneNumberVerified: item.seller?.phoneNumberVerified || false,
            dateVerified: item.seller?.dateVerified || item.seller?.dateCreated || new Date().toISOString(),
            idVerified: item.seller?.idVerified || false,
            reviewCount: item.seller?.reviewCount || 0,
            mostRecentReview: (item.seller?.mostRecentReview || { rating: 0, message: '', userId: 0, postedById: 0, createdDate: new Date().toISOString() }) as any,
        },
        itemCategory: {
            name: item.itemCategory?.name || '',
            description: item.itemCategory?.description || '',
        },
    })) : [];

    // Log data sources for debugging

    // Handle location filter changes
    const handleLocationFilter = (stateCode: string, lgaCode?: string) => {
        const newFilter = stateCode ? { stateCode, lgaCode } : null;
        setLocationFilter(newFilter);

        // Update API params with location filter
        if (updateParams) {
            const params: any = { sort: currentSort };
            if (stateCode) {
                params.stateCode = stateCode;
                if (lgaCode) {
                    params.lgaCode = lgaCode;
                }
            }
            updateParams(params);
        }
    };

    // Handle sort changes
    const handleSortChange = (sortValue: string) => {
        setCurrentSort(sortValue);

        // Update API params with new sort
        if (updateParams) {
            const params: any = { sort: sortValue };
            if (locationFilter) {
                params.stateCode = locationFilter.stateCode;
                if (locationFilter.lgaCode) {
                    params.lgaCode = locationFilter.lgaCode;
                }
            }
            updateParams(params);
        }
    };

    // Use API data when filters/sorting are active AND data has been fetched, otherwise use server data
    const hasActiveFilters = locationFilter !== null || currentSort !== 'recent';

    // Show API items only when we have active filters AND the API has fetched data
    // Otherwise show server items
    const items = (hasActiveFilters && transformedApiItems.length > 0)
        ? transformedApiItems
        : (serverItems && serverItems.length > 0 ? serverItems : transformedApiItems);

    const auctionItems = serverAuctionItems || [];
    const defaultCategories = serverCategories && serverCategories.length > 0 ? serverCategories :
         (apiCategories && Array.isArray(apiCategories) ? apiCategories.map(cat => ({ name: cat.name, description: cat.description })) : []);



    return (
        <MainHomeServer
            items={items}
            auctionItems={auctionItems}
            defaultCategories={defaultCategories}
            loadMoreRef={loadMoreRef}
            loading={itemsLoading}
            hasMore={hasMore}
            onLocationFilter={handleLocationFilter}
            currentLocationFilter={locationFilter}
            onSortChange={handleSortChange}
            currentSort={currentSort}
        />
    );
};

export default MainHomeClient;