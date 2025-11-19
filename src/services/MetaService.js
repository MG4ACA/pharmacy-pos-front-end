export class MetaService {
  static async getProductTypes() {
    try {
      const result = await window.electronAPI.getProductTypes();
      // Normalize response - controller returns { success, productTypes }
      if (result.success) {
        return {
          success: true,
          data: result.productTypes || [],
        };
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('MetaService getProductTypes error:', error);
      throw new Error('Failed to fetch product types');
    }
  }

  static async getCategories() {
    try {
      const result = await window.electronAPI.getCategories();
      // Normalize response - controller returns { success, categories }
      if (result.success) {
        return {
          success: true,
          data: result.categories || [],
        };
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error('MetaService getCategories error:', error);
      throw new Error('Failed to fetch categories');
    }
  }
}
