<template>
  <div class="create-stock-receipt">
    <div class="flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">
        {{ isEditMode ? 'Edit Stock Receipt' : 'Create Stock Receipt' }}
      </h1>
      <div class="flex gap-2">
        <Button
          v-if="!isEditMode"
          label="Load Sample Data"
          icon="pi pi-file-import mr-2"
          class="p-button-help"
          @click="loadSampleData"
        />
        <Button
          label="Back to List"
          icon="pi pi-arrow-left mr-2"
          class="p-button-secondary"
          @click="goBack"
        />
      </div>
    </div>

    <Card>
      <template #content>
        <!-- Receipt Header -->
        <div class="mb-4">
          <h2 class="text-xl font-semibold mb-3">Receipt Information</h2>
          <div class="grid">
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="receiptNumber" class="block mb-2">Receipt Number *</label>
                <InputText
                  id="receiptNumber"
                  v-model="header.receiptNumber"
                  class="w-full"
                  readonly
                  disabled
                />
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="supplier" class="block mb-2">Supplier *</label>
                <Dropdown
                  id="supplier"
                  v-model="header.supplierId"
                  :options="suppliers"
                  option-label="name"
                  option-value="id"
                  placeholder="Select Supplier"
                  class="w-full"
                  :class="{ 'p-invalid': submitted && !header.supplierId }"
                  show-clear
                />
                <small v-if="submitted && !header.supplierId" class="p-error">
                  Supplier is required
                </small>
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="receiptDate" class="block mb-2">Receipt Date *</label>
                <Calendar
                  id="receiptDate"
                  v-model="header.receiptDate"
                  date-format="yy-mm-dd"
                  class="w-full"
                  :class="{ 'p-invalid': submitted && !header.receiptDate }"
                  show-button-bar
                />
                <small v-if="submitted && !header.receiptDate" class="p-error">
                  Date is required
                </small>
              </div>
            </div>
            <div class="col-12 md:col-3">
              <div class="field">
                <label for="status" class="block mb-2">Status</label>
                <Dropdown
                  id="status"
                  v-model="header.status"
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select Status"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="invoiceNumber" class="block mb-2">Supplier Invoice #</label>
                <InputText
                  id="invoiceNumber"
                  v-model="header.supplierInvoiceNumber"
                  placeholder="Optional"
                  class="w-full"
                />
              </div>
            </div>
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="invoiceDate" class="block mb-2">Supplier Invoice Date</label>
                <Calendar
                  id="invoiceDate"
                  v-model="header.supplierInvoiceDate"
                  date-format="yy-mm-dd"
                  class="w-full"
                  show-button-bar
                />
              </div>
            </div>
            <div class="col-12 md:col-4">
              <div class="field">
                <label for="notes" class="block mb-2">Notes</label>
                <InputText
                  id="notes"
                  v-model="header.notes"
                  placeholder="Optional notes"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <!-- Product Lines -->
        <div class="mb-4">
          <div class="flex justify-content-between align-items-center mb-3">
            <h2 class="text-xl font-semibold">Product Lines</h2>
            <Button label="Add Product" icon="pi pi-plus mr-2" @click="showAddProductDialog" />
          </div>

          <DataTable :value="entries" data-key="tempId" responsive-layout="scroll" striped-rows>
            <Column header="Product" style="min-width: 200px">
              <template #body="{ data }">
                <div>
                  <div class="font-semibold">{{ data.productName }}</div>
                  <div class="text-sm text-500">{{ data.barcode }}</div>
                </div>
              </template>
            </Column>

            <Column field="batchNumber" header="Batch #" style="width: 150px"></Column>

            <Column field="quantity" header="Qty" style="width: 100px">
              <template #body="{ data }">
                <span class="font-semibold">{{ data.quantity }}</span>
              </template>
            </Column>

            <Column field="costPrice" header="Cost Price" style="width: 120px">
              <template #body="{ data }">
                {{ formatCurrency(data.costPrice) }}
              </template>
            </Column>

            <Column field="sellingPrice" header="Selling Price" style="width: 120px">
              <template #body="{ data }">
                {{ formatCurrency(data.sellingPrice) }}
              </template>
            </Column>

            <Column header="Line Total" style="width: 120px">
              <template #body="{ data }">
                <span class="font-semibold">
                  {{ formatCurrency(data.costPrice * data.quantity) }}
                </span>
              </template>
            </Column>

            <Column field="expiryDate" header="Expiry" style="width: 120px">
              <template #body="{ data }">
                {{ data.expiryDate ? formatDate(data.expiryDate) : '-' }}
              </template>
            </Column>

            <Column header="Actions" style="width: 100px">
              <template #body="{ data, index }">
                <div class="flex gap-1">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-sm p-button-text"
                    v-tooltip.top="'Edit'"
                    @click="editProductLine(index)"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-sm p-button-text p-button-danger"
                    v-tooltip.top="'Remove'"
                    @click="removeProductLine(index)"
                  />
                </div>
              </template>
            </Column>

            <template #empty>
              <div class="text-center py-4">
                <p>No products added yet</p>
                <small class="text-500">Click "Add Product" to start</small>
              </div>
            </template>
          </DataTable>

          <small v-if="submitted && entries.length === 0" class="p-error block mt-2">
            At least one product line is required
          </small>
        </div>

        <Divider />

        <!-- Summary -->
        <div class="grid mb-4">
          <div class="col-12 md:col-6 md:col-offset-6">
            <div class="grid">
              <div class="col-6 text-right font-semibold">Total Items:</div>
              <div class="col-6 text-right">{{ entries.length }}</div>

              <div class="col-6 text-right font-semibold">Total Amount:</div>
              <div class="col-6 text-right font-bold text-xl">
                {{ formatCurrency(totalAmount) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-content-end gap-2">
          <Button
            label="Cancel"
            icon="pi pi-times mr-2"
            class="p-button-secondary"
            @click="goBack"
          />
          <Button
            label="Save as Draft"
            icon="pi pi-save mr-2"
            class="p-button-secondary"
            @click="saveReceipt('draft')"
            :loading="saving"
          />
          <Button
            label="Complete Receipt"
            icon="pi pi-check mr-2"
            @click="saveReceipt('completed')"
            :loading="saving"
          />
        </div>
      </template>
    </Card>

    <!-- Add/Edit Product Dialog -->
    <Dialog
      v-model:visible="productDialogVisible"
      :header="editingIndex !== null ? 'Edit Product Line' : 'Add Product Line'"
      :modal="true"
      :style="{ width: '600px' }"
    >
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <label for="product" class="block mb-2">Product *</label>
            <Dropdown
              id="product"
              v-model="currentEntry.productId"
              :options="products"
              option-label="name"
              option-value="id"
              placeholder="Select Product"
              class="w-full"
              filter
              :class="{ 'p-invalid': productSubmitted && !currentEntry.productId }"
              @change="onProductChange"
            >
              <template #option="{ option }">
                <div>
                  <div>{{ option.name }}</div>
                  <small class="text-500">{{ option.barcode }}</small>
                </div>
              </template>
            </Dropdown>
            <small v-if="productSubmitted && !currentEntry.productId" class="p-error">
              Product is required
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="batchNumber" class="block mb-2">Batch Number *</label>
            <InputText
              id="batchNumber"
              v-model="currentEntry.batchNumber"
              placeholder="Enter batch number"
              class="w-full"
              :class="{ 'p-invalid': productSubmitted && !currentEntry.batchNumber }"
            />
            <small v-if="productSubmitted && !currentEntry.batchNumber" class="p-error">
              Batch number is required
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="quantity" class="block mb-2">Quantity *</label>
            <InputNumber
              id="quantity"
              v-model="currentEntry.quantity"
              placeholder="Enter quantity"
              class="w-full"
              :min="1"
              :class="{ 'p-invalid': productSubmitted && !currentEntry.quantity }"
            />
            <small v-if="productSubmitted && !currentEntry.quantity" class="p-error">
              Quantity is required
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="costPrice" class="block mb-2">Cost Price *</label>
            <InputNumber
              id="costPrice"
              v-model="currentEntry.costPrice"
              placeholder="0.00"
              class="w-full"
              mode="currency"
              currency="LKR"
              locale="en-LK"
              :min="0"
              :min-fraction-digits="2"
              :class="{ 'p-invalid': productSubmitted && !currentEntry.costPrice }"
            />
            <small v-if="productSubmitted && !currentEntry.costPrice" class="p-error">
              Cost price is required
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="sellingPrice" class="block mb-2">Selling Price *</label>
            <InputNumber
              id="sellingPrice"
              v-model="currentEntry.sellingPrice"
              placeholder="0.00"
              class="w-full"
              mode="currency"
              currency="LKR"
              locale="en-LK"
              :min="0"
              :min-fraction-digits="2"
              :class="{ 'p-invalid': productSubmitted && !currentEntry.sellingPrice }"
            />
            <small v-if="productSubmitted && !currentEntry.sellingPrice" class="p-error">
              Selling price is required
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="expiryDate" class="block mb-2">Expiry Date</label>
            <Calendar
              id="expiryDate"
              v-model="currentEntry.expiryDate"
              date-format="yy-mm-dd"
              class="w-full"
              show-button-bar
              placeholder="Optional"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="lineNotes" class="block mb-2">Notes</label>
            <InputText
              id="lineNotes"
              v-model="currentEntry.notes"
              placeholder="Optional"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times mr-2"
          class="p-button-secondary"
          @click="closeProductDialog"
        />
        <Button label="Save" icon="pi pi-check mr-2" @click="saveProductLine" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import { useStockReceiptStore } from '@/stores/stockReceipt';
import { useSupplierStore } from '@/stores/supplier';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const stockReceiptStore = useStockReceiptStore();
const supplierStore = useSupplierStore();
const productStore = useProductStore();
const authStore = useAuthStore();

// State
const isEditMode = computed(() => route.params.id && route.name === 'EditStockReceipt');
const receiptId = computed(() => route.params.id);

const header = ref({
  receiptNumber: '',
  supplierId: null,
  receiptDate: new Date(),
  supplierInvoiceNumber: '',
  supplierInvoiceDate: null,
  notes: '',
  status: 'completed',
});

const entries = ref([]);
const submitted = ref(false);
const saving = ref(false);
const productDialogVisible = ref(false);
const productSubmitted = ref(false);
const editingIndex = ref(null);

const currentEntry = ref({
  productId: null,
  productName: '',
  barcode: '',
  batchNumber: '',
  quantity: 1,
  costPrice: 0,
  sellingPrice: 0,
  expiryDate: null,
  notes: '',
  tempId: Date.now(),
});

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Completed', value: 'completed' },
];

// Computed
const suppliers = computed(() => supplierStore.suppliers);
const products = computed(() => productStore.products);

const totalAmount = computed(() => {
  return entries.value.reduce((sum, entry) => {
    return sum + entry.costPrice * entry.quantity;
  }, 0);
});

// Methods
const generateReceiptNumber = async () => {
  try {
    const number = await stockReceiptStore.generateReceiptNumber();
    header.value.receiptNumber = number;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to generate receipt number',
      life: 3000,
    });
  }
};

const showAddProductDialog = () => {
  resetCurrentEntry();
  editingIndex.value = null;
  productSubmitted.value = false;
  productDialogVisible.value = true;
};

const editProductLine = (index) => {
  const entry = entries.value[index];
  currentEntry.value = { ...entry };
  editingIndex.value = index;
  productSubmitted.value = false;
  productDialogVisible.value = true;
};

const saveProductLine = () => {
  productSubmitted.value = true;

  // Validate
  if (
    !currentEntry.value.productId ||
    !currentEntry.value.batchNumber ||
    !currentEntry.value.quantity ||
    !currentEntry.value.costPrice ||
    !currentEntry.value.sellingPrice
  ) {
    return;
  }

  if (editingIndex.value !== null) {
    // Update existing
    entries.value[editingIndex.value] = { ...currentEntry.value };
  } else {
    // Add new
    currentEntry.value.tempId = Date.now();
    entries.value.push({ ...currentEntry.value });
  }

  closeProductDialog();
};

const removeProductLine = (index) => {
  entries.value.splice(index, 1);
};

const closeProductDialog = () => {
  productDialogVisible.value = false;
  resetCurrentEntry();
  editingIndex.value = null;
  productSubmitted.value = false;
};

const resetCurrentEntry = () => {
  currentEntry.value = {
    productId: null,
    productName: '',
    barcode: '',
    batchNumber: '',
    quantity: 1,
    costPrice: 0,
    sellingPrice: 0,
    expiryDate: null,
    notes: '',
    tempId: Date.now(),
  };
};

const onProductChange = (event) => {
  const product = products.value.find((p) => p.id === event.value);
  if (product) {
    currentEntry.value.productName = product.name;
    currentEntry.value.barcode = product.barcode;
  }
};

const saveReceipt = async (status) => {
  submitted.value = true;

  // Validate header
  if (!header.value.supplierId || !header.value.receiptDate) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields',
      life: 3000,
    });
    return;
  }

  // Validate entries
  if (entries.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please add at least one product line',
      life: 3000,
    });
    return;
  }

  try {
    saving.value = true;
    header.value.status = status;

    const receiptData = {
      header: {
        receiptNumber: header.value.receiptNumber,
        supplierId: header.value.supplierId,
        receiptDate: formatDateForAPI(header.value.receiptDate),
        supplierInvoiceNumber: header.value.supplierInvoiceNumber || null,
        supplierInvoiceDate: header.value.supplierInvoiceDate
          ? formatDateForAPI(header.value.supplierInvoiceDate)
          : null,
        notes: header.value.notes || null,
        status: header.value.status,
      },
      entries: entries.value.map((entry) => ({
        productId: entry.productId,
        batchNumber: entry.batchNumber,
        quantity: entry.quantity,
        costPrice: entry.costPrice,
        sellingPrice: entry.sellingPrice,
        expiryDate: entry.expiryDate ? formatDateForAPI(entry.expiryDate) : null,
        notes: entry.notes || null,
      })),
      userId: authStore.user.id,
    };

    if (isEditMode.value) {
      await stockReceiptStore.updateReceipt(receiptId.value, receiptData);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Stock receipt updated successfully',
        life: 3000,
      });
    } else {
      await stockReceiptStore.createReceipt(receiptData);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Stock receipt created successfully',
        life: 3000,
      });
    }

    router.push('/inventory/stock-receipts');
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Failed to save receipt',
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

const loadReceipt = async (id) => {
  try {
    const receipt = await stockReceiptStore.loadReceiptById(id);

    header.value = {
      receiptNumber: receipt.receipt_number,
      supplierId: receipt.supplier_id,
      receiptDate: new Date(receipt.receipt_date),
      supplierInvoiceNumber: receipt.supplier_invoice_number || '',
      supplierInvoiceDate: receipt.supplier_invoice_date
        ? new Date(receipt.supplier_invoice_date)
        : null,
      notes: receipt.notes || '',
      status: receipt.status,
    };

    entries.value = receipt.entries.map((entry, index) => ({
      tempId: Date.now() + index,
      productId: entry.product_id,
      productName: entry.product?.name || 'Unknown',
      barcode: entry.product?.barcode || '',
      batchNumber: entry.batch_number,
      quantity: entry.quantity_received,
      costPrice: parseFloat(entry.cost_price),
      sellingPrice: parseFloat(entry.selling_price),
      expiryDate: entry.expiry_date ? new Date(entry.expiry_date) : null,
      notes: entry.notes || '',
    }));
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load receipt',
      life: 3000,
    });
    router.push('/inventory/stock-receipts');
  }
};

const loadSampleData = () => {
  // Load sample header data
  if (suppliers.value.length > 0) {
    header.value.supplierId = suppliers.value[0].id;
  }
  header.value.receiptDate = new Date();
  header.value.supplierInvoiceNumber = 'INV-' + Math.floor(Math.random() * 10000);
  header.value.supplierInvoiceDate = new Date();
  header.value.notes = 'Sample stock receipt for testing';
  header.value.status = 'draft';

  // Load sample product entries
  if (products.value.length > 0) {
    entries.value = [];
    const sampleCount = Math.min(5, products.value.length);

    for (let i = 0; i < sampleCount; i++) {
      const product = products.value[i];
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);

      entries.value.push({
        tempId: Date.now() + i,
        productId: product.id,
        productName: product.name,
        barcode: product.barcode || '',
        batchNumber: 'BATCH-' + (Math.floor(Math.random() * 1000) + 1),
        quantity: Math.floor(Math.random() * 50) + 10,
        costPrice: parseFloat((Math.random() * 500 + 50).toFixed(2)),
        sellingPrice: parseFloat((Math.random() * 800 + 100).toFixed(2)),
        expiryDate: futureDate,
        notes: 'Sample product entry',
      });
    }

    toast.add({
      severity: 'success',
      summary: 'Sample Data Loaded',
      detail: `Loaded ${sampleCount} sample product entries`,
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'warn',
      summary: 'No Products',
      detail: 'No products available to create sample data',
      life: 3000,
    });
  }
};

const goBack = () => {
  router.push('/inventory/stock-receipts');
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const formatDateForAPI = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Lifecycle
onMounted(async () => {
  await supplierStore.fetchActiveSuppliers();
  await productStore.fetchProducts();

  if (isEditMode.value) {
    await loadReceipt(receiptId.value);
  } else {
    await generateReceiptNumber();
  }
});
</script>

<style scoped>
.create-stock-receipt {
  padding: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.field {
  margin-bottom: 0;
}
</style>
