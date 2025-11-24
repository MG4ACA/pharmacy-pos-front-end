import { ipcMain } from 'electron';
import SaleController from '../controllers/SaleController.js';

/**
 * Register all sale-related IPC handlers
 */
export function registerSaleHandlers() {
  // Create new sale
  ipcMain.handle('sale:create', async (event, saleData) => {
    return await SaleController.createSale(saleData);
  });

  // Get sale by ID
  ipcMain.handle('sale:getById', async (event, id) => {
    return await SaleController.getSaleById(id);
  });

  // Get sales history
  ipcMain.handle('sale:getHistory', async (event, params) => {
    return await SaleController.getSalesHistory(params);
  });

  // Get today's sales
  ipcMain.handle('sale:getToday', async () => {
    return await SaleController.getTodaySales();
  });

  // Get sales statistics
  ipcMain.handle('sale:getStatistics', async () => {
    return await SaleController.getSalesStatistics();
  });

  // Update sale
  ipcMain.handle('sale:update', async (event, { id, data }) => {
    return await SaleController.updateSale(id, data);
  });

  console.log('Sale IPC handlers registered');
}
