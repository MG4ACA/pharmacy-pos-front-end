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

      <!-- Daily Sales Trend Chart -->
      <div class="col-12">
        <Card>
          <template #title>
            <div class="flex align-items-center justify-content-between">
              <div class="flex align-items-center">
                <i class="pi pi-chart-line mr-2"></i>
                Daily Sales Trend
              </div>
              <div class="flex gap-2">
                <Button
                  label="7 Days"
                  severity="info"
                  text
                  size="small"
                  :outlined="salesTorendDays !== 7"
                  @click="
                    salesTorendDays = 7;
                    fetchDashboardData();
                  "
                />
                <Button
                  label="30 Days"
                  severity="info"
                  text
                  size="small"
                  :outlined="salesTorendDays !== 30"
                  @click="
                    salesTorendDays = 30;
                    fetchDashboardData();
                  "
                />
              </div>
            </div>
          </template>
          <template #content>
            <Chart v-if="!isLoading" type="line" :data="salesTrendData" :options="chartOptions" />
            <Skeleton v-else height="400px" />
          </template>
        </Card>
      </div>

      <!-- Top Selling Products Chart -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-list mr-2"></i>
              Top Selling Products
            </div>
          </template>
          <template #content>
            <Chart
              v-if="!isLoading"
              type="bar"
              :data="topProductsData"
              :options="barChartOptions"
            />
            <Skeleton v-else height="350px" />
          </template>
        </Card>
      </div>

      <!-- Revenue vs Profit Chart -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center">
              <i class="pi pi-chart-bar mr-2"></i>
              Revenue vs Profit Trend
            </div>
          </template>
          <template #content>
            <Chart
              v-if="!isLoading"
              type="bar"
              :data="revenueVsProfitData"
              :options="columnChartOptions"
            />
            <Skeleton v-else height="350px" />
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
import Chart from 'primevue/chart';
import Skeleton from 'primevue/skeleton';

const router = useRouter();
const toast = useToast();

// State
const isLoading = ref(true);
const salesTorendDays = ref(7);
const dashboardData = ref({
  todaySales: 0,
  totalProducts: 0,
  lowStockItems: 0,
  expiringSoon: 0,
  monthSales: 0,
  totalSalesCount: 0,
});

const salesTrendData = ref({});
const topProductsData = ref({});
const revenueVsProfitData = ref({});

// Chart Options
const chartOptions = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return 'Rs.' + value.toLocaleString();
        },
      },
    },
  },
});

const barChartOptions = ref({
  indexAxis: 'y',
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value.toLocaleString();
        },
      },
    },
  },
});

const columnChartOptions = ref({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return 'Rs.' + value.toLocaleString();
        },
      },
    },
  },
});

// Methods
async function fetchDashboardData() {
  isLoading.value = true;

  try {
    const result = await DashboardService.getDashboardSummary({
      days: salesTorendDays.value,
    });

    if (result.success) {
      dashboardData.value = result.data;

      // Initialize Sales Trend Chart
      if (result.data.salesTrend) {
        salesTrendData.value = {
          labels: result.data.salesTrend.labels,
          datasets: [
            {
              label: 'Daily Sales (Rs.)',
              data: result.data.salesTrend.data,
              fill: true,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 4,
              pointBackgroundColor: '#3B82F6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
            },
          ],
        };
      }

      // Initialize Top Products Chart
      if (result.data.topProducts) {
        topProductsData.value = {
          labels: result.data.topProducts.labels,
          datasets: [
            {
              label: 'Quantity Sold',
              data: result.data.topProducts.data,
              backgroundColor: ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#10B981'],
              borderColor: '#fff',
              borderWidth: 1,
            },
          ],
        };
      }

      // Initialize Revenue vs Profit Chart
      if (result.data.revenueVsProfit) {
        revenueVsProfitData.value = {
          labels: result.data.revenueVsProfit.labels,
          datasets: [
            {
              label: 'Revenue (Rs.)',
              data: result.data.revenueVsProfit.revenue,
              backgroundColor: '#3B82F6',
              borderColor: '#1E40AF',
              borderWidth: 1,
            },
            {
              label: 'Profit (Rs.)',
              data: result.data.revenueVsProfit.profit,
              backgroundColor: '#10B981',
              borderColor: '#047857',
              borderWidth: 1,
            },
          ],
        };
      }
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
