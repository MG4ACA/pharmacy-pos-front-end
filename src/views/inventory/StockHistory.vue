<template>
  <div class="stock-history">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Stock History</h1>
      <Button
        label="Add Stock Entry"
        icon="pi pi-plus"
        @click="$router.push('/inventory/stock-entry')"
      />
    </div>

    <!-- Filters -->
    <Card class="mb-4">
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-3">
            <div class="field">
              <label for="filter-product" class="block mb-2">Product</label>
              <AutoComplete
                id="filter-product"
                v-model="filters.selectedProduct"
                :suggestions="productSuggestions"
                @complete="searchProducts"
                @item-select="onProductSelect"
                field="name"
                placeholder="Search product"
              />
            </div>
          </div>

          <div class="col-12 md:col-3">
            <div class="field">
              <label for="filter-supplier" class="block mb-2">Supplier</label>
              <Dropdown
                id="filter-supplier"
                v-model="filters.supplier_id"
                :options="suppliers"
                option-label="name"
                option-value="id"
                placeholder="All suppliers"
                show-clear
              />
            </div>
          </div>

          <div class="col-12 md:col-2">
            <div class="field">
              <label for="filter-from" class="block mb-2">From Date</label>
              <Calendar
                id="filter-from"
                v-model="filters.from_date"
                dateFormat="yy-mm-dd"
                placeholder="Start date"
                show-icon
              />
            </div>
          </div>

          <div class="col-12 md:col-2">
            <div class="field">
              <label for="filter-to" class="block mb-2">To Date</label>
              <Calendar
                id="filter-to"
                v-model="filters.to_date"
                dateFormat="yy-mm-dd"
                placeholder="End date"
                show-icon
              />
            </div>
          </div>

          <div class="col-12 md:col-2">
            <div class="field">
              <label class="block mb-2">&nbsp;</label>
              <div class="flex align-items-center" style="height: 3rem">
                <Checkbox id="has-stock" v-model="filters.has_stock" :binary="true" class="mr-2" />
                <label for="has-stock">Stock Available</label>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="flex gap-2">
              <Button label="Apply Filters" icon="pi pi-filter" @click="applyFilters" />
              <Button
                label="Clear Filters"
                icon="pi pi-filter-slash"
                class="p-button-secondary"
                @click="clearFilters"
              />
              <Button
                label="Expiring Soon"
                icon="pi pi-exclamation-triangle"
                class="p-button-warning"
                @click="showExpiringSoon"
              />
              <Button
                icon="pi pi-refresh mr-0"
                class="p-button-help"
                v-tooltip.top="'Refresh'"
                @click="loadStockHistory"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Data Table -->
    <Card>
      <template #content>
        <DataTable
          :value="stockEntries"
          :loading="loading"
          paginator
          :rows="pagination.limit"
          :totalRecords="pagination.total"
          :lazy="true"
          @page="onPage"
          data-key="id"
          responsive-layout="scroll"
        >
          <Column field="id" header="ID" style="width: 80px"></Column>

          <Column header="Product">
            <template #body="{ data }">
              <div>
                <div class="font-semibold">{{ data.product?.name || 'N/A' }}</div>
                <div class="text-sm text-500" v-if="data.product?.barcode">
                  {{ data.product.barcode }}
                </div>
              </div>
            </template>
          </Column>

          <Column header="Supplier">
            <template #body="{ data }">
              {{ data.supplier?.name || '-' }}
            </template>
          </Column>

          <Column field="batch_number" header="Batch">
            <template #body="{ data }">
              {{ data.batch_number || '-' }}
            </template>
          </Column>

          <Column header="Quantity">
            <template #body="{ data }">
              <div>
                <div>Received: {{ data.quantity_received }}</div>
                <div
                  :class="{
                    'text-green-600': data.quantity_remaining > 0,
                    'text-red-600': data.quantity_remaining === 0,
                  }"
                >
                  Remaining: {{ data.quantity_remaining }}
                </div>
              </div>
            </template>
          </Column>

          <Column header="Pricing">
            <template #body="{ data }">
              <div>
                <div class="text-sm">Cost: LKR {{ formatPrice(data.cost_price) }}</div>
                <div class="text-sm">Selling: LKR {{ formatPrice(data.selling_price) }}</div>
              </div>
            </template>
          </Column>

          <Column field="expiry_date" header="Expiry">
            <template #body="{ data }">
              <Tag
                v-if="data.expiry_date"
                :value="formatDate(data.expiry_date)"
                :severity="getExpirySeverity(data.expiry_date)"
              />
              <span v-else>-</span>
            </template>
          </Column>

          <Column field="entry_date" header="Entry Date">
            <template #body="{ data }">
              {{ formatDate(data.entry_date) }}
            </template>
          </Column>

          <Column header="Actions" style="width: 120px">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                class="p-button-sm p-button-text"
                v-tooltip.top="'View Details'"
                @click="viewDetails(data)"
              />
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-4">No stock entries found</div>
          </template>
        </DataTable>
      </template>
    </Card>

    <!-- Details Dialog -->
    <Dialog
      v-model:visible="detailsDialog"
      :header="'Stock Entry Details - ID: ' + selectedEntry?.id"
      :modal="true"
      :style="{ width: '600px' }"
    >
      <div v-if="selectedEntry" class="grid">
        <div class="col-6">
          <strong>Product:</strong>
          <p>{{ selectedEntry.product?.name || 'N/A' }}</p>
        </div>
        <div class="col-6">
          <strong>Barcode:</strong>
          <p>{{ selectedEntry.product?.barcode || '-' }}</p>
        </div>
        <div class="col-6">
          <strong>Supplier:</strong>
          <p>{{ selectedEntry.supplier?.name || '-' }}</p>
        </div>
        <div class="col-6">
          <strong>Batch Number:</strong>
          <p>{{ selectedEntry.batch_number || '-' }}</p>
        </div>
        <div class="col-6">
          <strong>Quantity Received:</strong>
          <p>{{ selectedEntry.quantity_received }}</p>
        </div>
        <div class="col-6">
          <strong>Quantity Remaining:</strong>
          <p>{{ selectedEntry.quantity_remaining }}</p>
        </div>
        <div class="col-6">
          <strong>Cost Price:</strong>
          <p>LKR {{ formatPrice(selectedEntry.cost_price) }}</p>
        </div>
        <div class="col-6">
          <strong>Selling Price:</strong>
          <p>LKR {{ formatPrice(selectedEntry.selling_price) }}</p>
        </div>
        <div class="col-6">
          <strong>Entry Date:</strong>
          <p>{{ formatDate(selectedEntry.entry_date) }}</p>
        </div>
        <div class="col-6">
          <strong>Expiry Date:</strong>
          <p>
            <Tag
              v-if="selectedEntry.expiry_date"
              :value="formatDate(selectedEntry.expiry_date)"
              :severity="getExpirySeverity(selectedEntry.expiry_date)"
            />
            <span v-else>-</span>
          </p>
        </div>
        <div class="col-12" v-if="selectedEntry.notes">
          <strong>Notes:</strong>
          <p>{{ selectedEntry.notes }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification';
import { ProductService } from '@/services/ProductService';
import { SupplierService } from '@/services/SupplierService';
import { useStockStore } from '@/stores/stock';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';

const router = useRouter();
const stockStore = useStockStore();
const { success, error } = useNotification();

const loading = computed(() => stockStore.loading);
const stockEntries = computed(() => stockStore.stockEntries);
const pagination = computed(() => stockStore.pagination);

const productSuggestions = ref([]);
const suppliers = ref([]);
const detailsDialog = ref(false);
const selectedEntry = ref(null);

const filters = reactive({
  selectedProduct: null,
  product_id: null,
  supplier_id: null,
  from_date: null,
  to_date: null,
  has_stock: false,
});

const searchProducts = async (event) => {
  try {
    const result = await ProductService.searchProducts(event.query);
    if (result.success) {
      productSuggestions.value = result.data || [];
    }
  } catch (err) {
    console.error('Product search error:', err);
  }
};

const onProductSelect = (event) => {
  filters.product_id = event.value.id;
};

const loadSuppliers = async () => {
  try {
    const result = await SupplierService.getActiveSuppliers();
    if (result.success) {
      suppliers.value = result.data || [];
    }
  } catch (err) {
    console.error('Failed to load suppliers:', err);
  }
};

const applyFilters = async () => {
  const params = {
    page: 1,
    limit: pagination.value.limit,
  };

  if (filters.product_id) {
    params.product_id = filters.product_id;
  }

  if (filters.supplier_id) {
    params.supplier_id = filters.supplier_id;
  }

  if (filters.from_date) {
    params.from_date = filters.from_date.toISOString().split('T')[0];
  }

  if (filters.to_date) {
    params.to_date = filters.to_date.toISOString().split('T')[0];
  }

  if (filters.has_stock) {
    params.has_stock = true;
  }

  try {
    await stockStore.fetchStockHistory(params);
  } catch (err) {
    error('Failed to fetch stock history');
  }
};

const clearFilters = () => {
  filters.selectedProduct = null;
  filters.product_id = null;
  filters.supplier_id = null;
  filters.from_date = null;
  filters.to_date = null;
  filters.has_stock = false;
  loadStockHistory();
};

const showExpiringSoon = async () => {
  try {
    const result = await stockStore.fetchExpiringStock(30);
    if (result.success && result.data && result.data.length > 0) {
      success(`Found ${result.data.length} items expiring within 30 days`);
    } else {
      success('No items expiring within 30 days');
    }
  } catch (err) {
    error('Failed to fetch expiring stock');
  }
};

const onPage = (event) => {
  const params = {
    page: event.page + 1,
    limit: event.rows,
  };

  if (filters.product_id) params.product_id = filters.product_id;
  if (filters.supplier_id) params.supplier_id = filters.supplier_id;
  if (filters.from_date) params.from_date = filters.from_date.toISOString().split('T')[0];
  if (filters.to_date) params.to_date = filters.to_date.toISOString().split('T')[0];
  if (filters.has_stock) params.has_stock = true;

  stockStore.fetchStockHistory(params);
};

const viewDetails = async (entry) => {
  try {
    const result = await stockStore.fetchBatchDetails(entry.id);
    if (result.success) {
      selectedEntry.value = result.data;
      detailsDialog.value = true;
    }
  } catch (err) {
    error('Failed to load batch details');
  }
};

const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2);
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB');
};

const getExpirySeverity = (expiryDate) => {
  if (!expiryDate) return 'info';

  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return 'danger';
  if (daysUntilExpiry <= 30) return 'warning';
  return 'success';
};

const loadStockHistory = async () => {
  try {
    await stockStore.fetchStockHistory({
      page: 1,
      limit: 10,
    });
  } catch (err) {
    error('Failed to load stock history');
  }
};

onMounted(() => {
  loadSuppliers();
  loadStockHistory();
});
</script>

<style scoped>
.stock-history {
  max-width: 1400px;
  width: 100%;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.field {
  margin-bottom: 0;
}

.field label {
  font-weight: 500;
  color: var(--text-primary);
}

.text-500 {
  color: #6b7280;
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}
</style>
