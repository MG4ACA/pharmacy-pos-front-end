<template>
  <div class="notification-bell">
    <Button
      icon="pi pi-bell"
      severity="secondary"
      text
      rounded
      @click="toggle"
      v-tooltip.bottom="'Notifications'"
      :badge="unreadCount > 0 ? String(unreadCount) : null"
      badgeSeverity="danger"
    />

    <OverlayPanel ref="op" :style="{ width: '420px' }">
      <!-- Header -->
      <div class="flex align-items-center justify-content-between mb-3">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-bell text-xl"></i>
          <span class="font-bold text-lg">Notifications</span>
          <Tag v-if="unreadCount > 0" :value="unreadCount" severity="danger" rounded />
        </div>
        <div class="flex gap-1">
          <Button
            icon="pi pi-check-circle"
            v-tooltip.top="'Mark all as read'"
            text
            rounded
            size="small"
            @click="handleMarkAllRead"
            :disabled="unreadCount === 0"
          />
          <Button
            icon="pi pi-cog"
            v-tooltip.top="'Settings'"
            text
            rounded
            size="small"
            @click="handleOpenSettings"
          />
        </div>
      </div>

      <Divider class="my-2" />

      <!-- Notifications List -->
      <div v-if="isLoading" class="text-center py-5">
        <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
      </div>

      <div v-else-if="notifications.length === 0" class="text-center py-5">
        <i class="pi pi-inbox text-6xl text-400 mb-3"></i>
        <p class="text-600 mb-0">No notifications</p>
        <small class="text-500">You're all caught up!</small>
      </div>

      <ScrollPanel v-else :style="{ height: '400px' }" class="notification-list">
        <div class="flex flex-column gap-2">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'notification-item p-3 border-round cursor-pointer transition-colors transition-duration-200',
              notification.is_read ? 'surface-50' : 'surface-100',
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex align-items-start gap-3">
              <div
                :class="[
                  'flex-shrink-0 flex align-items-center justify-content-center border-round',
                  'w-2rem h-2rem',
                  getNotificationIconClass(notification.type),
                ]"
              >
                <i :class="['text-sm', getNotificationIcon(notification.type)]"></i>
              </div>

              <div class="flex-grow-1 overflow-hidden">
                <div class="flex align-items-center justify-content-between mb-1">
                  <span
                    :class="[
                      'font-semibold text-sm',
                      !notification.is_read ? 'text-900' : 'text-600',
                    ]"
                  >
                    {{ notification.title }}
                  </span>
                  <Badge
                    v-if="!notification.is_read"
                    value="new"
                    severity="danger"
                    size="small"
                  ></Badge>
                </div>

                <p class="text-sm text-600 mb-2 line-height-3 white-space-normal">
                  {{ notification.message }}
                </p>

                <div class="flex align-items-center justify-content-between">
                  <small class="text-500">{{ formatTimeAgo(notification.created_at) }}</small>
                  <div class="flex gap-1">
                    <Button
                      v-if="!notification.is_read"
                      icon="pi pi-check"
                      text
                      rounded
                      size="small"
                      severity="success"
                      v-tooltip.top="'Mark as read'"
                      @click.stop="handleMarkAsRead(notification.id)"
                    />
                    <Button
                      icon="pi pi-trash"
                      text
                      rounded
                      size="small"
                      severity="danger"
                      v-tooltip.top="'Delete'"
                      @click.stop="handleDelete(notification.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollPanel>

      <!-- Footer -->
      <Divider class="my-2" />
      <div class="flex justify-content-between align-items-center">
        <Button
          label="Clear Read"
          icon="pi pi-trash"
          text
          size="small"
          @click="handleClearRead"
          :disabled="notifications.filter((n) => n.is_read).length === 0"
        />
        <Button
          label="View All"
          icon="pi pi-arrow-right"
          iconPos="right"
          text
          size="small"
          @click="handleViewAll"
        />
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['open-settings']);

const router = useRouter();
const toast = useToast();
const notificationStore = useNotificationStore();

const op = ref();
const isLoading = ref(false);
let refreshInterval = null;

// Computed
const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);

// Methods
onMounted(() => {
  // Notification feature disabled for now
  // loadNotifications();
  // Refresh notifications every 30 seconds
  // refreshInterval = setInterval(() => {
  //   notificationStore.loadUnreadCount();
  // }, 30000);
});

onUnmounted(() => {
  // if (refreshInterval) {
  //   clearInterval(refreshInterval);
  // }
});

async function loadNotifications() {
  isLoading.value = true;
  try {
    await notificationStore.loadNotifications({ limit: 20 });
  } catch (error) {
    console.error('Error loading notifications:', error);
  } finally {
    isLoading.value = false;
  }
}

function toggle(event) {
  op.value.toggle(event);
  if (!op.value.visible) {
    loadNotifications();
  }
}

async function handleMarkAsRead(notificationId) {
  try {
    await notificationStore.markAsRead(notificationId);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to mark notification as read',
      life: 3000,
    });
  }
}

async function handleMarkAllRead() {
  try {
    await notificationStore.markAllAsRead();
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'All notifications marked as read',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to mark all as read',
      life: 3000,
    });
  }
}

async function handleDelete(notificationId) {
  try {
    await notificationStore.deleteNotification(notificationId);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Notification deleted',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete notification',
      life: 3000,
    });
  }
}

async function handleClearRead() {
  try {
    await notificationStore.deleteAllRead();
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Read notifications cleared',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to clear read notifications',
      life: 3000,
    });
  }
}

function handleNotificationClick(notification) {
  // Mark as read if unread
  if (!notification.is_read) {
    handleMarkAsRead(notification.id);
  }

  // Navigate based on notification type
  switch (notification.type) {
    case 'low_stock':
      router.push('/inventory/stock');
      break;
    case 'expiring_product':
      router.push('/inventory/products');
      break;
    case 'daily_sales':
      router.push('/sales/history');
      break;
    default:
      break;
  }

  op.value.hide();
}

function handleOpenSettings() {
  op.value.hide();
  emit('open-settings');
}

function handleViewAll() {
  op.value.hide();
  // Could navigate to a dedicated notifications page if you create one
  router.push('/settings');
}

function getNotificationIcon(type) {
  const icons = {
    low_stock: 'pi pi-exclamation-triangle',
    expiring_product: 'pi pi-calendar-times',
    daily_sales: 'pi pi-chart-line',
    system_update: 'pi pi-sync',
    payment_reminder: 'pi pi-money-bill',
  };
  return icons[type] || 'pi pi-bell';
}

function getNotificationIconClass(type) {
  const classes = {
    low_stock: 'bg-orange-100 text-orange-600',
    expiring_product: 'bg-red-100 text-red-600',
    daily_sales: 'bg-blue-100 text-blue-600',
    system_update: 'bg-purple-100 text-purple-600',
    payment_reminder: 'bg-green-100 text-green-600',
  };
  return classes[type] || 'bg-gray-100 text-gray-600';
}

function formatTimeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return past.toLocaleDateString();
}
</script>

<style scoped>
.notification-item:hover {
  background-color: var(--surface-200) !important;
}

.notification-list :deep(.p-scrollpanel-content) {
  padding-right: 0.5rem;
}
</style>
