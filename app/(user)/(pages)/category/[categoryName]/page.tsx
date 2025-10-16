'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import CategoryWrapper from './components/CategoryWrapper';
import { Item } from '~/utils/interface';
import { useItems, useCategories } from '~/hooks/useItems';
import Loading from '~/ui/common/loading/Loading';

export default function CategoryPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const categoryName = params?.categoryName as string;

    // Decode the category name from URL
    const decodedCategoryName = decodeURIComponent(categoryName || '');

    // Get search query from URL
    const searchQuery = searchParams.get('q') || '';

    // Filter state
    const [filters, setFilters] = useState({
        category: decodedCategoryName,
        subCategory: '',
        stateCode: '',
        lgaCode: '',
        priceMin: '',
        priceMax: '',
        verifiedSellers: false,
        discount: false,
        sort: 'recent',
        search: searchQuery
    });

    // Update filters when search query changes from URL
    useEffect(() => {
        if (searchQuery !== filters.search) {
            setFilters(prev => ({ ...prev, search: searchQuery }));
        }
    }, [searchQuery]);

    // Fetch items with filters
    const { items: apiItems, loading, hasMore, loadMore, updateParams, initialized } = useItems({
        initialParams: {
            page: 0,
            size: 20,
            category: decodedCategoryName,
            sort: filters.sort as any,
            search: searchQuery
        },
        autoFetch: true
    });

    // Fetch categories for filter dropdown
    const { categories: apiCategories } = useCategories();

    // Transform API items to legacy format
    const transformedApiItems: Item[] = (apiItems && Array.isArray(apiItems)) ? apiItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrls: item.imageUrls || [],
        flipForImgUrls: [],
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
            title: '',
            firstName: item.seller?.firstName || '',
            middleName: '',
            lastName: item.seller?.lastName || '',
            email: item.seller?.email || '',
            phoneNumber: item.seller?.phoneNumber || '',
            avatar: item.seller?.profileImageUrl || '',
            avg_rating: item.seller?.avgRating || 0,
            status: item.seller?.status || 'active',
            phoneNumberVerified: item.seller?.phoneNumberVerified || false,
            idVerified: item.seller?.idVerified || false,
            dateVerified: item.seller?.dateVerified || item.seller?.dateCreated || new Date().toISOString(),
            reviewCount: item.seller?.reviewCount || 0,
            mostRecentReview: (item.seller?.mostRecentReview || { rating: 0, message: '', userId: 0, postedById: 0, createdDate: new Date().toISOString() }) as any,
        },
        itemCategory: {
            name: item.itemCategory?.name || '',
            description: item.itemCategory?.description || '',
        },
    })) : [];

    // Use only real API data (no dummy data)
    const items = transformedApiItems;
    const categories = apiCategories || [];

    // Update items when search query changes from URL
    useEffect(() => {
        if (updateParams && searchQuery && initialized) {
            const apiParams: any = {
                page: 0,
                category: decodedCategoryName,
                sort: filters.sort,
                search: searchQuery,
            };

            // Add existing filters
            if (filters.subCategory) apiParams.subcategory = filters.subCategory;
            if (filters.stateCode) apiParams.stateCode = filters.stateCode;
            if (filters.lgaCode) apiParams.lgaCode = filters.lgaCode;
            if (filters.priceMin) apiParams.minAmount = parseFloat(filters.priceMin);
            if (filters.priceMax) apiParams.maxAmount = parseFloat(filters.priceMax);
            if (filters.verifiedSellers) apiParams.isVerifiedSeller = true;
            if (filters.discount) apiParams.hasDiscount = true;

            updateParams(apiParams, true);
        }
    }, [searchQuery]);

    // Handle filter changes
    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);

        // Update API params - build complete params object
        if (updateParams) {
            const apiParams: any = {
                page: 0,
                size: 20,
                // Always use the category from filters, or fall back to the URL category
                category: newFilters.category || decodedCategoryName,
                sort: newFilters.sort,
            };

            // Add subcategory if present
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

            // Add boolean filters only if true (omit if false to remove from query)
            if (newFilters.verifiedSellers) {
                apiParams.isVerifiedSeller = true;
            }
            if (newFilters.discount) {
                apiParams.hasDiscount = true;
            }

            // Use replace=true to completely replace params instead of merging
            updateParams(apiParams, true);
        }
    };

    if (!decodedCategoryName) {
        return <div>Category not found</div>;
    }

    if (loading && !items.length) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Loading size='lg' text={`Loading ${decodedCategoryName} items...`} />
            </div>
        );
    }

    return (
        <CategoryWrapper
            categoryName={decodedCategoryName}
            items={items}
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
        />
    );
}