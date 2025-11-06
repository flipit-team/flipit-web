import { apiClient, handleApiCall } from '~/lib/api-client';
import { TopNavDTO } from '~/types/api';

export class HomeService {
  // Get top navigation counters
  static async getTopNavCounters() {
    return handleApiCall(() =>
      apiClient.get<TopNavDTO>('/v1/home/top_nav', { requireAuth: true })
    );
  }
}

export default HomeService;
