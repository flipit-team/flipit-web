import { apiClient, handleApiCall } from '~/lib/api-client';
import { StateDTO, LGADTO } from '~/types/api';

export class LocationService {
  // Get all states
  static async getStates() {
    return handleApiCall(() =>
      apiClient.get<StateDTO[]>('/states')
    );
  }

  // Get a specific state by code
  static async getStateByCode(code: string) {
    return handleApiCall(() =>
      apiClient.get<StateDTO>(`/states/${code}`)
    );
  }

  // Get all LGAs
  static async getAllLGAs() {
    return handleApiCall(() =>
      apiClient.get<LGADTO[]>('/lgas')
    );
  }

  // Get LGAs for a specific state
  static async getLGAsByState(stateCode: string) {
    return handleApiCall(() =>
      apiClient.get<LGADTO[]>(`/lgas/state/${stateCode}`)
    );
  }
}

export default LocationService;
