import apiClient from '@/api/client';

export class SupplierService {
  /**
   * Get all suppliers
   * @param {Object} params - Query parameters (status, search)
   * @returns {Promise<Object>}
   */
  static async getAllSuppliers(params = {}) {
    try {
      return await apiClient.get('/suppliers', { params });
    } catch (error) {
      console.error('SupplierService.getAllSuppliers error:', error);
      throw error;
    }
  }

  /**
   * Get supplier by ID
   * @param {number} id - Supplier ID
   * @returns {Promise<Object>}
   */
  static async getSupplierById(id) {
    try {
      return await apiClient.get(`/suppliers/${id}`);
    } catch (error) {
      console.error('SupplierService.getSupplierById error:', error);
      throw error;
    }
  }

  /**
   * Create new supplier
   * @param {Object} data - Supplier data
   * @returns {Promise<Object>}
   */
  static async createSupplier(data) {
    try {
      return await apiClient.post('/suppliers', data);
    } catch (error) {
      console.error('SupplierService.createSupplier error:', error);
      throw error;
    }
  }

  /**
   * Update supplier
   * @param {number} id - Supplier ID
   * @param {Object} data - Updated supplier data
   * @returns {Promise<Object>}
   */
  static async updateSupplier(id, data) {
    try {
      return await apiClient.put(`/suppliers/${id}`, data);
    } catch (error) {
      console.error('SupplierService.updateSupplier error:', error);
      throw error;
    }
  }

  /**
   * Delete supplier
   * @param {number} id - Supplier ID
   * @returns {Promise<Object>}
   */
  static async deleteSupplier(id) {
    try {
      return await apiClient.delete(`/suppliers/${id}`);
    } catch (error) {
      console.error('SupplierService.deleteSupplier error:', error);
      throw error;
    }
  }

  /**
   * Get active suppliers only
   * @returns {Promise<Object>}
   */
  static async getActiveSuppliers() {
    try {
      return await apiClient.get('/suppliers/active');
    } catch (error) {
      console.error('SupplierService.getActiveSuppliers error:', error);
      throw error;
    }
  }

  /**
   * Get products from supplier
   * @param {number} supplierId - Supplier ID
   * @returns {Promise<Object>}
   */
  static async getProductsFromSupplier(supplierId) {
    try {
      return await apiClient.get(`/suppliers/${supplierId}/products`);
    } catch (error) {
      console.error('SupplierService.getProductsFromSupplier error:', error);
      throw error;
    }
  }
}
