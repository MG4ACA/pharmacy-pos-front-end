<template>
  <div class="sales-history-container p-4">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="m-0 text-primary">Sales History</h2>
        <p class="text-600 m-0 mt-1">View and manage all sales transactions</p>
      </div>
      <div class="flex gap-2">
        <Button
          label="Export to CSV"
          icon="pi pi-download"
          severity="secondary"
          outlined
          @click="handleQuickExport"
          :loading="exporting"
        />
        <Button label="New Sale" outlined icon="pi pi-plus" @click="$router.push('/sales/pos')" />
      </div>
    </div>

    <!-- Filters -->
    <Card class="filter-card mb-3">
      <template #content>
        <div class="flex justify-content-between">
          <div>
            <label for="dateRange" class="block mb-2" style="font-size: 0.85em">Date Range</label>
            <Calendar
              id="dateRange"
              v-model="filters.dateRange"
              selection-mode="range"
              date-format="yy-mm-dd"
              placeholder="Select date range"
              @date-select="applyFilters"
              show-button-bar
              :manual-input="false"
              class="w-full"
            />
          </div>

          <div>
            <label for="paymentMethod" class="block mb-2" style="font-size: 0.85em">
              Payment Method
            </label>
            <Dropdown
              id="paymentMethod"
              v-model="filters.payment_method"
              :options="paymentMethods"
              optionLabel="label"
              optionValue="value"
              placeholder="All Methods"
              class="w-full"
              showClear
              @change="applyFilters"
            />
          </div>

          <div>
            <label for="paymentStatus" class="block mb-2" style="font-size: 0.85em">Status</label>
            <Dropdown
              id="paymentStatus"
              v-model="filters.payment_status"
              :options="paymentStatuses"
              optionLabel="label"
              optionValue="value"
              placeholder="All Statuses"
              class="w-full"
              showClear
              @change="applyFilters"
            />
          </div>

          <div class="flex align-items-end justify-content-end gap-2">
            <Button label="Clear" icon="pi pi-filter-slash" outlined @click="clearFilters" />
            <Button icon="pi pi-refresh" outlined @click="fetchSales" />
          </div>
        </div>
      </template>
    </Card>

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
          @sort="onSort"
          dataKey="id"
          responsiveLayout="scroll"
          :empty-message="'No sales found'"
          class="p-datatable-sm"
        >
          <Column field="id" header="Sale ID" style="width: 100px" sortable>
            <template #body="{ data }">
              <span class="font-semibold">#{{ data.id }}</span>
            </template>
          </Column>

          <Column field="sale_date" header="Date & Time" style="min-width: 180px" sortable>
            <template #body="{ data }">
              {{ formatDate(data.sale_date) }}
            </template>
          </Column>

          <Column field="subtotal" header="Subtotal" style="min-width: 120px" sortable>
            <template #body="{ data }">Rs. {{ parseFloat(data.subtotal).toFixed(2) }}</template>
          </Column>

          <Column field="discount" header="Discount" style="min-width: 120px" sortable>
            <template #body="{ data }">
              <span v-if="data.discount > 0" class="text-red-500">
                - Rs. {{ parseFloat(data.discount).toFixed(2) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>

          <Column field="total_amount" header="Total" style="min-width: 130px" sortable>
            <template #body="{ data }">
              <span class="font-bold text-primary">
                Rs. {{ parseFloat(data.total_amount).toFixed(2) }}
              </span>
            </template>
          </Column>

          <Column field="payment_method" header="Payment" style="min-width: 120px" sortable>
            <template #body="{ data }">
              <Tag
                :value="data.payment_method"
                :severity="getPaymentMethodSeverity(data.payment_method)"
                style="text-transform: uppercase"
              />
            </template>
          </Column>

          <Column field="payment_status" header="Status" style="min-width: 120px" sortable>
            <template #body="{ data }">
              <Tag
                :value="data.payment_status"
                :severity="getStatusSeverity(data.payment_status)"
                style="text-transform: capitalize"
              />
            </template>
          </Column>

          <Column header="Actions" style="width: 150px">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                @click="viewSaleDetails(data)"
                v-tooltip.top="'View Details'"
              />
              <Button
                icon="pi pi-pencil"
                severity="warning"
                text
                rounded
                @click="editSale(data)"
                v-tooltip.top="'Edit Sale'"
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
          :value="selectedSale.saleItems"
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
          <Column field="stockEntry" header="Batch" style="width: 150px">
            <template #body="{ data }">
              {{ data.stockEntry?.batch_number || '-' }}
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

    <!-- Edit Sale Dialog -->
    <Dialog
      v-model:visible="showEditDialog"
      :header="`Edit Sale - #${editForm?.id || ''}`"
      :modal="true"
      :style="{ width: '800px' }"
      :maximizable="true"
    >
      <div v-if="editForm" class="grid">
        <!-- Sale Items Section -->
        <div class="col-12">
          <h4 class="mb-3">Sale Items</h4>
          <DataTable :value="editForm.items" class="p-datatable-sm mb-4" responsiveLayout="scroll">
            <Column field="product.name" header="Product" style="min-width: 200px" />
            <Column field="quantity" header="Quantity" style="width: 120px">
              <template #body="{ data, index }">
                <InputNumber
                  v-model="data.quantity"
                  :min="1"
                  :max="data.available_stock + data.original_quantity"
                  showButtons
                  buttonLayout="horizontal"
                  @input="updateItemSubtotal(index)"
                  class="w-full"
                >
                  <template #incrementbuttonicon>
                    <span class="pi pi-plus" />
                  </template>
                  <template #decrementbuttonicon>
                    <span class="pi pi-minus" />
                  </template>
                </InputNumber>
              </template>
            </Column>
            <Column field="unit_price" header="Unit Price" style="width: 150px">
              <template #body="{ data, index }">
                <InputNumber
                  v-model="data.unit_price"
                  mode="decimal"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  :min="0"
                  @input="updateItemSubtotal(index)"
                  class="w-full"
                />
              </template>
            </Column>
            <Column field="subtotal" header="Subtotal" style="width: 150px">
              <template #body="{ data }">Rs. {{ parseFloat(data.subtotal).toFixed(2) }}</template>
            </Column>
            <Column header="Actions" style="width: 80px">
              <template #body="{ index }">
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="removeItem(index)"
                  v-tooltip.top="'Remove Item'"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <div class="col-12">
          <label for="editDiscount" class="block mb-2 font-semibold">Discount (Rs.)</label>
          <InputNumber
            id="editDiscount"
            v-model="editForm.discount"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :min="0"
            class="w-full"
          />
        </div>

        <div class="col-12">
          <label for="editTax" class="block mb-2 font-semibold">Tax (Rs.)</label>
          <InputNumber
            id="editTax"
            v-model="editForm.tax"
            mode="decimal"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :min="0"
            class="w-full"
          />
        </div>

        <div class="col-12">
          <label for="editPaymentMethod" class="block mb-2 font-semibold">Payment Method</label>
          <Dropdown
            id="editPaymentMethod"
            v-model="editForm.payment_method"
            :options="paymentMethods"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Payment Method"
            class="w-full"
          />
        </div>

        <div class="col-12">
          <label for="editPaymentStatus" class="block mb-2 font-semibold">Payment Status</label>
          <Dropdown
            id="editPaymentStatus"
            v-model="editForm.payment_status"
            :options="paymentStatuses"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Payment Status"
            class="w-full"
          />
        </div>

        <div class="col-12">
          <label for="editNotes" class="block mb-2 font-semibold">Notes</label>
          <Textarea
            id="editNotes"
            v-model="editForm.notes"
            rows="3"
            class="w-full"
            placeholder="Add notes..."
          />
        </div>

        <div class="col-12">
          <div class="surface-100 border-round p-3">
            <div class="flex justify-content-between mb-2">
              <span class="text-600">Subtotal:</span>
              <span class="font-semibold">Rs. {{ parseFloat(editForm.subtotal).toFixed(2) }}</span>
            </div>
            <div class="flex justify-content-between mb-2">
              <span class="text-600">Discount:</span>
              <span class="font-semibold text-red-500">
                - Rs. {{ parseFloat(editForm.discount || 0).toFixed(2) }}
              </span>
            </div>
            <div class="flex justify-content-between mb-2">
              <span class="text-600">Tax:</span>
              <span class="font-semibold text-green-600">
                + Rs. {{ parseFloat(editForm.tax || 0).toFixed(2) }}
              </span>
            </div>
            <Divider />
            <div class="flex justify-content-between">
              <span class="font-bold text-lg">New Total:</span>
              <span class="font-bold text-lg text-primary">Rs. {{ calculateNewTotal() }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          severity="secondary"
          outlined
          @click="showEditDialog = false"
        />
        <Button label="Save Changes" icon="pi pi-check" @click="saveSaleChanges" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import ExportService from '@/services/ExportService';
import { useSaleStore } from '@/stores/sale';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const saleStore = useSaleStore();

// Refs
const filters = ref({
  dateRange: null,
  payment_method: null,
  payment_status: null,
  sortField: null,
  sortOrder: null,
});

const showDetailsDialog = ref(false);
const selectedSale = ref(null);
const showEditDialog = ref(false);
const editForm = ref(null);

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

const exporting = ref(false);

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

    await ExportService.exportSales(exportFilters);

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
    exporting.value = false;
  }
}

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

  // Extract dates from dateRange
  if (filters.value.dateRange && filters.value.dateRange.length > 0) {
    if (filters.value.dateRange[0]) {
      params.start_date = filters.value.dateRange[0].toISOString().split('T')[0];
    }
    if (filters.value.dateRange[1]) {
      params.end_date = filters.value.dateRange[1].toISOString().split('T')[0];
    }
  }

  if (filters.value.payment_method) {
    params.payment_method = filters.value.payment_method;
  }

  if (filters.value.payment_status) {
    params.payment_status = filters.value.payment_status;
  }

  if (filters.value.sortField) {
    params.sortField = filters.value.sortField;
  }

  if (filters.value.sortOrder !== null) {
    params.sortOrder = filters.value.sortOrder;
  }

  fetchSales(params);
}

function clearFilters() {
  filters.value = {
    dateRange: null,
    payment_method: null,
    payment_status: null,
    sortField: null,
    sortOrder: null,
  };
  fetchSales();
}

function onPage(event) {
  pagination.value.page = event.page + 1;
  applyFilters();
}

function onSort(event) {
  filters.value.sortField = event.sortField;
  filters.value.sortOrder = event.sortOrder;
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

async function editSale(sale) {
  const result = await saleStore.fetchSaleById(sale.id);

  if (result.success) {
    // Prepare items with editable fields
    const items = result.data.saleItems.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      product: item.product,
      stock_entry_id: item.stock_entry_id,
      quantity: item.quantity,
      original_quantity: item.quantity, // Store original for stock validation
      unit_price: parseFloat(item.unit_price),
      subtotal: parseFloat(item.subtotal),
      available_stock: 0, // Will be fetched from stock
    }));

    editForm.value = {
      id: result.data.id,
      items: items,
      subtotal: result.data.subtotal,
      discount: parseFloat(result.data.discount),
      tax: parseFloat(result.data.tax),
      payment_method: result.data.payment_method,
      payment_status: result.data.payment_status,
      notes: result.data.notes || '',
    };
    showEditDialog.value = true;
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: result.message,
      life: 3000,
    });
  }
}

function calculateNewTotal() {
  if (!editForm.value) return '0.00';
  // Calculate subtotal from items
  const subtotal = editForm.value.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const discount = parseFloat(editForm.value.discount) || 0;
  const tax = parseFloat(editForm.value.tax) || 0;
  return (subtotal - discount + tax).toFixed(2);
}

function updateItemSubtotal(index) {
  const item = editForm.value.items[index];
  item.subtotal = item.quantity * item.unit_price;
}

function removeItem(index) {
  if (editForm.value.items.length <= 1) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Cannot remove the last item. A sale must have at least one item.',
      life: 3000,
    });
    return;
  }
  editForm.value.items.splice(index, 1);
}

async function saveSaleChanges() {
  // Prepare items for update
  const items = editForm.value.items.map((item) => ({
    id: item.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
  }));

  const result = await saleStore.updateSale(editForm.value.id, {
    items: items,
    discount: editForm.value.discount,
    tax: editForm.value.tax,
    payment_method: editForm.value.payment_method,
    payment_status: editForm.value.payment_status,
    notes: editForm.value.notes,
  });

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Sale updated successfully',
      life: 3000,
    });
    showEditDialog.value = false;
    applyFilters(); // Refresh the list
  } else {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: result.message,
      life: 3000,
    });
  }
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
