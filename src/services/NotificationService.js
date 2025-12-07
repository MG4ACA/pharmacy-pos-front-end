import apiClient from '@/api/client';

export class NotificationService {
  /**
   * Get notification preferences
   * @returns {Promise<Object>}
   */
  static async getPreferences() {
    try {
      return await apiClient.get('/notifications/preferences');
    } catch (error) {
      console.error('NotificationService.getPreferences error:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   * @param {Object} data - Preference data
   * @returns {Promise<Object>}
   */
  static async updatePreferences(data) {
    try {
      return await apiClient.put('/notifications/preferences', data);
    } catch (error) {
      console.error('NotificationService.updatePreferences error:', error);
      throw error;
    }
  }

  /**
   * Get all notifications
   * @param {Object} params - Query parameters (type, is_read, limit, offset)
   * @returns {Promise<Object>}
   */
  static async getNotifications(params = {}) {
    try {
      return await apiClient.get('/notifications', { params });
    } catch (error) {
      console.error('NotificationService.getNotifications error:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   * @returns {Promise<Object>}
   */
  static async getUnreadCount() {
    try {
      return await apiClient.get('/notifications/unread-count');
    } catch (error) {
      console.error('NotificationService.getUnreadCount error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>}
   */
  static async markAsRead(notificationId) {
    try {
      return await apiClient.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('NotificationService.markAsRead error:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>}
   */
  static async markAllAsRead() {
    try {
      return await apiClient.put('/notifications/mark-all-read');
    } catch (error) {
      console.error('NotificationService.markAllAsRead error:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   * @param {number} notificationId - Notification ID
   * @returns {Promise<Object>}
   */
  static async deleteNotification(notificationId) {
    try {
      return await apiClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('NotificationService.deleteNotification error:', error);
      throw error;
    }
  }

  /**
   * Delete all read notifications
   * @returns {Promise<Object>}
   */
  static async deleteAllRead() {
    try {
      return await apiClient.delete('/notifications/read');
    } catch (error) {
      console.error('NotificationService.deleteAllRead error:', error);
      throw error;
    }
  }
}
