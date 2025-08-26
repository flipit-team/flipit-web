'use client';

import { useState, useEffect, useCallback } from 'react';
import { ItemsService } from '~/services/items.service';
import { ItemDTO, ItemsQueryParams, CategoryDTO } from '~/types/api';
import useApi from './useApi';

export function useItems(initialParams?: ItemsQueryParams) {
  const [items, setItems] = useState<ItemDTO[]>([]);
  const [params, setParams] = useState<ItemsQueryParams>(initialParams || {});
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [initialized, setInitialized] = useState(false);
  
  const { loading, error, execute } = useApi();

  const fetchItems = useCallback(async (searchParams?: ItemsQueryParams, append = false) => {
    const finalParams = searchParams || params;
    
    const result = await execute(() => ItemsService.getItems(finalParams));
    
    if (result.success && result.data) {
      const newItems = result.data.content;
      setItems(prev => append ? [...(prev || []), ...newItems] : newItems);
      setHasMore(!result.data.last);
      setTotalElements(result.data.totalElements);
      setInitialized(true);
    }
    
    return result;
  }, [params, execute]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !initialized) return;
    
    const itemsLength = Array.isArray(items) ? items.length : 0;
    const nextPage = Math.floor(itemsLength / (params.size || 15));
    const newParams = { ...params, page: nextPage };
    
    return fetchItems(newParams, true);
  }, [hasMore, loading, initialized, items, params, fetchItems]);

  const refresh = useCallback(() => {
    setItems([]);
    return fetchItems({ ...params, page: 0 });
  }, [params, fetchItems]);

  const updateParams = useCallback((newParams: Partial<ItemsQueryParams>) => {
    const updatedParams = { ...params, ...newParams, page: 0 };
    setParams(updatedParams);
    setItems([]);
    return fetchItems(updatedParams);
  }, [params, fetchItems]);

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items: items || [],
    loading,
    error,
    hasMore,
    totalElements,
    params,
    fetchItems,
    loadMore,
    refresh,
    updateParams,
    setParams,
    initialized,
  };
}

export function useItemById(itemId: number | null) {
  const { data: item, loading, error, execute } = useApi<ItemDTO>();

  const fetchItem = useCallback(async () => {
    if (!itemId) return;
    return execute(() => ItemsService.getItemById(itemId));
  }, [itemId, execute]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return {
    item,
    loading,
    error,
    refetch: fetchItem,
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const { loading, error, execute } = useApi<CategoryDTO[]>();

  const fetchCategories = useCallback(async () => {
    const result = await execute(() => ItemsService.getCategories());
    
    if (result.success && result.data) {
      setCategories(result.data);
    } else {
    }
    return result;
  }, [execute]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

export function useUserItems(userId: number | null) {
  const [items, setItems] = useState<ItemDTO[]>([]);
  const { loading, error, execute } = useApi<ItemDTO[]>();

  const fetchUserItems = useCallback(async () => {
    if (!userId) return;
    const result = await execute(() => ItemsService.getUserItems(userId));
    if (result.success && result.data) {
      setItems(result.data);
    }
    return result;
  }, [userId, execute]);

  useEffect(() => {
    fetchUserItems();
  }, [fetchUserItems]);

  return {
    items,
    loading,
    error,
    refetch: fetchUserItems,
  };
}