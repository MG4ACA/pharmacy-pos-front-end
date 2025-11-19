<template>
  <div class="expiring-products-report p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="m-0 text-primary">Expiring Products Report</h2>
        <p class="text-600 m-0 mt-1">Monitor products approaching expiration</p>
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
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="daysFilter" class="block mb-2">Check Products Expiring Within</label>
            <Dropdown
              id="daysFilter"
              v-model="selectedDays"
              :options="daysOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label class="block mb-2">&nbsp;</label>
            <Button
              label="Generate Report"
              icon="pi pi-refresh"
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
        <Card class="summary-card bg-red-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Urgent (≤7 days)</div>
                <div class="text-900 font-bold text-2xl text-red-600">
                  {{ reportData.urgent.length }} items
                </div>
              </div>
              <i class="pi pi-exclamation-circle text-red-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-4">
        <Card class="summary-card bg-orange-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Warning (8-30 days)</div>
                <div class="text-900 font-bold text-2xl text-orange-600">
                  {{ reportData.warning.length }} items
                </div>
              </div>
              <i class="pi pi-exclamation-triangle text-orange-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-4">
        <Card class="summary-card bg-purple-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Total Value at Risk</div>
                <div class="text-900 font-bold text-2xl text-purple-700">
                  LKR {{ formatCurrency(reportData.totalValueAtRisk) }}
                </div>
              </div>
              <i class="pi pi-money-bill text-purple-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Expiring Products Tabs -->
    <Card v-if="reportData">
      <template #content>
        <TabView>
          <!-- Urgent Tab (≤7 days) -->
          <TabPanel>
            <template #header>
              <span class="flex align-items-center gap-2">
                <i class="pi pi-exclamation-circle text-red-500"></i>
                <span>Urgent - Expires in 7 Days or Less ({{ reportData.urgent.length }})</span>
              </span>
            </template>
            <DataTable
              :value="reportData.urgent"
              paginator
              :rows="10"
              class="p-datatable-sm"
              responsiveLayout="scroll"
              :empty-message="'No urgent expiring products'"
            >
              <Column field="Product.name" header="Product" style="min-width: 250px">
                <template #body="{ data }">
                  <div class="font-semibold">{{ data.Product.name }}</div>
                  <div class="text-sm text-500">{{ data.Product.generic_name || '-' }}</div>
                </template>
              </Column>

              <Column field="batch_number" header="Batch Number" style="min-width: 150px">
                <template #body="{ data }">
                  <span class="font-mono">{{ data.batch_number }}</span>
                </template>
              </Column>

              <Column field="expiry_date" header="Expiry Date" style="min-width: 150px">
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <Tag :value="formatDate(data.expiry_date)" severity="danger" />
                    <span class="text-sm text-red-600 font-semibold">
                      ({{ getDaysRemaining(data.expiry_date) }} days)
                    </span>
                  </div>
                </template>
              </Column>

              <Column field="quantity" header="Quantity" style="min-width: 120px">
                <template #body="{ data }">
                  <span class="font-semibold">{{ data.quantity }} {{ data.Product.unit }}</span>
                </template>
              </Column>

              <Column field="Product.purchase_price" header="Unit Price" style="min-width: 130px">
                <template #body="{ data }">
                  LKR {{ formatCurrency(data.Product.purchase_price) }}
                </template>
              </Column>

              <Column header="Total Value" style="min-width: 140px">
                <template #body="{ data }">
                  <span class="font-semibold text-red-600">
                    LKR {{ formatCurrency(data.quantity * data.Product.purchase_price) }}
                  </span>
                </template>
              </Column>

              <Column field="Supplier.name" header="Supplier" style="min-width: 180px">
                <template #body="{ data }">
                  {{ data.Supplier?.name || 'N/A' }}
                </template>
              </Column>
            </DataTable>
          </TabPanel>

          <!-- Warning Tab (8-30 days) -->
          <TabPanel>
            <template #header>
              <span class="flex align-items-center gap-2">
                <i class="pi pi-exclamation-triangle text-orange-500"></i>
                <span>Warning - Expires in 8-30 Days ({{ reportData.warning.length }})</span>
              </span>
            </template>
            <DataTable
              :value="reportData.warning"
              paginator
              :rows="10"
              class="p-datatable-sm"
              responsiveLayout="scroll"
              :empty-message="'No products expiring in this period'"
            >
              <Column field="Product.name" header="Product" style="min-width: 250px">
                <template #body="{ data }">
                  <div class="font-semibold">{{ data.Product.name }}</div>
                  <div class="text-sm text-500">{{ data.Product.generic_name || '-' }}</div>
                </template>
              </Column>

              <Column field="batch_number" header="Batch Number" style="min-width: 150px">
                <template #body="{ data }">
                  <span class="font-mono">{{ data.batch_number }}</span>
                </template>
              </Column>

              <Column field="expiry_date" header="Expiry Date" style="min-width: 150px">
                <template #body="{ data }">
                  <div class="flex align-items-center gap-2">
                    <Tag :value="formatDate(data.expiry_date)" severity="warning" />
                    <span class="text-sm text-orange-600 font-semibold">
                      ({{ getDaysRemaining(data.expiry_date) }} days)
                    </span>
                  </div>
                </template>
              </Column>

              <Column field="quantity" header="Quantity" style="min-width: 120px">
                <template #body="{ data }">
                  <span class="font-semibold">{{ data.quantity }} {{ data.Product.unit }}</span>
                </template>
              </Column>

              <Column field="Product.purchase_price" header="Unit Price" style="min-width: 130px">
                <template #body="{ data }">
                  LKR {{ formatCurrency(data.Product.purchase_price) }}
                </template>
              </Column>

              <Column header="Total Value" style="min-width: 140px">
                <template #body="{ data }">
                  <span class="font-semibold text-orange-600">
                    LKR {{ formatCurrency(data.quantity * data.Product.purchase_price) }}
                  </span>
                </template>
              </Column>

              <Column field="Supplier.name" header="Supplier" style="min-width: 180px">
                <template #body="{ data }">
                  {{ data.Supplier?.name || 'N/A' }}
                </template>
              </Column>
            </DataTable>
          </TabPanel>
        </TabView>
      </template>
    </Card>

    <!-- Empty State -->
    <Card v-if="!reportData && !isLoading">
      <template #content>
        <div class="text-center py-6">
          <i class="pi pi-calendar-times text-6xl text-400 mb-3"></i>
          <p class="text-xl text-600 mb-2">No Report Generated</p>
          <p class="text-500">Select a time period and generate the report</p>
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
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import Panel from 'primevue/panel';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Tag from 'primevue/tag';

const toast = useToast();

// State
const isLoading = ref(false);
const reportData = ref(null);
const selectedDays = ref(30);

const daysOptions = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '30 Days', value: 30 },
  { label: '60 Days', value: 60 },
  { label: '90 Days', value: 90 },
];

// Methods
async function generateReport() {
  isLoading.value = true;

  try {
    const result = await ReportService.getExpiringProductsReport(selectedDays.value);

    if (result.success) {
      reportData.value = result.data;
      toast.add({
        severity: 'success',
        summary: 'Report Generated',
        detail: `Found ${result.data.urgent.length + result.data.warning.length} expiring products`,
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
  if (!reportData.value) {
    toast.add({
      severity: 'warn',
      summary: 'No Data',
      detail: 'Please generate a report first',
      life: 3000,
    });
    return;
  }

  // Combine urgent and warning into one dataset
  const allExpiring = [
    ...reportData.value.urgent.map((item) => ({
      product_name: item.Product.name,
      generic_name: item.Product.generic_name,
      batch_number: item.batch_number,
      expiry_date: item.expiry_date,
      days_remaining: getDaysRemaining(item.expiry_date),
      quantity: item.quantity,
      unit: item.Product.unit,
      unit_price: item.Product.purchase_price,
      total_value: item.quantity * item.Product.purchase_price,
      supplier: item.Supplier?.name || 'N/A',
      urgency: 'Urgent (≤7 days)',
    })),
    ...reportData.value.warning.map((item) => ({
      product_name: item.Product.name,
      generic_name: item.Product.generic_name,
      batch_number: item.batch_number,
      expiry_date: item.expiry_date,
      days_remaining: getDaysRemaining(item.expiry_date),
      quantity: item.quantity,
      unit: item.Product.unit,
      unit_price: item.Product.purchase_price,
      total_value: item.quantity * item.Product.purchase_price,
      supplier: item.Supplier?.name || 'N/A',
      urgency: 'Warning (8-30 days)',
    })),
  ];

  const columns = [
    { field: 'product_name', header: 'Product Name' },
    { field: 'generic_name', header: 'Generic Name' },
    { field: 'batch_number', header: 'Batch Number' },
    { field: 'expiry_date', header: 'Expiry Date' },
    { field: 'days_remaining', header: 'Days Remaining' },
    { field: 'quantity', header: 'Quantity' },
    { field: 'unit', header: 'Unit' },
    { field: 'unit_price', header: 'Unit Price' },
    { field: 'total_value', header: 'Total Value' },
    { field: 'supplier', header: 'Supplier' },
    { field: 'urgency', header: 'Urgency Level' },
  ];

  const csvContent = ReportService.exportToCSV(allExpiring, columns);
  const filename = `expiring-products-report-${new Date().toISOString().split('T')[0]}.csv`;

  ReportService.downloadCSV(csvContent, filename);

  toast.add({
    severity: 'success',
    summary: 'Export Successful',
    detail: 'Report has been exported to CSV',
    life: 3000,
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDaysRemaining(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function formatCurrency(value) {
  return parseFloat(value || 0).toFixed(2);
}
</script>

<style scoped>
.expiring-products-report {
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
