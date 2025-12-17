<template>
  <div class="stock-batches-container">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="m-0 text-primary" style="font-size: 1.5em">Stock Batches</h2>
        <p class="text-600 m-0 mt-1" style="font-size: 0.85em">
          View all stock batches with expiry dates and quantities
        </p>
      </div>
      <div class="flex gap-2">
        <Button
          label="Expiring Soon"
          icon="pi pi-exclamation-triangle"
          severity="warning"
          class="header-button-section"
          outlined
          @click="showExpiringOnly"
          :badge="expiringCount > 0 ? expiringCount.toString() : null"
          badgeSeverity="danger"
        />
        <Button
          label="Expired"
          icon="pi pi-times-circle"
          severity="danger"
          outlined
          @click="showExpiredOnly"
          :badge="expiredCount > 0 ? expiredCount.toString() : null"
          badgeSeverity="danger"
        />
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          @click="loadAllBatches"
          :loading="isLoading"
        />
      </div>
    </div>

    <!-- Filters -->
    <Card class="filter-card mb-3">
      <template #content>
        <div class="flex justify-content-between">
          <div class="">
            <label for="productSearch" class="block mb-2" style="font-size: 0.85em">Product</label>
            <AutoComplete
              id="productSearch"
              v-model="selectedProduct"
              :suggestions="filteredProducts"
              @complete="searchProducts"
              @item-select="onProductSelect"
              field="name"
              placeholder="Search product..."
              class="w-full"
            >
              <template #item="{ item }">
                <div>
                  <div style="font-size: 0.9em">{{ item.name }}</div>
                  <div style="font-size: 0.75em" class="text-500">{{ item.category?.name }}</div>
                </div>
              </template>
            </AutoComplete>
          </div>

          <div>
            <label for="supplierFilter" class="block mb-2" style="font-size: 0.85em">
              Supplier
            </label>
            <Dropdown
              id="supplierFilter"
              v-model="filters.supplierId"
              :options="suppliers"
              optionLabel="name"
              optionValue="id"
              placeholder="All Suppliers"
              showClear
              class="w-full"
            />
          </div>

          <div>
            <label for="receiptFilter" class="block mb-2" style="font-size: 0.85em">Receipt</label>
            <Dropdown
              id="receiptFilter"
              v-model="filters.receiptId"
              :options="receipts"
              optionLabel="receipt_number"
              optionValue="id"
              placeholder="All Receipts"
              showClear
              class="w-full"
              @change="onReceiptChange"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <span>{{ getReceiptLabel(slotProps.value) }}</span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>
              <template #option="slotProps">
                <div>
                  <div style="font-size: 0.9em" class="font-semibold">
                    {{ slotProps.option.receipt_number }}
                  </div>
                  <div style="font-size: 0.75em" class="text-500">
                    {{ formatDate(slotProps.option.receipt_date) }}
                    <span v-if="slotProps.option.supplier?.name">
                      - {{ slotProps.option.supplier.name }}
                    </span>
                  </div>
                </div>
              </template>
            </Dropdown>
          </div>

          <div>
            <label for="expiryFilter" class="block mb-2" style="font-size: 0.85em">
              Expiry Status
            </label>
            <Dropdown
              id="expiryFilter"
              v-model="filters.expiryStatus"
              :options="expiryStatusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Batches"
              class="w-full"
            />
          </div>

          <div class="flex align-items-end">
            <div class="field-checkbox mb-0">
              <Checkbox id="freeItemsFilter" v-model="filters.hasFreeItems" :binary="true" />
              <label for="freeItemsFilter" class="ml-2" style="font-size: 0.85em">
                <i class="pi pi-gift text-green-600 mr-1"></i>
                Show only free items
              </label>
            </div>
          </div>

          <div class="flex align-items-end justify-content-end">
            <Button label="Clear" icon="pi pi-filter-slash" outlined @click="clearFilters" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Stock Batches Table -->
    <Card>
      <template #content>
        <DataTable
          :value="filteredBatches"
          :loading="isLoading"
          stripedRows
          responsiveLayout="scroll"
          :paginator="true"
          :rows="20"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 20, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} batches"
          class="p-datatable-sm"
          sortField="expiry_date"
          :sortOrder="1"
        >
          <template #empty>
            <div class="text-center py-6">
              <i class="pi pi-inbox text-6xl text-400 mb-3"></i>
              <p class="text-xl" style="font-size: 1em">No stock batches found</p>
              <p class="text-sm text-500" style="font-size: 0.8em">
                Try adjusting your filters or add stock receipts
              </p>
            </div>
          </template>

          <Column field="product.name" header="Product" sortable style="width: 18%">
            <template #body="{ data }">
              <div>
                <div style="font-size: 0.9em" class="font-semibold">
                  {{ data.product?.name }}
                </div>
                <div style="font-size: 0.75em" class="text-500">
                  {{ data.product?.category?.name }} • Batch: {{ data.batch_number }}
                </div>
              </div>
            </template>
          </Column>

          <Column field="receipt.receipt_number" header="Receipt #" sortable style="width: 12%">
            <template #body="{ data }">
              <div v-if="data.receipt">
                <div style="font-size: 0.85em" class="font-semibold text-primary">
                  {{ data.receipt.receipt_number }}
                </div>
                <div
                  v-if="data.receipt.supplier_invoice_number"
                  style="font-size: 0.7em"
                  class="text-500"
                >
                  Inv: {{ data.receipt.supplier_invoice_number }}
                </div>
              </div>
              <span v-else style="font-size: 0.85em" class="text-500">N/A</span>
            </template>
          </Column>

          <Column field="supplier.name" header="Supplier" sortable style="width: 15%">
            <template #body="{ data }">
              <span style="font-size: 0.85em">{{ data.supplier?.name || 'N/A' }}</span>
            </template>
          </Column>

          <Column field="quantity_remaining" header="Quantity" sortable style="width: 15%">
            <template #body="{ data }">
              <div>
                <div class="flex align-items-center gap-2 mb-1">
                  <Tag
                    :value="data.quantity_remaining + ' total'"
                    :severity="data.quantity_remaining > 10 ? 'success' : 'warning'"
                  />
                  <Tag
                    v-if="data.free_quantity > 0"
                    :value="data.free_quantity + ' FREE'"
                    severity="success"
                    icon="pi pi-gift mr-1"
                    class="text-xs"
                  />
                </div>
                <div style="font-size: 0.75em" class="text-500">
                  Purchased: {{ data.quantity_received }}
                </div>
              </div>
            </template>
          </Column>

          <Column field="cost_price" header="Cost P" sortable style="width: 9%">
            <template #body="{ data }">
              <span style="font-size: 0.85em">
                Rs. {{ parseFloat(data.cost_price).toFixed(2) }}
              </span>
            </template>
          </Column>

          <Column field="selling_price" header="Selling P" sortable style="width: 9%">
            <template #body="{ data }">
              <span style="font-size: 0.85em" class="font-semibold text-primary">
                Rs. {{ parseFloat(data.selling_price).toFixed(2) }}
              </span>
            </template>
          </Column>

          <Column field="expiry_date" header="Dates" sortable style="width: 15%">
            <template #body="{ data }">
              <div>
                <div class="mb-1 flex">
                  <div style="font-size: 0.8em" class="text-600 mr-2">Expiry:</div>
                  <div v-if="data.expiry_date" style="font-size: 0.85em">
                    {{ formatDate(data.expiry_date) }}
                    <Tag
                      v-if="getExpiryStatus(data.expiry_date) === 'expired'"
                      value="Expired"
                      severity="danger"
                      class="mt-1 ml-1"
                      style="font-size: 0.65em; padding: 0.1rem 0.3rem"
                    />
                    <Tag
                      v-else-if="getExpiryStatus(data.expiry_date) === 'expiring'"
                      value="Expiring Soon"
                      severity="warning"
                      class="mt-1 ml-1"
                      style="font-size: 0.65em; padding: 0.1rem 0.3rem"
                    />
                  </div>
                  <span v-else style="font-size: 0.85em" class="text-500">No expiry</span>
                </div>
                <div class="flex">
                  <div style="font-size: 0.8em" class="text-600 mr-2">Entry:</div>
                  <span style="font-size: 0.75em" class="text-600">
                    {{ formatDate(data.entry_date) }}
                  </span>
                </div>
              </div>
            </template>
          </Column>

          <Column header="Actions" :exportable="false" style="width: 5%">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                @click="viewBatchDetails(data.id)"
                v-tooltip.left="'View Details'"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Batch Details Dialog -->
    <Dialog
      v-model:visible="showDetailsDialog"
      header="Batch Details"
      :modal="true"
      :style="{ width: '600px' }"
    >
      <div v-if="currentBatch" class="batch-details">
        <!-- Product Info -->
        <div class="surface-100 border-round p-3 mb-3">
          <h3 class="mt-0 mb-2" style="font-size: 1.1em">Product Information</h3>
          <div class="grid">
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Product Name</label>
              <p style="font-size: 0.9em" class="mt-1 font-semibold">
                {{ currentBatch.product?.name }}
              </p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Category</label>
              <p style="font-size: 0.9em" class="mt-1">
                {{ currentBatch.product?.category?.name }}
              </p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Barcode</label>
              <p style="font-size: 0.9em" class="mt-1">{{ currentBatch.product?.barcode }}</p>
            </div>
          </div>
        </div>

        <!-- Batch Info -->
        <div class="surface-100 border-round p-3 mb-3">
          <h3 class="mt-0 mb-2" style="font-size: 1.1em">Batch Information</h3>
          <div class="grid">
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Batch Number</label>
              <p style="font-size: 0.9em" class="mt-1 font-semibold">
                {{ currentBatch.batch_number }}
              </p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Quantity Remaining</label>
              <p style="font-size: 0.9em" class="mt-1">
                <Tag
                  :value="currentBatch.quantity_remaining + ' total'"
                  :severity="currentBatch.quantity_remaining > 10 ? 'success' : 'warning'"
                />
              </p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Free Items</label>
              <p style="font-size: 0.9em" class="mt-1">
                <span v-if="currentBatch.free_quantity > 0" class="text-green-600 font-semibold">
                  <i class="pi pi-gift mr-1"></i>
                  {{ currentBatch.free_quantity }} units
                </span>
                <span v-else class="text-500">None</span>
              </p>
            </div>
            <div class="col-12">
              <label style="font-size: 0.75em" class="text-600">Breakdown</label>
              <p style="font-size: 0.85em" class="mt-1">
                Purchased:
                {{ currentBatch.quantity_received }} | Free: {{ currentBatch.free_quantity || 0 }} |
                <span class="font-semibold">
                  Total: {{ currentBatch.quantity_received + (currentBatch.free_quantity || 0) }}
                </span>
              </p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Cost Price</label>
              <p style="font-size: 0.9em" class="mt-1">
                Rs. {{ parseFloat(currentBatch.cost_price).toFixed(2) }}
              </p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Selling Price</label>
              <p style="font-size: 0.9em" class="mt-1 text-primary font-semibold">
                Rs. {{ parseFloat(currentBatch.selling_price).toFixed(2) }}
              </p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Entry Date</label>
              <p style="font-size: 0.9em" class="mt-1">{{ formatDate(currentBatch.entry_date) }}</p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Expiry Date</label>
              <p style="font-size: 0.9em" class="mt-1">
                {{ currentBatch.expiry_date ? formatDate(currentBatch.expiry_date) : 'No expiry' }}
                <Tag
                  v-if="
                    currentBatch.expiry_date &&
                    getExpiryStatus(currentBatch.expiry_date) === 'expired'
                  "
                  value="Expired"
                  severity="danger"
                  class="ml-2"
                  style="font-size: 0.7em"
                />
                <Tag
                  v-else-if="
                    currentBatch.expiry_date &&
                    getExpiryStatus(currentBatch.expiry_date) === 'expiring'
                  "
                  value="Expiring Soon"
                  severity="warning"
                  class="ml-2"
                  style="font-size: 0.7em"
                />
              </p>
            </div>
          </div>
        </div>

        <!-- Receipt Info -->
        <div class="surface-100 border-round p-3 mb-3" v-if="currentBatch.receipt">
          <h3 class="mt-0 mb-2" style="font-size: 1.1em">Receipt Information</h3>
          <div class="grid">
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Receipt Number</label>
              <p style="font-size: 0.9em" class="mt-1 font-semibold text-primary">
                {{ currentBatch.receipt.receipt_number }}
              </p>
            </div>
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Receipt Date</label>
              <p style="font-size: 0.9em" class="mt-1">
                {{ formatDate(currentBatch.receipt.receipt_date) }}
              </p>
            </div>
            <div class="col-6" v-if="currentBatch.receipt.supplier_invoice_number">
              <label style="font-size: 0.75em" class="text-600">Supplier Invoice #</label>
              <p style="font-size: 0.9em" class="mt-1">
                {{ currentBatch.receipt.supplier_invoice_number }}
              </p>
            </div>
            <div class="col-6" v-if="currentBatch.receipt.total_amount">
              <label style="font-size: 0.75em" class="text-600">Receipt Total</label>
              <p style="font-size: 0.9em" class="mt-1">
                Rs. {{ parseFloat(currentBatch.receipt.total_amount).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Supplier Info -->
        <div class="surface-100 border-round p-3">
          <h3 class="mt-0 mb-2" style="font-size: 1.1em">Supplier Information</h3>
          <div class="grid">
            <div class="col-6">
              <label style="font-size: 0.75em" class="text-600">Supplier Name</label>
              <p style="font-size: 0.9em" class="mt-1">
                {{ currentBatch.supplier?.name || 'N/A' }}
              </p>
            </div>
            <div class="col-6" v-if="currentBatch.supplier?.contact_person">
              <label style="font-size: 0.75em" class="text-600">Contact Person</label>
              <p style="font-size: 0.9em" class="mt-1">
                {{ currentBatch.supplier.contact_person }}
              </p>
            </div>
            <div class="col-6" v-if="currentBatch.supplier?.phone">
              <label style="font-size: 0.75em" class="text-600">Phone</label>
              <p style="font-size: 0.9em" class="mt-1">{{ currentBatch.supplier.phone }}</p>
            </div>
            <div class="col-6" v-if="currentBatch.supplier?.email">
              <label style="font-size: 0.75em" class="text-600">Email</label>
              <p style="font-size: 0.9em" class="mt-1">{{ currentBatch.supplier.email }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Close" icon="pi pi-times" @click="showDetailsDialog = false" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/product';
import { useStockStore } from '@/stores/stock';
import { useStockReceiptStore } from '@/stores/stockReceipt';
import { useSupplierStore } from '@/stores/supplier';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const toast = useToast();
const stockStore = useStockStore();
const productStore = useProductStore();
const supplierStore = useSupplierStore();
const stockReceiptStore = useStockReceiptStore();

// Refs
const allBatches = ref([]);
const selectedProduct = ref(null);
const filteredProducts = ref([]);
const suppliers = ref([]);
const receipts = ref([]);
const showDetailsDialog = ref(false);
const filters = ref({
  supplierId: null,
  receiptId: null,
  expiryStatus: null,
  hasFreeItems: false,
});

const expiryStatusOptions = [
  { label: 'All Batches', value: null },
  { label: 'Expiring Soon (30 days)', value: 'expiring' },
  { label: 'Expired', value: 'expired' },
  { label: 'Valid', value: 'valid' },
];

// Lifecycle
onMounted(() => {
  initializeData();
});

// Helper function - must be defined before computed properties
const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 30) return 'expiring';
  return 'valid';
};

// Computed
const isLoading = computed(() => stockStore.isLoading);
const currentBatch = computed(() => stockStore.currentBatch);

const filteredBatches = computed(() => {
  let result = allBatches.value;

  if (filters.value.supplierId) {
    result = result.filter((batch) => batch.supplier?.id === filters.value.supplierId);
  }

  if (filters.value.receiptId) {
    result = result.filter((batch) => batch.receipt?.id === filters.value.receiptId);
  }

  if (filters.value.expiryStatus) {
    result = result.filter((batch) => {
      if (!batch.expiry_date && filters.value.expiryStatus === 'valid') return true;
      if (!batch.expiry_date) return false;

      const status = getExpiryStatus(batch.expiry_date);
      return status === filters.value.expiryStatus;
    });
  }

  if (filters.value.hasFreeItems) {
    result = result.filter((batch) => batch.free_quantity > 0);
  }

  return result;
});

const expiringCount = computed(() => {
  return allBatches.value.filter((batch) => {
    if (!batch.expiry_date) return false;
    return getExpiryStatus(batch.expiry_date) === 'expiring';
  }).length;
});

const expiredCount = computed(() => {
  return allBatches.value.filter((batch) => {
    if (!batch.expiry_date) return false;
    return getExpiryStatus(batch.expiry_date) === 'expired';
  }).length;
});

// Methods
const loadAllBatches = async () => {
  try {
    // Fetch all products first
    await productStore.fetchProducts();

    // Get stock for each product
    const products = productStore.products;
    const allEntries = [];

    for (const product of products) {
      try {
        const entries = await stockStore.fetchStockByProduct(product.id);
        // Entries already include product data from backend
        allEntries.push(...entries);
      } catch (error) {
        console.error(`Failed to load stock for product ${product.id}:`, error);
      }
    }

    allBatches.value = allEntries;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load stock batches',
      life: 5000,
    });
  }
};

const searchProducts = async (event) => {
  const query = event.query.trim().toLowerCase();

  if (query.length < 2) {
    filteredProducts.value = [];
    return;
  }

  try {
    const products = await productStore.searchProducts(query);
    filteredProducts.value = products || [];
  } catch (error) {
    filteredProducts.value = [];
  }
};

const onProductSelect = async (event) => {
  const product = event.value;

  try {
    const entries = await stockStore.fetchStockByProduct(product.id);
    // Entries already include product data from backend
    allBatches.value = entries;

    toast.add({
      severity: 'success',
      summary: 'Filtered',
      detail: `Showing batches for ${product.name}`,
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load product batches',
      life: 5000,
    });
  }
};

const showExpiringOnly = () => {
  filters.value.expiryStatus = 'expiring';
  toast.add({
    severity: 'info',
    summary: 'Filter Applied',
    detail: `Showing ${expiringCount.value} expiring batches`,
    life: 3000,
  });
};

const showExpiredOnly = () => {
  filters.value.expiryStatus = 'expired';
  toast.add({
    severity: 'error',
    summary: 'Filter Applied',
    detail: `Showing ${expiredCount.value} expired batches`,
    life: 3000,
  });
};

const clearFilters = () => {
  filters.value = {
    supplierId: null,
    receiptId: null,
    expiryStatus: null,
    hasFreeItems: false,
  };
  selectedProduct.value = null;
  loadAllBatches();
};

const getReceiptLabel = (receiptId) => {
  const receipt = receipts.value.find((r) => r.id === receiptId);
  return receipt ? receipt.receipt_number : '';
};

const onReceiptChange = () => {
  if (filters.value.receiptId) {
    const selectedReceipt = receipts.value.find((r) => r.id === filters.value.receiptId);
    if (selectedReceipt && selectedReceipt.supplier_id) {
      filters.value.supplierId = selectedReceipt.supplier_id;
    }
  }
};

const viewBatchDetails = async (batchId) => {
  try {
    await stockStore.fetchBatchDetails(batchId);
    showDetailsDialog.value = true;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load batch details',
      life: 5000,
    });
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB');
};

// Initialize data
const initializeData = async () => {
  await loadAllBatches();

  // Load suppliers for filter
  try {
    await supplierStore.fetchSuppliers();
    suppliers.value = supplierStore.suppliers;
  } catch (error) {
    console.error('Failed to load suppliers:', error);
  }

  // Load receipts for filter
  try {
    await stockReceiptStore.loadReceipts();
    receipts.value = stockReceiptStore.receipts;
  } catch (error) {
    console.error('Failed to load receipts:', error);
  }
};
</script>

<style scoped>
.stock-batches-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0.5rem;
}
.p-badge,
.p-button-label {
  margin-left: 0.5rem;
}

.batch-details h3 {
  color: var(--primary-color);
}

.batch-details label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.batch-details p {
  margin: 0;
}
</style>
