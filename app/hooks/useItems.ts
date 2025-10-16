'use client';

import { useState, useEffect, useCallback } from 'react';
import { ItemsService } from '~/services/items.service';
import { ItemDTO, ItemsQueryParams, CategoryDTO } from '~/types/api';
import useApi from './useApi';

interface UseItemsOptions {
  initialParams?: ItemsQueryParams;
  autoFetch?: boolean;
}

export function useItems(options?: UseItemsOptions | ItemsQueryParams) {
  // Support both old API (just params) and new API (options object)
  const initialParams: ItemsQueryParams | undefined = options && 'initialParams' in options ? options.initialParams : options as ItemsQueryParams | undefined;
  const autoFetch = options && 'autoFetch' in options ? options.autoFetch : true;

  const [items, setItems] = useState<ItemDTO[]>([]);
  const [params, setParams] = useState<ItemsQueryParams>(initialParams || {});
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const { loading, error, execute } = useApi();

  const fetchItems = useCallback(async (searchParams?: ItemsQueryParams, append = false) => {
    const finalParams = searchParams || params;

    const result = await execute(() => ItemsService.getItems(finalParams));

    if (result.success && result.data && result.data.content) {
      const newItems = Array.isArray(result.data.content) ? result.data.content : [];
      const isLast = result.data.last;

      setItems(prev => append ? [...(prev || []), ...newItems] : newItems);
      setHasMore(!isLast);
      setTotalElements(result.data.totalElements);
      setCurrentPage(finalParams.page || 0);
      setInitialized(true);
    }

    return result;
  }, [params, execute]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !initialized) {
      return;
    }
    
    const nextPage = currentPage + 1;
    const newParams = { ...params, page: nextPage };
    
    return fetchItems(newParams, true);
  }, [hasMore, loading, initialized, currentPage, params, fetchItems]);

  const refresh = useCallback(() => {
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    return fetchItems({ ...params, page: 0 });
  }, [params, fetchItems]);

  const updateParams = useCallback((newParams: Partial<ItemsQueryParams>, replace = false) => {
    // If replace is true, use newParams directly; otherwise merge with existing params
    const updatedParams = replace ? { ...newParams, page: 0 } : { ...params, ...newParams, page: 0 };
    setParams(updatedParams);
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    return fetchItems(updatedParams);
  }, [params, fetchItems]);

  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [autoFetch]);

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