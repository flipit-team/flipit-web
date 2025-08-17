import { apiClient, handleApiCall } from '~/lib/api-client';
import { UserDTO, UpdateProfileRequest } from '~/types/api';

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
}

export default UserService;