<template>
  <div class="flex align-items-center justify-content-center" style="height: 100vh">
    <Card style="width: 500px">
      <template #title>
        <div class="text-center">
          <i class="pi pi-exclamation-circle text-6xl text-orange-500 mb-3"></i>
          <h1 class="text-900">404 - Page Not Found</h1>
        </div>
      </template>
      <template #content>
        <p class="text-center text-600 mb-4">The page you are looking for does not exist.</p>
        <div class="text-center">
          <Button label="Go to Dashboard" icon="pi pi-home" @click="$router.push('/dashboard')" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
</script>
