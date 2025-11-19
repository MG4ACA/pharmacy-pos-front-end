export class AuthService {
  static async login(credentials) {
    try {
      const result = await window.electronAPI.login(credentials);
      return result;
    } catch (error) {
      console.error('AuthService login error:', error);
      throw new Error('Login failed');
    }
  }

  static async logout() {
    try {
      const result = await window.electronAPI.logout();
      return result;
    } catch (error) {
      console.error('AuthService logout error:', error);
      throw new Error('Logout failed');
    }
  }

  static async getCurrentUser() {
    try {
      const result = await window.electronAPI.getCurrentUser();
      return result;
    } catch (error) {
      console.error('AuthService getCurrentUser error:', error);
      throw new Error('Failed to get current user');
    }
  }

  static async changePassword(data) {
    try {
      const result = await window.electronAPI.changePassword(data);
      return result;
    } catch (error) {
      console.error('AuthService changePassword error:', error);
      throw new Error('Failed to change password');
    }
  }

  static async checkFirstRun() {
    try {
      const result = await window.electronAPI.checkFirstRun();
      return result;
    } catch (error) {
      console.error('AuthService checkFirstRun error:', error);
      throw new Error('Failed to check first run');
    }
  }
}
