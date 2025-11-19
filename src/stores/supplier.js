import { SupplierService } from '@/services/SupplierService';
import { defineStore } from 'pinia';

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [],
    currentSupplier: null,
    loading: false,
  }),

  getters: {
    hasSuppliers: (state) => state.suppliers.length > 0,
    activeSuppliers: (state) => state.suppliers.filter((s) => s.status === 'active'),
  },

  actions: {
    /**
     * Fetch all suppliers
     * @param {Object} params - Query parameters (status, search)
     */
    async fetchSuppliers(params = {}) {
      this.loading = true;
      try {
        const result = await SupplierService.getAllSuppliers(params);
        if (result.success) {
          this.suppliers = result.data || [];
        }
        return result;
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch active suppliers only
     */
    async fetchActiveSuppliers() {
      this.loading = true;
      try {
        const result = await SupplierService.getActiveSuppliers();
        if (result.success) {
          this.suppliers = result.data || [];
        }
        return result;
      } catch (error) {
        console.error('Failed to fetch active suppliers:', error);
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch supplier by ID
     * @param {number} id - Supplier ID
     */
    async fetchSupplierById(id) {
      this.loading = true;
      try {
        const result = await SupplierService.getSupplierById(id);
        if (result.success) {
          this.currentSupplier = result.data;
        }
        return result;
      } catch (error) {
        console.error('Failed to fetch supplier:', error);
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create new supplier
     * @param {Object} data - Supplier data
     */
    async createSupplier(data) {
      this.loading = true;
      try {
        const result = await SupplierService.createSupplier(data);
        if (result.success) {
          // Add to beginning of list
          this.suppliers.unshift(result.data);
        }
        return result;
      } catch (error) {
        console.error('Failed to create supplier:', error);
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update supplier
     * @param {number} id - Supplier ID
     * @param {Object} data - Updated supplier data
     */
    async updateSupplier(id, data) {
      this.loading = true;
      try {
        const result = await SupplierService.updateSupplier(id, data);
        if (result.success) {
          // Update in list
          const index = this.suppliers.findIndex((s) => s.id === id);
          if (index !== -1) {
            this.suppliers[index] = result.data;
          }
        }
        return result;
      } catch (error) {
        console.error('Failed to update supplier:', error);
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete supplier (soft delete)
     * @param {number} id - Supplier ID
     */
    async deleteSupplier(id) {
      this.loading = true;
      try {
        const result = await SupplierService.deleteSupplier(id);
        if (result.success) {
          // Update status in list
          const supplier = this.suppliers.find((s) => s.id === id);
          if (supplier) {
            supplier.status = 'inactive';
          }
        }
        return result;
      } catch (error) {
        console.error('Failed to delete supplier:', error);
        return { success: false, message: error.message };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear current supplier
     */
    clearCurrentSupplier() {
      this.currentSupplier = null;
    },

    /**
     * Clear suppliers list
     */
    clearSuppliers() {
      this.suppliers = [];
    },

    /**
     * Fetch products from supplier
     * @param {number} supplierId - Supplier ID
     */
    async fetchProductsFromSupplier(supplierId) {
      this.loading = true;
      try {
        const result = await SupplierService.getProductsFromSupplier(supplierId);
        return result;
      } catch (error) {
        console.error('Failed to fetch products from supplier:', error);
        return { success: false, message: error.message, data: [] };
      } finally {
        this.loading = false;
      }
    },
  },
});
