<template>
  <div class="pos-container">
    <!-- Header -->
    <div
      class="pos-header flex justify-content-between align-items-center mb-4 p-3 surface-card border-round"
    >
      <div>
        <h2 class="m-0 text-primary">Point of Sale</h2>
        <p class="text-600 m-0 mt-1">{{ currentDate }}</p>
      </div>
      <div>
        <Button
          label="Sales History"
          icon="pi pi-history"
          class="p-button-outlined mr-2"
          @click="$router.push('/sales/history')"
        />
        <Button
          label="Clear Cart"
          icon="pi pi-trash"
          severity="danger"
          class="p-button-outlined"
          :disabled="cart.length === 0"
          @click="confirmClearCart"
        />
      </div>
    </div>

    <div class="pos-content grid">
      <!-- Left Panel: Product Search & Cart -->
      <div class="col-12 lg:col-8">
        <!-- Product Search -->
        <Panel header="Product Search" class="mb-3">
          <div class="grid">
            <div class="col-12">
              <AutoComplete
                v-model="selectedProduct"
                :suggestions="filteredProducts"
                @complete="searchProducts"
                @item-select="onProductSelect"
                field="name"
                placeholder="Search by product name, generic name, or barcode..."
                class="w-full"
                :pt="{
                  input: { class: 'w-full p-3' },
                }"
              >
                <template #item="{ item }">
                  <div class="flex align-items-center justify-content-between w-full">
                    <div>
                      <div class="font-semibold">{{ item.name }}</div>
                      <div class="text-sm text-600">{{ item.generic_name }}</div>
                      <div class="text-xs text-500">{{ item.category }}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-primary">Rs. {{ item.selling_price }}</div>
                      <div
                        class="text-sm"
                        :class="item.total_stock > 0 ? 'text-green-600' : 'text-red-600'"
                      >
                        Stock: {{ item.total_stock }}
                      </div>
                    </div>
                  </div>
                </template>
              </AutoComplete>
            </div>
          </div>
        </Panel>

        <!-- Shopping Cart -->
        <Panel header="Shopping Cart" class="cart-panel">
          <DataTable
            :value="cart"
            :empty-message="'Cart is empty. Search and add products.'"
            class="p-datatable-sm"
            responsiveLayout="scroll"
          >
            <Column field="product_name" header="Product" style="min-width: 200px">
              <template #body="{ data }">
                <div>
                  <div class="font-semibold">{{ data.product_name }}</div>
                  <div class="text-sm text-600">{{ data.generic_name }}</div>
                </div>
              </template>
            </Column>

            <Column field="category" header="Category" style="min-width: 120px" />

            <Column field="unit_price" header="Unit Price" style="min-width: 120px">
              <template #body="{ data }">Rs. {{ data.unit_price.toFixed(2) }}</template>
            </Column>

            <Column field="quantity" header="Quantity" style="min-width: 150px">
              <template #body="{ data }">
                <InputNumber
                  v-model="data.quantity"
                  :min="1"
                  :max="data.available_quantity"
                  showButtons
                  buttonLayout="horizontal"
                  decrementButtonClass="p-button-danger"
                  incrementButtonClass="p-button-success"
                  @update:modelValue="(value) => updateQuantity(data.product_id, value)"
                  class="w-full"
                  :pt="{
                    input: { class: 'text-center w-4rem' },
                  }"
                />
              </template>
            </Column>

            <Column field="subtotal" header="Subtotal" style="min-width: 120px">
              <template #body="{ data }">
                Rs. {{ (data.quantity * data.unit_price).toFixed(2) }}
              </template>
            </Column>

            <Column header="Action" style="width: 100px">
              <template #body="{ data }">
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="removeItem(data.product_id)"
                />
              </template>
            </Column>
          </DataTable>
        </Panel>
      </div>

      <!-- Right Panel: Billing Summary -->
      <div class="col-12 lg:col-4">
        <Panel header="Billing Summary" class="billing-summary">
          <!-- Totals -->
          <div class="mb-4">
            <div class="flex justify-content-between mb-2">
              <span class="text-600">Subtotal:</span>
              <span class="font-semibold">Rs. {{ cartSubtotal.toFixed(2) }}</span>
            </div>

            <!-- Discount -->
            <div class="field mb-3">
              <label for="discount" class="block mb-2 text-600">Discount (Rs.)</label>
              <InputNumber
                id="discount"
                v-model="discount"
                mode="currency"
                currency="LKR"
                locale="en-LK"
                :min="0"
                :max="cartSubtotal"
                class="w-full"
              />
            </div>

            <!-- Tax -->
            <div class="field mb-3">
              <label for="tax" class="block mb-2 text-600">Tax (Rs.)</label>
              <InputNumber
                id="tax"
                v-model="tax"
                mode="currency"
                currency="LKR"
                locale="en-LK"
                :min="0"
                class="w-full"
              />
            </div>

            <Divider />

            <div class="flex justify-content-between align-items-center mb-3">
              <span class="text-xl font-bold">Total:</span>
              <span class="text-2xl font-bold text-primary">Rs. {{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="field mb-4">
            <label for="paymentMethod" class="block mb-2 text-600">Payment Method</label>
            <Dropdown
              id="paymentMethod"
              v-model="paymentMethod"
              :options="paymentMethods"
              optionLabel="label"
              optionValue="value"
              placeholder="Select payment method"
              class="w-full"
            />
          </div>

          <!-- Notes -->
          <div class="field mb-4">
            <label for="notes" class="block mb-2 text-600">Notes (Optional)</label>
            <Textarea
              id="notes"
              v-model="notes"
              rows="3"
              class="w-full"
              placeholder="Add any notes for this sale..."
            />
          </div>

          <!-- Action Buttons -->
          <Button
            label="Complete Sale"
            icon="pi pi-check"
            class="w-full p-button-lg mb-2"
            :disabled="cart.length === 0 || isLoading"
            :loading="isLoading"
            @click="completeSale"
          />

          <Button
            label="Clear Cart"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="w-full"
            :disabled="cart.length === 0"
            @click="confirmClearCart"
          />
        </Panel>
      </div>
    </div>

    <!-- Sale Success Dialog -->
    <Dialog
      v-model:visible="showSuccessDialog"
      header="Sale Completed"
      :modal="true"
      :closable="false"
      :style="{ width: '450px' }"
    >
      <div class="text-center py-4">
        <i class="pi pi-check-circle text-green-500 text-6xl mb-3"></i>
        <h3 class="text-xl font-bold mb-2">Sale Completed Successfully!</h3>
        <p class="text-600 mb-4">Sale ID: #{{ currentSale?.id }}</p>

        <div class="surface-100 border-round p-3 mb-4">
          <div class="flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span class="font-semibold">Rs. {{ currentSale?.subtotal }}</span>
          </div>
          <div class="flex justify-content-between mb-2" v-if="currentSale?.discount > 0">
            <span>Discount:</span>
            <span class="font-semibold text-red-500">- Rs. {{ currentSale?.discount }}</span>
          </div>
          <div class="flex justify-content-between mb-2" v-if="currentSale?.tax > 0">
            <span>Tax:</span>
            <span class="font-semibold">+ Rs. {{ currentSale?.tax }}</span>
          </div>
          <Divider />
          <div class="flex justify-content-between">
            <span class="font-bold text-lg">Total:</span>
            <span class="font-bold text-lg text-primary">Rs. {{ currentSale?.total_amount }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="New Sale" icon="pi pi-plus" @click="startNewSale" autofocus />
        <Button
          label="View Details"
          icon="pi pi-eye"
          severity="secondary"
          outlined
          @click="viewSaleDetails"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import { useSaleStore } from '@/stores/sale';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Panel from 'primevue/panel';
import Textarea from 'primevue/textarea';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const saleStore = useSaleStore();
const productStore = useProductStore();
const authStore = useAuthStore();

// Refs
const selectedProduct = ref(null);
const filteredProducts = ref([]);
const showSuccessDialog = ref(false);

// Computed
const cart = computed(() => saleStore.cart);
const cartSubtotal = computed(() => saleStore.cartSubtotal);
const cartTotal = computed(() => saleStore.cartTotal);
const discount = computed({
  get: () => saleStore.discount,
  set: (value) => saleStore.setDiscount(value),
});
const tax = computed({
  get: () => saleStore.tax,
  set: (value) => saleStore.setTax(value),
});
const paymentMethod = computed({
  get: () => saleStore.paymentMethod,
  set: (value) => saleStore.setPaymentMethod(value),
});
const notes = computed({
  get: () => saleStore.notes,
  set: (value) => saleStore.setNotes(value),
});
const isLoading = computed(() => saleStore.isLoading);
const currentSale = computed(() => saleStore.currentSale);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Other', value: 'other' },
];

// Methods
async function searchProducts(event) {
  const query = event.query.trim().toLowerCase();

  if (query.length < 2) {
    filteredProducts.value = [];
    return;
  }

  // Search products
  const result = await productStore.searchProducts(query);

  if (result.success) {
    filteredProducts.value = result.data;
  } else {
    filteredProducts.value = [];
    toast.add({
      severity: 'error',
      summary: 'Search Error',
      detail: result.message,
      life: 3000,
    });
  }
}

function onProductSelect(event) {
  const product = event.value;

  if (product.total_stock <= 0) {
    toast.add({
      severity: 'warn',
      summary: 'Out of Stock',
      detail: `${product.name} is currently out of stock`,
      life: 3000,
    });
    return;
  }

  saleStore.addToCart(product);
  selectedProduct.value = null;

  toast.add({
    severity: 'success',
    summary: 'Added to Cart',
    detail: `${product.name} added to cart`,
    life: 2000,
  });
}

function updateQuantity(productId, quantity) {
  saleStore.updateCartItemQuantity(productId, quantity);
}

function removeItem(productId) {
  saleStore.removeFromCart(productId);
  toast.add({
    severity: 'info',
    summary: 'Item Removed',
    detail: 'Product removed from cart',
    life: 2000,
  });
}

function confirmClearCart() {
  confirm.require({
    message: 'Are you sure you want to clear the entire cart?',
    header: 'Clear Cart',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      saleStore.clearCart();
      toast.add({
        severity: 'info',
        summary: 'Cart Cleared',
        detail: 'Shopping cart has been cleared',
        life: 2000,
      });
    },
  });
}

async function completeSale() {
  if (cart.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Empty Cart',
      detail: 'Please add products to cart before completing sale',
      life: 3000,
    });
    return;
  }

  const result = await saleStore.completeSale(authStore.user.id);

  if (result.success) {
    showSuccessDialog.value = true;
    toast.add({
      severity: 'success',
      summary: 'Sale Completed',
      detail: 'Sale has been completed successfully',
      life: 3000,
    });
  } else {
    toast.add({
      severity: 'error',
      summary: 'Sale Failed',
      detail: result.message,
      life: 5000,
    });
  }
}

function startNewSale() {
  showSuccessDialog.value = false;
  saleStore.clearCart();
}

function viewSaleDetails() {
  showSuccessDialog.value = false;
  router.push(`/sales/history`);
}

onMounted(() => {
  // Clear cart on mount
  saleStore.clearCart();
});
</script>

<style scoped>
.pos-container {
  padding: 1rem;
  max-width: 1800px;
  margin: 0 auto;
}

.pos-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-panel {
  min-height: 400px;
}

.billing-summary {
  position: sticky;
  top: 1rem;
}

@media (max-width: 991px) {
  .billing-summary {
    position: static;
  }
}
</style>
