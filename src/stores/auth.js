import { AuthService } from '@/services/AuthService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Initialize from localStorage
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('auth_token');

  const user = ref(storedUser ? JSON.parse(storedUser) : null);
  const token = ref(storedToken || null);

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  const login = async (credentials) => {
    try {
      const result = await AuthService.login(credentials);

      if (result.success) {
        user.value = result.user;
        token.value = result.token;
        return result;
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      user.value = null;
      token.value = null;
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state even if API call fails
      user.value = null;
      token.value = null;
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const result = await AuthService.getCurrentUser();
      if (result.success) {
        user.value = result.user;
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      return result;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  };

  const changePassword = async (data) => {
    try {
      const result = await AuthService.changePassword(data);
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  // Initialize user from token on app load
  const initAuth = async () => {
    if (token.value && !user.value) {
      try {
        await getCurrentUser();
      } catch (error) {
        // Token might be expired, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        token.value = null;
        user.value = null;
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    getCurrentUser,
    changePassword,
    initAuth,
  };
});
