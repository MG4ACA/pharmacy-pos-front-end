import apiClient from '@/api/client';

/**
 * Stock Receipt Service
 * Handles all stock receipt related operations
 */
export class StockReceiptService {
  /**
   * Generate next receipt number
   * @returns {Promise<Object>}
   */
  static async generateReceiptNumber() {
    try {
      return await apiClient.get('/stock-receipts/generate-number');
    } catch (error) {
      console.error('StockReceiptService.generateReceiptNumber error:', error);
      throw error;
    }
  }

  /**
   * Create new stock receipt with entries
   * @param {Object} receiptData - Receipt data with header and entries
   * @returns {Promise<Object>}
   */
  static async createReceipt(receiptData) {
    try {
      return await apiClient.post('/stock-receipts', receiptData);
    } catch (error) {
      console.error('StockReceiptService.createReceipt error:', error);
      throw error;
    }
  }

  /**
   * Get all receipts with optional filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>}
   */
  static async getAllReceipts(filters = {}) {
    try {
      return await apiClient.get('/stock-receipts', { params: filters });
    } catch (error) {
      console.error('StockReceiptService.getAllReceipts error:', error);
      throw error;
    }
  }

  /**
   * Get receipt by ID
   * @param {number} id - Receipt ID
   * @returns {Promise<Object>}
   */
  static async getReceiptById(id) {
    try {
      return await apiClient.get(`/stock-receipts/${id}`);
    } catch (error) {
      console.error('StockReceiptService.getReceiptById error:', error);
      throw error;
    }
  }

  /**
   * Update receipt (draft only)
   * @param {number} id - Receipt ID
   * @param {Object} receiptData - Updated receipt data
   * @returns {Promise<Object>}
   */
  static async updateReceipt(id, receiptData) {
    try {
      return await apiClient.put(`/stock-receipts/${id}`, receiptData);
    } catch (error) {
      console.error('StockReceiptService.updateReceipt error:', error);
      throw error;
    }
  }

  /**
   * Cancel receipt
   * @param {number} id - Receipt ID
   * @returns {Promise<Object>}
   */
  static async cancelReceipt(id) {
    try {
      return await apiClient.delete(`/stock-receipts/${id}`);
    } catch (error) {
      console.error('StockReceiptService.cancelReceipt error:', error);
      throw error;
    }
  }

  /**
   * Get receipts by supplier
   * @param {number} supplierId - Supplier ID
   * @returns {Promise<Object>}
   */
  static async getReceiptsBySupplier(supplierId) {
    try {
      return await apiClient.get(`/stock-receipts/supplier/${supplierId}`);
    } catch (error) {
      console.error('StockReceiptService.getReceiptsBySupplier error:', error);
      throw error;
    }
  }
}
