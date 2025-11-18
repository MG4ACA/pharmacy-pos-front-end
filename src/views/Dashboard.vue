<template>
  <div class="dashboard">
    <h1 class="page-title mb-4">Dashboard</h1>

    <div class="grid">
      <!-- Summary Cards -->
      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-blue-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Today's Sales</div>
                <div class="text-900 font-bold text-2xl">LKR 0.00</div>
              </div>
              <div
                class="bg-blue-500 border-circle flex align-items-center justify-content-center"
                style="width: 3rem; height: 3rem"
              >
                <i class="pi pi-shopping-cart text-white text-xl"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-green-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Total Products</div>
                <div class="text-900 font-bold text-2xl">0</div>
              </div>
              <div
                class="bg-green-500 border-circle flex align-items-center justify-content-center"
                style="width: 3rem; height: 3rem"
              >
                <i class="pi pi-box text-white text-xl"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-orange-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Low Stock Items</div>
                <div class="text-900 font-bold text-2xl">0</div>
              </div>
              <div
                class="bg-orange-500 border-circle flex align-items-center justify-content-center"
                style="width: 3rem; height: 3rem"
              >
                <i class="pi pi-exclamation-triangle text-white text-xl"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-red-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Expiring Soon</div>
                <div class="text-900 font-bold text-2xl">0</div>
              </div>
              <div
                class="bg-red-500 border-circle flex align-items-center justify-content-center"
                style="width: 3rem; height: 3rem"
              >
                <i class="pi pi-calendar-times text-white text-xl"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-bolt mr-2"></i>
              Quick Actions
            </div>
          </template>
          <template #content>
            <div class="flex gap-3 flex-wrap">
              <Button
                label="Open POS"
                icon="pi pi-calculator"
                severity="success"
                size="large"
                @click="$router.push('/sales/pos')"
              />
              <Button
                label="Add Stock Entry"
                icon="pi pi-plus-circle"
                severity="info"
                size="large"
                @click="$router.push('/inventory/stock-entry')"
              />
              <Button
                label="Add New Product"
                icon="pi pi-plus"
                severity="help"
                size="large"
                @click="$router.push('/inventory/products/add')"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import Card from 'primevue/card';
import { onMounted } from 'vue';

onMounted(() => {
  // TODO: Fetch dashboard data
  console.log('Dashboard mounted');
});
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
