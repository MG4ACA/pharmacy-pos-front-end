import { StockReceiptService } from '@/services/StockReceiptService';
import { defineStore } from 'pinia';

export const useStockReceiptStore = defineStore('stockReceipt', {
  state: () => ({
    receipts: [],
    currentReceipt: null,
    filters: {
      supplierId: null,
      status: null,
      startDate: null,
      endDate: null,
      searchQuery: '',
      sortField: 'receipt_date',
      sortOrder: -1,
    },
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Get receipts filtered by status
     */
    receiptsByStatus: (state) => (status) => {
      return state.receipts.filter((r) => r.status === status);
    },

    /**
     * Get draft receipts count
     */
    draftReceiptsCount: (state) => {
      return state.receipts.filter((r) => r.status === 'draft').length;
    },

    /**
     * Get completed receipts count
     */
    completedReceiptsCount: (state) => {
      return state.receipts.filter((r) => r.status === 'completed').length;
    },

    /**
     * Get total amount from all receipts
     */
    totalReceiptsAmount: (state) => {
      return state.receipts.reduce((sum, r) => sum + parseFloat(r.total_amount || 0), 0);
    },
  },

  actions: {
    /**
     * Generate next receipt number
     */
    async generateReceiptNumber() {
      try {
        this.loading = true;
        this.error = null;
        const result = await StockReceiptService.generateReceiptNumber();

        if (!result.success) {
          throw new Error(result.error);
        }

        return result.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create new stock receipt
     */
    async createReceipt(receiptData) {
      try {
        this.loading = true;
        this.error = null;
        const result = await StockReceiptService.createReceipt(receiptData);

        if (!result.success) {
          throw new Error(result.error);
        }

        // Reload receipts after creation
        await this.loadReceipts();

        return result.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Load all receipts with current filters
     */
    async loadReceipts() {
      try {
        this.loading = true;
        this.error = null;
        const result = await StockReceiptService.getAllReceipts(this.filters);

        if (!result.success) {
          throw new Error(result.error);
        }

        this.receipts = result.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Load receipt by ID
     */
    async loadReceiptById(id) {
      try {
        this.loading = true;
        this.error = null;
        const result = await StockReceiptService.getReceiptById(id);

        if (!result.success) {
          throw new Error(result.error);
        }

        this.currentReceipt = result.data;
        return result.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update receipt
     */
    async updateReceipt(id, receiptData) {
      try {
        this.loading = true;
        this.error = null;
        const result = await StockReceiptService.updateReceipt(id, receiptData);

        if (!result.success) {
          throw new Error(result.error);
        }

        // Reload receipts after update
        await this.loadReceipts();

        return result.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Cancel receipt
     */
    async cancelReceipt(id) {
      try {
        this.loading = true;
        this.error = null;
        const result = await StockReceiptService.cancelReceipt(id);

        if (!result.success) {
          throw new Error(result.error);
        }

        // Reload receipts after cancellation
        await this.loadReceipts();

        return result;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Load receipts by supplier
     */
    async loadReceiptsBySupplier(supplierId) {
      try {
        this.loading = true;
        this.error = null;
        const result = await StockReceiptService.getReceiptsBySupplier(supplierId);

        if (!result.success) {
          throw new Error(result.error);
        }

        return result.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update filters
     */
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },

    /**
     * Clear filters
     */
    clearFilters() {
      this.filters = {
        supplierId: null,
        status: null,
        startDate: null,
        endDate: null,
        searchQuery: '',
        sortField: 'receipt_date',
        sortOrder: -1,
      };
    },

    /**
     * Clear current receipt
     */
    clearCurrentReceipt() {
      this.currentReceipt = null;
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null;
    },
  },
});
