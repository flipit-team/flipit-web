'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '~/contexts/AppContext';
import { AuthService } from '~/services/auth.service';
import { UserDTO } from '~/types/api';

export interface AuthState {
  isAuthenticated: boolean | null;
  user: UserDTO | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: null,
    user: null,
    loading: true,
    error: null,
  });
  const { setUser } = useAppContext();

  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await AuthService.me();
      
      if (error) {
        console.error('Auth check error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: error.message,
        });
        setUser(null);
        return;
      }

      if (data && data.isAuthenticated && data.user) {
        console.log('Auth check success:', data);
        
        // Ensure user.id exists before trying to access it
        if (!data.user.id) {
          console.error('User data missing id:', data.user);
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'User data is incomplete',
          });
          setUser(null);
          return;
        }
        
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          loading: false,
          error: null,
        });
        setUser({
          token: 'managed-by-cookies',
          userId: data.user.id.toString(),
          userName: data.user.firstName || data.user.username || data.user.email || '',
        });
      } else {
        console.log('Auth check - not authenticated or missing data:', data);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check exception:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication check failed',
      });
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('🔍 Login attempt:', { username: credentials.username });
      const { data, error } = await AuthService.login(credentials);
      
      console.log('🎯 AuthService response:', { data, error });
      
      if (error) {
        console.error('❌ Login error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      if (data) {
        // Handle response format: data might be wrapped in 'message' property
        const responseData = data.message || data;
        console.log('📦 Response data:', responseData);
        
        const user = responseData.user;
        const token = responseData.token || responseData.jwt;
        
        console.log('👤 User data:', user);
        console.log('🔑 Token present:', !!token);
        
        if (!user || !user.id) {
          console.error('❌ Invalid user data:', user);
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: 'Invalid user data received',
          }));
          return { success: false, error: 'Invalid user data received' };
        }
        
        console.log('✅ Login successful, setting auth state');
        setAuthState({
          isAuthenticated: true,
          user: user,
          loading: false,
          error: null,
        });
        setUser({
          token: 'managed-by-cookies',
          userId: user.id.toString(),
          userName: user.firstName || user.username || user.email || '',
        });
        return { success: true, user: user };
      }

      console.error('❌ No data in response');
      return { success: false, error: 'Login failed - no data received' };
    } catch (error) {
      console.error('❌ Login exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      setUser(null);
    }
  }, [setUser]);

  const signup = useCallback(async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    roleIds?: number[];
  }) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await AuthService.signup(userData);
      
      if (error) {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        return { success: false, error: error.message };
      }

      if (data) {
        // Handle response format: data might be wrapped in 'message' property
        const responseData = data.message || data;
        const user = responseData.user;
        
        if (!user || !user.id) {
          setAuthState(prev => ({
            ...prev,
            loading: false,
            error: 'Invalid user data received',
          }));
          return { success: false, error: 'Invalid user data received' };
        }
        
        setAuthState({
          isAuthenticated: true,
          user: user,
          loading: false,
          error: null,
        });
        setUser({
          token: 'managed-by-cookies',
          userId: user.id.toString(),
          userName: user.firstName || user.username || user.email || '',
        });
        return { success: true, user: user };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [setUser]);

  return {
    ...authState,
    login,
    logout,
    signup,
    checkAuth,
    // Legacy compatibility
    isAuthenticated: authState.isAuthenticated,
  };
}

export default useAuth;
