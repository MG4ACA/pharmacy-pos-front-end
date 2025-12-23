<template>
  <div class="mobile-layout">
    <div class="mobile-header shadow-1">
      <div class="flex align-items-center justify-content-between px-3 py-2 bg-primary text-white">
        <div class="flex align-items-center">
          <i class="pi pi-plus-circle mr-2 text-2xl"></i>
          <span class="font-bold text-xl">Pharmacy POS</span>
        </div>
        <Button icon="pi pi-sign-out" class="p-button-text text-white" @click="logout" />
      </div>
    </div>

    <div class="mobile-content p-3 pb-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <div class="mobile-nav shadow-4">
      <div
        class="flex justify-content-around align-items-center bg-white py-2 border-top-1 border-300"
      >
        <router-link to="/mobile/dashboard" class="nav-item" active-class="active">
          <i class="pi pi-home"></i>
          <span>Home</span>
        </router-link>
        <router-link to="/mobile/sales" class="nav-item" active-class="active">
          <i class="pi pi-chart-line"></i>
          <span>Sales</span>
        </router-link>
        <router-link to="/mobile/inventory" class="nav-item" active-class="active">
          <i class="pi pi-box"></i>
          <span>Stock</span>
        </router-link>
        <router-link to="/mobile/alerts" class="nav-item" active-class="active">
          <i class="pi pi-bell"></i>
          <span v-if="alertCount > 0" class="alert-badge">{{ alertCount }}</span>
          <span>Alerts</span>
        </router-link>
        <router-link to="/mobile/more" class="nav-item" active-class="active">
          <i class="pi pi-ellipsis-h"></i>
          <span>More</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const alertCount = computed(() => {
  return notificationStore.unreadCount || 0;
});

function logout() {
  authStore.logout();
  router.push('/login');
}

onMounted(() => {
  notificationStore.loadNotifications();
});
</script>

<style scoped>
.mobile-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background-color: var(--surface-ground);
  overflow: hidden;
}

.mobile-header {
  flex-shrink: 0;
  z-index: 1000;
}

.mobile-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text-color-secondary);
  font-size: 0.75rem;
  position: relative;
  padding: 0.5rem;
  flex: 1;
}

.nav-item i {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.nav-item.active {
  color: var(--primary-color);
}

.alert-badge {
  position: absolute;
  top: 2px;
  right: 25%;
  background-color: var(--red-500);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pb-8 {
  padding-bottom: 5rem !important;
}
</style>
