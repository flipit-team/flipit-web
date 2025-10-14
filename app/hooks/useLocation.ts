import { useState, useEffect, useCallback } from 'react';
import { NIGERIAN_LOCATIONS } from '~/data/nigerianLocations';
import { StateDTO, LGADTO } from '~/types/api';

export function useStates() {
  const [states, setStates] = useState<StateDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      // Convert local data to StateDTO format
      const stateData: StateDTO[] = NIGERIAN_LOCATIONS.states.map((state, index) => ({
        id: index + 1,
        name: state.name,
        code: state.code
      }));
      setStates(stateData);
    } catch (err) {
      setError('An error occurred while loading states');
    } finally {
      setLoading(false);
    }
  }, []);

  return { states, loading, error };
}

export function useLGAs(stateCode?: string) {
  const [lgas, setLGAs] = useState<LGADTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLGAs = useCallback((code?: string) => {
    if (!code) {
      setLGAs([]);
      return;
    }

    try {
      setLoading(true);
      // Find state and get its LGAs from local data
      const state = NIGERIAN_LOCATIONS.states.find(s => s.code === code);
      if (state) {
        const lgaData: LGADTO[] = state.lgas.map((lga, index) => ({
          id: index + 1,
          name: lga.name,
          code: lga.code
        }));
        setLGAs(lgaData);
      } else {
        setLGAs([]);
        setError(`State with code ${code} not found`);
      }
    } catch (err) {
      setError('An error occurred while loading LGAs');
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
