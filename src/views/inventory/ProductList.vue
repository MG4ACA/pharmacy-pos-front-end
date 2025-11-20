<template>
  <div class="product-list">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Products</h1>
      <Button
        label="Add Product"
        icon="pi pi-plus mr-2"
        @click="$router.push('/inventory/products/add')"
      />
    </div>

    <!-- Filters -->
    <Card class="filter-card mb-4">
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-4">
            <span class="p-input-icon-left w-full relative flex align-items-center">
              <i class="pi pi-search search-icon" />
              <InputText
                v-model="filters.search"
                placeholder="Search by name or barcode"
                class="w-full"
                @input="handleSearch"
              />
            </span>
          </div>
          <div class="col-12 md:col-8 flex gap-3">
            <Dropdown
              v-model="filters.category_id"
              :options="categories"
              option-label="name"
              option-value="id"
              placeholder="All Categories"
              class="w-full"
              show-clear
              @change="handleFilter"
            />
            <Dropdown
              v-model="filters.product_type_id"
              :options="productTypes"
              option-label="name"
              option-value="id"
              placeholder="All Types"
              class="w-full"
              show-clear
              @change="handleFilter"
            />
            <Dropdown
              v-model="filters.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="Status"
              class="w-full"
              @change="handleFilter"
            />
            <Button icon="pi pi-refresh" class="p-button-help" @click="loadProducts" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Products DataTable -->
    <Card>
      <template #content>
        <DataTable
          :value="productStore.products"
          :loading="productStore.loading"
          :rows="pagination.limit"
          :total-records="pagination.total"
          paginator
          lazy
          striped-rows
          show-gridlines
          responsive-layout="scroll"
          @page="onPage"
        >
          <template #empty>
            <div class="text-center p-4">
              <i class="pi pi-inbox text-4xl text-400 mb-3"></i>
              <p class="text-600">No products found</p>
              <Button
                label="Add First Product"
                icon="pi pi-plus"
                class="p-button-sm"
                @click="$router.push('/inventory/products/add')"
              />
            </div>
          </template>

          <Column field="name" header="Product Name" :sortable="true">
            <template #body="{ data }">
              <div>
                <div class="font-semibold">{{ data.name }}</div>
                <div class="text-sm text-500" v-if="data.barcode">Barcode: {{ data.barcode }}</div>
              </div>
            </template>
          </Column>

          <Column field="productType.name" header="Type" :sortable="true"></Column>

          <Column field="category.name" header="Category" :sortable="true"></Column>

          <Column field="total_stock" header="Stock" :sortable="true">
            <template #body="{ data }">
              <Tag
                :value="data.total_stock"
                :severity="
                  data.is_low_stock ? 'danger' : data.total_stock > 0 ? 'success' : 'warning'
                "
              >
                <i
                  :class="data.is_low_stock ? 'pi pi-exclamation-triangle' : 'pi pi-check-circle'"
                  class="mr-1"
                ></i>
                {{ data.total_stock }}
              </Tag>
            </template>
          </Column>

          <Column field="reorder_level" header="Reorder Level" :sortable="true"></Column>

          <Column field="status" header="Status" :sortable="true">
            <template #body="{ data }">
              <Tag :severity="data.status === 'active' ? 'success' : 'danger'">
                {{ data.status }}
              </Tag>
            </template>
          </Column>

          <Column header="Actions" :exportable="false">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-sm p-button-warning"
                  v-tooltip.top="'Edit'"
                  @click="editProduct(data.id)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-sm p-button-danger"
                  v-tooltip.top="'Delete'"
                  @click="confirmDelete(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification';
import { MetaService } from '@/services/MetaService';
import { useProductStore } from '@/stores/product';
import { useConfirm } from 'primevue/useconfirm';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';

const router = useRouter();
const productStore = useProductStore();
const confirm = useConfirm();
const { success, error } = useNotification();

const productTypes = ref([]);
const categories = ref([]);

const filters = reactive({
  search: '',
  category_id: null,
  product_type_id: null,
  status: 'active',
});

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

const statusOptions = [
  { label: 'All', value: null },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

let searchTimeout = null;

const loadProducts = async () => {
  try {
    await productStore.fetchProducts({
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    });
    pagination.total = productStore.pagination.total;
  } catch (err) {
    error(err.message || 'Failed to load products');
  }
};

const loadMetadata = async () => {
  try {
    const [typesResult, categoriesResult] = await Promise.all([
      MetaService.getProductTypes(),
      MetaService.getCategories(),
    ]);

    if (typesResult.success) {
      productTypes.value = typesResult.data;
    }

    if (categoriesResult.success) {
      categories.value = categoriesResult.data;
    }
  } catch (err) {
    console.error('Failed to load metadata:', err);
  }
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.page = 1;
    loadProducts();
  }, 500);
};

const handleFilter = () => {
  pagination.page = 1;
  loadProducts();
};

const onPage = (event) => {
  pagination.page = event.page + 1;
  pagination.limit = event.rows;
  loadProducts();
};

const editProduct = (id) => {
  router.push(`/inventory/products/${id}/edit`);
};

const confirmDelete = (product) => {
  confirm.require({
    message: `Are you sure you want to delete "${product.name}"?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await productStore.deleteProduct(product.id);
        success('Product deleted successfully');
        loadProducts();
      } catch (err) {
        error(err.message || 'Failed to delete product');
      }
    },
  });
};

onMounted(() => {
  loadMetadata();
  loadProducts();
});
</script>

<style scoped>
.filter-card > div {
  padding: 0 !important;
}
.product-list {
  max-width: 1400px;
  width: 100%;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.p-button-help {
  padding: 0.7rem 1.5rem;
}
</style>
