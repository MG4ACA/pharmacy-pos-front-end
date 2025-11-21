<template>
  <div class="pos-container">
    <div class="pos-content grid">
      <!-- Left Panel: Product Search & Cart -->
      <div class="col-12 lg:col-8">
        <!-- Product Search -->
        <Panel class="mb-3">
          <template #header>
            <div class="flex items-center gap-2 w-full justify-content-between align-items-center">
              <span class="font-bold">Product Search</span>
            </div>
          </template>
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
                      <div class="text-xs text-500">{{ item.category.name }}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-primary">
                        Rs.
                        {{
                          item.average_selling_price
                            ? item.average_selling_price.toFixed(2)
                            : item.selling_price.toFixed(2)
                        }}
                      </div>
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
        <Panel class="cart-panel">
          <template #header>
            <div class="flex items-center gap-2 w-full justify-content-between align-items-center">
              <span class="font-bold">Shopping Cart</span>
              <Button
                label="Clear Cart"
                icon="pi pi-trash mr-2"
                severity="danger"
                class="p-button-outlined"
                :disabled="cart.length === 0"
                @click="confirmClearCart"
              />
            </div>
          </template>
          <div v-if="cart.length === 0" class="text-center py-6 text-600">
            <i class="pi pi-shopping-cart text-6xl mb-3 text-400"></i>
            <p class="text-xl">Cart is empty</p>
            <p class="text-sm">Search and add products to get started</p>
          </div>

          <div v-else class="cart-items">
            <div
              v-for="item in cart"
              :key="item.product_id"
              class="cart-item surface-card border-round mb-3 p-1"
            >
              <div class="grid align-items-center justify-content-between">
                <!-- Product Info -->
                <div class="col-3 pr-0">
                  <div class="font-semibold mb-1" style="font-size: 0.9em">
                    {{ item.product_name }}
                  </div>
                  <div class="text-500 mb-2" style="font-size: 0.75em">
                    {{ item.category.name }}
                  </div>
                  <div class="text-600" style="font-size: 0.7em">
                    <span class="font-semibold">Available:</span>
                    {{ item.available_quantity }}
                    units
                  </div>
                </div>

                <!-- Unit Price (Editable) -->
                <div class="col-3 pr-0">
                  <label class="block text-600 mb-1" style="font-size: 0.7em">
                    Unit Price (Rs.)
                  </label>
                  <InputNumber
                    v-model="item.unit_price"
                    mode="currency"
                    currency="LKR"
                    locale="en-LK"
                    :min="0"
                    @update:modelValue="updateUnitPrice(item.product_id, $event)"
                    class="input-compact unit-price-input"
                    :pt="{
                      input: {
                        class: 'p-inputtext-sm',
                        style: 'font-size: 0.8em; height: 2rem; padding: 0.3rem 0.5rem',
                      },
                    }"
                  />
                </div>

                <!-- Quantity -->
                <div class="col-2 pr-0">
                  <label class="block text-600 mb-1" style="font-size: 0.7em">Quantity</label>
                  <InputNumber
                    v-model="item.quantity"
                    :min="1"
                    :max="item.available_quantity"
                    showButtons
                    mode="decimal"
                    decrementButtonClass="p-button-danger p-button-sm"
                    incrementButtonClass="p-button-success p-button-sm"
                    @update:modelValue="updateQuantity(item.product_id, $event)"
                    class="input-compact quantity-input"
                  />
                </div>
                <!-- Subtotal -->
                <div class="col-2 text-right pr-0">
                  <label class="block text-600 mb-1" style="font-size: 0.7em">Subtotal</label>
                  <div class="font-bold text-primary" style="font-size: 1.1em">
                    Rs. {{ (item.quantity * item.unit_price).toFixed(2) }}
                  </div>
                </div>

                <!-- Remove Button -->
                <div class="col-1 text-right">
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    rounded
                    @click="removeItem(item.product_id)"
                    v-tooltip.left="'Remove item'"
                  />
                </div>
              </div>
            </div>

            <!-- Cart Summary -->
            <div class="cart-summary surface-100 border-round p-3 mt-3">
              <div class="flex justify-content-between align-items-center">
                <span class="text-600" style="font-size: 0.85em">Total Items:</span>
                <span class="font-semibold" style="font-size: 0.85em">{{ cart.length }}</span>
              </div>
              <div class="flex justify-content-between align-items-center mt-2">
                <span class="text-600" style="font-size: 0.85em">Total Quantity:</span>
                <span class="font-semibold" style="font-size: 0.85em">
                  {{ cart.reduce((sum, item) => sum + item.quantity, 0) }} units
                </span>
              </div>
            </div>
          </div>
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

  try {
    // Search products - store returns data array directly
    const products = await productStore.searchProducts(query);
    filteredProducts.value = products || [];
  } catch (error) {
    filteredProducts.value = [];
    toast.add({
      severity: 'error',
      summary: 'Search Error',
      detail: error.message || 'Failed to search products',
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

function updateUnitPrice(productId, price) {
  saleStore.updateCartItemPrice(productId, price);
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
  max-width: 1800px;
  margin: 0 auto;
}

.pos-header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-panel {
  min-height: 400px;
}

.input-compact > .p-inputtext {
  width: auto;
}

.unit-price-input {
  input {
    width: 10rem !important;
  }
}
.quantity-input {
  height: 2.4rem !important;
}

.p-button-icon-only {
  padding: 0;
}
.billing-summary {
  position: sticky;
  top: 1rem;
}

@media (max-width: 991px) {
  .billing-summary {
    position: static;
  }

  .cart-items {
    max-height: 400px;
  }
}
</style>
