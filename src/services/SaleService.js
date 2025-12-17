import apiClient from '@/api/client';

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
      const result = await apiClient.post('/sales', saleData);
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
      const result = await apiClient.get('/sales', { params });
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
      const result = await apiClient.get(`/sales/${id}`);
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
      const result = await apiClient.get('/sales/today');
      return result;
    } catch (error) {
      console.error('SaleService.getTodaySales error:', error);
      return {
        success: false,
        message: error.message || "Failed to fetch today's sales",
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

  /**
   * Update sale
   * @param {number} id - Sale ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Result
   */
  static async updateSale(id, data) {
    try {
      const result = await apiClient.put(`/sales/${id}`, data);
      return result;
    } catch (error) {
      console.error('SaleService.updateSale error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update sale',
      };
    }
  }

  /**
   * Get free items sales report
   * @param {Object} params - Query parameters with date range
   * @returns {Promise<Object>} Result with free items analytics
   */
  static async getFreeItemsSalesReport(params = {}) {
    try {
      const result = await apiClient.get('/sales/reports/free-items', { params });
      return result;
    } catch (error) {
      console.error('SaleService.getFreeItemsSalesReport error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch free items sales report',
        data: {
          sales: [],
          summary: {
            totalSalesWithFreeItems: 0,
            totalFreeItemsSold: 0,
            totalFreeItemsRevenue: 0,
            averageRevenuePerSale: 0,
          },
          topProducts: [],
        },
      };
    }
  }
}

export default SaleService;
