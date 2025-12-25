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

          <DataTable
            :value="displayEntries"
            data-key="tempId"
            responsive-layout="scroll"
            striped-rows
          >
            <Column header="Product & Batch" style="width: 30%">
              <template #body="{ data }">
                <div>
                  <div class="font-semibold">{{ data.productName }}</div>
                  <div class="text-xs text-600 mt-1">Batch: {{ data.batchNumber }}</div>
                </div>
              </template>
            </Column>

            <Column header="Quantity" style="width: 20%">
              <template #body="{ data }">
                <div class="flex flex-column">
                  <div class="flex align-items-center justify-content-start">
                    <span class="text-xs font-semibold mr-1">Total:</span>
                    <span class="text-sm font-bold text-primary">
                      {{ data.quantity + (data.freeQuantity || 0) }}
                    </span>
                  </div>
                  <div class="flex align-items-center justify-content-between">
                    <span class="text-xs text-600 mr-1">Purchased:</span>
                    <span class="text-sm font-semibold">{{ data.quantity }}</span>

                    <span class="text-xs text-600 ml-2 mr-1">| Free:</span>
                    <span class="text-xs" v-if="!data.freeQuantity > 0">NAN</span>

                    <div class="flex align-items-center gap-1">
                      <Tag
                        v-if="data.freeQuantity > 0"
                        :value="data.freeQuantity || 0"
                        severity="success"
                        icon="pi pi-gift pr-2"
                        class="text-xs"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="costPrice" header="Cost Price" style="width: 11%">
              <template #body="{ data }">
                {{ formatCurrency(data.costPrice) }}
              </template>
            </Column>

            <Column field="sellingPrice" header="Selling Price" style="width: 11%">
              <template #body="{ data }">
                {{ formatCurrency(data.sellingPrice) }}
              </template>
            </Column>

            <Column header="Line Total" style="width: 12%">
              <template #body="{ data }">
                <span class="font-semibold">
                  {{ formatCurrency(data.costPrice * data.quantity) }}
                </span>
              </template>
            </Column>

            <Column field="expiryDate" header="Expiry" style="width: 11%">
              <template #body="{ data }">
                {{ data.expiryDate ? formatDate(data.expiryDate) : '-' }}
              </template>
            </Column>

            <Column header="Actions" style="width: 5%">
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

        <!-- Summary -->
        <div class="grid mb-4">
          <div class="col-12 md:col-6 md:col-offset-6">
            <div class="grid">
              <div class="col-6 text-right font-semibold">Total Items (Lines):</div>
              <div class="col-6 text-right">{{ entries.length }}</div>

              <div class="col-6 text-right font-semibold">Grand Total Qty:</div>
              <div class="col-6 text-right font-semibold">
                {{ totalPurchasedQty + totalFreeQty }}
                <span v-if="totalFreeQty > 0">
                  ({{ totalPurchasedQty }} +
                  <Tag
                    v-if="totalFreeQty > 0"
                    :value="totalFreeQty + ' FREE'"
                    severity="success"
                    icon="pi pi-gift pr-1"
                    class="ml-2 text-xs"
                  />
                  )
                </span>
              </div>

              <Divider class="my-2" />

              <div class="col-6 text-right font-semibold">Total Amount:</div>
              <div class="col-6 text-right font-bold text-xl">
                {{ formatCurrency(totalAmount) }}
              </div>
              <div class="col-12 text-right text-sm text-500">(Cost of purchased items only)</div>
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
      class="product-dialog"
    >
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <label for="product" class="block mb-1">Product *</label>
            <AutoComplete
              id="product"
              v-model="currentEntry.productSearch"
              :suggestions="filteredProducts"
              field="name"
              placeholder="Search by product name, barcode or UPC"
              class="w-full"
              :class="{ 'p-invalid': productSubmitted && !currentEntry.productId }"
              @complete="searchProducts"
              @item-select="onProductSelect"
            >
              <template #item="{ item }">
                <div class="flex justify-content-between align-items-center w-full">
                  <div>
                    <div class="font-semibold">{{ item.name }}</div>
                    <div class="text-sm text-500">{{ item.barcode || item.upc || '' }}</div>
                  </div>
                </div>
              </template>
            </AutoComplete>
            <small class="text-500">Type name, barcode or UPC to search</small>
            <small v-if="productSubmitted && !currentEntry.productId" class="p-error">
              Product is required
            </small>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="batchNumber" class="block mb-1">Batch Number *</label>
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
            <label for="expiryDate" class="block mb-1">Expiry Date</label>
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

        <div class="col-12 md:col-8 flex align-items-center">
          <div class="field">
            <div class="flex align-items-center">
              <Checkbox
                ref="packageModeCheckbox"
                id="packageMode"
                v-model="currentEntry.isPackageMode"
                :binary="true"
                @keydown.space.prevent="currentEntry.isPackageMode = !currentEntry.isPackageMode"
                @keydown.enter.prevent="currentEntry.isPackageMode = !currentEntry.isPackageMode"
              />
              <label for="packageMode" class="ml-2">Has Packaging Hierarchy?</label>
            </div>
            <small class="text-500">Check if product comes in packages/cards/units</small>
          </div>
        </div>

        <!-- Single Product Mode - Quantity -->
        <template v-if="!currentEntry.isPackageMode">
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="quantity" class="block mb-1">Purchased Qty *</label>
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
        </template>

        <!-- Package Mode - Quantity -->
        <template v-if="currentEntry.isPackageMode">
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="packageQty" class="block mb-1">Packages *</label>
              <InputNumber
                id="packageQty"
                v-model="currentEntry.packageQuantity"
                placeholder="0"
                class="w-full"
                :min="1"
                :class="{ 'p-invalid': productSubmitted && !currentEntry.packageQuantity }"
              />
              <small v-if="productSubmitted && !currentEntry.packageQuantity" class="p-error">
                Required
              </small>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="field">
              <label for="itemsPerPkg" class="block mb-1">Items per Package *</label>
              <InputNumber
                id="itemsPerPkg"
                v-model="currentEntry.itemsPerPackage"
                placeholder="0"
                class="w-full"
                :min="1"
                :class="{ 'p-invalid': productSubmitted && !currentEntry.itemsPerPackage }"
              />
              <small v-if="productSubmitted && !currentEntry.itemsPerPackage" class="p-error">
                Required
              </small>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="field">
              <label for="unitsPerItem" class="block mb-1">Units per Item *</label>
              <InputNumber
                id="unitsPerItem"
                v-model="currentEntry.unitsPerItem"
                placeholder="0"
                class="w-full"
                :min="1"
                :class="{ 'p-invalid': productSubmitted && !currentEntry.unitsPerItem }"
              />
              <small v-if="productSubmitted && !currentEntry.unitsPerItem" class="p-error">
                Required
              </small>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="field">
              <label for="totalQtyCalc" class="block mb-1">Total Qty</label>
              <InputNumber
                id="totalQtyCalc"
                :model-value="calculatedTotalQty"
                disabled
                class="w-full p-inputtext-filled"
              />
            </div>
          </div>
        </template>

        <!-- Free Qty & Total Display (Both Modes) -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="freeQuantity" class="block mb-1">Free Qty</label>
            <InputNumber
              id="freeQuantity"
              v-model="currentEntry.freeQuantity"
              placeholder="0"
              class="w-full"
              :min="0"
              :max="currentEntry.quantity"
            />
            <small class="text-500">Optional - from supplier promotions</small>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label for="totalQtyDisplay" class="block mb-1">Total Qty</label>
            <InputNumber
              id="totalQtyDisplay"
              :model-value="displayTotalQty"
              disabled
              class="w-full p-inputtext-filled"
            />
            <small class="text-500">Purchased/Calculated + Free</small>
          </div>
        </div>

        <!-- Single Product Mode - Prices -->
        <template v-if="!currentEntry.isPackageMode">
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="costPrice" class="block mb-1">Cost Price *</label>
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
              <label for="sellingPrice" class="block mb-1">Selling Price *</label>
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
        </template>

        <!-- Package Mode - Prices -->
        <template v-if="currentEntry.isPackageMode">
          <div class="col-12 md:col-4">
            <div class="field">
              <label for="packagePrice" class="block mb-1">Package Price (Total) *</label>
              <InputNumber
                id="packagePrice"
                v-model="currentEntry.packagePrice"
                placeholder="0.00"
                class="w-full"
                mode="currency"
                currency="LKR"
                locale="en-LK"
                :min="0"
                :min-fraction-digits="2"
                :class="{ 'p-invalid': productSubmitted && !currentEntry.packagePrice }"
              />
              <small v-if="productSubmitted && !currentEntry.packagePrice" class="p-error">
                Package price is required
              </small>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="field">
              <label for="unitCostCalc" class="block mb-1">Unit Cost (Per item)</label>
              <InputNumber
                id="unitCostCalc"
                :model-value="calculatedUnitCost"
                disabled
                class="w-full p-inputtext-filled"
                mode="currency"
                currency="LKR"
                locale="en-LK"
              />
              <small class="text-500">Auto-calculated</small>
            </div>
          </div>

          <div class="col-12 md:col-4">
            <div class="field">
              <label for="sellingPricePackage" class="block mb-1">Selling Price *</label>
              <InputNumber
                id="sellingPricePackage"
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
        </template>

        <div class="col-12">
          <div class="field">
            <label for="lineNotes" class="1">Notes</label>
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
        <Button label="Save" icon="pi pi-check mr-2" @click="saveProductLine" />
        <Button
          label="Cancel"
          icon="pi pi-times mr-2"
          class="p-button-secondary"
          @click="closeProductDialog"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import { useStockStore } from '@/stores/stock';
import { useStockReceiptStore } from '@/stores/stockReceipt';
import { useSupplierStore } from '@/stores/supplier';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const stockReceiptStore = useStockReceiptStore();
const supplierStore = useSupplierStore();
const productStore = useProductStore();
const authStore = useAuthStore();
const stockStore = useStockStore();

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
  productSearch: '',
  batchNumber: '',
  quantity: 1,
  costPrice: 0,
  sellingPrice: 0,
  expiryDate: null,
  notes: '',
  tempId: Date.now(),
  // Packaging hierarchy fields
  isPackageMode: false,
  packageQuantity: 1,
  itemsPerPackage: 1,
  unitsPerItem: 1,
  packagePrice: 0,
});

// Suggestions for product autocomplete
const filteredProducts = ref([]);

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

const totalPurchasedQty = computed(() => {
  return entries.value.reduce((sum, entry) => sum + (entry.quantity || 0), 0);
});

const totalFreeQty = computed(() => {
  return entries.value.reduce((sum, entry) => sum + (entry.freeQuantity || 0), 0);
});

// Computed for packaging mode
const calculatedTotalQty = computed(() => {
  if (!currentEntry.value.isPackageMode) {
    return currentEntry.value.quantity || 0;
  }
  return (
    (currentEntry.value.packageQuantity || 0) *
    (currentEntry.value.itemsPerPackage || 0) *
    (currentEntry.value.unitsPerItem || 0)
  );
});

const calculatedUnitCost = computed(() => {
  if (!currentEntry.value.isPackageMode) {
    return currentEntry.value.costPrice || 0;
  }
  const totalQty = calculatedTotalQty.value;
  if (totalQty <= 0) return 0;
  return parseFloat((currentEntry.value.packagePrice / totalQty).toFixed(2));
});

const displayTotalQty = computed(() => {
  return calculatedTotalQty.value + (currentEntry.value.freeQuantity || 0);
});

// Newest products appear first in the table
const displayEntries = computed(() => {
  return [...entries.value].reverse();
}); // Methods
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
  currentEntry.value = { ...entry, productSearch: entry.productName };
  editingIndex.value = index;
  productSubmitted.value = false;
  productDialogVisible.value = true;
};

const saveProductLine = () => {
  productSubmitted.value = true;

  // Validate basic fields
  if (
    !currentEntry.value.productId ||
    !currentEntry.value.batchNumber ||
    !currentEntry.value.sellingPrice
  ) {
    return;
  }

  // Validate based on mode
  if (currentEntry.value.isPackageMode) {
    // Package mode validation
    if (
      !currentEntry.value.packageQuantity ||
      !currentEntry.value.itemsPerPackage ||
      !currentEntry.value.unitsPerItem ||
      !currentEntry.value.packagePrice
    ) {
      return;
    }
  } else {
    // Single product mode validation
    if (!currentEntry.value.quantity || !currentEntry.value.costPrice) {
      return;
    }
  }

  // Prepare entry for saving
  const entryToSave = { ...currentEntry.value };

  // If package mode, calculate and set the quantity and costPrice for API
  if (currentEntry.value.isPackageMode) {
    entryToSave.quantity = calculatedTotalQty.value;
    entryToSave.costPrice = calculatedUnitCost.value;
  }

  if (editingIndex.value !== null) {
    // Update existing
    entries.value[editingIndex.value] = entryToSave;
  } else {
    // Add new
    entryToSave.tempId = Date.now();
    entries.value.push(entryToSave);
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
  // Set default expiry date to 2026-12-13
  const defaultExpiryDate = new Date('2026-12-13');

  currentEntry.value = {
    productId: null,
    productName: '',
    barcode: '',
    productSearch: '',
    batchNumber: '',
    quantity: 1,
    freeQuantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    expiryDate: defaultExpiryDate,
    notes: '',
    tempId: Date.now(),
    isPackageMode: false,
    packageQuantity: 1,
    itemsPerPackage: 1,
    unitsPerItem: 1,
    packagePrice: 0,
  };
};

const generateBatchNumber = (productId) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `BATCH-${productId}-${y}${m}${d}`;
};

const handleProductSelection = async (product) => {
  if (!product) return;
  currentEntry.value.productId = product.id;
  currentEntry.value.productName = product.name;
  currentEntry.value.barcode = product.barcode || '';

  // Auto-generate a batch number for new entries
  currentEntry.value.batchNumber = generateBatchNumber(product.id);

  // Try to fetch last stock entries for this product and prefill prices
  try {
    const entriesData = await stockStore.fetchStockByProduct(product.id);
    if (Array.isArray(entriesData) && entriesData.length > 0) {
      // Find the most recent entry by entry_date or id
      let lastEntry = null;
      if (entriesData.every((e) => e.entry_date)) {
        lastEntry = entriesData
          .slice()
          .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date))[0];
      } else {
        lastEntry = entriesData.slice().sort((a, b) => b.id - a.id)[0];
      }

      if (lastEntry) {
        if (lastEntry.cost_price !== undefined && lastEntry.cost_price !== null) {
          currentEntry.value.costPrice = parseFloat(lastEntry.cost_price);
        }
        if (lastEntry.selling_price !== undefined && lastEntry.selling_price !== null) {
          currentEntry.value.sellingPrice = parseFloat(lastEntry.selling_price);
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch last stock entry for product:', err);
  }
};

// AutoComplete handlers
async function searchProducts(event) {
  const query = (
    event && event.query ? event.query : currentEntry.value.productSearch || ''
  ).trim();

  if (query.length < 1) {
    filteredProducts.value = [];
    return;
  }

  try {
    const results = await productStore.searchProducts(query);
    filteredProducts.value = results || [];
  } catch (err) {
    filteredProducts.value = [];
    toast.add({
      severity: 'error',
      summary: 'Search Error',
      detail: err.message || 'Failed to search products',
      life: 3000,
    });
  }
}

async function onProductSelect(event) {
  const product = event && event.value ? event.value : null;
  if (!product) return;

  // set the visible search text
  currentEntry.value.productSearch = product.name;

  // handle selection (fills ids, batch number, last prices)
  await handleProductSelection(product);

  // clear suggestions
  filteredProducts.value = [];
}

const onProductSearch = async () => {
  const q = (currentEntry.value.productSearch || '').trim();
  if (!q) return;

  // Try exact barcode or UPC match first
  let product = products.value.find(
    (p) => (p.barcode && p.barcode === q) || (p.upc && p.upc === q)
  );

  // If not found, search by name (case-insensitive contains)
  if (!product) {
    const ql = q.toLowerCase();
    product = products.value.find((p) => p.name && p.name.toLowerCase().includes(ql));
  }

  if (!product) {
    toast.add({
      severity: 'warn',
      summary: 'Not found',
      detail: 'No matching product found',
      life: 3000,
    });
    return;
  }

  // If product found, handle selection
  await handleProductSelection(product);
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

    // Generate receipt number if completing and number is not set
    if (status === 'completed' && !header.value.receiptNumber) {
      try {
        const generatedNumber = await stockReceiptStore.generateReceiptNumber();
        header.value.receiptNumber = generatedNumber;
        toast.add({
          severity: 'info',
          summary: 'Receipt Number Generated',
          detail: `Receipt #${generatedNumber} generated successfully`,
          life: 3000,
        });
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to generate receipt number',
          life: 3000,
        });
        throw err;
      }
    }

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
        freeQuantity: entry.freeQuantity || 0,
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
  }
  // Receipt number is now generated only when saving as completed to prevent race conditions
});
</script>

<style lang="scss">
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

/* Product dialog styling */
.product-dialog label {
  font-size: 0.875rem;
}

.product-dialog small {
  font-size: 0.75rem;
}
</style>
