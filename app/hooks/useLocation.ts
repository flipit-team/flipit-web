import { useState, useEffect, useCallback } from 'react';
import { LocationService } from '~/services/location.service';
import { StateDTO, LGADTO } from '~/types/api';

export function useStates() {
  const [states, setStates] = useState<StateDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const result = await LocationService.getStates();

        if (result.data) {
          setStates(result.data);
        } else {
          setError(result.error?.message || 'Failed to fetch states');
        }
      } catch (err) {
        setError('An error occurred while fetching states');
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, loading, error };
}

export function useLGAs(stateCode?: string) {
  const [lgas, setLGAs] = useState<LGADTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLGAs = useCallback(async (code?: string) => {
    if (!code) {
      setLGAs([]);
      return;
    }

    try {
      setLoading(true);
      const result = await LocationService.getLGAsByState(code);

      if (result.data) {
        setLGAs(result.data);
      } else {
        setError(result.error?.message || 'Failed to fetch LGAs');
      }
    } catch (err) {
      setError('An error occurred while fetching LGAs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (stateCode) {
      fetchLGAs(stateCode);
    } else {
      setLGAs([]);
    }
  }, [stateCode, fetchLGAs]);

  return { lgas, loading, error, refetch: fetchLGAs };
}
