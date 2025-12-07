<template>
  <div class="top-selling-report p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="m-0 text-primary">Top Selling Products Report</h2>
        <p class="text-600 m-0 mt-1">Analyze best performing products by revenue</p>
      </div>
      <Button
        label="Export to CSV"
        icon="pi pi-download"
        @click="exportReport"
        :disabled="!reportData || isLoading"
      />
    </div>

    <!-- Filter Panel -->
    <Panel header="Report Parameters" class="mb-4">
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <div class="field">
            <label for="startDate" class="block mb-2">Start Date *</label>
            <Calendar
              id="startDate"
              v-model="startDate"
              dateFormat="yy-mm-dd"
              showIcon
              class="w-full"
              :maxDate="new Date()"
            />
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="field">
            <label for="endDate" class="block mb-2">End Date *</label>
            <Calendar
              id="endDate"
              v-model="endDate"
              dateFormat="yy-mm-dd"
              showIcon
              class="w-full"
              :maxDate="new Date()"
              :minDate="startDate"
            />
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-2">
          <div class="field">
            <label for="sortBy" class="block mb-2">Sort By</label>
            <Dropdown
              id="sortBy"
              v-model="selectedSortBy"
              :options="sortByOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-2">
          <div class="field">
            <label for="limitFilter" class="block mb-2">Number of Products</label>
            <Dropdown
              id="limitFilter"
              v-model="selectedLimit"
              :options="limitOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-2">
          <div class="field">
            <label class="block mb-2">&nbsp;</label>
            <Button
              label="Generate"
              icon="pi pi-chart-bar"
              @click="generateReport"
              :loading="isLoading"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </Panel>

    <!-- Summary Cards -->
    <div v-if="reportData" class="grid mb-4">
      <div class="col-12 md:col-4">
        <Card class="summary-card bg-blue-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Total Products</div>
                <div class="text-900 font-bold text-2xl">
                  {{ reportData.length }}
                </div>
              </div>
              <i class="pi pi-box text-blue-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-4">
        <Card class="summary-card bg-green-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Total Revenue</div>
                <div class="text-900 font-bold text-2xl">
                  LKR {{ formatCurrency(getTotalRevenue()) }}
                </div>
              </div>
              <i class="pi pi-money-bill text-green-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-4">
        <Card class="summary-card bg-purple-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Total Profit</div>
                <div class="text-900 font-bold text-2xl">
                  LKR {{ formatCurrency(getTotalProfit()) }}
                </div>
                <div class="text-500 text-sm mt-1">
                  Margin: {{ getAverageProfitMargin().toFixed(1) }}%
                </div>
              </div>
              <i class="pi pi-chart-line text-purple-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Top Selling Products Table -->
    <Card v-if="reportData">
      <template #title>Top Selling Products</template>
      <template #content>
        <DataTable
          :value="reportData"
          class="p-datatable-sm"
          responsiveLayout="scroll"
          :empty-message="'No sales data found in selected period'"
        >
          <Column header="Rank" style="width: 80px">
            <template #body="{ index }">
              <div class="flex align-items-center gap-2">
                <i v-if="index === 0" class="pi pi-star-fill text-yellow-500"></i>
                <i v-else-if="index === 1" class="pi pi-star-fill text-gray-400"></i>
                <i v-else-if="index === 2" class="pi pi-star-fill text-orange-600"></i>
                <span class="font-bold text-xl">{{ index + 1 }}</span>
              </div>
            </template>
          </Column>

          <Column field="product.name" header="Product" style="min-width: 250px">
            <template #body="{ data }">
              <div>
                <div class="font-semibold text-lg">{{ data.product.name }}</div>
                <div class="text-sm text-500">{{ data.product.description || '-' }}</div>
              </div>
            </template>
          </Column>

          <Column field="product.category.name" header="Category" style="min-width: 150px">
            <template #body="{ data }">
              <Tag :value="data.product.category?.name || 'N/A'" severity="info" />
            </template>
          </Column>

          <Column field="total_quantity" header="Quantity Sold" style="min-width: 150px">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-shopping-cart text-primary"></i>
                <span class="font-semibold text-lg">
                  {{ data.total_quantity }}
                </span>
              </div>
            </template>
          </Column>

          <Column field="sale_count" header="No. of Sales" style="min-width: 130px">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <i class="pi pi-receipt text-600"></i>
                <span class="font-semibold">{{ data.sale_count }} sales</span>
              </div>
            </template>
          </Column>

          <Column field="total_revenue" header="Total Revenue" style="min-width: 180px">
            <template #body="{ data }">
              <div class="font-bold text-primary text-xl">
                LKR {{ formatCurrency(data.total_revenue) }}
              </div>
            </template>
          </Column>

          <Column field="total_profit" header="Total Profit" style="min-width: 180px">
            <template #body="{ data }">
              <div
                class="font-bold text-xl"
                :class="data.total_profit >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                LKR {{ formatCurrency(data.total_profit) }}
              </div>
            </template>
          </Column>

          <Column field="profit_margin" header="Profit Margin" style="min-width: 150px">
            <template #body="{ data }">
              <div class="flex align-items-center gap-2">
                <Tag
                  :value="data.profit_margin.toFixed(1) + '%'"
                  :severity="
                    data.profit_margin >= 30
                      ? 'success'
                      : data.profit_margin >= 15
                      ? 'warning'
                      : 'danger'
                  "
                />
              </div>
            </template>
          </Column>

          <Column header="Performance" style="min-width: 250px">
            <template #body="{ data, index }">
              <div class="flex flex-column gap-2">
                <div class="flex flex-column gap-1">
                  <div class="flex justify-content-between text-sm">
                    <span class="text-600">Revenue Share</span>
                    <span class="font-semibold">
                      {{ ((data.total_revenue / getTotalRevenue()) * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <ProgressBar
                    :value="(data.total_revenue / getTotalRevenue()) * 100"
                    :showValue="false"
                    style="height: 6px"
                  />
                </div>
                <div class="flex flex-column gap-1">
                  <div class="flex justify-content-between text-sm">
                    <span class="text-600">Profit Share</span>
                    <span class="font-semibold">
                      {{ ((data.total_profit / getTotalProfit()) * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <ProgressBar
                    :value="(data.total_profit / getTotalProfit()) * 100"
                    :showValue="false"
                    style="height: 6px"
                    severity="success"
                  />
                </div>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Empty State -->
    <Card v-if="!reportData && !isLoading">
      <template #content>
        <div class="text-center py-6">
          <i class="pi pi-chart-line text-6xl text-400 mb-3"></i>
          <p class="text-xl text-600 mb-2">No Report Generated</p>
          <p class="text-500">
            Select date range and generate the report to view top selling products
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import ReportService from '@/services/ReportService';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import Panel from 'primevue/panel';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';

const toast = useToast();

// State
const isLoading = ref(false);
const reportData = ref(null);
const startDate = ref(new Date());
const endDate = ref(new Date());
const selectedLimit = ref(10);
const selectedSortBy = ref('revenue');

// Set default dates (last 30 days)
startDate.value.setDate(startDate.value.getDate() - 30);
startDate.value.setHours(0, 0, 0, 0);
endDate.value.setHours(23, 59, 59, 999);

const sortByOptions = [
  { label: 'Sort by Revenue', value: 'revenue' },
  { label: 'Sort by Profit', value: 'profit' },
];

const limitOptions = [
  { label: 'Top 5', value: 5 },
  { label: 'Top 10', value: 10 },
  { label: 'Top 20', value: 20 },
  { label: 'Top 50', value: 50 },
  { label: 'Top 100', value: 100 },
];

// Methods
async function generateReport() {
  if (!startDate.value || !endDate.value) {
    toast.add({
      severity: 'warn',
      summary: 'Missing Dates',
      detail: 'Please select both start and end dates',
      life: 3000,
    });
    return;
  }

  if (startDate.value > endDate.value) {
    toast.add({
      severity: 'warn',
      summary: 'Invalid Date Range',
      detail: 'Start date must be before end date',
      life: 3000,
    });
    return;
  }

  isLoading.value = true;

  try {
    const result = await ReportService.getTopSellingProducts({
      start_date: startDate.value.toISOString().split('T')[0],
      end_date: endDate.value.toISOString().split('T')[0],
      limit: selectedLimit.value,
      sort_by: selectedSortBy.value,
    });

    if (result.success) {
      reportData.value = result.data;
      toast.add({
        severity: 'success',
        summary: 'Report Generated',
        detail: `Found ${result.data.length} top selling products`,
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message,
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate report',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

function exportReport() {
  if (!reportData.value || reportData.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'No Data',
      detail: 'Please generate a report first',
      life: 3000,
    });
    return;
  }

  const exportData = reportData.value.map((item, index) => ({
    rank: index + 1,
    product_name: item.product.name,
    description: item.product.description,
    category: item.product.category?.name || 'N/A',
    quantity_sold: item.total_quantity,
    number_of_sales: item.sale_count,
    total_revenue: item.total_revenue,
    total_cost: item.total_cost,
    total_profit: item.total_profit,
    profit_margin: item.profit_margin.toFixed(2),
    revenue_share_percent: ((item.total_revenue / getTotalRevenue()) * 100).toFixed(2),
    profit_share_percent: ((item.total_profit / getTotalProfit()) * 100).toFixed(2),
  }));

  const columns = [
    { field: 'rank', header: 'Rank' },
    { field: 'product_name', header: 'Product Name' },
    { field: 'description', header: 'Description' },
    { field: 'category', header: 'Category' },
    { field: 'quantity_sold', header: 'Quantity Sold' },
    { field: 'number_of_sales', header: 'Number of Sales' },
    { field: 'total_revenue', header: 'Total Revenue' },
    { field: 'total_cost', header: 'Total Cost' },
    { field: 'total_profit', header: 'Total Profit' },
    { field: 'profit_margin', header: 'Profit Margin %' },
    { field: 'revenue_share_percent', header: 'Revenue Share %' },
    { field: 'profit_share_percent', header: 'Profit Share %' },
  ];

  const csvContent = ReportService.exportToCSV(exportData, columns);
  const filename = `top-selling-products-${startDate.value.toISOString().split('T')[0]}-to-${
    endDate.value.toISOString().split('T')[0]
  }.csv`;

  ReportService.downloadCSV(csvContent, filename);

  toast.add({
    severity: 'success',
    summary: 'Export Successful',
    detail: 'Report has been exported to CSV',
    life: 3000,
  });
}

function getTotalRevenue() {
  if (!reportData.value) return 0;
  return reportData.value.reduce((sum, item) => sum + parseFloat(item.total_revenue), 0);
}

function getTotalProfit() {
  if (!reportData.value) return 0;
  return reportData.value.reduce((sum, item) => sum + parseFloat(item.total_profit || 0), 0);
}

function getAverageProfitMargin() {
  if (!reportData.value || reportData.value.length === 0) return 0;
  const totalMargin = reportData.value.reduce(
    (sum, item) => sum + parseFloat(item.profit_margin || 0),
    0
  );
  return totalMargin / reportData.value.length;
}

function getTotalQuantity() {
  if (!reportData.value) return 0;
  return reportData.value.reduce((sum, item) => sum + parseInt(item.total_quantity), 0);
}

function formatCurrency(value) {
  return parseFloat(value || 0).toFixed(2);
}
</script>

<style scoped>
.top-selling-report {
  max-width: 1800px;
  margin: 0 auto;
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
