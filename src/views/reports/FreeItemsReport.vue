<template>
  <div class="free-items-report p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="m-0 text-primary">
          <i class="pi pi-gift mr-2"></i>
          Free Items Report
        </h2>
        <p class="text-600 m-0 mt-1">Track free items received, sold, and revenue generated</p>
      </div>
      <Button
        label="Export to CSV"
        icon="pi pi-download"
        @click="exportReport"
        :disabled="!reportData || isLoading"
        outlined
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

    <!-- Report Summary Cards -->
    <div v-if="reportData" class="grid mb-4">
      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-blue-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Free Items Received</div>
                <div class="summery-card-description">
                  {{ reportData.summary.totalFreeReceived }}
                </div>
                <div class="text-500 text-sm mt-1">
                  {{ reportData.summary.receiptsCount }} receipts
                </div>
              </div>
              <i class="pi pi-inbox text-blue-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-green-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Free Items Sold</div>
                <div class="summery-card-description">
                  {{ reportData.summary.totalFreeSold }}
                </div>
                <div class="text-500 text-sm mt-1">{{ reportData.summary.salesCount }} sales</div>
              </div>
              <i class="pi pi-shopping-cart text-green-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-cyan-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Free Items in Stock</div>
                <div class="summery-card-description">
                  {{ reportData.summary.totalFreeInStock }}
                </div>
                <div class="text-500 text-sm mt-1">
                  Across {{ reportData.summary.productsCount }} products
                </div>
              </div>
              <i class="pi pi-box text-cyan-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-orange-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="summery-card-title">Revenue Generated</div>
                <div class="summery-card-description">
                  <span class="class-lkr">LKR</span>
                  {{ formatCurrency(reportData.summary.totalRevenue) }}
                </div>
                <div class="text-500 text-sm mt-1">From free items sold</div>
              </div>
              <i class="pi pi-dollar text-orange-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Detailed Product Breakdown Table -->
    <Card v-if="reportData && reportData.productBreakdown">
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <span>Free Items by Product</span>
          <Tag :value="`${(reportData.productBreakdown || []).length} Products`" severity="info" />
        </div>
      </template>
      <template #content>
        <DataTable
          :value="reportData.productBreakdown || []"
          :paginator="true"
          :rows="20"
          :rowsPerPageOptions="[10, 20, 50]"
          responsiveLayout="scroll"
          stripedRows
          sortField="freeReceived"
          :sortOrder="-1"
        >
          <template #empty>
            <div class="text-center py-4">
              <i class="pi pi-inbox text-4xl text-400 mb-3"></i>
              <p class="text-600">No free items data found for this period</p>
            </div>
          </template>

          <Column field="productName" header="Product" sortable style="min-width: 250px">
            <template #body="{ data }">
              <div>
                <div class="font-semibold">{{ data.productName }}</div>
                <div class="text-sm text-500" v-if="data.barcode">{{ data.barcode }}</div>
              </div>
            </template>
          </Column>

          <Column field="freeReceived" header="Received (Free)" sortable style="width: 150px">
            <template #body="{ data }">
              <Tag :value="data.freeReceived" severity="info" icon="pi pi-inbox" />
            </template>
          </Column>

          <Column field="freeSold" header="Sold (Free)" sortable style="width: 150px">
            <template #body="{ data }">
              <Tag
                :value="data.freeSold"
                :severity="data.freeSold > 0 ? 'success' : 'secondary'"
                icon="pi pi-shopping-cart"
              />
            </template>
          </Column>

          <Column field="freeRemaining" header="Remaining (Free)" sortable style="width: 150px">
            <template #body="{ data }">
              <Tag
                :value="data.freeRemaining"
                :severity="data.freeRemaining > 0 ? 'warning' : 'secondary'"
                icon="pi pi-box"
              />
            </template>
          </Column>

          <Column field="revenue" header="Revenue from Free" sortable style="width: 180px">
            <template #body="{ data }">
              <div class="font-semibold text-green-600">Rs. {{ formatCurrency(data.revenue) }}</div>
            </template>
          </Column>

          <Column field="utilization" header="Utilization %" sortable style="width: 150px">
            <template #body="{ data }">
              <div>
                <ProgressBar
                  :value="data.utilization"
                  :showValue="false"
                  style="height: 8px"
                  class="mb-1"
                />
                <div class="text-sm text-center">{{ data.utilization.toFixed(1) }}%</div>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- No Data Message -->
    <Card v-if="!reportData && !isLoading" class="text-center">
      <template #content>
        <div class="py-6">
          <i class="pi pi-chart-bar text-6xl text-400 mb-3"></i>
          <p class="text-xl text-600">Select a date range and generate the report</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import SaleService from '@/services/SaleService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();

// State
const startDate = ref(null);
const endDate = ref(null);
const reportData = ref(null);
const isLoading = ref(false);

// Methods
const generateReport = async () => {
  if (!startDate.value || !endDate.value) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please select both start and end dates',
      life: 3000,
    });
    return;
  }

  try {
    isLoading.value = true;

    const params = {
      startDate: formatDateForAPI(startDate.value),
      endDate: formatDateForAPI(endDate.value),
    };

    const response = await SaleService.getFreeItemsSalesReport(params);
    reportData.value = response.data;

    toast.add({
      severity: 'success',
      summary: 'Report Generated',
      detail: 'Free items report generated successfully',
      life: 3000,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to generate report',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const exportReport = async () => {
  if (!reportData.value) return;

  try {
    // Prepare CSV data
    const headers = [
      'Product Name',
      'Barcode',
      'Free Received',
      'Free Sold',
      'Free Remaining',
      'Revenue (LKR)',
      'Utilization %',
    ];

    const rows = reportData.value.productBreakdown.map((item) => [
      item.productName,
      item.barcode || '',
      item.freeReceived,
      item.freeSold,
      item.freeRemaining,
      item.revenue.toFixed(2),
      item.utilization.toFixed(1),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `free-items-report-${formatDateForAPI(startDate.value)}-to-${formatDateForAPI(
        endDate.value
      )}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: 'Report exported to CSV successfully',
      life: 3000,
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    toast.add({
      severity: 'error',
      summary: 'Export Failed',
      detail: 'Failed to export report',
      life: 3000,
    });
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Initialize with current month dates
const initializeDates = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  startDate.value = firstDay;
  endDate.value = today;
};

// Auto-load on mount
onMounted(() => {
  initializeDates();
  generateReport();
});
</script>

<style scoped>
.free-items-report {
  max-width: 100%;
}

.summary-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summery-card-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.summery-card-description {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
}

.class-lkr {
  font-size: 0.875rem;
  font-weight: 400;
  margin-right: 0.25rem;
}
</style>
