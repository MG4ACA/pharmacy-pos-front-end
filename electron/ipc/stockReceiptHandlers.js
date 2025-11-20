import { ipcMain } from 'electron';
import StockReceiptController from '../controllers/StockReceiptController.js';

// Stock Receipt: Generate Number
ipcMain.handle('stockReceipt:generateNumber', async (event) => {
  try {
    const result = await StockReceiptController.generateReceiptNumber();
    return result;
  } catch (error) {
    console.error('Stock receipt generateNumber handler error:', error);
    return {
      success: false,
      message: 'Failed to generate receipt number',
    };
  }
});

// Stock Receipt: Create
ipcMain.handle('stockReceipt:create', async (event, data) => {
  try {
    const result = await StockReceiptController.createReceipt(data);
    return result;
  } catch (error) {
    console.error('Stock receipt create handler error:', error);
    return {
      success: false,
      message: 'Failed to create stock receipt',
    };
  }
});

// Stock Receipt: Get All
ipcMain.handle('stockReceipts:getAll', async (event, filters) => {
  try {
    const result = await StockReceiptController.getAllStockReceipts(filters);
    return result;
  } catch (error) {
    console.error('Stock receipt getAll handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch stock receipts',
    };
  }
});

// Stock Receipt: Get By ID
ipcMain.handle('stockReceipt:getById', async (event, id) => {
  try {
    const result = await StockReceiptController.getReceiptById(id);
    return result;
  } catch (error) {
    console.error('Stock receipt getById handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch stock receipt',
    };
  }
});

// Stock Receipt: Update
ipcMain.handle('stockReceipt:update', async (event, id, data) => {
  try {
    const result = await StockReceiptController.updateReceipt(id, data);
    return result;
  } catch (error) {
    console.error('Stock receipt update handler error:', error);
    return {
      success: false,
      message: 'Failed to update stock receipt',
    };
  }
});

// Stock Receipt: Cancel
ipcMain.handle('stockReceipt:cancel', async (event, id) => {
  try {
    const result = await StockReceiptController.cancelReceipt(id);
    return result;
  } catch (error) {
    console.error('Stock receipt cancel handler error:', error);
    return {
      success: false,
      message: 'Failed to cancel stock receipt',
    };
  }
});

// Stock Receipt: Get By Supplier
ipcMain.handle('stockReceipt:getBySupplier', async (event, supplierId) => {
  try {
    const result = await StockReceiptController.getReceiptsBySupplier(supplierId);
    return result;
  } catch (error) {
    console.error('Stock receipt getBySupplier handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch supplier receipts',
    };
  }
});

console.log('✓ Stock receipt IPC handlers registered');
