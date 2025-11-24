import { ipcMain } from 'electron';
import DashboardController from '../controllers/DashboardController.js';

/**
 * Register all dashboard-related IPC handlers
 */
export function registerDashboardHandlers() {
  // Get dashboard summary
  ipcMain.handle('dashboard:getSummary', async () => {
    return await DashboardController.getDashboardSummary();
  });

  // Get low stock products
  ipcMain.handle('dashboard:getLowStock', async () => {
    return await DashboardController.getLowStockProducts();
  });

  // Get expiring products
  ipcMain.handle('dashboard:getExpiring', async (event, days) => {
    return await DashboardController.getExpiringProducts(days);
  });

  console.log('Dashboard IPC handlers registered');
}
