# Notifications System Implementation

## Overview

A comprehensive notification system has been implemented for the Pharmacy POS application with full CRUD functionality, user preferences, and real-time notification display.

## Features Implemented

### 1. Database Layer

**Tables Created:**

- `notification_preferences` - Stores user notification preferences
- `notifications` - Stores actual notification records

**Models:**

- `NotificationPreference.js` - User-specific notification settings
- `Notification.js` - Individual notification records

**Notification Types:**

1. **Low Stock Alerts** - Configurable threshold and frequency
2. **Expiring Products Alerts** - User-defined days before expiry
3. **Daily Sales Summary** - Scheduled at 11:00 PM daily
4. **System Updates** - Real-time or digest notifications
5. **Payment Reminders** - Configurable frequency

### 2. Backend API

**Controller:** `NotificationController.js`

- `getPreferences()` - Get user notification preferences
- `updatePreferences()` - Update notification settings
- `getNotifications()` - Retrieve notifications with filters
- `getUnreadCount()` - Get count of unread notifications
- `markAsRead()` - Mark single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `deleteNotification()` - Delete single notification
- `deleteAllRead()` - Clear all read notifications
- `createNotification()` - Internal method for creating notifications

**Routes:** `/api/notifications`

- `GET /preferences` - Get notification preferences
- `PUT /preferences` - Update notification preferences
- `GET /` - Get all notifications (with filters)
- `GET /unread-count` - Get unread count
- `PUT /:id/read` - Mark as read
- `PUT /mark-all-read` - Mark all as read
- `DELETE /:id` - Delete notification
- `DELETE /read` - Delete all read notifications

### 3. Frontend Services

**NotificationService.js**

- Full CRUD operations for notifications
- Preference management
- Unread count tracking

**Notification Store (Pinia)**

- State management for notifications
- Real-time updates
- Unread count tracking
- Computed properties for filtering

### 4. UI Components

#### NotificationPreferencesModal.vue

Comprehensive settings modal with:

- Enable/disable toggles for each notification type
- Custom threshold settings (Low Stock)
- Custom days before expiry (Expiring Products)
- Time picker for daily sales summary (23:00:00)
- Frequency options: Real-time, Daily Digest, Weekly Digest
- Save/Cancel functionality

#### NotificationBell.vue

Header notification indicator with:

- Bell icon with unread badge
- Dropdown overlay panel
- Notification list with scrolling
- Mark as read/delete actions
- Time ago formatting
- Color-coded notification types
- Navigation to relevant sections
- Settings access
- Auto-refresh every 30 seconds

### 5. Settings Page Integration

**Notification Card Added:**

- Clickable card in "Additional Settings" section
- Opens NotificationPreferencesModal
- Icon: Bell icon (pi-bell)
- Description: "Configure notification preferences"

### 6. Header Integration

**Navbar.vue Updated:**

- NotificationBell component added
- Positioned between date and user menu
- Opens notification dropdown on click
- Settings button navigates to preferences

## Notification Preference Options

### Low Stock Alerts

- **Enable/Disable:** Toggle on/off
- **Threshold:** Custom units (default: 10)
- **Frequency:** Real-time, Daily, Weekly

### Expiring Products Alerts

- **Enable/Disable:** Toggle on/off
- **Days Before Expiry:** Custom days (default: 30)
- **Frequency:** Real-time, Daily, Weekly

### Daily Sales Summary

- **Enable/Disable:** Toggle on/off
- **Delivery Time:** Custom time picker (default: 23:00:00)

### System Updates

- **Enable/Disable:** Toggle on/off
- **Frequency:** Real-time, Daily, Weekly

### Payment Reminders

- **Enable/Disable:** Toggle on/off (default: disabled)
- **Frequency:** Real-time, Daily, Weekly

## Technical Specifications

### Database Schema

**notification_preferences:**

- `id` - Primary key
- `user_id` - Foreign key to users (unique)
- `low_stock_enabled` - Boolean
- `low_stock_threshold` - Integer (min: 1)
- `low_stock_frequency` - ENUM('realtime', 'daily', 'weekly')
- `expiring_products_enabled` - Boolean
- `expiring_products_days` - Integer (min: 1)
- `expiring_products_frequency` - ENUM
- `daily_sales_enabled` - Boolean
- `daily_sales_time` - TIME
- `system_updates_enabled` - Boolean
- `system_updates_frequency` - ENUM
- `payment_reminders_enabled` - Boolean
- `payment_reminders_frequency` - ENUM
- `created_at`, `updated_at` - Timestamps

**notifications:**

- `id` - Primary key
- `user_id` - Foreign key to users
- `type` - ENUM('low_stock', 'expiring_product', 'daily_sales', 'system_update', 'payment_reminder')
- `title` - String(255)
- `message` - Text
- `metadata` - JSON (additional data)
- `is_read` - Boolean (default: false)
- `read_at` - DateTime (nullable)
- `priority` - ENUM('low', 'medium', 'high')
- `created_at`, `updated_at` - Timestamps

### Indexes

- `notification_preferences.user_id`
- `notifications.user_id`
- `notifications.type`
- `notifications.is_read`
- `notifications.created_at`

## Usage

### For Users

1. **Access Notification Settings:**

   - Click bell icon in header
   - Click settings icon in notification dropdown
   - Navigate to Settings page and click "Notifications" card

2. **Configure Preferences:**

   - Enable/disable notification types
   - Set custom thresholds and frequencies
   - Save changes

3. **View Notifications:**

   - Click bell icon to see notification list
   - Unread count badge shows on bell icon
   - Click notification to navigate to relevant section
   - Mark as read or delete individual notifications

4. **Manage Notifications:**
   - Mark all as read
   - Clear read notifications
   - Delete individual notifications

### For Developers

**Creating Notifications:**

```javascript
await NotificationController.createNotification({
  user_id: userId,
  type: 'low_stock',
  title: 'Low Stock Alert',
  message: 'Product X is running low on stock',
  metadata: { product_id: 123, current_stock: 5 },
  priority: 'high',
});
```

**Checking User Preferences:**

```javascript
const prefs = await NotificationPreference.findOne({
  where: { user_id: userId },
});

if (prefs.low_stock_enabled) {
  // Send low stock notification
}
```

## Future Enhancements

1. **Scheduled Jobs:**

   - Implement cron jobs for checking low stock
   - Schedule expiring product checks
   - Generate daily sales summaries at configured time

2. **Real-time Updates:**

   - WebSocket integration for instant notifications
   - Push notifications for desktop/mobile

3. **Email Notifications:**

   - Email delivery for digest notifications
   - Email templates for each notification type

4. **Advanced Filtering:**

   - Filter by date range
   - Filter by priority
   - Search notifications

5. **Notification History:**

   - Dedicated notifications page
   - Pagination for large datasets
   - Export notification history

6. **Custom Notification Rules:**
   - User-defined notification rules
   - Multiple threshold levels
   - Category-specific settings

## Files Modified/Created

### Backend

- `backend-project/src/database/models/Notification.js` (new)
- `backend-project/src/database/models/NotificationPreference.js` (new)
- `backend-project/src/database/migrations/20251207165053-create-notifications.js` (new)
- `backend-project/src/controllers/NotificationController.js` (new)
- `backend-project/src/routes/notification.routes.js` (new)
- `backend-project/src/routes/index.js` (modified)
- `backend-project/src/database/models/index.js` (modified)

### Frontend

- `src/services/NotificationService.js` (new)
- `src/stores/notification.js` (new)
- `src/components/notifications/NotificationPreferencesModal.vue` (new)
- `src/components/notifications/NotificationBell.vue` (new)
- `src/views/Settings.vue` (modified)
- `src/components/layout/Navbar.vue` (modified)

## Testing Checklist

- [ ] Backend API endpoints respond correctly
- [ ] Preferences save and load properly
- [ ] Notifications display in bell dropdown
- [ ] Unread count updates correctly
- [ ] Mark as read functionality works
- [ ] Delete notifications works
- [ ] Modal opens from Settings page
- [ ] Bell icon shows in navbar
- [ ] Navigation from notifications works
- [ ] Auto-refresh updates unread count
- [ ] Time picker saves correctly for daily sales
- [ ] All frequency options save properly

## Deployment Notes

1. **Database Migration:**

   - Tables will be created automatically on server restart
   - Uses `sequelize.sync({ alter: true })`
   - No manual migration needed

2. **Default Values:**

   - Preferences created with sensible defaults
   - Low stock threshold: 10 units
   - Expiring products: 30 days
   - Daily sales time: 23:00:00

3. **Performance:**

   - Indexed queries for fast retrieval
   - Pagination support for large datasets
   - Auto-refresh interval: 30 seconds

4. **Security:**
   - All routes require authentication
   - User-scoped queries (can only access own notifications)
   - Input validation on all endpoints
