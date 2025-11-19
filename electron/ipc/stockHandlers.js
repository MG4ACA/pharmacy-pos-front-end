import { ipcMain } from 'electron';
import StockController from '../controllers/StockController.js';

// Stock: Add Entry
ipcMain.handle('stock:addEntry', async (event, data) => {
  try {
    const result = await StockController.addStockEntry(data);
    return result;
  } catch (error) {
    console.error('Stock addEntry handler error:', error);
    return {
      success: false,
      message: 'Failed to add stock entry',
    };
  }
});

// Stock: Get By Product
ipcMain.handle('stock:getByProduct', async (event, productId) => {
  try {
    const result = await StockController.getStockByProduct(productId);
    return result;
  } catch (error) {
    console.error('Stock getByProduct handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch stock entries',
      data: [],
    };
  }
});

// Stock: Get History
ipcMain.handle('stock:getHistory', async (event, params) => {
  try {
    const result = await StockController.getStockHistory(params);
    return result;
  } catch (error) {
    console.error('Stock getHistory handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch stock history',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }
});

// Stock: Get Batch Details
ipcMain.handle('stock:getBatchDetails', async (event, batchId) => {
  try {
    const result = await StockController.getBatchDetails(batchId);
    return result;
  } catch (error) {
    console.error('Stock getBatchDetails handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch batch details',
    };
  }
});

// Stock: Deduct Stock (FIFO)
ipcMain.handle('stock:deduct', async (event, { productId, quantity }) => {
  try {
    const result = await StockController.deductStock(productId, quantity);
    return result;
  } catch (error) {
    console.error('Stock deduct handler error:', error);
    return {
      success: false,
      message: 'Failed to deduct stock',
    };
  }
});

// Stock: Get Expiring Stock
ipcMain.handle('stock:getExpiring', async (event, days) => {
  try {
    const result = await StockController.getExpiringStock(days);
    return result;
  } catch (error) {
    console.error('Stock getExpiring handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch expiring stock',
      data: [],
    };
  }
});

console.log('✓ Stock IPC handlers registered');
