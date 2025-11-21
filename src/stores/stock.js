import { defineStore } from 'pinia';
import { ref } from 'vue';
import StockService from '../services/StockService';

export const useStockStore = defineStore('stock', () => {
  // State
  const stockEntries = ref([]);
  const currentBatch = ref(null);
  const expiringStock = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Actions
  async function fetchStockByProduct(productId) {
    try {
      isLoading.value = true;
      error.value = null;

      const data = await StockService.getStockByProduct(productId);
      stockEntries.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to fetch stock entries:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBatchDetails(batchId) {
    try {
      isLoading.value = true;
      error.value = null;

      const data = await StockService.getBatchDetails(batchId);
      currentBatch.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to fetch batch details:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchExpiringStock(days = 30) {
    try {
      isLoading.value = true;
      error.value = null;

      const data = await StockService.getExpiringStock(days);
      expiringStock.value = data;
      return data;
    } catch (err) {
      error.value = err.message;
      console.error('Failed to fetch expiring stock:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function clearStockEntries() {
    stockEntries.value = [];
  }

  return {
    // State
    stockEntries,
    currentBatch,
    expiringStock,
    isLoading,
    error,

    // Actions
    fetchStockByProduct,
    fetchBatchDetails,
    fetchExpiringStock,
    clearError,
    clearStockEntries,
  };
});
