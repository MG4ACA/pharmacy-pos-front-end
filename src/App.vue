<template>
  <Toast position="top-right" />
  <ConfirmDialog />
  <router-view />
</template>

<script setup>
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { onMounted } from 'vue';

onMounted(() => {
  console.log('Pharmacy POS Application Started');
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
