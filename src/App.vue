<template>
  <Toast position="top-right" />
  <ConfirmDialog />
  <router-view />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const handleResize = () => {
  if (!authStore.isAuthenticated || route.path === '/login') return;

  const isMobile = window.innerWidth <= 768;
  const isMobilePath = route.path.startsWith('/mobile');

  if (isMobile && !isMobilePath) {
    router.push('/mobile/dashboard');
  } else if (!isMobile && isMobilePath) {
    router.push('/dashboard');
  }
};

onMounted(() => {
  console.log('Pharmacy POS Application Started');
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
* {
  margin: 0;
  /* padding: 0; */
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--surface-ground);
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  width: 100%;
}
</style>
