'use client';

import React, { useState, useEffect, useCallback, useContext, createContext, useMemo } from 'react';
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
    if (!user?.token) {
      setLikedItemIds(new Set());
      return;
    }

    const result = await execute(() => LikesService.getLikedItems());
    if (result.success && result.data && Array.isArray(result.data)) {
      const itemIds = new Set<number>(result.data.map((item: ItemDTO) => item.id));
      setLikedItemIds(itemIds);
    }
  }, [execute, user?.token]);

  const isLiked = useCallback((itemId: number) => {
    return likedItemIds.has(itemId);
  }, [likedItemIds]);

  const addLikedItem = useCallback((itemId: number) => {
    setLikedItemIds(prev => {
      const next = new Set(prev);
      next.add(itemId);
      return next;
    });
  }, []);

  const removeLikedItem = useCallback((itemId: number) => {
    setLikedItemIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  }, []);

  const toggleLike = useCallback(async (itemId: number) => {
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

  const value = useMemo(() => ({
    likedItemIds,
    isLiked,
    toggleLike,
    addLikedItem,
    removeLikedItem,
    refreshLikedItems,
  }), [likedItemIds, isLiked, toggleLike, addLikedItem, removeLikedItem, refreshLikedItems]);

  return React.createElement(LikesContext.Provider, { value }, children);
}

// Hook for individual item like functionality
export function useItemLike(itemId: number) {
  const { isLiked, toggleLike } = useLikesContext();
  const [loading, setLoading] = useState(false);

  const handleToggleLike = useCallback(async () => {
    setLoading(true);
    try {
      await toggleLike(itemId);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [itemId, toggleLike]);

  return {
    isLiked: isLiked(itemId),
    toggleLike: handleToggleLike,
    loading,
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
    if (result.success && result.data && Array.isArray(result.data)) {
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
