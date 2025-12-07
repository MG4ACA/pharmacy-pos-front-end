import { NotificationService } from '@/services/NotificationService';
import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  // State
  state: () => ({
    notifications: [],
    preferences: null,
    unreadCount: 0,
    isLoading: false,
    error: null,
  }),

  // Getters
  getters: {
    unreadNotifications: (state) => {
      return state.notifications.filter((n) => !n.is_read);
    },

    notificationsByType: (state) => {
      return (type) => state.notifications.filter((n) => n.type === type);
    },

    hasUnread: (state) => {
      return state.unreadCount > 0;
    },
  },

  // Actions
  actions: {
    /**
     * Load notification preferences
     */
    async loadPreferences() {
      try {
        this.isLoading = true;
        this.error = null;

        const result = await NotificationService.getPreferences();

        if (result.success) {
          this.preferences = result.data;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error loading preferences:', error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Update notification preferences
     */
    async updatePreferences(data) {
      try {
        this.isLoading = true;
        this.error = null;

        const result = await NotificationService.updatePreferences(data);

        if (result.success) {
          this.preferences = result.data;
          return result;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error updating preferences:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Load notifications
     */
    async loadNotifications(params = {}) {
      try {
        this.isLoading = true;
        this.error = null;

        const result = await NotificationService.getNotifications(params);

        if (result.success) {
          this.notifications = result.data;
          this.unreadCount = result.unreadCount || 0;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error loading notifications:', error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Load unread count
     */
    async loadUnreadCount() {
      try {
        const result = await NotificationService.getUnreadCount();

        if (result.success) {
          this.unreadCount = result.count;
        }
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    },

    /**
     * Mark notification as read
     */
    async markAsRead(notificationId) {
      try {
        const result = await NotificationService.markAsRead(notificationId);

        if (result.success) {
          const notification = this.notifications.find((n) => n.id === notificationId);
          if (notification) {
            notification.is_read = true;
            notification.read_at = new Date();
          }
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead() {
      try {
        const result = await NotificationService.markAllAsRead();

        if (result.success) {
          this.notifications.forEach((n) => {
            n.is_read = true;
            n.read_at = new Date();
          });
          this.unreadCount = 0;
        }
      } catch (error) {
        console.error('Error marking all as read:', error);
        throw error;
      }
    },

    /**
     * Delete notification
     */
    async deleteNotification(notificationId) {
      try {
        const result = await NotificationService.deleteNotification(notificationId);

        if (result.success) {
          const index = this.notifications.findIndex((n) => n.id === notificationId);
          if (index !== -1) {
            const wasUnread = !this.notifications[index].is_read;
            this.notifications.splice(index, 1);
            if (wasUnread) {
              this.unreadCount = Math.max(0, this.unreadCount - 1);
            }
          }
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
      }
    },

    /**
     * Delete all read notifications
     */
    async deleteAllRead() {
      try {
        const result = await NotificationService.deleteAllRead();

        if (result.success) {
          this.notifications = this.notifications.filter((n) => !n.is_read);
        }
      } catch (error) {
        console.error('Error deleting all read notifications:', error);
        throw error;
      }
    },

    /**
     * Add new notification (for real-time updates)
     */
    addNotification(notification) {
      this.notifications.unshift(notification);
      if (!notification.is_read) {
        this.unreadCount++;
      }
    },

    /**
     * Clear all notifications
     */
    clearNotifications() {
      this.notifications = [];
      this.unreadCount = 0;
    },
  },
});
