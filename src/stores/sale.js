import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import SaleService from '../services/SaleService';

export const useSaleStore = defineStore('sale', () => {
  // Cart state
  const cart = ref([]);
  const discount = ref(0);
  const tax = ref(0);
  const paymentMethod = ref('cash');
  const notes = ref('');

  // Sales history
  const salesHistory = ref([]);
  const currentSale = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Pagination
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Computed: Cart totals
  const cartSubtotal = computed(() => {
    return cart.value.reduce((sum, item) => {
      return sum + item.quantity * item.unit_price;
    }, 0);
  });

  const cartTotal = computed(() => {
    const subtotal = cartSubtotal.value;
    const discountAmount = parseFloat(discount.value) || 0;
    const taxAmount = parseFloat(tax.value) || 0;
    return subtotal - discountAmount + taxAmount;
  });

  const cartItemCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  // Actions: Cart management
  function addToCart(product) {
    // Check if product already in cart
    const existingItem = cart.value.find((item) => item.product_id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.value.push({
        product_id: product.id,
        product_name: product.name,
        generic_name: product.generic_name,
        category: product.category,
        unit_price: parseFloat(product.average_selling_price || product.selling_price || 0),
        quantity: 1,
        available_quantity: product.total_stock || 0,
      });
    }
  }

  function updateCartItemQuantity(productId, quantity) {
    const item = cart.value.find((i) => i.product_id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  function updateCartItemPrice(productId, price) {
    const item = cart.value.find((i) => i.product_id === productId);
    if (item) {
      item.unit_price = parseFloat(price) || 0;
    }
  }

  function removeFromCart(productId) {
    const index = cart.value.findIndex((item) => item.product_id === productId);
    if (index !== -1) {
      cart.value.splice(index, 1);
    }
  }

  function clearCart() {
    cart.value = [];
    discount.value = 0;
    tax.value = 0;
    paymentMethod.value = 'cash';
    notes.value = '';
  }

  function setDiscount(value) {
    discount.value = parseFloat(value) || 0;
  }

  function setTax(value) {
    tax.value = parseFloat(value) || 0;
  }

  function setPaymentMethod(method) {
    paymentMethod.value = method;
  }

  function setNotes(value) {
    notes.value = value;
  }

  // Actions: Sale operations
  async function completeSale(userId) {
    if (cart.value.length === 0) {
      error.value = 'Cart is empty';
      return { success: false, message: 'Cart is empty' };
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Prepare sale data
      const saleData = {
        user_id: userId,
        items: cart.value.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        discount: discount.value,
        tax: tax.value,
        payment_method: paymentMethod.value,
        notes: notes.value,
      };

      const result = await SaleService.createSale(saleData);

      if (result.success) {
        clearCart();
        currentSale.value = result.data;
      } else {
        error.value = result.message;
      }

      return result;
    } catch (err) {
      error.value = err.message;
      return {
        success: false,
        message: err.message || 'Failed to complete sale',
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchSalesHistory(params = {}) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await SaleService.getSalesHistory(params);

      if (result.success) {
        salesHistory.value = result.data;
        pagination.value = result.pagination;
      } else {
        error.value = result.message;
        salesHistory.value = [];
      }

      return result;
    } catch (err) {
      error.value = err.message;
      salesHistory.value = [];
      return {
        success: false,
        message: err.message || 'Failed to fetch sales history',
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchSaleById(id) {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await SaleService.getSaleById(id);

      if (result.success) {
        currentSale.value = result.data;
      } else {
        error.value = result.message;
        currentSale.value = null;
      }

      return result;
    } catch (err) {
      error.value = err.message;
      currentSale.value = null;
      return {
        success: false,
        message: err.message || 'Failed to fetch sale details',
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTodaySales() {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await SaleService.getTodaySales();

      if (!result.success) {
        error.value = result.message;
      }

      return result;
    } catch (err) {
      error.value = err.message;
      return {
        success: false,
        message: err.message || "Failed to fetch today's sales",
      };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // Cart state
    cart,
    discount,
    tax,
    paymentMethod,
    notes,

    // Sales state
    salesHistory,
    currentSale,
    isLoading,
    error,
    pagination,

    // Computed
    cartSubtotal,
    cartTotal,
    cartItemCount,

    // Cart actions
    addToCart,
    updateCartItemQuantity,
    updateCartItemPrice,
    removeFromCart,
    clearCart,
    setDiscount,
    setTax,
    setPaymentMethod,
    setNotes,

    // Sale actions
    completeSale,
    fetchSalesHistory,
    fetchSaleById,
    fetchTodaySales,
  };
});
