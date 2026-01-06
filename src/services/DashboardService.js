import apiClient from '@/api/client';

/**
 * Dashboard Service
 * Handles all dashboard-related operations
 */
class DashboardService {
  /**
   * Get dashboard summary statistics with chart data
   * @param {Object} params - Query parameters
   * @param {number} params.days - Number of days for trend (7 or 30)
   * @returns {Promise<Object>} Result with dashboard data and charts
   */
  static async getDashboardSummary(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/dashboard/summary${queryString ? '?' + queryString : ''}`;
      const result = await apiClient.get(url);
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
          salesTrend: { labels: [], data: [] },
          topProducts: { labels: [], data: [] },
          revenueVsProfit: { labels: [], revenue: [], profit: [] },
        },
      };
    }
  }
}

export default DashboardService;
