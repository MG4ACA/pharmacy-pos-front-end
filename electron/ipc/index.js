// This file will import all IPC handlers
import './authHandlers.js';
import './metaHandlers.js';
import './productHandlers.js';
import './stockHandlers.js';
import './supplierHandlers.js';
import { registerSaleHandlers } from './saleHandlers.js';

// Register sale handlers
registerSaleHandlers();

// To be implemented in future phases:
// import './dashboardHandlers.js'

console.log('✓ All IPC handlers loaded');
