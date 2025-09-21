'use client';

import React, { useState } from 'react';
import LiveAuctionWrapper from './LiveAuctionWrapper';
import { Item } from '~/utils/interface';

interface Props {
    items: Item[];
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
}

const LiveAuctionClient = ({ items, defaultCategories }: Props) => {
    const [locationFilter, setLocationFilter] = useState<{ stateCode: string; lgaCode?: string } | null>(null);
    const [currentSort, setCurrentSort] = useState<string>('recent');

    // Handle location filter changes
    const handleLocationFilter = (stateCode: string, lgaCode?: string) => {
        const newFilter = stateCode ? { stateCode, lgaCode } : null;
        setLocationFilter(newFilter);

        // TODO: Implement API filtering for auction items based on location
        console.log('Location filter for auctions:', newFilter);
    };

    // Handle sort changes
    const handleSortChange = (sortValue: string) => {
        setCurrentSort(sortValue);

        // TODO: Implement API sorting for auction items
        console.log('Sort filter for auctions:', sortValue);
    };

    return (
        <LiveAuctionWrapper
            items={items}
            defaultCategories={defaultCategories}
            onLocationFilter={handleLocationFilter}
            onSortChange={handleSortChange}
            currentSort={currentSort}
        />
    );
};

export default LiveAuctionClient;