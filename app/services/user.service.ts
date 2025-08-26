import { apiClient, handleApiCall } from '~/lib/api-client';
import { UserDTO, UpdateProfileRequest, ChangePasswordRequest } from '~/types/api';

export class UserService {
  // Get user profile
  static async getProfile() {
    return handleApiCall(() =>
      apiClient.get<UserDTO>('/profile/get-profile', { requireAuth: true })
    );
  }

  // Update user profile
  static async updateProfile(profileData: UpdateProfileRequest) {
    return handleApiCall(() =>
      apiClient.put<UserDTO>('/profile/update-user', profileData, { requireAuth: true })
    );
  }

  // Get user by ID
  static async getUserById(userId: number) {
    return handleApiCall(() =>
      apiClient.get<UserDTO>(`/user/${userId}`, { requireAuth: true })
    );
  }

  // Update user by ID (admin/self only)
  static async updateUserById(userId: number, userData: UpdateProfileRequest) {
    return handleApiCall(() =>
      apiClient.put<UserDTO>(`/user/${userId}`, userData, { requireAuth: true })
    );
  }

  // Get users (admin only) - NEW
  static async getUsers(page = 0, size = 15) {
    return handleApiCall(() =>
      apiClient.get<UserDTO[]>(`/user/${page}/${size}`, { requireAuth: true })
    );
  }

  // Change password - NEW
  static async changePassword(passwordData: ChangePasswordRequest) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>('/profile/update-password', passwordData, { requireAuth: true })
    );
  }

  // Verify phone number - NEW
  static async verifyPhoneNumber(userId: number, verificationData: any) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>(`/user/${userId}/verify-phoneNumber`, verificationData, { requireAuth: true })
    );
  }

  // Verify user profile - NEW
  static async verifyProfile(userId: number, verificationData: any) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>(`/user/${userId}/verifyProfile`, verificationData, { requireAuth: true })
    );
  }

  // Deactivate user (admin only) - NEW
  static async deactivateUser(userId: number) {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>(`/user/${userId}/deactivateUser`, {}, { requireAuth: true })
    );
  }

  // Reactivate user (admin only) - NEW
  static async reactivateUser(userId: number) {
    return handleApiCall(() =>
      apiClient.put<{ message: string }>(`/user/${userId}/reactivateUser`, {}, { requireAuth: true })
    );
  }

  // Delete user (admin only) - NEW
  static async deleteUser(userId: number) {
    return handleApiCall(() =>
      apiClient.delete<{ message: string }>(`/user/${userId}`, { requireAuth: true })
    );
  }
}

export default UserService;