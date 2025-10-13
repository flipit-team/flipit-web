'use client';

import React, { useState } from 'react';
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
        sort: 'recent'
    });

    // Fetch items with filters
    const { items: apiItems, loading, hasMore, loadMore, updateParams } = useItems({
        page: 0,
        size: 20,
        category: decodedCategoryName,
        sort: filters.sort as any,
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

    // Handle filter changes
    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);

        // Update API params
        if (updateParams) {
            const apiParams: any = {
                page: 0,
                category: newFilters.category || undefined,
                subcategory: newFilters.subCategory || undefined,
                sort: newFilters.sort,
            };

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

            // Add verified seller filter
            if (newFilters.verifiedSellers) {
                apiParams.isVerifiedSeller = true;
            }

            // Add discount filter
            if (newFilters.discount) {
                apiParams.hasDiscount = true;
            }

            updateParams(apiParams);
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