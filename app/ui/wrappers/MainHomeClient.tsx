'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const searchQuery = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || '';
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Filter state managed in MainHomeClient
    const [filters, setFilters] = useState({
        category: categoryParam,
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

    // Sync URL params (search, category) into filters and trigger fetch
    useEffect(() => {
        if (!updateParams) return;

        const hasUrlSearch = searchQuery !== '';
        const hasUrlCategory = categoryParam !== '';

        if (!hasUrlSearch && !hasUrlCategory) return;

        const updated = { ...filters, search: searchQuery, category: categoryParam };
        setFilters(updated);

        const apiParams: Record<string, any> = { sort: updated.sort };
        if (updated.search) apiParams.search = updated.search;
        if (updated.category) apiParams.category = updated.category;
        if (updated.stateCode) apiParams.stateCode = updated.stateCode;
        if (updated.lgaCode) apiParams.lgaCode = updated.lgaCode;
        if (updated.priceMin) apiParams.minAmount = parseFloat(updated.priceMin);
        if (updated.priceMax) apiParams.maxAmount = parseFloat(updated.priceMax);
        if (updated.verifiedSellers) apiParams.isVerifiedSeller = true;
        if (updated.discount) apiParams.hasDiscount = true;

        updateParams(apiParams, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, categoryParam]);
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

    // Handle search input with debounce — updates URL which triggers the useEffect above
    const handleSearchChange = useCallback((query: string) => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (query) {
                params.set('q', query);
            } else {
                params.delete('q');
            }
            const qs = params.toString();
            router.replace(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false });
        }, 500);
    }, [searchParams, router, pathname]);

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
    const hasActiveFilters = filters.category !== '' || categoryParam !== '' || filters.stateCode !== '' || filters.sort !== 'recent' || searchQuery !== '' ||
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
            onSearchChange={handleSearchChange}
            searchQuery={searchQuery}
            userName={authStatus?.user?.userName || authStatus?.user?.firstName || ''}
            userAvatar={authStatus?.user?.avatar || ''}
        />
    );
};

export default MainHomeClient;