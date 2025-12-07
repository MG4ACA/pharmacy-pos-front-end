<template>
  <div class="export-data p-4">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="m-0 text-primary">Data Export</h2>
      <p class="text-600 m-0 mt-1">Export your sales and inventory data to CSV format</p>
    </div>

    <!-- Statistics Cards -->
    <div class="grid mb-4">
      <div class="col-12 md:col-6">
        <Card>
          <template #content>
            <div class="flex align-items-center gap-3">
              <div
                class="flex align-items-center justify-content-center bg-blue-100 border-round"
                style="width: 3rem; height: 3rem"
              >
                <i class="pi pi-shopping-cart text-blue-600 text-xl"></i>
              </div>
              <div>
                <div class="text-600 text-sm mb-1">Total Sales Records</div>
                <div class="text-2xl font-bold text-900">
                  {{ stats.totalSales?.toLocaleString() || 0 }}
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6">
        <Card>
          <template #content>
            <div class="flex align-items-center gap-3">
              <div
                class="flex align-items-center justify-content-center bg-green-100 border-round"
                style="width: 3rem; height: 3rem"
              >
                <i class="pi pi-box text-green-600 text-xl"></i>
              </div>
              <div>
                <div class="text-600 text-sm mb-1">Total Stock Receipts</div>
                <div class="text-2xl font-bold text-900">
                  {{ stats.totalStockReceipts?.toLocaleString() || 0 }}
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Export Options -->
    <div class="grid">
      <!-- Sales Export -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-shopping-cart text-blue-500"></i>
              <span>Export Sales Data</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <!-- Date Range -->
              <div class="field mb-0">
                <label class="block mb-2 font-medium">Date Range</label>
                <div class="flex gap-2">
                  <Calendar
                    v-model="salesFilters.startDate"
                    placeholder="Start Date"
                    dateFormat="yy-mm-dd"
                    showIcon
                    :maxDate="salesFilters.endDate || new Date()"
                    class="flex-1"
                  />
                  <Calendar
                    v-model="salesFilters.endDate"
                    placeholder="End Date"
                    dateFormat="yy-mm-dd"
                    showIcon
                    :minDate="salesFilters.startDate"
                    :maxDate="new Date()"
                    class="flex-1"
                  />
                </div>
              </div>

              <!-- Category Filter -->
              <div class="field mb-0">
                <label for="salesCategory" class="block mb-2 font-medium">Filter by Category</label>
                <Dropdown
                  id="salesCategory"
                  v-model="salesFilters.categoryId"
                  :options="categories"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="All Categories"
                  showClear
                  class="w-full"
                />
              </div>

              <!-- Export Button -->
              <Button
                label="Export Sales to CSV"
                icon="pi pi-download"
                :loading="exportingSales"
                @click="handleExportSales"
                class="w-full"
              />
            </div>
          </template>
        </Card>
      </div>

      <!-- Stock Receipts Export -->
      <div class="col-12 lg:col-6">
        <Card>
          <template #title>
            <div class="flex align-items-center gap-2">
              <i class="pi pi-box text-green-500"></i>
              <span>Export Stock Receipts</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <!-- Date Range -->
              <div class="field mb-0">
                <label class="block mb-2 font-medium">Date Range</label>
                <div class="flex gap-2">
                  <Calendar
                    v-model="stockFilters.startDate"
                    placeholder="Start Date"
                    dateFormat="yy-mm-dd"
                    showIcon
                    :maxDate="stockFilters.endDate || new Date()"
                    class="flex-1"
                  />
                  <Calendar
                    v-model="stockFilters.endDate"
                    placeholder="End Date"
                    dateFormat="yy-mm-dd"
                    showIcon
                    :minDate="stockFilters.startDate"
                    :maxDate="new Date()"
                    class="flex-1"
                  />
                </div>
              </div>

              <!-- Supplier Filter -->
              <div class="field mb-0">
                <label for="stockSupplier" class="block mb-2 font-medium">Filter by Supplier</label>
                <Dropdown
                  id="stockSupplier"
                  v-model="stockFilters.supplierId"
                  :options="suppliers"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="All Suppliers"
                  showClear
                  class="w-full"
                />
              </div>

              <!-- Category Filter -->
              <div class="field mb-0">
                <label for="stockCategory" class="block mb-2 font-medium">Filter by Category</label>
                <Dropdown
                  id="stockCategory"
                  v-model="stockFilters.categoryId"
                  :options="categories"
                  optionLabel="name"
                  optionValue="id"
                  placeholder="All Categories"
                  showClear
                  class="w-full"
                />
              </div>

              <!-- Export Button -->
              <Button
                label="Export Stock Receipts to CSV"
                icon="pi pi-download"
                :loading="exportingStock"
                @click="handleExportStockReceipts"
                class="w-full"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Info Message -->
    <Message severity="info" :closable="false" class="mt-4">
      <template #messageicon>
        <i class="pi pi-info-circle"></i>
      </template>
      <div>
        <strong>Export Information:</strong>
        <ul class="mt-2 mb-0 pl-4">
          <li>CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</li>
          <li>Use date filters to export data for specific periods</li>
          <li>Category filters help you export specific product types</li>
          <li>All monetary values are in your local currency</li>
        </ul>
      </div>
    </Message>
  </div>
</template>

<script setup>
import ExportService from '@/services/ExportService';
import { MetaService } from '@/services/MetaService';
import { SupplierService } from '@/services/SupplierService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const toast = useToast();

// State
const stats = ref({
  totalSales: 0,
  totalStockReceipts: 0,
});

const categories = ref([]);
const suppliers = ref([]);

const salesFilters = ref({
  startDate: null,
  endDate: null,
  categoryId: null,
});

const stockFilters = ref({
  startDate: null,
  endDate: null,
  supplierId: null,
  categoryId: null,
});

const exportingSales = ref(false);
const exportingStock = ref(false);

// Methods
onMounted(async () => {
  await Promise.all([loadStats(), loadCategories(), loadSuppliers()]);
});

async function loadStats() {
  try {
    const result = await ExportService.getExportStats();
    if (result.success) {
      stats.value = result.stats;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadCategories() {
  try {
    const result = await MetaService.getCategories();
    if (result.success) {
      categories.value = result.data;
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

async function loadSuppliers() {
  try {
    const result = await SupplierService.getAllSuppliers();
    if (result.success) {
      suppliers.value = result.data;
    }
  } catch (error) {
    console.error('Error loading suppliers:', error);
  }
}

async function handleExportSales() {
  exportingSales.value = true;
  try {
    const filters = {
      startDate: salesFilters.value.startDate
        ? new Date(salesFilters.value.startDate).toISOString().split('T')[0]
        : null,
      endDate: salesFilters.value.endDate
        ? new Date(salesFilters.value.endDate).toISOString().split('T')[0]
        : null,
      categoryId: salesFilters.value.categoryId || null,
    };

    await ExportService.exportSales(filters);

    toast.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: 'Sales data has been exported to CSV',
      life: 3000,
    });
  } catch (error) {
    console.error('Error exporting sales:', error);
    toast.add({
      severity: 'error',
      summary: 'Export Failed',
      detail: error.message || 'Failed to export sales data',
      life: 3000,
    });
  } finally {
    exportingSales.value = false;
  }
}

async function handleExportStockReceipts() {
  exportingStock.value = true;
  try {
    const filters = {
      startDate: stockFilters.value.startDate
        ? new Date(stockFilters.value.startDate).toISOString().split('T')[0]
        : null,
      endDate: stockFilters.value.endDate
        ? new Date(stockFilters.value.endDate).toISOString().split('T')[0]
        : null,
      supplierId: stockFilters.value.supplierId || null,
      categoryId: stockFilters.value.categoryId || null,
    };

    await ExportService.exportStockReceipts(filters);

    toast.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: 'Stock receipts data has been exported to CSV',
      life: 3000,
    });
  } catch (error) {
    console.error('Error exporting stock receipts:', error);
    toast.add({
      severity: 'error',
      summary: 'Export Failed',
      detail: error.message || 'Failed to export stock receipts data',
      life: 3000,
    });
  } finally {
    exportingStock.value = false;
  }
}
</script>

<style scoped>
.export-data :deep(.p-card-body) {
  padding: 1.5rem;
}

.export-data :deep(.p-card-title) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0;
}

.export-data :deep(.p-card-content) {
  padding-top: 0;
}
</style>
