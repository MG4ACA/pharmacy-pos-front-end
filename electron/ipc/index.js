// This file will import all IPC handlers
import './authHandlers.js';
import { registerDashboardHandlers } from './dashboardHandlers.js';
import './metaHandlers.js';
import './productHandlers.js';
import { registerReportHandlers } from './reportHandlers.js';
import { registerSaleHandlers } from './saleHandlers.js';
import { registerStockHandlers } from './stockHandlers.js';
import './stockReceiptHandlers.js';
import './supplierHandlers.js';

// Register handlers
registerSaleHandlers();
registerDashboardHandlers();
registerReportHandlers();
registerStockHandlers();

console.log('✓ All IPC handlers loaded');
