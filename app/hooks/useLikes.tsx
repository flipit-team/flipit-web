'use client';

import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { LikesService } from '~/services/likes.service';
import { ItemDTO } from '~/types/api';
import { useAppContext } from '~/contexts/AppContext';
import useApi from './useApi';

// Context for managing liked items globally
interface LikesContextValue {
  likedItemIds: Set<number>;
  isLiked: (itemId: number) => boolean;
  toggleLike: (itemId: number) => Promise<void>;
  addLikedItem: (itemId: number) => void;
  removeLikedItem: (itemId: number) => void;
  refreshLikedItems: () => Promise<void>;
}

const LikesContext = createContext<LikesContextValue | null>(null);

export function useLikesContext() {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikesContext must be used within a LikesProvider');
  }
  return context;
}

// Provider component
export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [likedItemIds, setLikedItemIds] = useState<Set<number>>(new Set());
  const { execute } = useApi();
  const { user } = useAppContext();

  const refreshLikedItems = useCallback(async () => {
    // Only fetch liked items if user is authenticated
    if (!user?.token) {
      setLikedItemIds(new Set());
      return;
    }
    
    const result = await execute(() => LikesService.getLikedItems());
    if (result.success && result.data) {
      const itemIds = new Set<number>(result.data.map((item: ItemDTO) => item.id));
      setLikedItemIds(itemIds);
    }
  }, [execute, user?.token]);

  const isLiked = useCallback((itemId: number) => {
    return likedItemIds.has(itemId);
  }, [likedItemIds]);

  const addLikedItem = useCallback((itemId: number) => {
    setLikedItemIds(prev => new Set(Array.from(prev).concat([itemId])));
  }, []);

  const removeLikedItem = useCallback((itemId: number) => {
    setLikedItemIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }, []);

  const toggleLike = useCallback(async (itemId: number) => {
    // Check if user is authenticated before making API call
    if (!user?.token) {
      throw new Error('User must be authenticated to like items');
    }
    
    const wasLiked = isLiked(itemId);
    
    try {
      if (wasLiked) {
        removeLikedItem(itemId);
        await execute(() => LikesService.unlikeItem(itemId));
      } else {
        addLikedItem(itemId);
        await execute(() => LikesService.likeItem(itemId));
      }
    } catch (error) {
      // Revert optimistic update on error
      if (wasLiked) {
        addLikedItem(itemId);
      } else {
        removeLikedItem(itemId);
      }
      throw error;
    }
  }, [isLiked, addLikedItem, removeLikedItem, execute, user?.token]);

  // Load liked items on mount
  useEffect(() => {
    refreshLikedItems();
  }, [refreshLikedItems]);

  const value: LikesContextValue = {
    likedItemIds,
    isLiked,
    toggleLike,
    addLikedItem,
    removeLikedItem,
    refreshLikedItems,
  };

  return React.createElement(LikesContext.Provider, { value }, children);
}

// Hook for individual item like functionality
export function useItemLike(itemId: number) {
  const { isLiked, toggleLike } = useLikesContext();
  const { loading, error } = useApi();

  const handleToggleLike = useCallback(async () => {
    try {
      await toggleLike(itemId);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  }, [itemId, toggleLike]);

  return {
    isLiked: isLiked(itemId),
    toggleLike: handleToggleLike,
    loading,
    error,
  };
}

// Hook for fetching user's liked items (for saved items page)
export function useLikedItems() {
  const [items, setItems] = useState<ItemDTO[]>([]);
  const { loading, error, execute } = useApi();
  const { refreshLikedItems, removeLikedItem } = useLikesContext();
  const { user } = useAppContext();

  const fetchLikedItems = useCallback(async () => {
    if (!user?.token) {
      setItems([]);
      return { success: true, data: [] };
    }
    
    const result = await execute(() => LikesService.getLikedItems());
    if (result.success && result.data) {
      setItems(result.data);
    }
    return result;
  }, [execute, user?.token]);

  const removeLikedItemFromList = useCallback(async (itemId: number) => {
    if (!user?.token) {
      throw new Error('User must be authenticated to unlike items');
    }
    
    const result = await execute(() => LikesService.unlikeItem(itemId));
    if (result.success) {
      setItems(prev => prev.filter(item => item.id !== itemId));
      removeLikedItem(itemId);
    }
    return result;
  }, [execute, removeLikedItem, user?.token]);

  const refresh = useCallback(async () => {
    await refreshLikedItems();
    return fetchLikedItems();
  }, [fetchLikedItems, refreshLikedItems]);

  useEffect(() => {
    fetchLikedItems();
  }, [fetchLikedItems]);

  return {
    items,
    loading,
    error,
    removeLikedItem: removeLikedItemFromList,
    refresh,
    refetch: fetchLikedItems,
  };
}

// Utility hook for checking liked status of multiple items (for item lists)
export function useBulkLikedStatus(itemIds: number[]) {
  const [likedStatus, setLikedStatus] = useState<Record<number, boolean>>({});
  const { user } = useAppContext();

  const checkLikedStatus = useCallback(async () => {
    if (!itemIds.length || !user?.token) {
      setLikedStatus({});
      return;
    }
    
    try {
      const result = await LikesService.checkLikedStatus(itemIds);
      if ('success' in result && result.success && result.data) {
        setLikedStatus(result.data);
      } else if ('data' in result && result.data) {
        setLikedStatus(result.data);
      }
    } catch (error) {
      console.error('Failed to check liked status:', error);
    }
  }, [itemIds, user?.token]);

  useEffect(() => {
    checkLikedStatus();
  }, [checkLikedStatus]);

  return {
    likedStatus,
    isLiked: useCallback((itemId: number) => likedStatus[itemId] || false, [likedStatus]),
    refresh: checkLikedStatus,
  };
}