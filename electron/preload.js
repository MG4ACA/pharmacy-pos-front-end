const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Authentication
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  logout: () => ipcRenderer.invoke('auth:logout'),
  getCurrentUser: () => ipcRenderer.invoke('auth:getCurrentUser'),
  changePassword: (data) => ipcRenderer.invoke('auth:changePassword', data),
  checkFirstRun: () => ipcRenderer.invoke('auth:checkFirstRun'),

  // Products
  getAllProducts: (params) => ipcRenderer.invoke('product:getAll', params),
  getProductById: (id) => ipcRenderer.invoke('product:getById', id),
  createProduct: (data) => ipcRenderer.invoke('product:create', data),
  updateProduct: (id, data) => ipcRenderer.invoke('product:update', { id, data }),
  deleteProduct: (id) => ipcRenderer.invoke('product:delete', id),
  searchProducts: (query) => ipcRenderer.invoke('product:search', query),

  // Stock
  addStockEntry: (data) => ipcRenderer.invoke('stock:addEntry', data),
  getStockByProduct: (productId) => ipcRenderer.invoke('stock:getByProduct', productId),
  getStockHistory: (params) => ipcRenderer.invoke('stock:getHistory', params),
  getBatchDetails: (batchId) => ipcRenderer.invoke('stock:getBatchDetails', batchId),
  deductStock: (data) => ipcRenderer.invoke('stock:deduct', data),
  getExpiringStock: (days) => ipcRenderer.invoke('stock:getExpiring', days),

  // Suppliers
  getAllSuppliers: (params) => ipcRenderer.invoke('supplier:getAll', params),
  getSupplierById: (id) => ipcRenderer.invoke('supplier:getById', id),
  createSupplier: (data) => ipcRenderer.invoke('supplier:create', data),
  updateSupplier: (data) => ipcRenderer.invoke('supplier:update', data),
  deleteSupplier: (id) => ipcRenderer.invoke('supplier:delete', id),
  getActiveSuppliers: () => ipcRenderer.invoke('supplier:getActive'),
  getProductsFromSupplier: (supplierId) => ipcRenderer.invoke('supplier:getProducts', supplierId),

  // Sales
  createSale: (data) => ipcRenderer.invoke('sale:create', data),
  getSaleHistory: (params) => ipcRenderer.invoke('sale:getHistory', params),
  getSaleById: (id) => ipcRenderer.invoke('sale:getById', id),
  getTodaySales: () => ipcRenderer.invoke('sale:getTodaySales'),

  // Dashboard
  getDashboardSummary: () => ipcRenderer.invoke('dashboard:getSummary'),

  // Reports
  getDailySalesReport: (params) => ipcRenderer.invoke('report:dailySales', params),
  getStockLevelReport: () => ipcRenderer.invoke('report:stockLevel'),
  getExpiringProductsReport: (days) => ipcRenderer.invoke('report:expiringProducts', days),
  getTopSellingProducts: (params) => ipcRenderer.invoke('report:topSelling', params),

  // Product Types & Categories
  getProductTypes: () => ipcRenderer.invoke('productType:getAll'),
  getCategories: () => ipcRenderer.invoke('category:getAll'),
});

console.log('✓ Preload script loaded - electronAPI exposed');
