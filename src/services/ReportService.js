import apiClient from '@/api/client';

/**
 * Report Service
 * Handles all report-related operations
 */
class ReportService {
  /**
   * Get daily sales report
   * @param {Object} params - Query parameters (start_date, end_date)
   * @returns {Promise<Object>} Result with sales report
   */
  static async getDailySalesReport(params) {
    try {
      const result = await apiClient.get('/reports/daily-sales', { params });
      return result;
    } catch (error) {
      console.error('ReportService.getDailySalesReport error:', error);
      return {
        success: false,
        message: error.message || 'Failed to generate daily sales report',
      };
    }
  }

  /**
   * Get stock level report
   * @returns {Promise<Object>} Result with stock report
   */
  static async getStockLevelReport() {
    try {
      const result = await apiClient.get('/reports/stock-level');
      return result;
    } catch (error) {
      console.error('ReportService.getStockLevelReport error:', error);
      return {
        success: false,
        message: error.message || 'Failed to generate stock level report',
      };
    }
  }

  /**
   * Get expiring products report
   * @param {number} days - Number of days to check
   * @returns {Promise<Object>} Result with expiring products
   */
  static async getExpiringProductsReport(days = 30) {
    try {
      const result = await apiClient.get('/reports/expiring', { params: { days } });
      return result;
    } catch (error) {
      console.error('ReportService.getExpiringProductsReport error:', error);
      return {
        success: false,
        message: error.message || 'Failed to generate expiring products report',
      };
    }
  }

  /**
   * Get top selling products
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Result with top products
   */
  static async getTopSellingProducts(params) {
    try {
      const result = await apiClient.get('/reports/top-selling', { params });
      return result;
    } catch (error) {
      console.error('ReportService.getTopSellingProducts error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch top selling products',
        data: [],
      };
    }
  }

  /**
   * Export data to CSV format
   * @param {Array} data - Data to export
   * @param {Array} columns - Column definitions
   * @returns {string} CSV string
   */
  static exportToCSV(data, columns) {
    // Create CSV header
    const header = columns.map((col) => col.header).join(',');

    // Create CSV rows
    const rows = data.map((row) => {
      return columns
        .map((col) => {
          let value = row[col.field];

          // Handle nested properties
          if (col.field.includes('.')) {
            const parts = col.field.split('.');
            value = parts.reduce((obj, key) => obj?.[key], row);
          }

          // Format value
          if (value === null || value === undefined) {
            value = '';
          } else if (typeof value === 'string') {
            // Escape quotes and wrap in quotes if contains comma
            value = value.replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n')) {
              value = `"${value}"`;
            }
          }

          return value;
        })
        .join(',');
    });

    return [header, ...rows].join('\n');
  }

  /**
   * Download CSV file
   * @param {string} csvContent - CSV content
   * @param {string} filename - File name
   */
  static downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default ReportService;
