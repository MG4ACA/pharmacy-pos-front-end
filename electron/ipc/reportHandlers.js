import { ipcMain } from 'electron';
import ReportController from '../controllers/ReportController.js';

/**
 * Register all report-related IPC handlers
 */
export function registerReportHandlers() {
  // Get daily sales report
  ipcMain.handle('report:dailySales', async (event, params) => {
    return await ReportController.getDailySalesReport(params);
  });

  // Get stock level report
  ipcMain.handle('report:stockLevel', async () => {
    return await ReportController.getStockLevelReport();
  });

  // Get expiring products report
  ipcMain.handle('report:expiringProducts', async (event, days) => {
    return await ReportController.getExpiringProductsReport(days);
  });

  // Get top selling products
  ipcMain.handle('report:topSelling', async (event, params) => {
    return await ReportController.getTopSellingProducts(params);
  });

  console.log('Report IPC handlers registered');
}
