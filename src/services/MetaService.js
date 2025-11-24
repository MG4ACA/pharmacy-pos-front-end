import apiClient from '@/api/client';

export class MetaService {
  static async getProductTypes() {
    try {
      const result = await apiClient.get('/meta/product-types');
      // API returns { success, data }
      return result;
    } catch (error) {
      console.error('MetaService getProductTypes error:', error);
      throw new Error(error.message || 'Failed to fetch product types');
    }
  }

  static async getCategories() {
    try {
      const result = await apiClient.get('/meta/categories');
      // API returns { success, data }
      return result;
    } catch (error) {
      console.error('MetaService getCategories error:', error);
      throw new Error(error.message || 'Failed to fetch categories');
    }
  }
}
