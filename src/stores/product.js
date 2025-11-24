import { ProductService } from '@/services/ProductService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const currentProduct = ref(null);
  const loading = ref(false);
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const hasProducts = computed(() => products.value.length > 0);

  /**
   * Fetch all products with filters
   */
  const fetchProducts = async (params = {}) => {
    loading.value = true;
    try {
      const result = await ProductService.getAllProducts(params);

      if (result.success) {
        products.value = result.data;
        pagination.value = result.pagination;
        return result;
      } else {
        throw new Error(result.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch product by ID
   */
  const fetchProductById = async (id) => {
    loading.value = true;
    try {
      const result = await ProductService.getProductById(id);

      if (result.success) {
        currentProduct.value = result.data;
        return result;
      } else {
        throw new Error(result.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Fetch product by ID error:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create new product
   */
  const createProduct = async (data) => {
    loading.value = true;
    try {
      const result = await ProductService.createProduct(data);

      if (result.success) {
        // Optionally add to products list
        if (result.data) {
          products.value.unshift(result.data);
        }
        return result;
      } else {
        throw new Error(result.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update product
   */
  const updateProduct = async (id, data) => {
    loading.value = true;
    try {
      const result = await ProductService.updateProduct(id, data);

      if (result.success) {
        // Update in products list
        const index = products.value.findIndex((p) => p.id === id);
        if (index !== -1 && result.data) {
          products.value[index] = result.data;
        }

        // Update current product if it's the same
        if (currentProduct.value && currentProduct.value.id === id) {
          currentProduct.value = result.data;
        }

        return result;
      } else {
        throw new Error(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete product
   */
  const deleteProduct = async (id) => {
    loading.value = true;
    try {
      const result = await ProductService.deleteProduct(id);

      if (result.success) {
        // Remove from products list
        products.value = products.value.filter((p) => p.id !== id);

        // Clear current product if it's the same
        if (currentProduct.value && currentProduct.value.id === id) {
          currentProduct.value = null;
        }

        return result;
      } else {
        throw new Error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Search products
   */
  const searchProducts = async (query) => {
    loading.value = true;
    try {
      const result = await ProductService.searchProducts(query);

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to search products');
      }
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Clear current product
   */
  const clearCurrentProduct = () => {
    currentProduct.value = null;
  };

  return {
    // State
    products,
    currentProduct,
    loading,
    pagination,

    // Getters
    hasProducts,

    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    clearCurrentProduct,
  };
});
