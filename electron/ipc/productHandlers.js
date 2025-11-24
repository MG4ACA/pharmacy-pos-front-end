import { ipcMain } from 'electron';
import ProductController from '../controllers/ProductController.js';

// Product: Get All
ipcMain.handle('product:getAll', async (event, params) => {
  try {
    const result = await ProductController.getAllProducts(params);
    return result;
  } catch (error) {
    console.error('Product getAll handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch products',
    };
  }
});

// Product: Get By ID
ipcMain.handle('product:getById', async (event, id) => {
  try {
    const result = await ProductController.getProductById(id);
    return result;
  } catch (error) {
    console.error('Product getById handler error:', error);
    return {
      success: false,
      message: 'Failed to fetch product',
    };
  }
});

// Product: Create
ipcMain.handle('product:create', async (event, data) => {
  try {
    const result = await ProductController.createProduct(data);
    return result;
  } catch (error) {
    console.error('Product create handler error:', error);
    return {
      success: false,
      message: 'Failed to create product',
    };
  }
});

// Product: Update
ipcMain.handle('product:update', async (event, { id, data }) => {
  try {
    const result = await ProductController.updateProduct(id, data);
    return result;
  } catch (error) {
    console.error('Product update handler error:', error);
    return {
      success: false,
      message: 'Failed to update product',
    };
  }
});

// Product: Delete
ipcMain.handle('product:delete', async (event, id) => {
  try {
    const result = await ProductController.deleteProduct(id);
    return result;
  } catch (error) {
    console.error('Product delete handler error:', error);
    return {
      success: false,
      message: 'Failed to delete product',
    };
  }
});

// Product: Search
ipcMain.handle('product:search', async (event, query) => {
  try {
    const result = await ProductController.searchProducts(query);
    return result;
  } catch (error) {
    console.error('Product search handler error:', error);
    return {
      success: false,
      message: 'Failed to search products',
    };
  }
});

console.log('✓ Product IPC handlers registered');
