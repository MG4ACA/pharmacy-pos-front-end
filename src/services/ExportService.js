import apiClient from '@/api/client';

class ExportService {
  /**
   * Export sales data to CSV
   */
  static async exportSales(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters.categoryId) {
        params.append('categoryId', filters.categoryId);
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
        }/export/sales?${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export sales data');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('ExportService exportSales error:', error);
      throw error;
    }
  }

  /**
   * Export stock receipts data to CSV
   */
  static async exportStockReceipts(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      if (filters.supplierId) {
        params.append('supplierId', filters.supplierId);
      }
      if (filters.categoryId) {
        params.append('categoryId', filters.categoryId);
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
        }/export/stock-receipts?${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export stock receipts data');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stock_receipts_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('ExportService exportStockReceipts error:', error);
      throw error;
    }
  }

  /**
   * Get export statistics
   */
  static async getExportStats() {
    try {
      const result = await apiClient.get('/export/stats');
      return result;
    } catch (error) {
      console.error('ExportService getExportStats error:', error);
      throw error;
    }
  }
}

export default ExportService;
