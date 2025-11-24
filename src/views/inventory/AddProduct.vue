<template>
  <div class="add-product">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Add Product</h1>
      <Button
        label="Fill Sample Data"
        icon="pi pi-file"
        class="p-button-help p-button-sm"
        @click="fillSampleData"
        type="button"
      />
      <Button
        label="Back to List"
        icon="pi pi-arrow-left mr-2"
        class="p-button-secondary"
        @click="$router.push('/inventory/products')"
      />
    </div>

    <Card>
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
            <Button label="Save Product" icon="pi pi-check" type="submit" :loading="loading" />
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
import { useRouter } from 'vue-router';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const router = useRouter();
const productStore = useProductStore();
const { success, error } = useNotification();

const productTypes = ref([]);
const categories = ref([]);
const loading = ref(false);

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

const fillSampleData = () => {
  formData.name = 'Paracetamol 500mg';
  formData.barcode = '8901234567890';
  formData.description = 'Paracetamol tablets for pain relief and fever reduction. 500mg strength.';
  // Set to first available type and category if they exist
  formData.product_type_id = productTypes.value.length > 0 ? productTypes.value[0].id : null;
  formData.category_id = categories.value.length > 0 ? categories.value[0].id : null;
  formData.reorder_level = 50;
  formData.status = 'active';
  // Clear any errors
  Object.keys(errors).forEach((key) => delete errors[key]);
};

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

    await productStore.createProduct(submitData);
    success('Product created successfully');
    router.push('/inventory/products');
  } catch (err) {
    error(err.message || 'Failed to create product');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMetadata();
});
</script>

<style scoped>
.add-product {
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
</style>
