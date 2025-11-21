import { ipcMain } from 'electron';
import StockController from '../controllers/StockController.js';

/**
 * Register all stock-related IPC handlers
 */
export function registerStockHandlers() {
  // Get stock entries by product ID
  ipcMain.handle('stock:getByProduct', async (event, productId) => {
    try {
      return await StockController.getStockByProduct(productId);
    } catch (error) {
      console.error('stock:getByProduct error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch stock entries',
      };
    }
  });

  // Get batch details by batch ID
  ipcMain.handle('stock:getBatchDetails', async (event, batchId) => {
    try {
      return await StockController.getBatchDetails(batchId);
    } catch (error) {
      console.error('stock:getBatchDetails error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch batch details',
      };
    }
  });

  // Deduct stock (used internally by sales)
  ipcMain.handle('stock:deduct', async (event, { productId, quantity }) => {
    try {
      return await StockController.deductStock(productId, quantity);
    } catch (error) {
      console.error('stock:deduct error:', error);
      return {
        success: false,
        message: error.message || 'Failed to deduct stock',
      };
    }
  });

  // Get expiring stock
  ipcMain.handle('stock:getExpiring', async (event, days = 30) => {
    try {
      return await StockController.getExpiringStock(days);
    } catch (error) {
      console.error('stock:getExpiring error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch expiring stock',
      };
    }
  });
}
