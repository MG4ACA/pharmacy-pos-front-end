<template>
  <div class="stock-receipt-list">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Stock Receipts</h1>
      <Button label="Create Receipt" icon="pi pi-plus mr-2" @click="goToCreateReceipt" />
    </div>

    <!-- Filters -->
    <Card class="mb-4">
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-3">
            <div class="field">
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
          <div class="col-12 md:col-3">
            <div class="field">
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
          <div class="col-12 md:col-2">
            <div class="field">
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
          <div class="col-12 md:col-2">
            <div class="field">
              <label for="startDate" class="block mb-2">Start Date</label>
              <Calendar
                id="startDate"
                v-model="filters.startDate"
                date-format="yy-mm-dd"
                placeholder="Start Date"
                class="w-full"
                @date-select="loadReceipts"
                show-button-bar
              />
            </div>
          </div>
          <div class="col-12 md:col-2">
            <div class="field">
              <label for="endDate" class="block mb-2">End Date</label>
              <Calendar
                id="endDate"
                v-model="filters.endDate"
                date-format="yy-mm-dd"
                placeholder="End Date"
                class="w-full"
                @date-select="loadReceipts"
                show-button-bar
              />
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <Button
            label="Clear Filters"
            icon="pi pi-filter-slash mr-2"
            class="p-button-secondary"
            @click="clearFilters"
          />
          <Button
            icon="pi pi-refresh mr-0"
            class="p-button-help"
            v-tooltip.top="'Refresh'"
            @click="loadReceipts"
          />
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
        >
          <Column field="receipt_number" header="Receipt #" style="width: 150px">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.receipt_number }}</span>
            </template>
          </Column>

          <Column field="receipt_date" header="Date" style="width: 120px">
            <template #body="{ data }">
              {{ formatDate(data.receipt_date) }}
            </template>
          </Column>

          <Column header="Supplier">
            <template #body="{ data }">
              <div>
                <div class="font-semibold">{{ data.supplier?.name || 'N/A' }}</div>
                <div class="text-sm text-500" v-if="data.supplier_invoice_number">
                  Invoice: {{ data.supplier_invoice_number }}
                </div>
              </div>
            </template>
          </Column>

          <Column field="total_items" header="Items" style="width: 100px">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.total_items }}</span>
            </template>
          </Column>

          <Column field="total_amount" header="Total Amount" style="width: 150px">
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
import { useStockReceiptStore } from '@/stores/stockReceipt';
import { useSupplierStore } from '@/stores/supplier';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';

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
  startDate: null,
  endDate: null,
});

const searchTimeout = ref(null);

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

// Computed
const receipts = computed(() => stockReceiptStore.receipts);
const loading = computed(() => stockReceiptStore.loading);
const suppliers = computed(() => supplierStore.suppliers);

// Methods
const loadReceipts = async () => {
  try {
    // Format dates for API
    const filterData = {
      ...filters.value,
      startDate: filters.value.startDate ? formatDateForAPI(filters.value.startDate) : null,
      endDate: filters.value.endDate ? formatDateForAPI(filters.value.endDate) : null,
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
    startDate: null,
    endDate: null,
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
