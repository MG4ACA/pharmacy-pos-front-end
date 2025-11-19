import { requireElectron } from '@/utils/environment';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);

  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials) => {
    try {
      requireElectron();

      // Convert reactive object to plain object for IPC
      const plainCredentials = {
        username: credentials.username,
        password: credentials.password,
      };

      const result = await window.electronAPI.login(plainCredentials);

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
      await window.electronAPI.logout();
      user.value = null;
      token.value = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const result = await window.electronAPI.getCurrentUser();
      if (result.success) {
        user.value = result.user;
      }
      return result;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  };

  const changePassword = async (data) => {
    try {
      const result = await window.electronAPI.changePassword(data);
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
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
  };
});
