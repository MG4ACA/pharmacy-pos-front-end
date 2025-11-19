export class StockService {
  static async addStockEntry(data) {
    try {
      const result = await window.electronAPI.addStockEntry(data);
      return result;
    } catch (error) {
      console.error('StockService addStockEntry error:', error);
      throw new Error('Failed to add stock entry');
    }
  }

  static async getStockByProduct(productId) {
    try {
      const result = await window.electronAPI.getStockByProduct(productId);
      return result;
    } catch (error) {
      console.error('StockService getStockByProduct error:', error);
      throw new Error('Failed to fetch stock entries');
    }
  }

  static async getStockHistory(params) {
    try {
      const result = await window.electronAPI.getStockHistory(params);
      return result;
    } catch (error) {
      console.error('StockService getStockHistory error:', error);
      throw new Error('Failed to fetch stock history');
    }
  }

  static async getBatchDetails(batchId) {
    try {
      const result = await window.electronAPI.getBatchDetails(batchId);
      return result;
    } catch (error) {
      console.error('StockService getBatchDetails error:', error);
      throw new Error('Failed to fetch batch details');
    }
  }

  static async deductStock(productId, quantity) {
    try {
      const result = await window.electronAPI.deductStock({ productId, quantity });
      return result;
    } catch (error) {
      console.error('StockService deductStock error:', error);
      throw new Error('Failed to deduct stock');
    }
  }

  static async getExpiringStock(days = 30) {
    try {
      const result = await window.electronAPI.getExpiringStock(days);
      return result;
    } catch (error) {
      console.error('StockService getExpiringStock error:', error);
      throw new Error('Failed to fetch expiring stock');
    }
  }
}
