import { apiClient, handleApiCall } from '~/lib/api-client';
import { SupportCallbackRequest, AbuseReportRequest } from '~/utils/interface';

export class SupportService {
  // Request support callback
  static async requestCallback(data: SupportCallbackRequest) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>('/v1/support/request_callback', data, { requireAuth: true })
    );
  }

  // Report abusive content/users
  static async reportAbuse(data: AbuseReportRequest) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>('/v1/support/report_abuse', data, { requireAuth: true })
    );
  }
}

export default SupportService;