import { ipcMain } from 'electron';
import MetaController from '../controllers/MetaController.js';

// Get all product types
ipcMain.handle('productType:getAll', async (event) => {
  try {
    const result = await MetaController.getAllProductTypes();
    return result;
  } catch (error) {
    console.error('Get product types handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch product types',
      productTypes: [],
    };
  }
});

// Get all categories
ipcMain.handle('category:getAll', async (event) => {
  try {
    const result = await MetaController.getAllCategories();
    return result;
  } catch (error) {
    console.error('Get categories handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch categories',
      categories: [],
    };
  }
});

console.log('✓ Meta IPC handlers registered');
