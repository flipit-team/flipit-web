'use client';

import React, { useState } from 'react';
import { useAppContext } from '~/contexts/AppContext';
import { dummyItems } from '~/utils/dummy';
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
    const { debugMode } = useAppContext();
    const [locationFilter, setLocationFilter] = useState<{ stateCode: string; lgaCode?: string } | null>(null);
    
    // Fetch client-side data with infinite scroll support
    const { items: apiItems, loading: itemsLoading, hasMore, loadMore, updateParams } = useItems({ page: 0, size: 15 });
    const { categories: apiCategories, loading: categoriesLoading } = useCategories();
    
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
    const transformedApiItems: Item[] = apiItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrls: item.imageUrls,
        flipForImgUrls: [], // This field doesn't exist in new API
        acceptCash: item.acceptCash,
        cashAmount: item.cashAmount,
        condition: item.condition,
        published: item.published,
        location: item.location,
        dateCreated: new Date(item.dateCreated),
        seller: {
            id: item.seller.id.toString(),
            title: '', // This field doesn't exist in new API
            firstName: item.seller.firstName,
            middleName: '', // This field doesn't exist in new API
            lastName: item.seller.lastName,
            email: item.seller.email,
            phoneNumber: item.seller.phoneNumber,
            avatar: item.seller.profileImageUrl || '',
            avg_rating: item.seller.avgRating || 0,
            status: item.seller.status || 'active',
            phoneNumberVerified: item.seller.phoneNumberVerified || false,
            dateVerified: new Date(item.seller.dateVerified || item.seller.dateCreated),
        },
        itemCategories: item.itemCategories.map(cat => ({
            name: cat.name,
            description: cat.description,
        })),
    }));

    // Log data sources for debugging

    // Handle location filter changes
    const handleLocationFilter = (stateCode: string, lgaCode?: string) => {
        const newFilter = stateCode ? { stateCode, lgaCode } : null;
        setLocationFilter(newFilter);
        
        // Update API params with location filter
        if (updateParams) {
            const params: any = {};
            if (stateCode) {
                params.stateCode = stateCode;
                if (lgaCode) {
                    params.lgaCode = lgaCode;
                }
            }
            updateParams(params);
        }
    };

    // Use dummy data in debug mode, otherwise prioritize server data, then client-side API data
    const items = debugMode ? dummyItems : (serverItems && serverItems.length > 0 ? serverItems : (transformedApiItems || []));
    const auctionItems = debugMode ? dummyItems.slice(0, 5) : (serverAuctionItems || []); // Use first 5 dummy items or server auction items
    const defaultCategories = debugMode ? [
        {name: 'Electronics', description: 'Devices like phones, laptops, gadgets, etc.'},
        {name: 'Mobile Phones', description: 'Smartphones and related accessories'},
        {name: 'Clothing', description: 'Fashion items and apparel'},
        {name: 'Home & Garden', description: 'Home improvement and garden items'},
        {name: 'Sports', description: 'Sports equipment and accessories'}
    ] : (serverCategories && serverCategories.length > 0 ? serverCategories : 
         (apiCategories && Array.isArray(apiCategories) ? apiCategories.map(cat => ({ name: cat.name, description: cat.description })) : []));


    return (
        <MainHomeServer 
            items={items} 
            auctionItems={auctionItems}
            defaultCategories={defaultCategories}
            loadMoreRef={loadMoreRef}
            loading={itemsLoading}
            hasMore={hasMore}
            onLocationFilter={handleLocationFilter}
        />
    );
};

export default MainHomeClient;