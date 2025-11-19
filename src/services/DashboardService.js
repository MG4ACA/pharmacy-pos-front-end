/**
 * Dashboard Service
 * Handles all dashboard-related operations
 */
class DashboardService {
  /**
   * Get dashboard summary statistics
   * @returns {Promise<Object>} Result with dashboard data
   */
  static async getDashboardSummary() {
    try {
      const result = await window.electronAPI.getDashboardSummary();
      return result;
    } catch (error) {
      console.error('DashboardService.getDashboardSummary error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch dashboard summary',
        data: {
          todaySales: 0,
          totalProducts: 0,
          lowStockItems: 0,
          expiringSoon: 0,
          monthSales: 0,
          totalSalesCount: 0,
          recentSales: [],
        },
      };
    }
  }
}

export default DashboardService;
