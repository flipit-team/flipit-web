'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
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
    shouldLogout?: boolean;
}

const MainHomeClient = ({ items: serverItems, auctionItems: serverAuctionItems, defaultCategories: serverCategories, authStatus, shouldLogout }: Props) => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    // Handle automatic logout for expired tokens
    useEffect(() => {
        if (shouldLogout) {
            // Call logout API to clear cookies and redirect
            fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            }).then(() => {
                window.location.href = '/login';
            }).catch(() => {
                // Even if logout fails, redirect to login
                window.location.href = '/login';
            });
        }
    }, [shouldLogout]);

    // Filter state managed in MainHomeClient
    const [filters, setFilters] = useState({
        category: '',
        subCategory: '',
        stateCode: '',
        lgaCode: '',
        priceMin: '',
        priceMax: '',
        verifiedSellers: false,
        discount: false,
        sort: 'recent',
        search: ''
    });

    // Fetch client-side data with infinite scroll support
    // Don't fetch on mount - we already have server items
    const { items: apiItems, loading: itemsLoading, hasMore, loadMore, updateParams, initialized } = useItems({
        initialParams: { page: 0, size: 15, sort: 'recent' },
        autoFetch: false
    });

    // Update items when search query changes
    useEffect(() => {
        if (searchQuery && updateParams) {
            const params: any = { sort: filters.sort, search: searchQuery };
            if (filters.stateCode) {
                params.stateCode = filters.stateCode;
                if (filters.lgaCode) {
                    params.lgaCode = filters.lgaCode;
                }
            }
            updateParams(params);
        }
    }, [searchQuery]);
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

    // Transform API items to legacy format - memoized
    const transformedApiItems: Item[] = useMemo(() => (apiItems && Array.isArray(apiItems)) ? apiItems.map(item => ({
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
    })) : [], [apiItems]);

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters: typeof filters) => {
        setFilters(newFilters);

        // Update API params - build complete params object
        if (updateParams) {
            const apiParams: any = {
                page: 0,
                size: 15,
                sort: newFilters.sort,
            };

            // Add category filters
            if (newFilters.category) {
                apiParams.category = newFilters.category;
            }
            if (newFilters.subCategory) {
                apiParams.subcategory = newFilters.subCategory;
            }

            // Add search if present
            if (newFilters.search) {
                apiParams.search = newFilters.search;
            }

            // Add location filters
            if (newFilters.stateCode) {
                apiParams.stateCode = newFilters.stateCode;
            }
            if (newFilters.lgaCode) {
                apiParams.lgaCode = newFilters.lgaCode;
            }

            // Add price range filters
            if (newFilters.priceMin) {
                apiParams.minAmount = parseFloat(newFilters.priceMin);
            }
            if (newFilters.priceMax) {
                apiParams.maxAmount = parseFloat(newFilters.priceMax);
            }

            // Add boolean filters only if true
            if (newFilters.verifiedSellers) {
                apiParams.isVerifiedSeller = true;
            }
            if (newFilters.discount) {
                apiParams.hasDiscount = true;
            }

            updateParams(apiParams, true);
        }
    }, [updateParams]);

    // Handle sort changes
    const handleSortChange = (sortValue: string) => {
        const newFilters = { ...filters, sort: sortValue };
        handleFilterChange(newFilters);
    };

    // Use API data when filters/sorting/search are active AND data has been fetched, otherwise use server data
    const hasActiveFilters = filters.category !== '' || filters.stateCode !== '' || filters.sort !== 'recent' || searchQuery !== '' ||
        filters.priceMin !== '' || filters.priceMax !== '' || filters.verifiedSellers || filters.discount;

    // Show API items when filters are active and initialized, otherwise always show server items
    const items = (hasActiveFilters && initialized)
        ? transformedApiItems
        : serverItems;

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
            onSortChange={handleSortChange}
            currentSort={filters.sort}
            filters={filters}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
        />
    );
};

export default MainHomeClient;