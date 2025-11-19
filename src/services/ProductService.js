export class ProductService {
  /**
   * Get all products with optional filters and pagination
   */
  static async getAllProducts(params = {}) {
    try {
      return await window.electronAPI.getAllProducts(params);
    } catch (error) {
      console.error('ProductService getAllProducts error:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id) {
    try {
      return await window.electronAPI.getProductById(id);
    } catch (error) {
      console.error('ProductService getProductById error:', error);
      throw error;
    }
  }

  /**
   * Create new product
   */
  static async createProduct(data) {
    try {
      return await window.electronAPI.createProduct(data);
    } catch (error) {
      console.error('ProductService createProduct error:', error);
      throw error;
    }
  }

  /**
   * Update product
   */
  static async updateProduct(id, data) {
    try {
      return await window.electronAPI.updateProduct(id, data);
    } catch (error) {
      console.error('ProductService updateProduct error:', error);
      throw error;
    }
  }

  /**
   * Delete product
   */
  static async deleteProduct(id) {
    try {
      return await window.electronAPI.deleteProduct(id);
    } catch (error) {
      console.error('ProductService deleteProduct error:', error);
      throw error;
    }
  }

  /**
   * Search products by name or barcode
   */
  static async searchProducts(query) {
    try {
      return await window.electronAPI.searchProducts(query);
    } catch (error) {
      console.error('ProductService searchProducts error:', error);
      throw error;
    }
  }
}
