'use client';

import { useState, useCallback } from 'react';
import { ApiClientError } from '~/lib/api-client';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    apiCall: () => Promise<{ data: T; error: null } | { data: null; error: Error }>
  ) => {
    setState({ data: null, loading: true, error: null });

    try {
      const result = await apiCall();
      
      if (result.error) {
        setState({
          data: null,
          loading: false,
          error: result.error.message,
        });
        return { success: false, error: result.error.message };
      }

      setState({
        data: result.data,
        loading: false,
        error: null,
      });
      return { success: true, data: result.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApi;