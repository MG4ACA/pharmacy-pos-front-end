/**
 * Sale Service
 * Handles all sale-related operations
 */
class SaleService {
  /**
   * Create a new sale
   * @param {Object} saleData - Sale data including items
   * @returns {Promise<Object>} Result
   */
  static async createSale(saleData) {
    try {
      const result = await window.electronAPI.createSale(saleData);
      return result;
    } catch (error) {
      console.error('SaleService.createSale error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create sale',
      };
    }
  }

  /**
   * Get sales history with filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Result with sales data
   */
  static async getSalesHistory(params = {}) {
    try {
      const result = await window.electronAPI.getSaleHistory(params);
      return result;
    } catch (error) {
      console.error('SaleService.getSalesHistory error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch sales history',
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  }

  /**
   * Get sale by ID
   * @param {number} id - Sale ID
   * @returns {Promise<Object>} Result with sale data
   */
  static async getSaleById(id) {
    try {
      const result = await window.electronAPI.getSaleById(id);
      return result;
    } catch (error) {
      console.error('SaleService.getSaleById error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch sale details',
      };
    }
  }

  /**
   * Get today's sales
   * @returns {Promise<Object>} Result with today's sales data
   */
  static async getTodaySales() {
    try {
      const result = await window.electronAPI.getTodaySales();
      return result;
    } catch (error) {
      console.error('SaleService.getTodaySales error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch today\'s sales',
        data: {
          sales: [],
          summary: {
            totalSales: 0,
            totalRevenue: 0,
            totalDiscount: 0,
            totalTax: 0,
            date: new Date().toISOString().split('T')[0],
          },
        },
      };
    }
  }
}

export default SaleService;
