import apiClient from '@/api/client';

export class AuthService {
  static async login(credentials) {
    try {
      const result = await apiClient.post('/auth/login', credentials);

      // Store token and user in localStorage
      if (result.success && result.token) {
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('AuthService login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  static async logout() {
    try {
      await apiClient.post('/auth/logout');

      // Clear token and user from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      return { success: true };
    } catch (error) {
      console.error('AuthService logout error:', error);
      // Clear local data even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      throw new Error(error.message || 'Logout failed');
    }
  }

  static async getCurrentUser() {
    try {
      const result = await apiClient.get('/auth/me');
      return result;
    } catch (error) {
      console.error('AuthService getCurrentUser error:', error);
      throw new Error(error.message || 'Failed to get current user');
    }
  }

  static async changePassword(data) {
    try {
      const result = await apiClient.put('/auth/change-password', data);
      return result;
    } catch (error) {
      console.error('AuthService changePassword error:', error);
      throw new Error(error.message || 'Failed to change password');
    }
  }

  static async checkFirstRun() {
    try {
      const result = await apiClient.get('/auth/first-run');
      return result;
    } catch (error) {
      console.error('AuthService checkFirstRun error:', error);
      throw new Error(error.message || 'Failed to check first run');
    }
  }
}
