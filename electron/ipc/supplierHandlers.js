import { ipcMain } from 'electron';
import SupplierController from '../controllers/SupplierController.js';

// Get all suppliers
ipcMain.handle('supplier:getAll', async (event, params) => {
  try {
    return await SupplierController.getAllSuppliers(params);
  } catch (error) {
    console.error('IPC supplier:getAll error:', error);
    return { success: false, message: error.message };
  }
});

// Get supplier by ID
ipcMain.handle('supplier:getById', async (event, id) => {
  try {
    return await SupplierController.getSupplierById(id);
  } catch (error) {
    console.error('IPC supplier:getById error:', error);
    return { success: false, message: error.message };
  }
});

// Create supplier
ipcMain.handle('supplier:create', async (event, data) => {
  try {
    return await SupplierController.createSupplier(data);
  } catch (error) {
    console.error('IPC supplier:create error:', error);
    return { success: false, message: error.message };
  }
});

// Update supplier
ipcMain.handle('supplier:update', async (event, { id, data }) => {
  try {
    return await SupplierController.updateSupplier(id, data);
  } catch (error) {
    console.error('IPC supplier:update error:', error);
    return { success: false, message: error.message };
  }
});

// Delete supplier
ipcMain.handle('supplier:delete', async (event, id) => {
  try {
    return await SupplierController.deleteSupplier(id);
  } catch (error) {
    console.error('IPC supplier:delete error:', error);
    return { success: false, message: error.message };
  }
});

// Get active suppliers
ipcMain.handle('supplier:getActive', async () => {
  try {
    return await SupplierController.getActiveSuppliers();
  } catch (error) {
    console.error('IPC supplier:getActive error:', error);
    return { success: false, message: error.message };
  }
});

// Get products from supplier
ipcMain.handle('supplier:getProducts', async (event, supplierId) => {
  try {
    return await SupplierController.getProductsFromSupplier(supplierId);
  } catch (error) {
    console.error('IPC supplier:getProducts error:', error);
    return { success: false, message: error.message, data: [] };
  }
});

console.log('✓ Supplier IPC handlers registered');
