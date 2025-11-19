import { StockService } from '@/services/StockService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useStockStore = defineStore('stock', () => {
  const stockEntries = ref([]);
  const currentBatch = ref(null);
  const loading = ref(false);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const hasStockEntries = computed(() => stockEntries.value.length > 0);

  /**
   * Add new stock entry
   */
  const addStockEntry = async (data) => {
    loading.value = true;
    try {
      const result = await StockService.addStockEntry(data);
      if (result.success && result.data) {
        // Add to beginning of array
        stockEntries.value.unshift(result.data);
      }
      return result;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch stock entries by product
   */
  const fetchStockByProduct = async (productId) => {
    loading.value = true;
    try {
      const result = await StockService.getStockByProduct(productId);
      if (result.success) {
        stockEntries.value = result.data || [];
      }
      return result;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch stock history with pagination and filters
   */
  const fetchStockHistory = async (params = {}) => {
    loading.value = true;
    try {
      const result = await StockService.getStockHistory(params);
      if (result.success) {
        stockEntries.value = result.data || [];
        if (result.pagination) {
          pagination.value = result.pagination;
        }
      }
      return result;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch batch details
   */
  const fetchBatchDetails = async (batchId) => {
    loading.value = true;
    try {
      const result = await StockService.getBatchDetails(batchId);
      if (result.success) {
        currentBatch.value = result.data;
      }
      return result;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Deduct stock using FIFO
   */
  const deductStock = async (productId, quantity) => {
    loading.value = true;
    try {
      const result = await StockService.deductStock(productId, quantity);
      return result;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get expiring stock
   */
  const fetchExpiringStock = async (days = 30) => {
    loading.value = true;
    try {
      const result = await StockService.getExpiringStock(days);
      if (result.success) {
        return result.data || [];
      }
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clear current batch
   */
  const clearCurrentBatch = () => {
    currentBatch.value = null;
  };

  /**
   * Clear all stock entries
   */
  const clearStockEntries = () => {
    stockEntries.value = [];
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    };
  };

  return {
    // State
    stockEntries,
    currentBatch,
    loading,
    pagination,

    // Computed
    hasStockEntries,

    // Actions
    addStockEntry,
    fetchStockByProduct,
    fetchStockHistory,
    fetchBatchDetails,
    deductStock,
    fetchExpiringStock,
    clearCurrentBatch,
    clearStockEntries,
  };
});
