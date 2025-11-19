import { ipcMain } from 'electron';
import UserController from '../controllers/UserController.js';

// Store current session
let currentSession = {
  user: null,
  token: null,
};

// Auth: Login
ipcMain.handle('auth:login', async (event, credentials) => {
  try {
    const { username, password } = credentials;

    if (!username || !password) {
      return {
        success: false,
        message: 'Username and password are required',
      };
    }

    const result = await UserController.login(username, password);

    if (result.success) {
      currentSession.user = result.user;
      currentSession.token = result.token;
    }

    return result;
  } catch (error) {
    console.error('Auth login handler error:', error);
    return {
      success: false,
      message: 'Login failed',
    };
  }
});

// Auth: Logout
ipcMain.handle('auth:logout', async (event) => {
  try {
    currentSession.user = null;
    currentSession.token = null;

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Auth logout handler error:', error);
    return {
      success: false,
      message: 'Logout failed',
    };
  }
});

// Auth: Get Current User
ipcMain.handle('auth:getCurrentUser', async (event) => {
  try {
    if (!currentSession.user) {
      return {
        success: false,
        message: 'No user logged in',
      };
    }

    return {
      success: true,
      user: currentSession.user,
    };
  } catch (error) {
    console.error('Get current user handler error:', error);
    return {
      success: false,
      message: 'Failed to get current user',
    };
  }
});

// Auth: Change Password
ipcMain.handle('auth:changePassword', async (event, data) => {
  try {
    if (!currentSession.user) {
      return {
        success: false,
        message: 'No user logged in',
      };
    }

    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
      return {
        success: false,
        message: 'Current password and new password are required',
      };
    }

    const result = await UserController.changePassword(
      currentSession.user.id,
      currentPassword,
      newPassword
    );

    return result;
  } catch (error) {
    console.error('Change password handler error:', error);
    return {
      success: false,
      message: 'Failed to change password',
    };
  }
});

// Auth: Check First Run
ipcMain.handle('auth:checkFirstRun', async (event) => {
  try {
    const result = await UserController.checkFirstRun();
    return result;
  } catch (error) {
    console.error('Check first run handler error:', error);
    return {
      success: false,
      isFirstRun: false,
    };
  }
});

console.log('✓ Auth IPC handlers registered');
