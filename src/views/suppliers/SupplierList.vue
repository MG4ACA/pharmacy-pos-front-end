<template>
  <div class="supplier-list">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Suppliers</h1>
      <Button label="Add Supplier" icon="pi pi-plus mr-2" @click="openAddDialog" />
    </div>

    <!-- Filters -->
    <Card class="mb-4">
      <template #content>
        <div class="grid">
          <div class="col-12 md:col-7">
            <div class="field">
              <label for="search" class="block mb-2">Search</label>
              <InputText
                id="search"
                v-model="searchQuery"
                placeholder="Search by name, contact, email, or phone"
                class="w-full"
                @input="handleSearch"
              />
            </div>
          </div>
          <div class="col-12 md:col-3">
            <div class="field">
              <label for="status" class="block mb-2">Status</label>
              <Dropdown
                id="status"
                v-model="statusFilter"
                :options="statusOptions"
                option-label="label"
                option-value="value"
                placeholder="All statuses"
                class="w-full"
                @change="handleFilter"
              />
            </div>
          </div>
          <div class="col-12 md:col-2">
            <div class="field">
              <label class="block mb-2">&nbsp;</label>
              <div class="flex gap-2">
                <Button
                  label="Clear"
                  icon="pi pi-filter-slash mr-2"
                  class="p-button-secondary"
                  @click="clearFilters"
                />
                <Button
                  icon="pi pi-refresh mr-0"
                  class="p-button-help"
                  v-tooltip.top="'Refresh'"
                  @click="loadSuppliers"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Data Table -->
    <Card>
      <template #content>
        <DataTable
          :value="suppliers"
          :loading="loading"
          data-key="id"
          responsive-layout="scroll"
          striped-rows
        >
          <Column field="id" header="ID" style="width: 80px"></Column>

          <Column header="Supplier Name">
            <template #body="{ data }">
              <div>
                <div class="font-semibold">{{ data.name }}</div>
                <div class="text-sm text-500" v-if="data.contact_person">
                  Contact: {{ data.contact_person }}
                </div>
              </div>
            </template>
          </Column>

          <Column header="Contact Details" style="width: 220px">
            <template #body="{ data }">
              <div>
                <div v-if="data.email" class="text-sm">
                  <i class="pi pi-envelope mr-1"></i>
                  {{ data.email }}
                </div>
                <div v-if="data.phone" class="text-sm">
                  <i class="pi pi-phone mr-1"></i>
                  {{ data.phone }}
                </div>
              </div>
            </template>
          </Column>

          <Column field="address" header="Address">
            <template #body="{ data }">
              {{ data.address || '-' }}
            </template>
          </Column>

          <Column field="status" header="Status" style="width: 120px">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>

          <Column header="Actions" style="width: 150px">
            <template #body="{ data }">
              <div class="flex gap-1">
                <Button
                  icon="pi pi-eye"
                  class="p-button-sm p-button-text p-button-info"
                  v-tooltip.top="'View Products'"
                  @click="viewProducts(data)"
                />
                <Button
                  icon="pi pi-pencil"
                  class="p-button-sm p-button-text"
                  v-tooltip.top="'Edit'"
                  @click="openEditDialog(data)"
                />
                <Button
                  v-if="data.status === 'active'"
                  icon="pi pi-trash"
                  class="p-button-sm p-button-text p-button-danger"
                  v-tooltip.top="'Delete'"
                  @click="confirmDelete(data)"
                />
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-4">No suppliers found</div>
          </template>
        </DataTable>
      </template>
    </Card>

    <!-- Add/Edit Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'add' ? 'Add Supplier' : 'Edit Supplier'"
      :modal="true"
      :style="{ width: '600px' }"
    >
      <div class="flex justify-content-end mb-3" v-if="dialogMode === 'add'">
        <Button
          label="Fill Sample Data"
          icon="pi pi-file"
          class="p-button-help p-button-sm"
          @click="fillSampleData"
          type="button"
        />
      </div>
      <form @submit.prevent="handleSubmit" class="p-fluid">
        <div class="grid">
          <div class="col-12">
            <div class="field">
              <label for="name" class="block mb-2">
                Supplier Name
                <span class="text-red-500">*</span>
              </label>
              <InputText
                id="name"
                v-model="formData.name"
                placeholder="Enter supplier name"
                :class="{ 'p-invalid': errors.name }"
              />
              <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
            </div>
          </div>

          <div class="col-12">
            <div class="field">
              <label for="contact_person" class="block mb-2">Contact Person</label>
              <InputText
                id="contact_person"
                v-model="formData.contact_person"
                placeholder="Enter contact person name"
              />
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field">
              <label for="email" class="block mb-2">Email</label>
              <InputText
                id="email"
                v-model="formData.email"
                placeholder="Enter email"
                :class="{ 'p-invalid': errors.email }"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field">
              <label for="phone" class="block mb-2">Phone</label>
              <InputText id="phone" v-model="formData.phone" placeholder="Enter phone number" />
            </div>
          </div>

          <div class="col-12">
            <div class="field">
              <label for="address" class="block mb-2">Address</label>
              <Textarea
                id="address"
                v-model="formData.address"
                rows="3"
                placeholder="Enter address"
              />
            </div>
          </div>

          <div class="col-12" v-if="dialogMode === 'edit'">
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
        </div>

        <div class="flex justify-content-end gap-2 mt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-secondary"
            @click="closeDialog"
            type="button"
          />
          <Button
            :label="dialogMode === 'add' ? 'Add Supplier' : 'Update Supplier'"
            icon="pi pi-check"
            type="submit"
            :loading="loading"
          />
        </div>
      </form>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialogVisible"
      header="Confirm Delete"
      :modal="true"
      :style="{ width: '400px' }"
    >
      <div class="flex align-items-center">
        <i
          class="pi pi-exclamation-triangle mr-3"
          style="font-size: 2rem; color: var(--red-500)"
        ></i>
        <span>
          Are you sure you want to delete supplier
          <strong>{{ supplierToDelete?.name }}</strong>
          ?
        </span>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-secondary"
          @click="deleteDialogVisible = false"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="handleDelete"
          :loading="loading"
        />
      </template>
    </Dialog>

    <!-- Products Dialog -->
    <Dialog
      v-model:visible="productsDialogVisible"
      :header="`Products from ${selectedSupplier?.name}`"
      :modal="true"
      :style="{ width: '800px' }"
    >
      <DataTable
        :value="supplierProducts"
        :loading="loading"
        responsive-layout="scroll"
        striped-rows
      >
        <Column field="id" header="ID" style="width: 80px"></Column>
        <Column field="name" header="Product Name"></Column>
        <Column field="generic_name" header="Generic Name">
          <template #body="{ data }">
            {{ data.generic_name || '-' }}
          </template>
        </Column>
        <Column field="category" header="Category"></Column>
        <Column field="type" header="Type"></Column>

        <template #empty>
          <div class="text-center py-4">No products found for this supplier</div>
        </template>
      </DataTable>

      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          class="p-button-secondary"
          @click="productsDialogVisible = false"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification';
import { useSupplierStore } from '@/stores/supplier';
import { computed, onMounted, reactive, ref } from 'vue';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';

const supplierStore = useSupplierStore();
const { success, error } = useNotification();

const loading = computed(() => supplierStore.loading);
const suppliers = computed(() => supplierStore.suppliers);

const searchQuery = ref('');
const statusFilter = ref('');
const dialogVisible = ref(false);
const dialogMode = ref('add');
const deleteDialogVisible = ref(false);
const supplierToDelete = ref(null);
const productsDialogVisible = ref(false);
const selectedSupplier = ref(null);
const supplierProducts = ref([]);

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const formData = reactive({
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  address: '',
  status: 'active',
});

const errors = reactive({});

let searchTimeout = null;

const getStatusSeverity = (status) => {
  return status === 'active' ? 'success' : 'danger';
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadSuppliers();
  }, 500);
};

const handleFilter = () => {
  loadSuppliers();
};

const loadSuppliers = async () => {
  const params = {};
  if (searchQuery.value) params.search = searchQuery.value;
  if (statusFilter.value) params.status = statusFilter.value;

  const result = await supplierStore.fetchSuppliers(params);
  if (!result.success) {
    error('Failed to load suppliers');
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  loadSuppliers();
};

const openAddDialog = () => {
  dialogMode.value = 'add';
  resetForm();
  dialogVisible.value = true;
};

const openEditDialog = (supplier) => {
  dialogMode.value = 'edit';
  formData.name = supplier.name;
  formData.contact_person = supplier.contact_person || '';
  formData.email = supplier.email || '';
  formData.phone = supplier.phone || '';
  formData.address = supplier.address || '';
  formData.status = supplier.status;
  formData.id = supplier.id;
  Object.keys(errors).forEach((key) => delete errors[key]);
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  resetForm();
};

const resetForm = () => {
  formData.name = '';
  formData.contact_person = '';
  formData.email = '';
  formData.phone = '';
  formData.address = '';
  formData.status = 'active';
  delete formData.id;
  Object.keys(errors).forEach((key) => delete errors[key]);
};

const fillSampleData = () => {
  formData.name = 'ABC Pharmaceuticals (Pvt) Ltd';
  formData.contact_person = 'John Silva';
  formData.email = 'contact@abcpharma.lk';
  formData.phone = '+94 11 234 5678';
  formData.address = 'No. 123, Main Street, Colombo 07, Sri Lanka';
  Object.keys(errors).forEach((key) => delete errors[key]);
};

const validateForm = () => {
  const newErrors = {};

  if (!formData.name || formData.name.trim() === '') {
    newErrors.name = 'Supplier name is required';
  }

  if (formData.email && formData.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
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

  const submitData = {
    name: formData.name,
    contact_person: formData.contact_person || null,
    email: formData.email || null,
    phone: formData.phone || null,
    address: formData.address || null,
    status: formData.status,
  };

  let result;
  if (dialogMode.value === 'add') {
    result = await supplierStore.createSupplier(submitData);
  } else {
    result = await supplierStore.updateSupplier(formData.id, submitData);
  }

  if (result.success) {
    success(
      dialogMode.value === 'add' ? 'Supplier added successfully' : 'Supplier updated successfully'
    );
    closeDialog();
    loadSuppliers();
  } else {
    error(result.message || 'Failed to save supplier');
  }
};

const confirmDelete = (supplier) => {
  supplierToDelete.value = supplier;
  deleteDialogVisible.value = true;
};

const handleDelete = async () => {
  const result = await supplierStore.deleteSupplier(supplierToDelete.value.id);
  if (result.success) {
    success('Supplier deleted successfully');
    deleteDialogVisible.value = false;
    supplierToDelete.value = null;
    loadSuppliers();
  } else {
    error(result.message || 'Failed to delete supplier');
  }
};

const viewProducts = async (supplier) => {
  selectedSupplier.value = supplier;
  const result = await supplierStore.fetchProductsFromSupplier(supplier.id);
  if (result.success) {
    supplierProducts.value = result.data || [];
    productsDialogVisible.value = true;
  } else {
    error(result.message || 'Failed to load products from supplier');
  }
};

onMounted(() => {
  loadSuppliers();
});
</script>

<style scoped>
.supplier-list {
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
