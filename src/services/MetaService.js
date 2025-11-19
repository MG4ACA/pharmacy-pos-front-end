export class MetaService {
  static async getProductTypes() {
    try {
      const result = await window.electronAPI.getProductTypes();
      return result;
    } catch (error) {
      console.error('MetaService getProductTypes error:', error);
      throw new Error('Failed to fetch product types');
    }
  }

  static async getCategories() {
    try {
      const result = await window.electronAPI.getCategories();
      return result;
    } catch (error) {
      console.error('MetaService getCategories error:', error);
      throw new Error('Failed to fetch categories');
    }
  }
}
