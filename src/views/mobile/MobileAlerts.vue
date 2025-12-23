<template>
  <div class="mobile-alerts">
    <div class="flex align-items-center justify-content-between mb-3">
      <h2 class="m-0 text-primary">Alerts</h2>
      <Button icon="pi pi-refresh" text rounded @click="fetchAlerts" :loading="isLoading" />
    </div>

    <TabView>
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-exclamation-triangle text-red-500"></i>
            <span>Low Stock</span>
            <Badge
              :value="lowStockItems.length"
              severity="danger"
              v-if="lowStockItems.length > 0"
            />
          </div>
        </template>

        <div v-if="!isLoading" class="mt-2">
          <Card
            v-for="item in lowStockItems"
            :key="item.id"
            class="mb-2 border-left-3 border-red-500 shadow-1"
          >
            <template #content>
              <div class="flex justify-content-between align-items-center">
                <div class="flex flex-column">
                  <span class="font-bold">{{ item.name }}</span>
                  <span class="text-500 text-xs">Reorder Level: {{ item.reorder_level }}</span>
                </div>
                <div class="flex flex-column align-items-end">
                  <span class="text-xl font-bold text-red-500">{{ item.total_stock }}</span>
                  <span class="text-xs text-500">Remaining</span>
                </div>
              </div>
            </template>
          </Card>
          <div v-if="lowStockItems.length === 0" class="text-center py-5 text-500 italic">
            No low stock items
          </div>
        </div>
        <div v-else class="flex flex-column gap-2 mt-2">
          <Skeleton v-for="i in 4" :key="i" height="4rem" />
        </div>
      </TabPanel>

      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <i class="pi pi-calendar-times text-orange-500"></i>
            <span>Expiring</span>
            <Badge
              :value="expiringItems.length"
              severity="warning"
              v-if="expiringItems.length > 0"
            />
          </div>
        </template>

        <div v-if="!isLoading" class="mt-2">
          <Card
            v-for="item in expiringItems"
            :key="item.id"
            class="mb-2 border-left-3 border-orange-500 shadow-1"
          >
            <template #content>
              <div class="flex justify-content-between align-items-center">
                <div class="flex flex-column">
                  <span class="font-bold">{{ item.product?.name }}</span>
                  <span class="text-500 text-xs">Batch: {{ item.batch_number }}</span>
                  <span class="text-orange-600 font-semibold text-xs mt-1">
                    Expires: {{ formatDate(item.expiry_date) }}
                  </span>
                </div>
                <div class="flex flex-column align-items-end">
                  <span class="text-xl font-bold">{{ item.quantity_remaining }}</span>
                  <span class="text-xs text-500">In Batch</span>
                </div>
              </div>
            </template>
          </Card>
          <div v-if="expiringItems.length === 0" class="text-center py-5 text-500 italic">
            No items expiring soon
          </div>
        </div>
        <div v-else class="flex flex-column gap-2 mt-2">
          <Skeleton v-for="i in 4" :key="i" height="4rem" />
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { ProductService } from '@/services/ProductService';
import StockService from '@/services/StockService';
import { onMounted, ref } from 'vue';

import Badge from 'primevue/badge';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';

const isLoading = ref(true);
const lowStockItems = ref([]);
const expiringItems = ref([]);

async function fetchAlerts() {
  isLoading.value = true;
  try {
    // Fetch low stock items (using products API with a large limit to get all)
    const productRes = await ProductService.getAllProducts({ limit: 1000, status: 'active' });
    if (productRes.success) {
      lowStockItems.value = productRes.data.filter((p) => p.is_low_stock);
    }

    // Fetch expiring items (using stock API, default 90 days)
    const expiringData = await StockService.getExpiringStock(90);
    expiringItems.value = expiringData || [];
  } catch (error) {
    console.error('Error fetching mobile alerts:', error);
  } finally {
    isLoading.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

onMounted(() => {
  fetchAlerts();
});
</script>

<style scoped>
.mobile-alerts {
  max-width: 100%;
}
:deep(.p-tabview-panels) {
  padding: 1rem 0;
  background: transparent;
}
:deep(.p-card-content) {
  padding: 0.5rem 0;
}
</style>
