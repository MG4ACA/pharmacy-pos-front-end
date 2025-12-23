<template>
  <div class="mobile-dashboard">
    <div class="flex align-items-center justify-content-between mb-3">
      <h2 class="m-0 text-primary">Dashboard</h2>
      <Button icon="pi pi-refresh" text rounded @click="fetchData" :loading="isLoading" />
    </div>

    <!-- Summary Cards -->
    <div class="grid">
      <div class="col-6">
        <Card class="summary-card bg-blue-50 border-none">
          <template #content>
            <div class="flex flex-column align-items-center">
              <span class="text-500 text-sm mb-1">Today's Sales</span>
              <span class="text-900 font-bold text-xl" v-if="!isLoading">
                LKR {{ formatCurrency(summary.todaySales) }}
              </span>
              <Skeleton v-else height="1.5rem" width="100%" />
            </div>
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="summary-card bg-green-50 border-none">
          <template #content>
            <div class="flex flex-column align-items-center">
              <span class="text-500 text-sm mb-1">Transactions</span>
              <span class="text-900 font-bold text-xl" v-if="!isLoading">
                {{ summary.totalSalesCount }}
              </span>
              <Skeleton v-else height="1.5rem" width="100%" />
            </div>
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="summary-card bg-orange-50 border-none" @click="$router.push('/mobile/alerts')">
          <template #content>
            <div class="flex flex-column align-items-center">
              <span class="text-500 text-sm mb-1">Low Stock</span>
              <span class="text-900 font-bold text-xl" v-if="!isLoading">
                {{ summary.lowStockItems }}
              </span>
              <Skeleton v-else height="1.5rem" width="100%" />
            </div>
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="summary-card bg-red-50 border-none" @click="$router.push('/mobile/alerts')">
          <template #content>
            <div class="flex flex-column align-items-center">
              <span class="text-500 text-sm mb-1">Expiring</span>
              <span class="text-900 font-bold text-xl" v-if="!isLoading">
                {{ summary.expiringSoon }}
              </span>
              <Skeleton v-else height="1.5rem" width="100%" />
            </div>
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="summary-card bg-cyan-50 border-none">
          <template #content>
            <div class="flex flex-column align-items-center">
              <span class="text-500 text-sm mb-1">Gross Profit</span>
              <span class="text-900 font-bold text-xl" v-if="!isLoading">
                LKR {{ formatCurrency(summary.grossProfit) }}
              </span>
              <Skeleton v-else height="1.5rem" width="100%" />
            </div>
          </template>
        </Card>
      </div>
      <div class="col-6">
        <Card class="summary-card bg-teal-50 border-none">
          <template #content>
            <div class="flex flex-column align-items-center">
              <span class="text-500 text-sm mb-1">Net Profit</span>
              <span class="text-900 font-bold text-xl" v-if="!isLoading">
                LKR {{ formatCurrency(summary.netProfit) }}
              </span>
              <Skeleton v-else height="1.5rem" width="100%" />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Sales Chart -->
    <Card class="mt-3">
      <template #title>
        <div class="text-lg font-semibold">Sales Trend (7 Days)</div>
      </template>
      <template #content>
        <div v-if="!isLoading" style="height: 200px">
          <Chart type="line" :data="chartData" :options="chartOptions" />
        </div>
        <Skeleton v-else height="200px" />
      </template>
    </Card>

    <!-- Recent Sales -->
    <Card class="mt-3">
      <template #title>
        <div class="flex align-items-center justify-content-between">
          <div class="text-lg font-semibold">Recent Sales</div>
          <Button label="View All" text size="small" @click="$router.push('/mobile/sales')" />
        </div>
      </template>
      <template #content>
        <div v-if="!isLoading">
          <div
            v-for="sale in summary.recentSales"
            :key="sale.id"
            class="flex align-items-center justify-content-between py-2 border-bottom-1 border-100"
          >
            <div class="flex flex-column">
              <span class="font-semibold">#{{ sale.id }}</span>
              <span class="text-500 text-xs">{{ formatTime(sale.sale_date) }}</span>
            </div>
            <div class="flex flex-column align-items-end">
              <span class="font-bold text-primary">
                LKR {{ formatCurrency(sale.total_amount) }}
              </span>
              <Tag
                :value="sale.payment_method"
                :severity="getPaymentSeverity(sale.payment_method)"
                class="text-xs"
              />
            </div>
          </div>
          <div v-if="summary.recentSales.length === 0" class="text-center py-3 text-500">
            No recent sales
          </div>
        </div>
        <div v-else class="flex flex-column gap-2">
          <Skeleton v-for="i in 3" :key="i" height="3rem" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import DashboardService from '@/services/DashboardService';
import ReportService from '@/services/ReportService';
import { onMounted, ref } from 'vue';

const isLoading = ref(true);
const summary = ref({
  todaySales: 0,
  totalSalesCount: 0,
  lowStockItems: 0,
  expiringSoon: 0,
  recentSales: [],
  grossProfit: 0,
  netProfit: 0,
});

const chartData = ref(null);
const chartOptions = ref({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => 'LKR ' + value,
      },
    },
  },
});

async function fetchData() {
  isLoading.value = true;
  try {
    const today = new Date().toISOString().split('T')[0];
    const [summaryRes, reportRes, todayReportRes] = await Promise.all([
      DashboardService.getDashboardSummary(),
      ReportService.getDailySalesReport({
        start_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: today,
      }),
      ReportService.getDailySalesReport({
        start_date: today,
        end_date: today,
      }),
    ]);

    if (summaryRes.success) {
      summary.value = {
        ...summaryRes.data,
        grossProfit: todayReportRes.success ? todayReportRes.grossProfit : 0,
        netProfit: todayReportRes.success ? todayReportRes.netProfit : 0,
      };
    }

    if (reportRes.success) {
      prepareChartData(reportRes.data.sales);
    }
  } catch (error) {
    console.error('Error fetching mobile dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
}

function prepareChartData(sales) {
  const last7Days = [...Array(7)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    })
    .reverse();

  const dailyTotals = last7Days.map((date) => {
    return sales
      .filter((s) => s.sale_date.startsWith(date))
      .reduce((sum, s) => sum + parseFloat(s.total_amount), 0);
  });

  chartData.value = {
    labels: last7Days.map((d) => d.split('-').slice(1).join('/')),
    datasets: [
      {
        label: 'Daily Sales',
        data: dailyTotals,
        fill: true,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };
}

function formatCurrency(value) {
  return parseFloat(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getPaymentSeverity(method) {
  const severities = { cash: 'success', card: 'info' };
  return severities[method.toLowerCase()] || 'warning';
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.summary-card {
  height: 100%;
}
.summary-card :deep(.p-card-body) {
  padding: 1rem;
}
</style>
