'use client';

import React from 'react';
import NoData from '../no-data/NoData';
import ItemCard from '../item-card/ItemCard';
import { useLikedItems } from '~/hooks/useLikes';

// Remove the SavedItemCard component entirely since we'll use regular ItemCard

const SavedItemsGrid: React.FC = () => {
  const { items, loading, error, removeLikedItem, refresh } = useLikedItems();

  if (loading) {
    return (
      <div className="grid-sizes xs:w-full pr-[60px]">
        <div className="py-9 xs:pt-6 xs:py-0 xs:mb-4 typo-heading-md-semibold">Saved Items</div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="typo-body-md-regular text-text-secondary">Loading saved items...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid-sizes xs:w-full pr-[60px]">
        <div className="py-9 xs:pt-6 xs:py-0 xs:mb-4 typo-heading-md-semibold">Saved Items</div>
        <div className="text-center py-12">
          <p className="typo-body-md-regular text-error mb-4">Failed to load saved items</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-sizes xs:w-full pr-[60px] no-scrollbar">
      <div className="py-9 xs:pt-6 xs:py-0 xs:mb-4 typo-heading-md-semibold">Saved Items</div>
      {items.length > 0 ? (
        <div className="grid grid-cols-3 xs:grid-cols-2 gap-6 xs:gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item as any}
              showSaveButton={true}
              showPromotedBadge={true}
              showVerifiedBadge={true}
            />
          ))}
        </div>
      ) : (
        <NoData text="No saved items yet" />
      )}
    </div>
  );
};

export default SavedItemsGrid;