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

  // Mark notification as seen
  static async markAsSeen(notificationId: number) {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>(`/notifications/${notificationId}/markAsSeen`, {}, { requireAuth: true })
    );
  }

  // Mark all notifications as seen
  static async markAllAsSeen() {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>('/notifications/mark-all-seen', {}, { requireAuth: true })
    );
  }

  // Mark all notifications as read (if endpoint exists)
  static async markAllAsRead() {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>('/notifications/mark-all-read', {}, { requireAuth: true })
    );
  }

  // Get unread notification count (if endpoint exists)
  static async getUnreadCount() {
    return handleApiCall(() =>
      apiClient.get<{ count: number }>('/notifications/unread-count', { requireAuth: true })
    );
  }

  // Delete notification (if endpoint exists)
  static async deleteNotification(notificationId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/notifications/${notificationId}`, { requireAuth: true })
    );
  }

  // Delete all notifications (if endpoint exists)
  static async deleteAllNotifications() {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>('/notifications/all', { requireAuth: true })
    );
  }

  // Get notification by ID (if endpoint exists)
  static async getNotificationById(notificationId: number) {
    return handleApiCall(() =>
      apiClient.get<NotificationDTO>(`/notifications/${notificationId}`, { requireAuth: true })
    );
  }
}

export default NotificationsService;