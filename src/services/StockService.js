/**
 * Stock Service
 * Handles all stock-related operations
 */
class StockService {
  /**
   * Get all stock entries for a specific product
   * @param {number} productId - Product ID
   * @returns {Promise<Array>} Stock entries
   */
  async getStockByProduct(productId) {
    try {
      const result = await window.electronAPI.getStockByProduct(productId);

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch stock entries');
      }
    } catch (error) {
      console.error('StockService.getStockByProduct error:', error);
      throw error;
    }
  }

  /**
   * Get batch details by batch ID
   * @param {number} batchId - Batch ID
   * @returns {Promise<Object>} Batch details
   */
  async getBatchDetails(batchId) {
    try {
      const result = await window.electronAPI.getBatchDetails(batchId);

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch batch details');
      }
    } catch (error) {
      console.error('StockService.getBatchDetails error:', error);
      throw error;
    }
  }

  /**
   * Get expiring stock within specified days
   * @param {number} days - Number of days (default: 30)
   * @returns {Promise<Array>} Expiring stock entries
   */
  async getExpiringStock(days = 30) {
    try {
      const result = await window.electronAPI.getExpiringStock(days);

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch expiring stock');
      }
    } catch (error) {
      console.error('StockService.getExpiringStock error:', error);
      throw error;
    }
  }
}

export default new StockService();
