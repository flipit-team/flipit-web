import { apiClient, handleApiCall } from '~/lib/api-client';

export class WaitlistService {
  static async joinWaitlist(email: string) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>('/v1/waitlist', { email }, {})
    );
  }
}

export default WaitlistService;
