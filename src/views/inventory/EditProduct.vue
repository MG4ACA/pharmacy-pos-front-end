<template>
  <div class="edit-product">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Edit Product</h1>
      <Button
        label="Back to List mr-2"
        icon="pi pi-arrow-left"
        class="p-button-secondary"
        @click="$router.push('/inventory/products')"
      />
    </div>

    <div
      v-if="pageLoading"
      class="flex justify-content-center align-items-center"
      style="min-height: 400px"
    >
      <ProgressSpinner />
    </div>

    <Card v-else>
      <template #content>
        <form @submit.prevent="handleSubmit" class="p-fluid">
          <div class="grid">
            <!-- Product Name -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="name" class="block mb-2">
                  Product Name
                  <span class="text-red-500">*</span>
                </label>
                <InputText
                  id="name"
                  v-model="formData.name"
                  :class="{ 'p-invalid': errors.name }"
                  placeholder="Enter product name"
                />
                <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
              </div>
            </div>

            <!-- Barcode -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="barcode" class="block mb-2">Barcode</label>
                <InputText
                  id="barcode"
                  v-model="formData.barcode"
                  :class="{ 'p-invalid': errors.barcode }"
                  placeholder="Enter barcode (optional)"
                />
                <small v-if="errors.barcode" class="p-error">{{ errors.barcode }}</small>
              </div>
            </div>

            <!-- Product Type -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="product_type_id" class="block mb-2">
                  Product Type
                  <span class="text-red-500">*</span>
                </label>
                <Dropdown
                  id="product_type_id"
                  v-model="formData.product_type_id"
                  :options="productTypes"
                  option-label="name"
                  option-value="id"
                  placeholder="Select product type"
                  :class="{ 'p-invalid': errors.product_type_id }"
                />
                <small v-if="errors.product_type_id" class="p-error">
                  {{ errors.product_type_id }}
                </small>
              </div>
            </div>

            <!-- Category -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="category_id" class="block mb-2">
                  Category
                  <span class="text-red-500">*</span>
                </label>
                <Dropdown
                  id="category_id"
                  v-model="formData.category_id"
                  :options="categories"
                  option-label="name"
                  option-value="id"
                  placeholder="Select category"
                  :class="{ 'p-invalid': errors.category_id }"
                />
                <small v-if="errors.category_id" class="p-error">
                  {{ errors.category_id }}
                </small>
              </div>
            </div>

            <!-- Reorder Level -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="reorder_level" class="block mb-2">Reorder Level</label>
                <InputNumber
                  id="reorder_level"
                  v-model="formData.reorder_level"
                  :min="0"
                  placeholder="Minimum stock level"
                  :class="{ 'p-invalid': errors.reorder_level }"
                />
                <small v-if="errors.reorder_level" class="p-error">
                  {{ errors.reorder_level }}
                </small>
              </div>
            </div>

            <!-- Status -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="status" class="block mb-2">Status</label>
                <Dropdown
                  id="status"
                  v-model="formData.status"
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select status"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="col-12">
              <div class="field">
                <label for="description" class="block mb-2">Description</label>
                <Textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  placeholder="Enter product description (optional)"
                  :class="{ 'p-invalid': errors.description }"
                />
                <small v-if="errors.description" class="p-error">
                  {{ errors.description }}
                </small>
              </div>
            </div>

            <!-- Stock Information (Read-only) -->
            <div class="col-12">
              <Divider />
              <h3 class="mb-3">Stock Information</h3>
              <div class="grid">
                <div class="col-12 md:col-4">
                  <div class="field">
                    <label class="block mb-2">Current Stock</label>
                    <InputNumber
                      :model-value="productStore.currentProduct?.total_stock || 0"
                      disabled
                    />
                  </div>
                </div>
                <div class="col-12 md:col-4">
                  <div class="field">
                    <label class="block mb-2">Stock Status</label>
                    <Tag :value="getStockStatus()" :severity="getStockSeverity()" class="w-full" />
                  </div>
                </div>
              </div>
              <small class="text-500">
                Note: Stock quantities are managed through the Stock Entry system
              </small>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-content-end gap-2 mt-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-secondary"
              @click="$router.push('/inventory/products')"
              type="button"
            />
            <Button label="Update Product" icon="pi pi-check" type="submit" :loading="loading" />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification';
import { MetaService } from '@/services/MetaService';
import { useProductStore } from '@/stores/product';
import { validateRequired } from '@/utils/validators';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const { success, error } = useNotification();

const productId = ref(route.params.id);
const productTypes = ref([]);
const categories = ref([]);
const loading = ref(false);
const pageLoading = ref(true);

const formData = reactive({
  name: '',
  barcode: '',
  description: '',
  product_type_id: null,
  category_id: null,
  reorder_level: 10,
  status: 'active',
});

const errors = reactive({});

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

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
    error('Failed to load product types and categories');
  }
};

const loadProduct = async () => {
  try {
    await productStore.fetchProductById(productId.value);

    if (productStore.currentProduct) {
      formData.name = productStore.currentProduct.name;
      formData.barcode = productStore.currentProduct.barcode || '';
      formData.description = productStore.currentProduct.description || '';
      formData.product_type_id = productStore.currentProduct.product_type_id;
      formData.category_id = productStore.currentProduct.category_id;
      formData.reorder_level = productStore.currentProduct.reorder_level;
      formData.status = productStore.currentProduct.status;
    } else {
      error('Product not found');
      router.push('/inventory/products');
    }
  } catch (err) {
    error(err.message || 'Failed to load product');
    router.push('/inventory/products');
  } finally {
    pageLoading.value = false;
  }
};

const validateForm = () => {
  const newErrors = {};

  const nameValidation = validateRequired(formData.name, 'Product name');
  if (nameValidation) newErrors.name = nameValidation;

  if (!formData.product_type_id) {
    newErrors.product_type_id = 'Product type is required';
  }

  if (!formData.category_id) {
    newErrors.category_id = 'Category is required';
  }

  if (formData.reorder_level !== null && formData.reorder_level < 0) {
    newErrors.reorder_level = 'Reorder level must be a positive number';
  }

  Object.keys(errors).forEach((key) => delete errors[key]);
  Object.assign(errors, newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    error('Please fix the form errors');
    return;
  }

  loading.value = true;

  try {
    // Convert empty strings to null
    const submitData = {
      ...formData,
      barcode: formData.barcode || null,
      description: formData.description || null,
    };

    await productStore.updateProduct(productId.value, submitData);
    success('Product updated successfully');
    router.push('/inventory/products');
  } catch (err) {
    error(err.message || 'Failed to update product');
  } finally {
    loading.value = false;
  }
};

const getStockStatus = () => {
  const product = productStore.currentProduct;
  if (!product) return 'Unknown';

  if (product.total_stock === 0) return 'Out of Stock';
  if (product.is_low_stock) return 'Low Stock';
  return 'In Stock';
};

const getStockSeverity = () => {
  const product = productStore.currentProduct;
  if (!product) return null;

  if (product.total_stock === 0) return 'danger';
  if (product.is_low_stock) return 'warning';
  return 'success';
};

onMounted(async () => {
  await loadMetadata();
  await loadProduct();
});
</script>

<style scoped>
.edit-product {
  max-width: 1200px;
  width: 100%;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  font-weight: 500;
  color: var(--text-primary);
}

.text-red-500 {
  color: #ef4444;
}

.text-500 {
  color: #6b7280;
}
</style>
