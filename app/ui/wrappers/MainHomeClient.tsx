'use client';

import React, { useState } from 'react';
import { useAppContext } from '~/contexts/AppContext';
import { dummyItems } from '~/utils/dummy';
import { Item } from '~/utils/interface';
import { useItems, useCategories } from '~/hooks/useItems';
import MainHomeServer from './MainHomeServer';

interface Props {
    items: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    authStatus?: {
        isAuthenticated: boolean;
        user: any | null;
    };
}

const MainHomeClient: React.FC<Props> = ({ items: serverItems, defaultCategories: serverCategories, authStatus }) => {
    const { debugMode } = useAppContext();
    
    // Fetch client-side data
    const { items: apiItems, loading: itemsLoading } = useItems({ page: 0, size: 15 });
    const { categories: apiCategories, loading: categoriesLoading } = useCategories();

    // Log authentication status for debugging
    React.useEffect(() => {
        if (authStatus) {
            console.log('🔐 Client-side auth status:', authStatus.isAuthenticated ? 'LOGGED IN' : 'NOT LOGGED IN');
            if (authStatus.user) {
                console.log('👤 Client-side user:', authStatus.user.firstName || authStatus.user.username || authStatus.user.email);
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
    console.log('🔍 MainHomeClient data source selection:');
    console.log('  - Debug mode:', debugMode);
    console.log('  - Server items count:', serverItems.length);
    console.log('  - Client API items count:', transformedApiItems.length);
    console.log('  - Server categories count:', serverCategories.length);
    console.log('  - Client API categories count:', apiCategories.length);

    // Use dummy data in debug mode, otherwise prioritize server data, then client-side API data
    const items = debugMode ? dummyItems : (serverItems.length > 0 ? serverItems : transformedApiItems);
    const defaultCategories = debugMode ? [
        {name: 'Electronics', description: 'Devices like phones, laptops, gadgets, etc.'},
        {name: 'Mobile Phones', description: 'Smartphones and related accessories'},
        {name: 'Clothing', description: 'Fashion items and apparel'},
        {name: 'Home & Garden', description: 'Home improvement and garden items'},
        {name: 'Sports', description: 'Sports equipment and accessories'}
    ] : (serverCategories.length > 0 ? serverCategories : apiCategories.map(cat => ({ name: cat.name, description: cat.description })));

    console.log('🎯 MainHomeClient final selection:');
    console.log('  - Items count:', items.length);
    console.log('  - Categories count:', defaultCategories.length);
    console.log('  - Using source:', debugMode ? 'dummy' : (serverItems.length > 0 ? 'server' : 'client'));

    return (
        <MainHomeServer 
            items={items} 
            defaultCategories={defaultCategories}
        />
    );
};

export default MainHomeClient;