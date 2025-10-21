'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import CategoryWrapper from './components/CategoryWrapper';
import { Item } from '~/utils/interface';
import { useItems, useCategories } from '~/hooks/useItems';
import Loading from '~/ui/common/loading/Loading';

export default function CategoryPage() {
    const params = useParams();
    const categoryName = params?.categoryName as string;

    // Decode the category name from URL
    const decodedCategoryName = decodeURIComponent(categoryName || '');

    // Fetch items with filters
    const { items: apiItems, loading, hasMore, loadMore, updateParams, initialized } = useItems({
        initialParams: {
            page: 0,
            size: 20,
            category: decodedCategoryName,
            sort: 'recent'
        },
        autoFetch: true
    });

    // Fetch categories for filter dropdown
    const { categories: apiCategories } = useCategories();

    // Memoize transformed items to prevent unnecessary recalculations
    const transformedApiItems: Item[] = useMemo(() => (apiItems && Array.isArray(apiItems)) ? apiItems.map(item => ({
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
    })) : [], [apiItems]);

    // Use only real API data (no dummy data)
    const items = transformedApiItems;
    const categories = apiCategories || [];

    // Handle filter changes - directly update params without page state
    const handleFilterChange = useCallback((newFilters: any) => {
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
    }, [updateParams, decodedCategoryName]);

    if (!decodedCategoryName) {
        return <div>Category not found</div>;
    }

    // Only show loading screen on initial load, not on filter changes
    if (loading && !items.length && !initialized) {
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
            onFilterChange={handleFilterChange}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
        />
    );
}