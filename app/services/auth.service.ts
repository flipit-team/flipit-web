import { apiClient, handleApiCall, buildQueryString } from '~/lib/api-client';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UserDTO
} from '~/types/api';
import { debugLog, debugError, debugApiResponse } from '~/utils/debug';

export class AuthService {
  // Login
  static async login(credentials: LoginRequest) {
    debugLog('AuthService.login', { credentials: { ...credentials, password: '[REDACTED]' } });
    
    const result = await handleApiCall(() =>
      apiClient.post<LoginResponse>('/auth/login', credentials)
    );
    
    debugApiResponse('/auth/login', result);
    return result;
  }

  // Signup
  static async signup(userData: SignupRequest) {
    // Transform frontend request to backend format
    const backendData = {
      ...userData,
      phoneNumber: userData.phone,
      phone: undefined // Remove phone, use phoneNumber
    };
    
    
    return handleApiCall(() =>
      apiClient.post<SignupResponse>('/auth/register', backendData)
    );
  }

  // Get current user profile
  static async me() {
    const result = await handleApiCall(() =>
      apiClient.get<{ user: UserDTO; isAuthenticated: boolean }>('/auth/me')
    );
    return result;
  }

  // Logout
  static async logout() {
    return handleApiCall(() =>
      apiClient.post('/auth/logout', {}, { requireAuth: true })
    );
  }

  // Google OAuth - Get login URL
  static async getGoogleLoginUrl() {
    return handleApiCall(() =>
      apiClient.get<{ url: string }>('/auth/google-login')
    );
  }

  // Handle Google OAuth callback
  static async handleGoogleCallback(code: string) {
    return handleApiCall(() =>
      apiClient.get<LoginResponse>(`/auth/google/callback${buildQueryString({ code })}`)
    );
  }

  // Forgot password
  static async forgotPassword(email: string) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>(`/auth/recovery${buildQueryString({ email })}`)
    );
  }

  // Reset password
  static async resetPassword(resetData: ResetPasswordRequest) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>('/auth/reset-password', resetData)
    );
  }

  // Change password
  static async changePassword(passwordData: ChangePasswordRequest) {
    return handleApiCall(() =>
      apiClient.post<{ message: string }>('/profile/update-password', passwordData, { requireAuth: true })
    );
  }
}

export default AuthService;