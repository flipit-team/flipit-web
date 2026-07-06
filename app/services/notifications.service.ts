import { apiClient, handleApiCall, buildQueryString } from '~/lib/api-client';
import { NotificationDTO, NotificationsQueryParams, PaginatedResponse } from '~/types/api';

export class NotificationsService {
  // Get notifications with pagination and filtering
  static async getNotifications(params?: NotificationsQueryParams) {
    const queryString = params ? buildQueryString(params) : '';
    return handleApiCall(() =>
      apiClient.get<PaginatedResponse<NotificationDTO>>(`/notifications/get-notifications${queryString}`, { requireAuth: true })
    );
  }

  // Mark notification as read
  static async markAsRead(notificationId: number) {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>(`/notifications/${notificationId}/markAsRead`, {}, { requireAuth: true })
    );
  }

}

export default NotificationsService;