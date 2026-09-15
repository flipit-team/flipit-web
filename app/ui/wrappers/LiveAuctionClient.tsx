'use client';

import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import LiveAuctionWrapper from './LiveAuctionWrapper';
import { Item } from '~/utils/interface';
import AuctionsService from '~/services/auctions.service';
import { AuctionDTO } from '~/types/api';

interface Props {
    items: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    userName?: string;
    userAvatar?: string;
}

// Transform AuctionDTO to Item
function transformAuctionToItem(auction: AuctionDTO): Item {
    return {
        id: auction.item.id,
        title: auction.item.title,
        description: auction.item.description,
        imageUrls: auction.item.imageUrls || [],
        flipForImgUrls: [],
        acceptCash: true,
        acceptSwap: false,
        cashAmount: auction.currentBid || auction.startingBid,
        condition: auction.item.condition,
        published: true,
        sold: auction.status === 'ENDED',
        location: auction.item.location,
        brand: auction.item.brand,
        dateCreated: new Date(auction.item.dateCreated),
        promoted: false,
        liked: false,
        seller: {
            id: auction.item.seller?.id?.toString() || '',
            title: '',
            firstName: auction.item.seller?.firstName || '',
            middleName: '',
            lastName: auction.item.seller?.lastName || '',
            email: auction.item.seller?.email || '',
            phoneNumber: auction.item.seller?.phoneNumber || '',
            avatar: auction.item.seller?.profileImageUrl || '',
            avg_rating: auction.item.seller?.avgRating || 0,
            status: auction.item.seller?.status || 'active',
            phoneNumberVerified: auction.item.seller?.phoneNumberVerified || false,
            dateVerified: auction.item.seller?.dateVerified || auction.item.seller?.dateCreated || new Date().toISOString(),
            idVerified: auction.item.seller?.idVerified || false,
            reviewCount: auction.item.seller?.reviewCount || 0,
            mostRecentReview: (auction.item.seller?.mostRecentReview || { rating: 0, message: '', userId: 0, postedById: 0, createdDate: new Date().toISOString() }) as any,
        },
        itemCategory: {
            name: auction.item.itemCategory?.name || '',
            description: auction.item.itemCategory?.description || '',
        },
        // Auction-specific fields
        isAuction: true,
        auctionId: auction.id,
        startingBid: auction.startingBid,
        currentBid: auction.currentBid,
        bidIncrement: auction.bidIncrement,
        reservePrice: auction.reservePrice,
        startDate: auction.startDate,
        endDate: auction.endDate,
        auctionStatus: auction.status
    };
}

type AuctionTab = 'live' | 'upcoming' | 'ended';

const LiveAuctionClient = ({ items: serverItems, defaultCategories, userName = '', userAvatar = '' }: Props) => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [activeTab, setActiveTab] = useState<AuctionTab>('live');

    // Filter state
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

    const [apiAuctions, setApiAuctions] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const lastAppliedSearchRef = React.useRef<string>('');
    const isInitialMountRef = React.useRef(true);
    const filtersRef = React.useRef(filters);

    // Keep filtersRef in sync with filters
    React.useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = useCallback(async (newFilters: typeof filters) => {
        setFilters(newFilters);
        setLoading(true);

        try {
            const apiParams: any = {
                page: 0,
                size: 15,
                sort: newFilters.sort,
            };

            if (newFilters.category) apiParams.category = newFilters.category;
            if (newFilters.subCategory) apiParams.subcategory = newFilters.subCategory;
            if (newFilters.search) apiParams.search = newFilters.search;
            if (newFilters.stateCode) apiParams.stateCode = newFilters.stateCode;
            if (newFilters.lgaCode) apiParams.lgaCode = newFilters.lgaCode;
            if (newFilters.priceMin) apiParams.minAmount = parseFloat(newFilters.priceMin);
            if (newFilters.priceMax) apiParams.maxAmount = parseFloat(newFilters.priceMax);
            if (newFilters.verifiedSellers) apiParams.isVerifiedSeller = true;
            if (newFilters.discount) apiParams.hasDiscount = true;

            const result = await AuctionsService.getActiveAuctions(apiParams);

            if (result.data) {
                const transformed = result.data.map(transformAuctionToItem);
                setApiAuctions(transformed);
                setInitialized(true);
            }
        } catch (error) {
            console.error('Failed to fetch auctions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle sort changes
    const handleSortChange = useCallback((sortValue: string) => {
        const newFilters = { ...filtersRef.current, sort: sortValue };
        handleFilterChange(newFilters);
    }, [handleFilterChange]);

    // Sync URL search query with filter state - without causing infinite loops
    React.useEffect(() => {
        // Skip initial mount
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
            lastAppliedSearchRef.current = searchQuery;
            return;
        }

        // Only update if search actually changed
        if (searchQuery !== lastAppliedSearchRef.current) {
            lastAppliedSearchRef.current = searchQuery;
            handleFilterChange({ ...filtersRef.current, search: searchQuery });
        }
    }, [searchQuery, handleFilterChange]);

    // Check if any filters are active
    const hasActiveFilters = filters.category !== '' || filters.stateCode !== '' || filters.sort !== 'recent' ||
        filters.search !== '' || filters.priceMin !== '' || filters.priceMax !== '' ||
        filters.verifiedSellers || filters.discount || searchQuery !== '';

    // Show API items when filters are active and initialized, otherwise show server items
    const allItems = (hasActiveFilters && initialized) ? apiAuctions : serverItems;

    // Filter by auction status tab
    const now = new Date();
    const filterByTab = (item: Item) => {
        const start = item.startDate ? new Date(item.startDate) : null;
        const end = item.endDate ? new Date(item.endDate) : null;
        const status = item.auctionStatus;

        switch (activeTab) {
            case 'live':
                return status === 'ACTIVE' && start && start <= now && end && end > now;
            case 'upcoming':
                return status === 'ACTIVE' && start && start > now;
            case 'ended':
                return status === 'ENDED' || status === 'CANCELLED' || (end && end <= now);
            default:
                return true;
        }
    };

    const items = allItems.filter(filterByTab);

    // Determine which tabs have auctions
    const tabCounts = {
        live: allItems.filter(i => i.auctionStatus === 'ACTIVE' && i.startDate && new Date(i.startDate) <= now && i.endDate && new Date(i.endDate) > now).length,
        upcoming: allItems.filter(i => i.auctionStatus === 'ACTIVE' && i.startDate && new Date(i.startDate) > now).length,
        ended: allItems.filter(i => i.auctionStatus === 'ENDED' || i.auctionStatus === 'CANCELLED' || (i.endDate && new Date(i.endDate) <= now)).length,
    };

    return (
        <LiveAuctionWrapper
            items={items}
            defaultCategories={defaultCategories}
            onSortChange={handleSortChange}
            currentSort={filters.sort}
            filters={filters}
            onFilterChange={handleFilterChange}
            searchQuery={searchQuery}
            loading={loading}
            userName={userName}
            userAvatar={userAvatar}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabCounts={tabCounts}
        />
    );
};

export default LiveAuctionClient;