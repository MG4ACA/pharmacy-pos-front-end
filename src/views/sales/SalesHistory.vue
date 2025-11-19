<template>
  <div class="sales-history-container p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="m-0 text-primary">Sales History</h2>
        <p class="text-600 m-0 mt-1">View and manage all sales transactions</p>
      </div>
      <Button label="New Sale" icon="pi pi-plus" @click="$router.push('/sales/pos')" />
    </div>

    <!-- Filters Panel -->
    <Panel header="Filters" :collapsed="false" :toggleable="true" class="mb-4">
      <div class="grid">
        <!-- Date Range -->
        <div class="col-12 md:col-3">
          <div class="field">
            <label for="startDate" class="block mb-2">Start Date</label>
            <Calendar
              id="startDate"
              v-model="filters.start_date"
              dateFormat="yy-mm-dd"
              showIcon
              class="w-full"
            />
          </div>
        </div>

        <div class="col-12 md:col-3">
          <div class="field">
            <label for="endDate" class="block mb-2">End Date</label>
            <Calendar
              id="endDate"
              v-model="filters.end_date"
              dateFormat="yy-mm-dd"
              showIcon
              class="w-full"
            />
          </div>
        </div>

        <!-- Payment Method -->
        <div class="col-12 md:col-3">
          <div class="field">
            <label for="paymentMethod" class="block mb-2">Payment Method</label>
            <Dropdown
              id="paymentMethod"
              v-model="filters.payment_method"
              :options="paymentMethods"
              optionLabel="label"
              optionValue="value"
              placeholder="All Methods"
              class="w-full"
              showClear
            />
          </div>
        </div>

        <!-- Payment Status -->
        <div class="col-12 md:col-3">
          <div class="field">
            <label for="paymentStatus" class="block mb-2">Status</label>
            <Dropdown
              id="paymentStatus"
              v-model="filters.payment_status"
              :options="paymentStatuses"
              optionLabel="label"
              optionValue="value"
              placeholder="All Statuses"
              class="w-full"
              showClear
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="col-12">
          <Button label="Apply Filters" icon="pi pi-search" @click="applyFilters" class="mr-2" />
          <Button
            label="Clear Filters"
            icon="pi pi-times"
            severity="secondary"
            outlined
            @click="clearFilters"
          />
        </div>
      </div>
    </Panel>

    <!-- Sales Table -->
    <Card>
      <template #content>
        <DataTable
          :value="salesHistory"
          :loading="isLoading"
          paginator
          :rows="pagination.limit"
          :totalRecords="pagination.total"
          :lazy="true"
          @page="onPage"
          dataKey="id"
          responsiveLayout="scroll"
          :empty-message="'No sales found'"
          class="p-datatable-sm"
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

          <Column header="Items" style="min-width: 200px">
            <template #body="{ data }">
              <div v-if="data.items && data.items.length > 0" class="text-sm">
                <div v-for="(item, index) in data.items.slice(0, 2)" :key="index" class="mb-1">
                  {{ item.product?.name }} ({{ item.quantity }})
                </div>
                <div v-if="data.items.length > 2" class="text-600">
                  +{{ data.items.length - 2 }} more items
                </div>
              </div>
            </template>
          </Column>

          <Column field="subtotal" header="Subtotal" style="min-width: 120px">
            <template #body="{ data }">Rs. {{ parseFloat(data.subtotal).toFixed(2) }}</template>
          </Column>

          <Column field="discount" header="Discount" style="min-width: 120px">
            <template #body="{ data }">
              <span v-if="data.discount > 0" class="text-red-500">
                - Rs. {{ parseFloat(data.discount).toFixed(2) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>

          <Column field="tax" header="Tax" style="min-width: 120px">
            <template #body="{ data }">
              <span v-if="data.tax > 0" class="text-green-600">
                + Rs. {{ parseFloat(data.tax).toFixed(2) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>

          <Column field="total_amount" header="Total" style="min-width: 130px">
            <template #body="{ data }">
              <span class="font-bold text-primary">
                Rs. {{ parseFloat(data.total_amount).toFixed(2) }}
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

          <Column field="payment_status" header="Status" style="min-width: 120px">
            <template #body="{ data }">
              <Tag
                :value="data.payment_status"
                :severity="getStatusSeverity(data.payment_status)"
                style="text-transform: capitalize"
              />
            </template>
          </Column>

          <Column field="user" header="User" style="min-width: 150px">
            <template #body="{ data }">
              {{ data.user?.full_name || data.user?.username || '-' }}
            </template>
          </Column>

          <Column header="Actions" style="width: 120px">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                @click="viewSaleDetails(data)"
                v-tooltip.top="'View Details'"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Sale Details Dialog -->
    <Dialog
      v-model:visible="showDetailsDialog"
      :header="`Sale Details - #${selectedSale?.id}`"
      :modal="true"
      :style="{ width: '700px' }"
      :maximizable="true"
    >
      <div v-if="selectedSale">
        <!-- Sale Info -->
        <div class="grid mb-4">
          <div class="col-6">
            <p class="text-600 mb-1">Date & Time:</p>
            <p class="font-semibold">{{ formatDate(selectedSale.sale_date) }}</p>
          </div>
          <div class="col-6">
            <p class="text-600 mb-1">Cashier:</p>
            <p class="font-semibold">
              {{ selectedSale.user?.full_name || selectedSale.user?.username }}
            </p>
          </div>
          <div class="col-6">
            <p class="text-600 mb-1">Payment Method:</p>
            <Tag
              :value="selectedSale.payment_method"
              :severity="getPaymentMethodSeverity(selectedSale.payment_method)"
              style="text-transform: uppercase"
            />
          </div>
          <div class="col-6">
            <p class="text-600 mb-1">Payment Status:</p>
            <Tag
              :value="selectedSale.payment_status"
              :severity="getStatusSeverity(selectedSale.payment_status)"
              style="text-transform: capitalize"
            />
          </div>
        </div>

        <Divider />

        <!-- Items Table -->
        <h4 class="mb-3">Sale Items</h4>
        <DataTable
          :value="selectedSale.items"
          class="p-datatable-sm mb-4"
          responsiveLayout="scroll"
        >
          <Column field="product.name" header="Product" style="min-width: 200px" />
          <Column field="quantity" header="Quantity" style="width: 100px" />
          <Column field="unit_price" header="Unit Price" style="width: 120px">
            <template #body="{ data }">Rs. {{ parseFloat(data.unit_price).toFixed(2) }}</template>
          </Column>
          <Column field="subtotal" header="Subtotal" style="width: 120px">
            <template #body="{ data }">Rs. {{ parseFloat(data.subtotal).toFixed(2) }}</template>
          </Column>
          <Column field="stock_entry" header="Batch" style="width: 150px">
            <template #body="{ data }">
              {{ data.stock_entry?.batch_number || '-' }}
            </template>
          </Column>
        </DataTable>

        <!-- Totals Summary -->
        <div class="surface-100 border-round p-3">
          <div class="flex justify-content-between mb-2">
            <span class="text-600">Subtotal:</span>
            <span class="font-semibold">
              Rs. {{ parseFloat(selectedSale.subtotal).toFixed(2) }}
            </span>
          </div>
          <div class="flex justify-content-between mb-2" v-if="selectedSale.discount > 0">
            <span class="text-600">Discount:</span>
            <span class="font-semibold text-red-500">
              - Rs. {{ parseFloat(selectedSale.discount).toFixed(2) }}
            </span>
          </div>
          <div class="flex justify-content-between mb-2" v-if="selectedSale.tax > 0">
            <span class="text-600">Tax:</span>
            <span class="font-semibold text-green-600">
              + Rs. {{ parseFloat(selectedSale.tax).toFixed(2) }}
            </span>
          </div>
          <Divider />
          <div class="flex justify-content-between">
            <span class="font-bold text-lg">Total:</span>
            <span class="font-bold text-lg text-primary">
              Rs. {{ parseFloat(selectedSale.total_amount).toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="selectedSale.notes" class="mt-3">
          <p class="text-600 mb-1">Notes:</p>
          <p class="font-semibold">{{ selectedSale.notes }}</p>
        </div>
      </div>

      <template #footer>
        <Button label="Close" icon="pi pi-times" @click="showDetailsDialog = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useSaleStore } from '@/stores/sale';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import Panel from 'primevue/panel';
import Tag from 'primevue/tag';

const router = useRouter();
const toast = useToast();
const saleStore = useSaleStore();

// Refs
const filters = ref({
  start_date: null,
  end_date: null,
  payment_method: null,
  payment_status: null,
});

const showDetailsDialog = ref(false);
const selectedSale = ref(null);

// Computed
const salesHistory = computed(() => saleStore.salesHistory);
const isLoading = computed(() => saleStore.isLoading);
const pagination = computed(() => saleStore.pagination);

// Options
const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Other', value: 'other' },
];

const paymentStatuses = [
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Cancelled', value: 'cancelled' },
];

// Methods
async function fetchSales(params = {}) {
  const result = await saleStore.fetchSalesHistory({
    page: pagination.value.page,
    limit: pagination.value.limit,
    ...params,
  });

  if (!result.success) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: result.message,
      life: 3000,
    });
  }
}

function applyFilters() {
  const params = {};

  if (filters.value.start_date) {
    params.start_date = filters.value.start_date.toISOString().split('T')[0];
  }

  if (filters.value.end_date) {
    params.end_date = filters.value.end_date.toISOString().split('T')[0];
  }

  if (filters.value.payment_method) {
    params.payment_method = filters.value.payment_method;
  }

  if (filters.value.payment_status) {
    params.payment_status = filters.value.payment_status;
  }

  fetchSales(params);
}

function clearFilters() {
  filters.value = {
    start_date: null,
    end_date: null,
    payment_method: null,
    payment_status: null,
  };
  fetchSales();
}

function onPage(event) {
  pagination.value.page = event.page + 1;
  applyFilters();
}

async function viewSaleDetails(sale) {
  const result = await saleStore.fetchSaleById(sale.id);

  if (result.success) {
    selectedSale.value = result.data;
    showDetailsDialog.value = true;
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: result.message,
      life: 3000,
    });
  }
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

function getStatusSeverity(status) {
  const severities = {
    completed: 'success',
    pending: 'warning',
    cancelled: 'danger',
  };
  return severities[status] || 'info';
}

onMounted(() => {
  fetchSales();
});
</script>

<style scoped>
.sales-history-container {
  max-width: 1800px;
  margin: 0 auto;
}
</style>
