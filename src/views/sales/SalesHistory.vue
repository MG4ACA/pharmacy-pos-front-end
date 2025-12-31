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
          <div class="flex align-items-end justify-content-end gap-2">
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
            <Button label="Clear" icon="pi pi-filter-slash" outlined @click="clearFilters" />
          </div>

          <div class="flex align-items-end justify-content-end gap-2">
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
          <Column field="id" header="Sale ID" style="width: 7%" sortable>
            <template #body="{ data }">
              <span class="font-semibold">#{{ data.id }}</span>
            </template>
          </Column>

          <Column field="sale_date" header="Date & Time" style="width: 13%" sortable>
            <template #body="{ data }">
              {{ formatDate(data.sale_date) }}
            </template>
          </Column>

          <Column header="Cashier" style="width: 8%">
            <template #body="{ data }">
              <span class="text-sm">
                {{ data.user?.username || data.user?.full_name || '-' }}
              </span>
            </template>
          </Column>

          <Column field="subtotal" header="Subtotal" style="width: 11%" sortable>
            <template #body="{ data }">Rs. {{ parseFloat(data.subtotal).toFixed(2) }}</template>
          </Column>

          <Column field="discount" header="Discount" style="width: 9%" sortable>
            <template #body="{ data }">
              <span v-if="data.discount > 0" class="text-red-500">
                <span v-if="data.discount_percentage">
                  {{ parseFloat(data.discount_percentage).toFixed(2) }}%
                  <br />
                  <small>(Rs. {{ parseFloat(data.discount).toFixed(2) }})</small>
                </span>
                <span v-else>Rs. {{ parseFloat(data.discount).toFixed(2) }}</span>
              </span>
              <span v-else>-</span>
            </template>
          </Column>

          <Column field="total_amount" header="Total" style="width: 11%" sortable>
            <template #body="{ data }">
              <span class="font-bold text-primary">
                Rs. {{ parseFloat(data.total_amount).toFixed(2) }}
              </span>
            </template>
          </Column>

          <Column header="Profit" style="width: 11%">
            <template #body="{ data }">
              <div v-if="data.profitMetrics">
                <div class="font-semibold">
                  Rs. {{ parseFloat(data.profitMetrics.grossProfit || 0).toFixed(2) }}
                </div>
                <div class="text-xs text-500" v-if="data.profitMetrics.freeItemsRevenue > 0">
                  Net: Rs. {{ parseFloat(data.profitMetrics.netProfit || 0).toFixed(2) }}
                </div>
              </div>
              <span v-else class="text-500">-</span>
            </template>
          </Column>

          <Column field="payment_method" header="Payment" style="width: 9%" sortable>
            <template #body="{ data }">
              <Tag
                :value="data.payment_method"
                :severity="getPaymentMethodSeverity(data.payment_method)"
                style="text-transform: uppercase"
              />
            </template>
          </Column>

          <Column field="payment_status" header="Status" style="width: 9%" sortable>
            <template #body="{ data }">
              <Tag
                :value="data.payment_status"
                :severity="getStatusSeverity(data.payment_status)"
                style="text-transform: capitalize"
              />
            </template>
          </Column>

          <Column header="Actions" style="width: 13%">
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
              <Button
                icon="pi pi-print"
                severity="success"
                text
                rounded
                @click="printReceipt(data)"
                v-tooltip.top="'Print Receipt'"
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
              <span v-if="selectedSale.discount_percentage">
                {{ parseFloat(selectedSale.discount_percentage).toFixed(2) }}% (Rs.
                {{ parseFloat(selectedSale.discount).toFixed(2) }})
              </span>
              <span v-else>Rs. {{ parseFloat(selectedSale.discount).toFixed(2) }}</span>
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
        <Button
          label="Print Receipt"
          icon="pi pi-print"
          severity="success"
          @click="printReceipt(selectedSale)"
        />
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
                  inputId="minmax-buttons"
                  @input="updateItemSubtotal(index)"
                  class="w-full"
                ></InputNumber>
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

        <div class="col-6">
          <label for="editDiscount" class="block mb-2 font-semibold">Discount (%)</label>
          <InputNumber
            id="editDiscount"
            v-model="editForm.discount_percentage"
            mode="decimal"
            :minFractionDigits="0"
            :maxFractionDigits="2"
            :min="0"
            :max="100"
            suffix="%"
            class="w-full"
            placeholder="Enter discount percentage"
          />
          <small class="text-500">
            Rs. {{ calculateEditDiscountAmount().toFixed(2) }} discount
          </small>
        </div>

        <div class="col-6">
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

        <div class="col-6">
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

        <div class="col-6">
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
          <label for="editNotes" class="block mb-2 font-semibold">
            Notes
            <span class="text-red-500">*</span>
          </label>
          <Textarea
            id="editNotes"
            v-model="editForm.notes"
            rows="3"
            class="w-full"
            placeholder="Add reason for updating this sale..."
            :class="{ 'p-invalid': !editForm.notes?.trim() }"
          />
          <small v-if="!editForm.notes?.trim()" class="text-red-500">
            Reason for update is required
          </small>
        </div>

        <div class="col-12">
          <div class="bg-blue-50 border-1 border-blue-200 border-round p-4">
            <h5 class="text-blue-800 mb-3 mt-0 flex align-items-center">
              <i class="pi pi-calculator text-blue-600 mr-2"></i>
              Sale Summary
            </h5>

            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="flex justify-content-between align-items-center py-2">
                  <span class="text-700 font-medium">Subtotal:</span>
                  <span class="font-semibold text-900">
                    Rs. {{ parseFloat(editForm.subtotal).toFixed(2) }}
                  </span>
                </div>
                <div class="flex justify-content-between align-items-center py-2">
                  <span class="text-700 font-medium flex align-items-center">
                    <i class="pi pi-minus-circle text-red-500 mr-1" style="font-size: 0.8rem"></i>
                    Discount:
                  </span>
                  <span class="font-semibold text-red-600">
                    <span v-if="editForm.discount_percentage">
                      {{ parseFloat(editForm.discount_percentage || 0).toFixed(2) }}%
                    </span>
                    (Rs. {{ calculateEditDiscountAmount().toFixed(2) }})
                  </span>
                </div>
                <div class="flex justify-content-between align-items-center py-2">
                  <span class="text-700 font-medium flex align-items-center">
                    <i class="pi pi-plus-circle text-green-500 mr-1" style="font-size: 0.8rem"></i>
                    Tax:
                  </span>
                  <span class="font-semibold text-green-600">
                    + Rs. {{ parseFloat(editForm.tax || 0).toFixed(2) }}
                  </span>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="bg-white border-round p-3 shadow-2">
                  <div class="text-center">
                    <div class="text-sm text-600 mb-1">New Total</div>
                    <div class="text-2xl font-bold text-primary">Rs. {{ calculateNewTotal() }}</div>
                    <div class="text-xs text-500 mt-1">After adjustments</div>
                  </div>
                </div>
              </div>
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
import PrintService from '@/services/PrintService';
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
    // Prepare items with editable fields and fetch available stock
    const items = await Promise.all(
      result.data.saleItems.map(async (item) => {
        let availableStock = 0;

        // Fetch total available stock for the product (across all batches)
        try {
          const productDetails = await productStore.getProductById(item.product_id);
          availableStock = productDetails?.total_stock || 0;
        } catch (error) {
          console.error('Error fetching product stock:', error);
        }

        return {
          id: item.id,
          product_id: item.product_id,
          product: item.product,
          stock_entry_id: item.stock_entry_id,
          quantity: item.quantity,
          original_quantity: item.quantity, // Store original for stock validation
          unit_price: parseFloat(item.unit_price),
          subtotal: parseFloat(item.subtotal),
          available_stock: availableStock,
        };
      })
    );

    editForm.value = {
      id: result.data.id,
      items: items,
      subtotal: result.data.subtotal,
      discount_percentage: result.data.discount_percentage || 0,
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
  const discountPercent = parseFloat(editForm.value.discount_percentage) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const tax = parseFloat(editForm.value.tax) || 0;
  return (subtotal - discountAmount + tax).toFixed(2);
}

function calculateEditDiscountAmount() {
  if (!editForm.value) return 0;
  const subtotal = editForm.value.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const discountPercent = parseFloat(editForm.value.discount_percentage) || 0;
  return (subtotal * discountPercent) / 100;
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

function printReceipt(sale) {
  try {
    PrintService.printReceipt(sale);
    toast.add({
      severity: 'success',
      summary: 'Print Initiated',
      detail: 'Receipt sent to printer',
      life: 3000,
    });
  } catch (error) {
    console.error('Error printing receipt:', error);
    toast.add({
      severity: 'error',
      summary: 'Print Failed',
      detail: error.message || 'Failed to print receipt',
      life: 3000,
    });
  }
}

async function saveSaleChanges() {
  // Validate required notes
  if (!editForm.value.notes || !editForm.value.notes.trim()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please provide a reason for updating this sale in the notes field.',
      life: 3000,
    });
    return;
  }

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
    discount_percentage: editForm.value.discount_percentage,
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
