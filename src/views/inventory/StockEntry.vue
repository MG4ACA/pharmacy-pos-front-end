<template>
  <div class="stock-entry">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Add Stock Entry</h1>
      <div class="flex gap-2">
        <Button
          label="Fill Sample Data"
          icon="pi pi-file"
          class="p-button-help p-button-sm"
          @click="fillSampleData"
          type="button"
        />
        <Button
          label="View History"
          icon="pi pi-history mr-2"
          class="p-button-secondary"
          @click="$router.push('/inventory/stock-history')"
        />
      </div>
    </div>

    <Card>
      <template #content>
        <form @submit.prevent="handleSubmit" class="p-fluid">
          <div class="grid">
            <!-- Product Selection -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="product" class="block mb-2">
                  Product
                  <span class="text-red-500">*</span>
                </label>
                <AutoComplete
                  id="product"
                  v-model="selectedProduct"
                  :suggestions="productSuggestions"
                  @complete="searchProducts"
                  @item-select="onProductSelect"
                  field="name"
                  placeholder="Search product by name or barcode"
                  :class="{ 'p-invalid': errors.product_id }"
                >
                  <template #item="{ item }">
                    <div>
                      <div class="font-semibold">{{ item.name }}</div>
                      <div class="text-sm text-500" v-if="item.barcode">
                        Barcode: {{ item.barcode }}
                      </div>
                    </div>
                  </template>
                </AutoComplete>
                <small v-if="errors.product_id" class="p-error">{{ errors.product_id }}</small>
              </div>
            </div>

            <!-- Supplier Selection -->
            <div class="col-12 md:col-6">
              <div class="field">
                <label for="supplier" class="block mb-2">
                  Supplier
                  <span class="text-red-500">*</span>
                </label>
                <Dropdown
                  id="supplier"
                  v-model="formData.supplier_id"
                  :options="suppliers"
                  option-label="name"
                  option-value="id"
                  placeholder="Select supplier"
                  :class="{ 'p-invalid': errors.supplier_id }"
                />
                <small v-if="errors.supplier_id" class="p-error">{{ errors.supplier_id }}</small>
              </div>
            </div>

            <!-- Batch Number -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="batch_number" class="block mb-2">Batch Number</label>
                <InputText
                  id="batch_number"
                  v-model="formData.batch_number"
                  placeholder="Enter batch number (optional)"
                />
              </div>
            </div>

            <!-- Quantity Received -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="quantity_received" class="block mb-2">
                  Quantity Received
                  <span class="text-red-500">*</span>
                </label>
                <InputNumber
                  id="quantity_received"
                  v-model="formData.quantity_received"
                  :min="1"
                  placeholder="Enter quantity"
                  :class="{ 'p-invalid': errors.quantity_received }"
                />
                <small v-if="errors.quantity_received" class="p-error">
                  {{ errors.quantity_received }}
                </small>
              </div>
            </div>

            <!-- Expiry Date -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="expiry_date" class="block mb-2">Expiry Date</label>
                <Calendar
                  id="expiry_date"
                  v-model="formData.expiry_date"
                  dateFormat="yy-mm-dd"
                  placeholder="Select expiry date (optional)"
                  :minDate="new Date()"
                  show-icon
                />
              </div>
            </div>

            <!-- Cost Price -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="cost_price" class="block mb-2">
                  Cost Price (LKR)
                  <span class="text-red-500">*</span>
                </label>
                <InputNumber
                  id="cost_price"
                  v-model="formData.cost_price"
                  mode="currency"
                  currency="LKR"
                  locale="en-LK"
                  :min="0"
                  :minFractionDigits="2"
                  placeholder="Enter cost price"
                  :class="{ 'p-invalid': errors.cost_price }"
                />
                <small v-if="errors.cost_price" class="p-error">{{ errors.cost_price }}</small>
              </div>
            </div>

            <!-- Selling Price -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="selling_price" class="block mb-2">
                  Selling Price (LKR)
                  <span class="text-red-500">*</span>
                </label>
                <InputNumber
                  id="selling_price"
                  v-model="formData.selling_price"
                  mode="currency"
                  currency="LKR"
                  locale="en-LK"
                  :min="0"
                  :minFractionDigits="2"
                  placeholder="Enter selling price"
                  :class="{ 'p-invalid': errors.selling_price }"
                />
                <small v-if="errors.selling_price" class="p-error">
                  {{ errors.selling_price }}
                </small>
              </div>
            </div>

            <!-- Profit Margin Display -->
            <div class="col-12 md:col-4">
              <div class="field">
                <label class="block mb-2">Profit Margin</label>
                <Tag
                  :value="profitMargin"
                  :severity="profitMarginSeverity"
                  class="w-full text-center"
                  style="padding: 0.75rem; font-size: 1rem"
                />
              </div>
            </div>

            <!-- Notes -->
            <div class="col-12">
              <div class="field">
                <label for="notes" class="block mb-2">Notes</label>
                <Textarea
                  id="notes"
                  v-model="formData.notes"
                  rows="3"
                  placeholder="Enter additional notes (optional)"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-content-end gap-2 mt-4">
            <Button
              label="Cancel"
              icon="pi pi-times"
              class="p-button-secondary"
              @click="resetForm"
              type="button"
            />
            <Button label="Add Stock Entry" icon="pi pi-check" type="submit" :loading="loading" />
          </div>
        </form>
      </template>
    </Card>
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
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';

const router = useRouter();
const stockStore = useStockStore();
const { success, error } = useNotification();

const selectedProduct = ref(null);
const productSuggestions = ref([]);
const suppliers = ref([]);
const loading = ref(false);

const formData = reactive({
  product_id: null,
  supplier_id: null,
  batch_number: '',
  quantity_received: null,
  cost_price: null,
  selling_price: null,
  expiry_date: null,
  notes: '',
});

const errors = reactive({});

const profitMargin = computed(() => {
  if (!formData.cost_price || !formData.selling_price) {
    return 'N/A';
  }
  const margin = ((formData.selling_price - formData.cost_price) / formData.cost_price) * 100;
  return `${margin.toFixed(2)}%`;
});

const profitMarginSeverity = computed(() => {
  if (!formData.cost_price || !formData.selling_price) return 'info';
  const margin = ((formData.selling_price - formData.cost_price) / formData.cost_price) * 100;
  if (margin < 10) return 'danger';
  if (margin < 20) return 'warning';
  return 'success';
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
  formData.product_id = event.value.id;
  errors.product_id = '';
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

const fillSampleData = async () => {
  // Search for a product first
  const result = await ProductService.searchProducts('');
  if (result.success && result.data && result.data.length > 0) {
    selectedProduct.value = result.data[0];
    formData.product_id = result.data[0].id;
  }

  formData.supplier_id = suppliers.value.length > 0 ? suppliers.value[0].id : null;
  formData.batch_number = 'BATCH-' + Date.now();
  formData.quantity_received = 100;
  formData.cost_price = 50.0;
  formData.selling_price = 75.0;

  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 12);
  formData.expiry_date = futureDate;

  formData.notes = 'Sample stock entry for testing purposes';

  Object.keys(errors).forEach((key) => delete errors[key]);
};

const validateForm = () => {
  const newErrors = {};

  if (!formData.product_id) {
    newErrors.product_id = 'Product is required';
  }

  if (!formData.supplier_id) {
    newErrors.supplier_id = 'Supplier is required';
  }

  if (!formData.quantity_received || formData.quantity_received <= 0) {
    newErrors.quantity_received = 'Quantity must be greater than 0';
  }

  if (!formData.cost_price || formData.cost_price <= 0) {
    newErrors.cost_price = 'Cost price must be greater than 0';
  }

  if (!formData.selling_price || formData.selling_price <= 0) {
    newErrors.selling_price = 'Selling price must be greater than 0';
  }

  if (
    formData.cost_price &&
    formData.selling_price &&
    formData.selling_price < formData.cost_price
  ) {
    newErrors.selling_price = 'Selling price should be greater than cost price';
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
    const submitData = {
      product_id: formData.product_id,
      supplier_id: formData.supplier_id,
      batch_number: formData.batch_number || null,
      quantity_received: formData.quantity_received,
      cost_price: formData.cost_price,
      selling_price: formData.selling_price,
      expiry_date: formData.expiry_date ? formData.expiry_date.toISOString().split('T')[0] : null,
      notes: formData.notes || null,
    };

    const result = await stockStore.addStockEntry(submitData);

    if (result.success) {
      success('Stock entry added successfully');
      resetForm();
    } else {
      error(result.message || 'Failed to add stock entry');
    }
  } catch (err) {
    error(err.message || 'Failed to add stock entry');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  selectedProduct.value = null;
  formData.product_id = null;
  formData.supplier_id = null;
  formData.batch_number = '';
  formData.quantity_received = null;
  formData.cost_price = null;
  formData.selling_price = null;
  formData.expiry_date = null;
  formData.notes = '';
  Object.keys(errors).forEach((key) => delete errors[key]);
};

onMounted(() => {
  loadSuppliers();
});
</script>

<style scoped>
.stock-entry {
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
