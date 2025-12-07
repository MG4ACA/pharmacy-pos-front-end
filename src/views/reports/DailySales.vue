<template>
  <div class="daily-sales-report p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="m-0 text-primary">Daily Sales Report</h2>
        <p class="text-600 m-0 mt-1">Generate and export sales reports</p>
      </div>
      <Button
        label="Export to CSV"
        icon="pi pi-download"
        @click="exportReport"
        :disabled="!reportData || isLoading"
      />
    </div>

    <!-- Date Range Filter -->
    <Panel header="Report Parameters" class="mb-4">
      <div class="grid">
        <div class="col-12 md:col-4">
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

        <div class="col-12 md:col-4">
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

        <div class="col-12 md:col-4">
          <div class="field">
            <label class="block mb-2">&nbsp;</label>
            <Button
              label="Generate Report"
              icon="pi pi-chart-bar"
              @click="generateReport"
              :loading="isLoading"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </Panel>

    <!-- Report Summary -->
    <div v-if="reportData" class="grid mb-4">
      <div class="col-12 md:col-6 lg:col-2">
        <Card class="summary-card bg-blue-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Total Sales</div>
                <div class="summery-card-description">
                  {{ reportData.summary.totalSales }}
                </div>
              </div>
              <i class="pi pi-shopping-cart text-blue-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-2">
        <Card class="summary-card bg-green-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Total Revenue</div>
                <div class="summery-card-description">
                  <span class="class-lkr">LKR</span>
                  {{ formatCurrency(reportData.summary.totalRevenue) }}
                </div>
              </div>
              <i class="pi pi-money-bill text-green-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-2">
        <Card class="summary-card bg-orange-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Total Discount</div>
                <div class="summery-card-description">
                  <span class="class-lkr">LKR</span>
                  {{ formatCurrency(reportData.summary.totalDiscount) }}
                </div>
              </div>
              <i class="pi pi-percentage text-orange-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-2">
        <Card class="summary-card bg-purple-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Net Revenue</div>
                <div class="summery-card-description">
                  <span class="class-lkr">LKR</span>
                  {{ formatCurrency(reportData.summary.netRevenue) }}
                </div>
              </div>
              <i class="pi pi-wallet text-purple-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-2">
        <Card class="summary-card bg-cyan-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Gross Profit</div>
                <div class="summery-card-description">
                  <span class="class-lkr">LKR</span>
                  {{ formatCurrency(reportData.summary.grossProfit) }}
                </div>
                <div class="text-500 text-sm mt-1">
                  Margin: {{ reportData.summary.profitMargin.toFixed(1) }}%
                </div>
              </div>
              <i class="pi pi-chart-line text-cyan-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-2">
        <Card class="summary-card bg-teal-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Net Profit</div>
                <div class="summery-card-description">
                  <span class="class-lkr">LKR</span>
                  {{ formatCurrency(reportData.summary.netProfit) }}
                </div>
                <div class="text-500 text-sm mt-1">
                  Cost:
                  <span class="class-lkr">LKR</span>
                  {{ formatCurrency(reportData.summary.totalCost) }}
                </div>
              </div>
              <i class="pi pi-dollar text-teal-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Payment Method Breakdown -->
    <div v-if="reportData" class="grid mb-4">
      <div class="col-12 md:col-6">
        <Card>
          <template #title>Payment Method Breakdown</template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center gap-2">
                  <Tag value="CASH" severity="success" />
                </div>
                <span class="font-bold text-xl">
                  LKR {{ formatCurrency(reportData.paymentBreakdown.cash) }}
                </span>
              </div>
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center gap-2">
                  <Tag value="CARD" severity="info" />
                </div>
                <span class="font-bold text-xl">
                  LKR {{ formatCurrency(reportData.paymentBreakdown.card) }}
                </span>
              </div>
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center gap-2">
                  <Tag value="OTHER" severity="warning" />
                </div>
                <span class="font-bold text-xl">
                  LKR {{ formatCurrency(reportData.paymentBreakdown.other) }}
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6">
        <Card>
          <template #title>Category-wise Sales</template>
          <template #content>
            <div class="flex flex-column gap-2" style="max-height: 300px; overflow-y: auto">
              <div
                v-for="(amount, category) in reportData.categoryTotals"
                :key="category"
                class="flex align-items-center justify-content-between p-2 surface-100 border-round"
              >
                <span class="font-semibold">{{ category }}</span>
                <span class="font-bold text-primary">LKR {{ formatCurrency(amount) }}</span>
              </div>
              <div
                v-if="Object.keys(reportData.categoryTotals).length === 0"
                class="text-center text-600 py-3"
              >
                No category data available
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Sales Table -->
    <Card v-if="reportData">
      <template #title>Sales Transactions</template>
      <template #content>
        <DataTable
          :value="reportData.sales"
          paginator
          :rows="10"
          class="p-datatable-sm"
          responsiveLayout="scroll"
          :empty-message="'No sales found in selected date range'"
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

          <Column header="Items" style="min-width: 150px">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.items?.length || 0 }} items</span>
            </template>
          </Column>

          <Column field="subtotal" header="Subtotal" style="min-width: 120px">
            <template #body="{ data }">LKR {{ formatCurrency(data.subtotal) }}</template>
          </Column>

          <Column field="discount" header="Discount" style="min-width: 120px">
            <template #body="{ data }">
              <span v-if="data.discount > 0" class="text-red-500">
                - LKR {{ formatCurrency(data.discount) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>

          <Column field="tax" header="Tax" style="min-width: 120px">
            <template #body="{ data }">
              <span v-if="data.tax > 0" class="text-green-600">
                + LKR {{ formatCurrency(data.tax) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>

          <Column field="total_amount" header="Total" style="min-width: 130px">
            <template #body="{ data }">
              <span class="font-bold text-primary">
                LKR {{ formatCurrency(data.total_amount) }}
              </span>
            </template>
          </Column>

          <Column field="payment_method" header="Payment" style="min-width: 120px">
            <template #body="{ data }">
              <Tag
                :value="data.payment_method"
                :severity="getPaymentMethodSeverity(data.payment_method)"
                style="text-transform: uppercase"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Empty State -->
    <Card v-if="!reportData && !isLoading">
      <template #content>
        <div class="text-center py-6">
          <i class="pi pi-chart-bar text-6xl text-400 mb-3"></i>
          <p class="text-xl text-600 mb-2">No Report Generated</p>
          <p class="text-500">Select a date range and click "Generate Report" to view sales data</p>
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
import Panel from 'primevue/panel';
import Tag from 'primevue/tag';

const toast = useToast();

// State
const isLoading = ref(false);
const reportData = ref(null);
const startDate = ref(new Date());
const endDate = ref(new Date());

// Set default dates (today)
startDate.value.setHours(0, 0, 0, 0);
endDate.value.setHours(23, 59, 59, 999);

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
    const result = await ReportService.getDailySalesReport({
      start_date: startDate.value.toISOString().split('T')[0],
      end_date: endDate.value.toISOString().split('T')[0],
    });

    if (result.success) {
      reportData.value = result.data;
      toast.add({
        severity: 'success',
        summary: 'Report Generated',
        detail: 'Sales report has been generated successfully',
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
  if (!reportData.value || !reportData.value.sales) {
    toast.add({
      severity: 'warn',
      summary: 'No Data',
      detail: 'Please generate a report first',
      life: 3000,
    });
    return;
  }

  const columns = [
    { field: 'id', header: 'Sale ID' },
    { field: 'sale_date', header: 'Date & Time' },
    { field: 'subtotal', header: 'Subtotal' },
    { field: 'discount', header: 'Discount' },
    { field: 'tax', header: 'Tax' },
    { field: 'total_amount', header: 'Total Amount' },
    { field: 'payment_method', header: 'Payment Method' },
    { field: 'payment_status', header: 'Payment Status' },
  ];

  const csvContent = ReportService.exportToCSV(reportData.value.sales, columns);
  const filename = `daily-sales-report-${reportData.value.dateRange.start}-to-${reportData.value.dateRange.end}.csv`;

  ReportService.downloadCSV(csvContent, filename);

  toast.add({
    severity: 'success',
    summary: 'Export Successful',
    detail: 'Report has been exported to CSV',
    life: 3000,
  });
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
</script>

<style scoped>
.daily-sales-report {
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

.summery-card-title {
  font-size: 12px;
}

.summery-card-description {
  font-size: 1.2rem;
  color: var(--surface-900) !important;
  font-weight: 700 !important;
}
.class-lkr {
  font-size: 12px;
}
</style>
