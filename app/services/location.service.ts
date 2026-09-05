import { apiClient, handleApiCall } from '~/lib/api-client';
import { StateDTO } from '~/types/api';

export class LocationService {
  // Get all states
  static async getStates() {
    return handleApiCall(() =>
      apiClient.get<StateDTO[]>('/v1/states')
    );
  }

  // Get states with LGAs (states already include LGAs inline)
  static async getStatesWithLGAs() {
    return this.getStates();
  }
}

export default LocationService;
