<template>
  <div class="dashboard">
    <h1 class="page-title text-primary">Dashboard</h1>

    <div class="grid">
      <!-- Summary Cards -->
      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-blue-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Today's Sales</div>
                <div class="text-900 font-bold text-2xl" v-if="!isLoading">
                  LKR {{ formatCurrency(dashboardData.todaySales) }}
                </div>
                <Skeleton v-else height="2rem" width="8rem" />
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
                <div class="text-900 font-bold text-2xl" v-if="!isLoading">
                  {{ dashboardData.totalProducts }}
                </div>
                <Skeleton v-else height="2rem" width="4rem" />
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
        <Card
          class="summary-card bg-orange-50"
          style="cursor: pointer"
          @click="$router.push('/inventory/products')"
        >
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Low Stock Items</div>
                <div class="text-900 font-bold text-2xl" v-if="!isLoading">
                  {{ dashboardData.lowStockItems }}
                </div>
                <Skeleton v-else height="2rem" width="3rem" />
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
        <Card
          class="summary-card bg-red-50"
          style="cursor: pointer"
          @click="$router.push('/inventory/stock-batches')"
        >
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Expiring Soon</div>
                <div class="text-900 font-bold text-2xl" v-if="!isLoading">
                  {{ dashboardData.expiringSoon }}
                </div>
                <Skeleton v-else height="2rem" width="3rem" />
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

      <!-- Free Items Card -->
      <div class="col-12 md:col-6 lg:col-3">
        <Card
          class="summary-card bg-teal-50"
          style="cursor: pointer"
          @click="$router.push('/reports/free-items')"
        >
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Free Items in Stock</div>
                <div class="text-900 font-bold text-2xl" v-if="!isLoading">
                  {{ dashboardData.freeItems?.totalInStock || 0 }}
                </div>
                <Skeleton v-else height="2rem" width="3rem" />
                <div class="text-500 text-sm mt-1" v-if="!isLoading && dashboardData.freeItems">
                  Sold today: {{ dashboardData.freeItems.soldToday || 0 }}
                </div>
              </div>
              <div
                class="bg-teal-500 border-circle flex align-items-center justify-content-center"
                style="width: 3rem; height: 3rem"
              >
                <i class="pi pi-gift text-white text-xl"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-purple-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Free Items Revenue</div>
                <div class="text-900 font-bold text-2xl" v-if="!isLoading">
                  LKR {{ formatCurrency(dashboardData.freeItems?.revenueThisMonth || 0) }}
                </div>
                <Skeleton v-else height="2rem" width="8rem" />
                <div class="text-500 text-sm mt-1" v-if="!isLoading && dashboardData.freeItems">
                  This month
                </div>
              </div>
              <div
                class="bg-purple-500 border-circle flex align-items-center justify-content-center"
                style="width: 3rem; height: 3rem"
              >
                <i class="pi pi-dollar text-white text-xl"></i>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Recent Sales -->
      <div class="col-12 lg:col-8">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <div class="flex align-items-center">
                <i class="pi pi-list mr-2"></i>
                Recent Sales
              </div>
              <Button
                label="View All"
                icon="pi pi-arrow-right"
                text
                size="small"
                @click="$router.push('/sales/history')"
              />
            </div>
          </template>
          <template #content>
            <DataTable
              v-if="!isLoading && dashboardData.recentSales.length > 0"
              :value="dashboardData.recentSales"
              class="p-datatable-sm"
              responsiveLayout="scroll"
            >
              <Column field="id" header="Sale ID" style="width: 100px">
                <template #body="{ data }">
                  <span class="font-semibold">#{{ data.id }}</span>
                </template>
              </Column>
              <Column field="sale_date" header="Date & Time" style="min-width: 180px">
                <template #body="{ data }">
                  {{ formatDate(data.sale_date) }}
                </template>
              </Column>
              <Column field="total_amount" header="Total" style="min-width: 120px">
                <template #body="{ data }">
                  <span class="font-bold text-primary">
                    LKR {{ formatCurrency(data.total_amount) }}
                  </span>
                </template>
              </Column>
              <Column field="payment_method" header="Payment" style="min-width: 100px">
                <template #body="{ data }">
                  <Tag
                    :value="data.payment_method"
                    :severity="getPaymentMethodSeverity(data.payment_method)"
                    style="text-transform: uppercase"
                  />
                </template>
              </Column>
            </DataTable>
            <div v-else-if="!isLoading" class="text-center py-4 text-600">
              <i class="pi pi-inbox text-4xl mb-3 block"></i>
              <p>No sales recorded yet. Start selling from POS!</p>
            </div>
            <div v-else class="flex flex-column gap-2">
              <Skeleton height="3rem" v-for="i in 5" :key="i" />
            </div>
          </template>
        </Card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 lg:col-4">
        <Card>
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-bolt mr-2"></i>
              Quick Actions
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-2">
              <Button
                label="Open POS"
                icon="pi pi-calculator"
                severity="success"
                class="w-full"
                @click="$router.push('/sales/pos')"
              />
              <Button
                label="Add Stock Entry"
                icon="pi pi-plus-circle"
                severity="info"
                class="w-full"
                @click="$router.push('/inventory/stock-entry')"
              />
              <Button
                label="Add New Product"
                icon="pi pi-plus"
                severity="help"
                class="w-full"
                @click="$router.push('/inventory/products/add')"
              />
              <Divider />
              <Button
                label="View Reports"
                icon="pi pi-chart-line"
                severity="secondary"
                outlined
                class="w-full"
                @click="$router.push('/reports/daily-sales')"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import DashboardService from '@/services/DashboardService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Divider from 'primevue/divider';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';

const router = useRouter();
const toast = useToast();

// State
const isLoading = ref(true);
const dashboardData = ref({
  todaySales: 0,
  totalProducts: 0,
  lowStockItems: 0,
  expiringSoon: 0,
  monthSales: 0,
  totalSalesCount: 0,
  recentSales: [],
});

// Methods
async function fetchDashboardData() {
  isLoading.value = true;

  try {
    const result = await DashboardService.getDashboardSummary();

    if (result.success) {
      dashboardData.value = result.data;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load dashboard data',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

function formatCurrency(value) {
  return parseFloat(value || 0).toFixed(2);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPaymentMethodSeverity(method) {
  const severities = {
    cash: 'success',
    card: 'info',
    other: 'warning',
  };
  return severities[method] || 'info';
}

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  width: 100%;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
}

.summary-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.summary-card :deep(.p-card-body) {
  padding: 1.5rem;
}

.summary-card :deep(.p-card-content) {
  padding: 0;
}
</style>
