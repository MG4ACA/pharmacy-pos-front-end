<template>
  <div class="stock-report p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="m-0 text-primary">Stock Level Report</h2>
        <p class="text-600 m-0 mt-1">View current inventory status and stock levels</p>
      </div>
      <Button
        label="Export to CSV"
        icon="pi pi-download"
        @click="exportReport"
        :disabled="!reportData || isLoading"
      />
    </div>

    <!-- Generate Button -->
    <div class="mb-4">
      <Button
        label="Generate Stock Report"
        icon="pi pi-refresh"
        @click="generateReport"
        :loading="isLoading"
      />
    </div>

    <!-- Summary Cards -->
    <div v-if="reportData" class="grid mb-4">
      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-blue-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Total Products</div>
                <div class="text-900 font-bold text-2xl">
                  {{ getTotalProducts() }}
                </div>
              </div>
              <i class="pi pi-box text-blue-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-green-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">In Stock</div>
                <div class="text-900 font-bold text-2xl text-green-600">
                  {{ reportData.products.inStock.length }}
                </div>
              </div>
              <i class="pi pi-check-circle text-green-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-orange-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Low Stock</div>
                <div class="text-900 font-bold text-2xl text-orange-600">
                  {{ reportData.products.lowStock.length }}
                </div>
              </div>
              <i class="pi pi-exclamation-triangle text-orange-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="summary-card bg-red-50">
          <template #content>
            <div class="flex align-items-center justify-content-between">
              <div>
                <div class="text-500 font-medium mb-2">Out of Stock</div>
                <div class="text-900 font-bold text-2xl text-red-600">
                  {{ reportData.products.outOfStock.length }}
                </div>
              </div>
              <i class="pi pi-times-circle text-red-500 text-4xl"></i>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Inventory Value -->
    <div v-if="reportData" class="mb-4">
      <Card class="bg-purple-50">
        <template #content>
          <div class="flex align-items-center justify-content-between">
            <div>
              <div class="text-600 font-medium mb-1">Total Inventory Value</div>
              <div class="text-900 font-bold text-3xl">
                LKR {{ formatCurrency(reportData.summary.totalInventoryValue) }}
              </div>
              <div class="text-500 text-sm mt-1">Based on purchase prices</div>
            </div>
            <i class="pi pi-wallet text-purple-500 text-5xl"></i>
          </div>
        </template>
      </Card>
    </div>

    <!-- Stock Status Tabs -->
    <Card v-if="reportData">
      <template #content>
        <TabView>
          <!-- In Stock Tab -->
          <TabPanel>
            <template #header>
              <span class="flex align-items-center gap-2">
                <i class="pi pi-check-circle text-green-500"></i>
                <span>In Stock ({{ reportData.products.inStock.length }})</span>
              </span>
            </template>
            <DataTable
              :value="reportData.products.inStock"
              paginator
              :rows="10"
              class="p-datatable-sm"
              responsiveLayout="scroll"
              :empty-message="'No products in stock'"
            >
              <Column field="name" header="Product Name" style="min-width: 250px">
                <template #body="{ data }">
                  <div class="font-semibold">{{ data.name }}</div>
                  <div class="text-sm text-500">{{ data.generic_name || '-' }}</div>
                </template>
              </Column>

              <Column field="category.name" header="Category" style="min-width: 150px">
                <template #body="{ data }">
                  <Tag :value="data.category?.name || 'N/A'" severity="info" />
                </template>
              </Column>

              <Column field="totalStock" header="Stock" style="min-width: 120px">
                <template #body="{ data }">
                  <span class="font-semibold text-green-600">
                    {{ data.totalStock }} {{ data.unit }}
                  </span>
                </template>
              </Column>

              <Column field="reorder_level" header="Reorder Level" style="min-width: 140px">
                <template #body="{ data }">{{ data.reorder_level }} {{ data.unit }}</template>
              </Column>

              <Column field="batchCount" header="Batch Count" style="min-width: 120px">
                <template #body="{ data }">
                  <Tag :value="data.batchCount" severity="info" />
                </template>
              </Column>

              <Column header="Earliest Expiry" style="min-width: 150px">
                <template #body="{ data }">
                  <span v-if="data.earliestExpiry">
                    {{ formatDate(data.earliestExpiry) }}
                  </span>
                  <span v-else class="text-500">N/A</span>
                </template>
              </Column>

              <Column header="Inventory Value" style="min-width: 150px">
                <template #body="{ data }">
                  <span class="font-semibold text-primary">
                    LKR {{ formatCurrency(data.inventoryValue) }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </TabPanel>

          <!-- Low Stock Tab -->
          <TabPanel>
            <template #header>
              <span class="flex align-items-center gap-2">
                <i class="pi pi-exclamation-triangle text-orange-500"></i>
                <span>Low Stock ({{ reportData.products.lowStock.length }})</span>
              </span>
            </template>
            <DataTable
              :value="reportData.products.lowStock"
              paginator
              :rows="10"
              class="p-datatable-sm"
              responsiveLayout="scroll"
              :empty-message="'No low stock products'"
            >
              <Column field="name" header="Product Name" style="min-width: 250px">
                <template #body="{ data }">
                  <div class="font-semibold">{{ data.name }}</div>
                  <div class="text-sm text-500">{{ data.generic_name || '-' }}</div>
                </template>
              </Column>

              <Column field="category.name" header="Category" style="min-width: 150px">
                <template #body="{ data }">
                  <Tag :value="data.category?.name || 'N/A'" severity="warning" />
                </template>
              </Column>

              <Column field="totalStock" header="Stock" style="min-width: 120px">
                <template #body="{ data }">
                  <span class="font-semibold text-orange-600">
                    {{ data.totalStock }} {{ data.unit }}
                  </span>
                </template>
              </Column>

              <Column field="reorder_level" header="Reorder Level" style="min-width: 140px">
                <template #body="{ data }">
                  <span class="text-orange-600">{{ data.reorder_level }} {{ data.unit }}</span>
                </template>
              </Column>

              <Column field="batchCount" header="Batch Count" style="min-width: 120px">
                <template #body="{ data }">
                  <Tag :value="data.batchCount" severity="warning" />
                </template>
              </Column>

              <Column header="Earliest Expiry" style="min-width: 150px">
                <template #body="{ data }">
                  <span v-if="data.earliestExpiry">
                    {{ formatDate(data.earliestExpiry) }}
                  </span>
                  <span v-else class="text-500">N/A</span>
                </template>
              </Column>

              <Column header="Inventory Value" style="min-width: 150px">
                <template #body="{ data }">
                  <span class="font-semibold text-primary">
                    LKR {{ formatCurrency(data.inventoryValue) }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </TabPanel>

          <!-- Out of Stock Tab -->
          <TabPanel>
            <template #header>
              <span class="flex align-items-center gap-2">
                <i class="pi pi-times-circle text-red-500"></i>
                <span>Out of Stock ({{ reportData.products.outOfStock.length }})</span>
              </span>
            </template>
            <DataTable
              :value="reportData.products.outOfStock"
              paginator
              :rows="10"
              class="p-datatable-sm"
              responsiveLayout="scroll"
              :empty-message="'No out of stock products'"
            >
              <Column field="name" header="Product Name" style="min-width: 250px">
                <template #body="{ data }">
                  <div class="font-semibold">{{ data.name }}</div>
                  <div class="text-sm text-500">{{ data.generic_name || '-' }}</div>
                </template>
              </Column>

              <Column field="category.name" header="Category" style="min-width: 150px">
                <template #body="{ data }">
                  <Tag :value="data.category?.name || 'N/A'" severity="danger" />
                </template>
              </Column>

              <Column field="totalStock" header="Stock" style="min-width: 120px">
                <template #body="{ data }">
                  <span class="font-semibold text-red-600">
                    {{ data.totalStock }} {{ data.unit }}
                  </span>
                </template>
              </Column>

              <Column field="reorder_level" header="Reorder Level" style="min-width: 140px">
                <template #body="{ data }">
                  <span class="text-red-600">{{ data.reorder_level }} {{ data.unit }}</span>
                </template>
              </Column>

              <Column field="batchCount" header="Batch Count" style="min-width: 120px">
                <template #body="{ data }">
                  <Tag :value="data.batchCount || 0" severity="danger" />
                </template>
              </Column>

              <Column header="Earliest Expiry" style="min-width: 150px">
                <template #body="{ data }">
                  <span class="text-500">N/A</span>
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
          <i class="pi pi-box text-6xl text-400 mb-3"></i>
          <p class="text-xl text-600 mb-2">No Report Generated</p>
          <p class="text-500">Click "Generate Stock Report" to view inventory status</p>
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
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Tag from 'primevue/tag';

const toast = useToast();

// State
const isLoading = ref(false);
const reportData = ref(null);

// Methods
async function generateReport() {
  isLoading.value = true;

  try {
    const result = await ReportService.getStockLevelReport();

    if (result.success) {
      reportData.value = result.data;
      toast.add({
        severity: 'success',
        summary: 'Report Generated',
        detail: 'Stock level report has been generated successfully',
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

  // Combine all stock levels into one dataset for export
  const allProducts = [
    ...reportData.value.products.inStock.map((p) => ({ ...p, stock_status: 'In Stock' })),
    ...reportData.value.products.lowStock.map((p) => ({ ...p, stock_status: 'Low Stock' })),
    ...reportData.value.products.outOfStock.map((p) => ({ ...p, stock_status: 'Out of Stock' })),
  ];

  const columns = [
    { field: 'name', header: 'Product Name' },
    { field: 'generic_name', header: 'Generic Name' },
    { field: 'category.name', header: 'Category' },
    { field: 'totalStock', header: 'Total Stock' },
    { field: 'unit', header: 'Unit' },
    { field: 'reorder_level', header: 'Reorder Level' },
    { field: 'inventoryValue', header: 'Inventory Value' },
    { field: 'batchCount', header: 'Batch Count' },
    { field: 'stock_status', header: 'Stock Status' },
  ];

  const csvContent = ReportService.exportToCSV(allProducts, columns);
  const filename = `stock-level-report-${new Date().toISOString().split('T')[0]}.csv`;

  ReportService.downloadCSV(csvContent, filename);

  toast.add({
    severity: 'success',
    summary: 'Export Successful',
    detail: 'Report has been exported to CSV',
    life: 3000,
  });
}

function getTotalProducts() {
  if (!reportData.value || !reportData.value.products) return 0;
  return (
    reportData.value.products.inStock.length +
    reportData.value.products.lowStock.length +
    reportData.value.products.outOfStock.length
  );
}

function formatCurrency(value) {
  return parseFloat(value || 0).toFixed(2);
}

function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>

<style scoped>
.stock-report {
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
