<template>
  <div class="stock-receipt-list">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title text-primary">Stock Receipts</h1>
      <div class="flex gap-2">
        <Button
          label="Export to CSV"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="handleQuickExport"
          :loading="exporting"
        />
        <Button label="Create Receipt" outlined icon="pi pi-plus mr-2" @click="goToCreateReceipt" />
        <Button
          icon="pi pi-refresh"
          label="Refresh"
          severity="secondary"
          outlined
          v-tooltip.top="'Refresh'"
          @click="loadReceipts"
        />
      </div>
    </div>

    <!-- Filters -->
    <Card class="mb-4">
      <template #content>
        <div class="flex justify-content-between">
          <div>
            <div>
              <label for="search" class="block mb-2">Search</label>
              <InputText
                id="search"
                v-model="filters.searchQuery"
                placeholder="Receipt # or Invoice #"
                class="w-full"
                @input="handleSearch"
              />
            </div>
          </div>
          <div>
            <div>
              <label for="supplier" class="block mb-2">Supplier</label>
              <Dropdown
                id="supplier"
                v-model="filters.supplierId"
                :options="suppliers"
                option-label="name"
                option-value="id"
                placeholder="All Suppliers"
                class="w-full"
                show-clear
                @change="loadReceipts"
              />
            </div>
          </div>
          <div>
            <div>
              <label for="status" class="block mb-2">Status</label>
              <Dropdown
                id="status"
                v-model="filters.status"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                placeholder="All Status"
                class="w-full"
                show-clear
                @change="loadReceipts"
              />
            </div>
          </div>
          <div>
            <div>
              <label for="dateRange" class="block mb-2">Date Range</label>
              <Calendar
                id="dateRange"
                v-model="filters.dateRange"
                selection-mode="range"
                date-format="yy-mm-dd"
                placeholder="Select date range"
                @date-select="loadReceipts"
                show-button-bar
                :manual-input="false"
              />
            </div>
          </div>
          <div class="flex align-items-end justify-content-end">
            <Button label="Clear" icon="pi pi-filter-slash" outlined @click="clearFilters" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Data Table -->
    <Card>
      <template #content>
        <DataTable
          :value="receipts"
          :loading="loading"
          data-key="id"
          responsive-layout="scroll"
          striped-rows
          paginator
          :rows="20"
          :rowsPerPageOptions="[10, 20, 50]"
          sort-field="receipt_date"
          :sort-order="-1"
          @sort="onSort"
        >
          <Column field="receipt_number" header="Receipt #" style="width: 150px">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.receipt_number }}</span>
            </template>
          </Column>

          <Column field="receipt_date" header="Date" sortable style="width: 120px">
            <template #body="{ data }">
              {{ formatDate(data.receipt_date) }}
            </template>
          </Column>

          <Column field="supplier.name" header="Supplier" sortable>
            <template #body="{ data }">
              <div>
                <div class="font-semibold">{{ data.supplier?.name || 'N/A' }}</div>
                <div class="text-sm text-500" v-if="data.supplier_invoice_number">
                  Invoice: {{ data.supplier_invoice_number }}
                </div>
              </div>
            </template>
          </Column>

          <Column field="total_items" header="Items" sortable style="width: 100px">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.total_items }}</span>
            </template>
          </Column>

          <Column field="total_amount" header="Total Amount" sortable style="width: 150px">
            <template #body="{ data }">
              {{ formatCurrency(data.total_amount) }}
            </template>
          </Column>

          <Column field="status" header="Status" style="width: 120px">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>

          <Column header="Created By" style="width: 150px">
            <template #body="{ data }">
              {{ data.creator?.full_name || 'N/A' }}
            </template>
          </Column>

          <Column header="Actions" style="width: 150px">
            <template #body="{ data }">
              <div class="flex gap-1">
                <Button
                  icon="pi pi-eye"
                  class="p-button-sm p-button-text p-button-info"
                  v-tooltip.top="'View Details'"
                  @click="viewReceipt(data.id)"
                />
                <Button
                  v-if="data.status === 'draft'"
                  icon="pi pi-pencil"
                  class="p-button-sm p-button-text"
                  v-tooltip.top="'Edit'"
                  @click="editReceipt(data.id)"
                />
                <Button
                  v-if="data.status !== 'cancelled'"
                  icon="pi pi-ban"
                  class="p-button-sm p-button-text p-button-danger"
                  v-tooltip.top="'Cancel'"
                  @click="confirmCancel(data)"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-4">No stock receipts found</div>
          </template>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import ExportService from '@/services/ExportService';
import { useStockReceiptStore } from '@/stores/stockReceipt';
import { useSupplierStore } from '@/stores/supplier';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const stockReceiptStore = useStockReceiptStore();
const supplierStore = useSupplierStore();

// State
const filters = ref({
  searchQuery: '',
  supplierId: null,
  status: null,
  dateRange: null,
  sortField: 'receipt_date',
  sortOrder: -1,
});

const searchTimeout = ref(null);

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const exporting = ref(false);

// Computed
const receipts = computed(() => stockReceiptStore.receipts);
const loading = computed(() => stockReceiptStore.loading);
const suppliers = computed(() => supplierStore.suppliers);

// Methods
async function handleQuickExport() {
  exporting.value = true;
  try {
    const exportFilters = {};

    // Apply current filters if any
    if (filters.value.dateRange && filters.value.dateRange[0]) {
      exportFilters.startDate = new Date(filters.value.dateRange[0]).toISOString().split('T')[0];
      if (filters.value.dateRange[1]) {
        exportFilters.endDate = new Date(filters.value.dateRange[1]).toISOString().split('T')[0];
      }
    }

    if (filters.value.supplierId) {
      exportFilters.supplierId = filters.value.supplierId;
    }

    await ExportService.exportStockReceipts(exportFilters);

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
    exporting.value = false;
  }
}

const loadReceipts = async () => {
  try {
    // Format dates for API - extract from dateRange
    let startDate = null;
    let endDate = null;

    if (filters.value.dateRange && filters.value.dateRange.length > 0) {
      startDate = filters.value.dateRange[0] ? formatDateForAPI(filters.value.dateRange[0]) : null;
      endDate = filters.value.dateRange[1] ? formatDateForAPI(filters.value.dateRange[1]) : null;
    }

    const filterData = {
      searchQuery: filters.value.searchQuery,
      supplierId: filters.value.supplierId,
      status: filters.value.status,
      startDate,
      endDate,
      sortField: filters.value.sortField,
      sortOrder: filters.value.sortOrder,
    };
    stockReceiptStore.setFilters(filterData);
    await stockReceiptStore.loadReceipts();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load stock receipts',
      life: 3000,
    });
  }
};

const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = setTimeout(() => {
    loadReceipts();
  }, 500);
};

const clearFilters = () => {
  filters.value = {
    searchQuery: '',
    supplierId: null,
    status: null,
    dateRange: null,
    sortField: 'receipt_date',
    sortOrder: -1,
  };
  stockReceiptStore.clearFilters();
  loadReceipts();
};

const goToCreateReceipt = () => {
  router.push('/inventory/stock-receipts/create');
};

const viewReceipt = (id) => {
  router.push(`/inventory/stock-receipts/${id}`);
};

const editReceipt = (id) => {
  router.push(`/inventory/stock-receipts/${id}/edit`);
};

const confirmCancel = (receipt) => {
  confirm.require({
    message: `Are you sure you want to cancel receipt ${receipt.receipt_number}? This action cannot be undone.`,
    header: 'Confirm Cancellation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await stockReceiptStore.cancelReceipt(receipt.id);
        toast.add({
          severity: 'success',
          summary: 'Cancelled',
          detail: 'Stock receipt cancelled successfully',
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to cancel receipt',
          life: 3000,
        });
      }
    },
  });
};

const getStatusSeverity = (status) => {
  const severityMap = {
    draft: 'warning',
    completed: 'success',
    cancelled: 'danger',
  };
  return severityMap[status] || 'info';
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const onSort = (event) => {
  filters.value.sortField = event.sortField;
  filters.value.sortOrder = event.sortOrder;
  loadReceipts();
};

// Lifecycle
onMounted(async () => {
  await supplierStore.fetchActiveSuppliers();
  await loadReceipts();
});
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}
</style>
