<template>
  <ElectronRequired v-if="!isElectron" />
  <template v-else>
    <Toast position="top-right" />
    <ConfirmDialog />
    <router-view />
  </template>
</template>

<script setup>
import ElectronRequired from '@/components/ElectronRequired.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { computed, onMounted } from 'vue';

const isElectron = computed(() => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
});

onMounted(() => {
  console.log('Pharmacy POS Application Started');
  console.log('Running in Electron:', isElectron.value);
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

#app {
  height: 100vh;
  overflow: hidden;
}
</style>
