<template>
  <div class="mobile-sales">
    <div class="flex align-items-center justify-content-between mb-3">
      <h2 class="m-0 text-primary">Sales Monitoring</h2>
      <Button icon="pi pi-refresh" text rounded @click="fetchSales" :loading="isLoading" />
    </div>

    <!-- Today's Summary -->
    <Card class="mb-3 bg-primary-reverse">
      <template #content>
        <div class="flex justify-content-around text-center">
          <div class="flex flex-column">
            <span class="text-sm opacity-70">Today's Total</span>
            <span class="text-2xl font-bold">LKR {{ formatCurrency(todayTotal) }}</span>
          </div>
          <Divider layout="vertical" />
          <div class="flex flex-column">
            <span class="text-sm opacity-70">Transactions</span>
            <span class="text-2xl font-bold">{{ sales.length }}</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Sales List -->
    <div class="flex flex-column gap-2">
      <div v-if="!isLoading">
        <Card
          v-for="sale in sales"
          :key="sale.id"
          class="mb-2 shadow-1"
          @click="viewSaleDetails(sale)"
        >
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div class="flex flex-column">
                <span class="font-bold text-lg">#{{ sale.id }}</span>
                <span class="text-500 text-sm">{{ formatDateTime(sale.sale_date) }}</span>
              </div>
              <div class="flex flex-column align-items-end">
                <span class="text-xl font-bold text-primary">
                  LKR {{ formatCurrency(sale.total_amount) }}
                </span>
                <div class="flex gap-1 mt-1">
                  <Tag
                    :value="sale.payment_method"
                    :severity="getPaymentSeverity(sale.payment_method)"
                  />
                  <Tag v-if="sale.discount > 0" value="Discounted" severity="warning" />
                </div>
              </div>
            </div>
          </template>
        </Card>
        <div v-if="sales.length === 0" class="text-center py-5 text-500">
          <i class="pi pi-inbox text-4xl mb-2 block"></i>
          No sales found for today
        </div>
      </div>
      <div v-else class="flex flex-column gap-2">
        <Skeleton v-for="i in 5" :key="i" height="5rem" />
      </div>
    </div>

    <!-- Sale Details Dialog -->
    <Dialog
      v-model:visible="showDetails"
      header="Sale Details"
      position="bottom"
      :modal="true"
      :draggable="false"
      :breakpoints="{ '960px': '95vw' }"
      class="mobile-dialog"
    >
      <div v-if="selectedSale" class="p-2">
        <div class="flex justify-content-between mb-3">
          <span class="text-500">Date:</span>
          <span class="font-semibold">{{ formatDateTime(selectedSale.sale_date) }}</span>
        </div>
        <div class="flex justify-content-between mb-3">
          <span class="text-500">Payment:</span>
          <Tag
            :value="selectedSale.payment_method"
            :severity="getPaymentSeverity(selectedSale.payment_method)"
          />
        </div>

        <Divider />

        <div class="font-bold mb-2">Items</div>
        <div
          v-for="item in selectedSale.saleItems"
          :key="item.id"
          class="flex justify-content-between mb-2 text-sm"
        >
          <div class="flex flex-column">
            <span>{{ item.product?.name }}</span>
            <span class="text-500">
              {{ item.quantity }} x LKR {{ formatCurrency(item.unit_price) }}
            </span>
          </div>
          <span class="font-semibold">LKR {{ formatCurrency(item.total_price) }}</span>
        </div>

        <Divider />

        <div class="flex justify-content-between mb-1">
          <span class="text-500">Subtotal:</span>
          <span>LKR {{ formatCurrency(selectedSale.subtotal) }}</span>
        </div>
        <div
          v-if="selectedSale.discount > 0"
          class="flex justify-content-between mb-1 text-red-500"
        >
          <span>Discount:</span>
          <span>- LKR {{ formatCurrency(selectedSale.discount) }}</span>
        </div>
        <div class="flex justify-content-between mt-2 text-xl font-bold">
          <span>Total:</span>
          <span class="text-primary">LKR {{ formatCurrency(selectedSale.total_amount) }}</span>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import ReportService from '@/services/ReportService';
import { computed, onMounted, ref } from 'vue';

const isLoading = ref(true);
const sales = ref([]);
const selectedSale = ref(null);
const showDetails = ref(false);

const todayTotal = computed(() => {
  return sales.value.reduce((sum, s) => sum + parseFloat(s.total_amount), 0);
});

async function fetchSales() {
  isLoading.value = true;
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await ReportService.getDailySalesReport({
      start_date: today,
      end_date: today,
    });
    if (result.success) {
      sales.value = result.data.sales;
    }
  } catch (error) {
    console.error('Error fetching mobile sales:', error);
  } finally {
    isLoading.value = false;
  }
}

function viewSaleDetails(sale) {
  selectedSale.value = sale;
  showDetails.value = true;
}

function formatCurrency(value) {
  return parseFloat(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPaymentSeverity(method) {
  const severities = { cash: 'success', card: 'info' };
  return severities[method.toLowerCase()] || 'warning';
}

onMounted(() => {
  fetchSales();
});
</script>

<style scoped>
.mobile-sales {
  max-width: 100%;
}
:deep(.p-card-content) {
  padding: 0.5rem 0;
}
.bg-primary-reverse {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}
</style>
