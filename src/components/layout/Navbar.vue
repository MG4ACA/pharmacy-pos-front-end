<template>
  <div class="navbar">
    <div class="navbar-left">
      <h2 class="navbar-title">
        <i class="pi pi-shield mr-2"></i>
        Pharmacy POS
      </h2>
    </div>

    <div class="navbar-right flex align-items-center gap-3">
      <span class="text-sm text-600">
        <i class="pi pi-calendar mr-1"></i>
        {{ currentDate }}
      </span>

      <div class="user-menu">
        <Button
          type="button"
          icon="pi pi-user"
          :label="authStore.user?.full_name || 'User'"
          text
          @click="toggleUserMenu"
        />
        <Menu ref="menu" :model="userMenuItems" popup />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { useToast } from 'primevue/usetoast';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const menu = ref();

const currentDate = ref('');

const updateDate = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

let dateInterval;
onMounted(() => {
  updateDate();
  dateInterval = setInterval(updateDate, 60000); // Update every minute
});

onUnmounted(() => {
  if (dateInterval) clearInterval(dateInterval);
});

const toggleUserMenu = (event) => {
  menu.value.toggle(event);
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    toast.add({
      severity: 'success',
      summary: 'Logged Out',
      detail: 'You have been logged out successfully',
      life: 3000,
    });
    router.push('/login');
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Logout failed',
      life: 3000,
    });
  }
};

const userMenuItems = [
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => router.push('/settings'),
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: handleLogout,
  },
];
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  background-color: var(--surface-card);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.navbar-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
  display: flex;
  align-items: center;
}

.navbar-right {
  display: flex;
  align-items: center;
}
</style>
