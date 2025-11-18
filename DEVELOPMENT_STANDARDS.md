# Development Standards & Guidelines

## 📋 Overview

This document defines the coding standards, architectural patterns, and best practices to maintain consistency across all development phases of the Pharmacy POS System.

**IMPORTANT**: Review this document before starting any new feature implementation or phase.

---

## 🏛️ Architecture & Project Structure

### Tech Stack

- **Frontend Framework**: Vue 3 (Composition API with `<script setup>`)
- **UI Library**: PrimeVue (Offline-first, bundled with application)
- **CSS Framework**: PrimeFlex (Utility-first CSS)
- **Desktop Framework**: Electron.js
- **Database**: MySQL 8.0.39
- **ORM**: Sequelize
- **State Management**: Pinia
- **Build Tool**: Vite
- **Node.js Version**: v20.19.1

### Offline-First Considerations

**IMPORTANT**: This system is designed to run locally without internet connection.

- ✅ Use PrimeVue and PrimeFlex (bundled with application)
- ✅ All assets (fonts, icons, images) must be bundled
- ✅ No CDN dependencies
- ✅ Local MySQL database
- ❌ No external API calls
- ❌ No online fonts (Google Fonts, etc.)

### Layered Architecture

```
Presentation Layer (Vue Components + PrimeVue)
         ↓
State Management Layer (Pinia Stores)
         ↓
Service Layer (API Services)
         ↓
IPC Layer (Electron IPC Communication)
         ↓
Business Logic Layer (Electron Main Process)
         ↓
Data Access Layer (Sequelize Models)
         ↓
Database (MySQL 8.0.39)
```

### Database Configuration

**MySQL Credentials** (Development):

- Host: `localhost`
- Port: `3306`
- Database: `pharmacy_pos`
- Username: `root`
- Password: `1234`
- Version: MySQL 8.0.39

**Default User** (Created on first run):

- Username: `admin`
- Password: `admin123` (MUST be changed on first login)
- Full Name: `System Administrator`

### Folder Structure Standards

```
src/
├── views/              # Page-level components (one per route)
├── components/         # Reusable UI components
│   ├── common/        # Generic reusable components (Button, Input, Modal)
│   ├── layout/        # Layout components (Navbar, Sidebar, Footer)
│   └── features/      # Feature-specific components
├── stores/            # Pinia state management
├── services/          # API/IPC service classes
├── composables/       # Reusable Vue composition functions
├── utils/             # Utility functions
├── constants/         # Application constants
├── types/             # TypeScript types/interfaces (if using TS)
└── assets/            # Static assets

electron/
├── main.js            # Electron main process
├── preload.js         # Preload scripts
├── database/
│   ├── connection.js  # Database connection
│   ├── models/        # Sequelize models
│   └── migrations/    # Database migrations
├── services/          # Business logic services
├── controllers/       # IPC request handlers
└── utils/             # Server-side utilities
```

---

## 🎨 UI/UX Standards

### Design System

#### Color Palette

```css
/* Primary Colors */
--primary: #3b82f6; /* Blue - Primary actions */
--primary-dark: #2563eb;
--primary-light: #93c5fd;

/* Secondary Colors */
--secondary: #10b981; /* Green - Success states */
--secondary-dark: #059669;
--secondary-light: #6ee7b7;

/* Semantic Colors */
--success: #10b981; /* Green */
--warning: #f59e0b; /* Amber - Low stock, warnings */
--error: #ef4444; /* Red - Errors, expired items */
--info: #3b82f6; /* Blue */

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-500: #6b7280;
--gray-700: #374151;
--gray-900: #111827;

/* Background */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-dark: #1f2937;

/* Text */
--text-primary: #111827;
--text-secondary: #6b7280;
--text-light: #9ca3af;
```

#### Typography

```css
/* Font Family */
--font-primary: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Spacing

```css
/* Use 4px base unit */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
```

#### Border Radius

```css
--radius-sm: 0.25rem; /* 4px */
--radius-md: 0.5rem; /* 8px */
--radius-lg: 0.75rem; /* 12px */
--radius-xl: 1rem; /* 16px */
--radius-full: 9999px; /* Fully rounded */
```

### Component Standards

**IMPORTANT**: Use PrimeVue components throughout the application for consistency.

#### Buttons (PrimeVue)

```vue
<!-- Primary Button -->
<Button label="Save" icon="pi pi-check" />

<!-- Secondary Button -->
<Button label="Cancel" severity="secondary" icon="pi pi-times" />

<!-- Danger Button -->
<Button label="Delete" severity="danger" icon="pi pi-trash" />

<!-- Success Button -->
<Button label="Add" severity="success" icon="pi pi-plus" />

<!-- Text Button -->
<Button label="View" text />

<!-- Icon Only -->
<Button icon="pi pi-search" rounded />

<!-- Sizes: small, normal (default), large -->
<Button label="Small" size="small" />
<Button label="Large" size="large" />

<!-- Loading State -->
<Button label="Processing" :loading="isLoading" />
```

#### Input Fields (PrimeVue)

```vue
<!-- Text Input -->
<div class="field">
  <label for="productName">Product Name <span class="p-error">*</span></label>
  <InputText 
    id="productName" 
    v-model="formData.name" 
    placeholder="Enter product name"
    :class="{ 'p-invalid': errors.name }"
  />
  <small class="p-error" v-if="errors.name">{{ errors.name }}</small>
</div>

<!-- Number Input -->
<div class="field">
  <label for="price">Price</label>
  <InputNumber 
    id="price" 
    v-model="formData.price" 
    mode="currency" 
    currency="LKR" 
    locale="en-LK"
  />
</div>

<!-- Dropdown -->
<div class="field">
  <label for="category">Category</label>
  <Dropdown 
    id="category" 
    v-model="formData.category_id" 
    :options="categories" 
    optionLabel="name" 
    optionValue="id"
    placeholder="Select Category"
  />
</div>

<!-- Date Input -->
<div class="field">
  <label for="expiryDate">Expiry Date</label>
  <Calendar 
    id="expiryDate" 
    v-model="formData.expiry_date" 
    dateFormat="yy-mm-dd"
    showIcon
  />
</div>

<!-- Textarea -->
<div class="field">
  <label for="description">Description</label>
  <Textarea 
    id="description" 
    v-model="formData.description" 
    rows="3" 
    autoResize
  />
</div>
```

#### Cards (PrimeVue)

```vue
<!-- Standard Card -->
<Card>
  <template #title>Card Title</template>
  <template #content>
    <p>Card content goes here</p>
  </template>
  <template #footer>
    <Button label="Action" />
  </template>
</Card>

<!-- Dashboard Widget Card -->
<Card class="dashboard-card">
  <template #title>
    <div class="flex align-items-center justify-content-between">
      <span>Today's Sales</span>
      <i class="pi pi-chart-line text-primary"></i>
    </div>
  </template>
  <template #content>
    <div class="text-3xl font-bold text-primary">LKR 45,000</div>
    <div class="text-sm text-500 mt-2">+12% from yesterday</div>
  </template>
</Card>
```

#### Tables (PrimeVue DataTable)

```vue
<!-- DataTable with Actions -->
<DataTable
  :value="products"
  :paginator="true"
  :rows="20"
  :loading="isLoading"
  stripedRows
  responsiveLayout="scroll"
  class="p-datatable-sm"
>
  <template #empty>
    <div class="text-center p-4">
      <i class="pi pi-inbox text-4xl text-400"></i>
      <p class="mt-2 text-500">No products found</p>
    </div>
  </template>
  
  <Column field="name" header="Product Name" sortable></Column>
  <Column field="barcode" header="Barcode" sortable></Column>
  <Column field="category.name" header="Category"></Column>
  <Column field="selling_price" header="Price" sortable>
    <template #body="{ data }">
      {{ formatCurrency(data.selling_price) }}
    </template>
  </Column>
  <Column field="total_quantity" header="Stock" sortable>
    <template #body="{ data }">
      <Tag 
        :value="data.total_quantity" 
        :severity="data.total_quantity <= data.reorder_level ? 'warning' : 'success'"
      />
    </template>
  </Column>
  <Column header="Actions" :exportable="false">
    <template #body="{ data }">
      <Button 
        icon="pi pi-pencil" 
        severity="info" 
        text 
        rounded 
        @click="editProduct(data.id)"
      />
      <Button 
        icon="pi pi-trash" 
        severity="danger" 
        text 
        rounded 
        @click="deleteProduct(data.id)"
      />
    </template>
  </Column>
</DataTable>
```

#### Status Badges (PrimeVue Tag)

```vue
<Tag value="Active" severity="success" />
<Tag value="Low Stock" severity="warning" icon="pi pi-exclamation-triangle" />
<Tag value="Expired" severity="danger" icon="pi pi-times-circle" />
<Tag value="New" severity="info" icon="pi pi-star" />
<Tag value="Inactive" severity="secondary" />
```

#### Notifications (PrimeVue Toast)

```vue
<!-- In component -->
<Toast />

<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// Success
toast.add({
  severity: 'success',
  summary: 'Success',
  detail: 'Product created successfully',
  life: 3000,
});

// Error
toast.add({
  severity: 'error',
  summary: 'Error',
  detail: 'Failed to save product',
  life: 5000,
});

// Warning
toast.add({
  severity: 'warn',
  summary: 'Warning',
  detail: 'Stock level is low',
  life: 4000,
});

// Info
toast.add({
  severity: 'info',
  summary: 'Info',
  detail: 'Product already exists',
  life: 3000,
});
</script>
```

#### Dialogs (PrimeVue Dialog)

```vue
<Dialog
  v-model:visible="showDialog"
  header="Confirm Delete"
  :modal="true"
  :style="{ width: '450px' }"
>
  <div class="flex align-items-center">
    <i class="pi pi-exclamation-triangle text-4xl text-orange-500 mr-3"></i>
    <span>Are you sure you want to delete this product?</span>
  </div>
  <template #footer>
    <Button label="Cancel" severity="secondary" @click="showDialog = false" />
    <Button label="Delete" severity="danger" @click="confirmDelete" />
  </template>
</Dialog>
```

### Layout Standards

#### Dashboard Grid

- Use 12-column grid system
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Card-based dashboard widgets

#### Navigation

- **Sidebar**: Fixed left sidebar (240px width) with collapsible option
- **Navbar**: Top navbar (64px height) with user info and quick actions
- **Breadcrumbs**: Show current location for nested pages

#### Responsive Behavior

- Mobile: Stack all elements vertically, hide sidebar (hamburger menu)
- Tablet: 2-column layouts where applicable
- Desktop: Full layout with sidebar

---

## 💻 Code Style & Standards

### Vue Component Structure

```vue
<template>
  <!-- 
    Template Guidelines:
    - Use semantic HTML
    - Keep templates clean and readable
    - Extract complex logic to computed properties
    - Use v-if for conditional rendering, v-show for toggle visibility
  -->
  <div class="component-name">
    <!-- Component content -->
  </div>
</template>

<script setup>
// 1. Imports (grouped by category)
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useProductStore } from '@/stores/product';
import ProductService from '@/services/ProductService';
import { formatCurrency, formatDate } from '@/utils/formatters';

// PrimeVue Components (auto-imported if configured)
// import Button from 'primevue/button'
// import InputText from 'primevue/inputtext'
// import DataTable from 'primevue/datatable'

// 2. Props
const props = defineProps({
  productId: {
    type: [String, Number],
    required: true,
  },
  mode: {
    type: String,
    default: 'view',
    validator: (value) => ['view', 'edit'].includes(value),
  },
});

// 3. Emits
const emit = defineEmits(['update', 'delete', 'close']);

// 4. Composables & Stores
const router = useRouter();
const productStore = useProductStore();

// 5. Reactive State
const isLoading = ref(false);
const formData = ref({
  name: '',
  price: 0,
  quantity: 0,
});
const errors = ref({});

// 6. Computed Properties
const isValid = computed(() => {
  return formData.value.name && formData.value.price > 0;
});

const formattedPrice = computed(() => {
  return formatCurrency(formData.value.price);
});

// 7. Methods (grouped by purpose)
const loadProduct = async () => {
  try {
    isLoading.value = true;
    const product = await ProductService.getById(props.productId);
    formData.value = { ...product };
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

const saveProduct = async () => {
  if (!validate()) return;

  try {
    isLoading.value = true;
    const result = await ProductService.update(props.productId, formData.value);
    emit('update', result);
    showSuccess('Product updated successfully');
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
};

const validate = () => {
  errors.value = {};

  if (!formData.value.name) {
    errors.value.name = 'Product name is required';
  }

  if (formData.value.price <= 0) {
    errors.value.price = 'Price must be greater than 0';
  }

  return Object.keys(errors.value).length === 0;
};

const toast = useToast();

const handleError = (error) => {
  console.error('Error:', error);
  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: error.message || 'An error occurred',
    life: 5000,
  });
};

const showSuccess = (message) => {
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: message,
    life: 3000,
  });
};

// 8. Lifecycle Hooks
onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
/* 
  Style Guidelines:
  - Prefer PrimeFlex utility classes over custom CSS
  - Use scoped styles only for component-specific customizations
  - Use PrimeVue design tokens (CSS variables)
  - Avoid deep selectors unless necessary
  
  PrimeFlex Examples:
  - Spacing: p-4, m-2, mt-3, mb-4, mx-auto
  - Flex: flex, align-items-center, justify-content-between
  - Grid: grid, col-12, md:col-6, lg:col-4
  - Text: text-xl, font-bold, text-center, text-primary
*/

/* Only add custom styles when PrimeFlex utilities are insufficient */
.component-name__custom {
  /* Use PrimeVue design tokens */
  background-color: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  padding: var(--inline-spacing);
}
</style>
```

### Naming Conventions

#### Vue Components

```javascript
// PascalCase for component names
ProductList.vue
AddProduct.vue
EditProduct.vue
StockEntryForm.vue

// Component file should match component name
// ✅ Good
ProductList.vue → <script setup> (implied name: ProductList)

// ❌ Bad
product-list.vue
productList.vue
```

#### Variables & Functions

```javascript
// camelCase for variables and functions
const productName = 'Aspirin';
const isLoading = false;
const totalAmount = 100;

function calculateTotal() {}
function fetchProducts() {}
async function saveProduct() {}

// Boolean variables should start with is/has/should
const isActive = true;
const hasPermission = false;
const shouldShowModal = true;
```

#### Constants

```javascript
// UPPER_SNAKE_CASE for constants
const MAX_ITEMS_PER_PAGE = 50;
const API_BASE_URL = 'http://localhost:3000';
const DEFAULT_CURRENCY = 'LKR';
```

#### CSS Classes

```css
/* BEM (Block Element Modifier) naming */
.product-card {
}
.product-card__header {
}
.product-card__title {
}
.product-card__price {
}
.product-card--featured {
}
.product-card--expired {
}
```

### Code Organization

#### File Naming

```
views/
  ProductList.vue          # PascalCase for components
  AddProduct.vue

services/
  ProductService.js        # PascalCase + 'Service' suffix
  StockService.js

stores/
  product.js               # lowercase for stores
  auth.js

utils/
  formatters.js            # lowercase for utilities
  validators.js

constants/
  productTypes.js          # lowercase
  categories.js
```

---

## 🔧 Service Layer Pattern

### Service Class Structure

```javascript
// src/services/ProductService.js
class ProductService {
  /**
   * Get all products with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of products
   */
  async getAll(filters = {}) {
    try {
      const response = await window.api.invoke('product:getAll', filters);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'Failed to fetch products');
    }
  }

  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product details
   */
  async getById(id) {
    try {
      if (!id) throw new Error('Product ID is required');

      const response = await window.api.invoke('product:getById', { id });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'Failed to fetch product');
    }
  }

  /**
   * Create new product
   * @param {Object} data - Product data
   * @returns {Promise<Object>} Created product
   */
  async create(data) {
    try {
      this.validateProductData(data);

      const response = await window.api.invoke('product:create', data);
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'Failed to create product');
    }
  }

  /**
   * Update existing product
   * @param {number} id - Product ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated product
   */
  async update(id, data) {
    try {
      if (!id) throw new Error('Product ID is required');
      this.validateProductData(data);

      const response = await window.api.invoke('product:update', { id, data });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'Failed to update product');
    }
  }

  /**
   * Delete product
   * @param {number} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    try {
      if (!id) throw new Error('Product ID is required');

      const response = await window.api.invoke('product:delete', { id });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'Failed to delete product');
    }
  }

  /**
   * Search products by name or barcode
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching products
   */
  async search(query) {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters');
      }

      const response = await window.api.invoke('product:search', { query });
      return this.handleResponse(response);
    } catch (error) {
      this.handleError(error, 'Failed to search products');
    }
  }

  // Private helper methods
  validateProductData(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Product name is required');
    }
    if (!data.selling_price || data.selling_price <= 0) {
      throw new Error('Valid selling price is required');
    }
    // Add more validation as needed
  }

  handleResponse(response) {
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error || 'Unknown error occurred');
  }

  handleError(error, defaultMessage) {
    console.error(defaultMessage, error);
    throw new Error(error.message || defaultMessage);
  }
}

export default new ProductService();
```

### IPC Channel Naming Convention

```javascript
// Format: <resource>:<action>
'product:getAll';
'product:getById';
'product:create';
'product:update';
'product:delete';
'product:search';

'stock:addEntry';
'stock:getByProduct';
'stock:updateQuantity';

'sale:create';
'sale:getHistory';
'sale:getById';

'supplier:getAll';
'supplier:create';
'supplier:update';
```

---

## 📦 State Management (Pinia)

### Store Structure

```javascript
// src/stores/product.js
import { defineStore } from 'pinia';
import ProductService from '@/services/ProductService';

export const useProductStore = defineStore('product', {
  // State
  state: () => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    filters: {
      search: '',
      category: null,
      status: 'active',
    },
    pagination: {
      page: 1,
      perPage: 20,
      total: 0,
    },
  }),

  // Getters
  getters: {
    filteredProducts: (state) => {
      let result = state.products;

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        result = result.filter(
          (p) => p.name.toLowerCase().includes(search) || p.barcode.includes(search)
        );
      }

      if (state.filters.category) {
        result = result.filter((p) => p.category_id === state.filters.category);
      }

      if (state.filters.status) {
        result = result.filter((p) => p.status === state.filters.status);
      }

      return result;
    },

    getProductById: (state) => (id) => {
      return state.products.find((p) => p.id === id);
    },

    lowStockProducts: (state) => {
      return state.products.filter((p) => p.total_quantity <= p.reorder_level);
    },

    expiringProducts: (state) => {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      return state.products.filter((p) => {
        if (!p.expiry_date) return false;
        return new Date(p.expiry_date) <= thirtyDaysFromNow;
      });
    },
  },

  // Actions
  actions: {
    async fetchProducts() {
      try {
        this.isLoading = true;
        this.error = null;

        const data = await ProductService.getAll(this.filters);
        this.products = data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch products:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProductById(id) {
      try {
        this.isLoading = true;
        this.error = null;

        const data = await ProductService.getById(id);
        this.currentProduct = data;
        return data;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch product:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async createProduct(productData) {
      try {
        this.isLoading = true;
        this.error = null;

        const newProduct = await ProductService.create(productData);
        this.products.push(newProduct);
        return newProduct;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to create product:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateProduct(id, productData) {
      try {
        this.isLoading = true;
        this.error = null;

        const updatedProduct = await ProductService.update(id, productData);

        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        if (this.currentProduct?.id === id) {
          this.currentProduct = updatedProduct;
        }

        return updatedProduct;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to update product:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteProduct(id) {
      try {
        this.isLoading = true;
        this.error = null;

        await ProductService.delete(id);

        this.products = this.products.filter((p) => p.id !== id);

        if (this.currentProduct?.id === id) {
          this.currentProduct = null;
        }
      } catch (error) {
        this.error = error.message;
        console.error('Failed to delete product:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async searchProducts(query) {
      try {
        this.isLoading = true;
        this.error = null;

        const results = await ProductService.search(query);
        return results;
      } catch (error) {
        this.error = error.message;
        console.error('Failed to search products:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    setFilter(key, value) {
      this.filters[key] = value;
    },

    resetFilters() {
      this.filters = {
        search: '',
        category: null,
        status: 'active',
      };
    },

    clearError() {
      this.error = null;
    },
  },
});
```

---

## 🗄️ Database Layer (Electron Main Process)

### Model Definition

```javascript
// electron/database/models/Product.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Product name is required' },
          len: {
            args: [2, 255],
            msg: 'Product name must be between 2 and 255 characters',
          },
        },
      },
      generic_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      barcode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: { msg: 'Barcode must be unique' },
        validate: {
          notEmpty: { msg: 'Barcode is required' },
        },
      },
      product_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'product_types',
          key: 'id',
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      prescription_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reorder_level: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        validate: {
          min: { args: [0], msg: 'Reorder level cannot be negative' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
    },
    {
      tableName: 'products',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['barcode'] },
        { fields: ['name'] },
        { fields: ['category_id'] },
        { fields: ['status'] },
      ],
    }
  );

  // Class Methods
  Product.associate = (models) => {
    Product.belongsTo(models.ProductType, {
      foreignKey: 'product_type_id',
      as: 'productType',
    });

    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });

    Product.hasMany(models.StockEntry, {
      foreignKey: 'product_id',
      as: 'stockEntries',
    });

    Product.hasMany(models.SaleItem, {
      foreignKey: 'product_id',
      as: 'saleItems',
    });
  };

  // Instance Methods
  Product.prototype.getTotalStock = async function () {
    const StockEntry = sequelize.models.StockEntry;
    const result = await StockEntry.sum('remaining_quantity', {
      where: { product_id: this.id },
    });
    return result || 0;
  };

  return Product;
};
```

### Controller/Handler Pattern

```javascript
// electron/controllers/ProductController.js
const { Product, ProductType, Category, StockEntry } = require('../database/models');
const { Op } = require('sequelize');

class ProductController {
  /**
   * Get all products with related data
   */
  async getAll(event, filters = {}) {
    try {
      const where = {};

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.category_id) {
        where.category_id = filters.category_id;
      }

      const products = await Product.findAll({
        where,
        include: [
          {
            model: ProductType,
            as: 'productType',
            attributes: ['id', 'name'],
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
          {
            model: StockEntry,
            as: 'stockEntries',
            attributes: ['remaining_quantity'],
            required: false,
          },
        ],
        order: [['name', 'ASC']],
      });

      // Calculate total stock for each product
      const productsWithStock = products.map((product) => {
        const productData = product.toJSON();
        productData.total_quantity =
          productData.stockEntries?.reduce((sum, entry) => sum + entry.remaining_quantity, 0) || 0;
        delete productData.stockEntries; // Remove to reduce payload
        return productData;
      });

      return {
        success: true,
        data: productsWithStock,
      };
    } catch (error) {
      console.error('ProductController.getAll error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get single product by ID
   */
  async getById(event, { id }) {
    try {
      const product = await Product.findByPk(id, {
        include: [
          { model: ProductType, as: 'productType' },
          { model: Category, as: 'category' },
          {
            model: StockEntry,
            as: 'stockEntries',
            where: { remaining_quantity: { [Op.gt]: 0 } },
            required: false,
            order: [['stock_entry_date', 'ASC']],
          },
        ],
      });

      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      const productData = product.toJSON();
      productData.total_quantity = await product.getTotalStock();

      return {
        success: true,
        data: productData,
      };
    } catch (error) {
      console.error('ProductController.getById error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create new product
   */
  async create(event, data) {
    try {
      const product = await Product.create(data);

      return {
        success: true,
        data: product.toJSON(),
      };
    } catch (error) {
      console.error('ProductController.create error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update product
   */
  async update(event, { id, data }) {
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      await product.update(data);

      return {
        success: true,
        data: product.toJSON(),
      };
    } catch (error) {
      console.error('ProductController.update error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete product (soft delete by setting status to inactive)
   */
  async delete(event, { id }) {
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      // Check if product has stock
      const totalStock = await product.getTotalStock();
      if (totalStock > 0) {
        return {
          success: false,
          error: 'Cannot delete product with existing stock',
        };
      }

      // Soft delete
      await product.update({ status: 'inactive' });

      return {
        success: true,
        data: { id },
      };
    } catch (error) {
      console.error('ProductController.delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Search products by name or barcode
   */
  async search(event, { query }) {
    try {
      const products = await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { barcode: { [Op.like]: `%${query}%` } },
          ],
          status: 'active',
        },
        include: [
          { model: ProductType, as: 'productType' },
          { model: Category, as: 'category' },
        ],
        limit: 20,
      });

      return {
        success: true,
        data: products.map((p) => p.toJSON()),
      };
    } catch (error) {
      console.error('ProductController.search error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new ProductController();
```

### IPC Registration

```javascript
// electron/main.js
const { ipcMain } = require('electron');
const ProductController = require('./controllers/ProductController');
const StockController = require('./controllers/StockController');
const SaleController = require('./controllers/SaleController');

// Register all IPC handlers
function registerIpcHandlers() {
  // Product handlers
  ipcMain.handle('product:getAll', ProductController.getAll.bind(ProductController));
  ipcMain.handle('product:getById', ProductController.getById.bind(ProductController));
  ipcMain.handle('product:create', ProductController.create.bind(ProductController));
  ipcMain.handle('product:update', ProductController.update.bind(ProductController));
  ipcMain.handle('product:delete', ProductController.delete.bind(ProductController));
  ipcMain.handle('product:search', ProductController.search.bind(ProductController));

  // Stock handlers
  ipcMain.handle('stock:addEntry', StockController.addEntry.bind(StockController));
  ipcMain.handle('stock:getByProduct', StockController.getByProduct.bind(StockController));

  // Sale handlers
  ipcMain.handle('sale:create', SaleController.create.bind(SaleController));
  ipcMain.handle('sale:getHistory', SaleController.getHistory.bind(SaleController));
}

module.exports = { registerIpcHandlers };
```

---

## ⚠️ Error Handling

### Frontend Error Handling

```javascript
// utils/errorHandler.js
export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);

  let message = 'An unexpected error occurred';

  if (error instanceof AppError) {
    message = error.message;
  } else if (error.message) {
    message = error.message;
  }

  // Show notification to user
  showNotification({
    type: 'error',
    title: 'Error',
    message: message,
  });

  return message;
};

// Usage in component
try {
  await productStore.createProduct(formData.value);
  showNotification({
    type: 'success',
    title: 'Success',
    message: 'Product created successfully',
  });
} catch (error) {
  handleError(error, 'Create Product');
}
```

### Backend Error Handling

```javascript
// electron/utils/errorHandler.js
class DatabaseError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

class ValidationError extends Error {
  constructor(message, fields = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

const handleControllerError = (error, context = '') => {
  console.error(`Controller Error [${context}]:`, error);

  if (error.name === 'SequelizeValidationError') {
    const fields = {};
    error.errors.forEach((err) => {
      fields[err.path] = err.message;
    });
    return {
      success: false,
      error: 'Validation failed',
      fields,
    };
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return {
      success: false,
      error: 'Record already exists with this value',
    };
  }

  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
  };
};

module.exports = {
  DatabaseError,
  ValidationError,
  handleControllerError,
};
```

---

## ✅ Validation Standards

### Frontend Validation

```javascript
// utils/validators.js
export const validators = {
  required: (value) => {
    return !!value || 'This field is required';
  },

  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Invalid email address';
  },

  minLength: (min) => (value) => {
    return (value && value.length >= min) || `Minimum ${min} characters required`;
  },

  maxLength: (max) => (value) => {
    return (value && value.length <= max) || `Maximum ${max} characters allowed`;
  },

  numeric: (value) => {
    return !isNaN(value) || 'Must be a number';
  },

  positive: (value) => {
    return value > 0 || 'Must be greater than 0';
  },

  barcode: (value) => {
    const pattern = /^[0-9]{8,13}$/;
    return pattern.test(value) || 'Invalid barcode format';
  },

  phone: (value) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(value) || 'Phone number must be 10 digits';
  },

  date: (value) => {
    return !isNaN(Date.parse(value)) || 'Invalid date format';
  },

  futureDate: (value) => {
    return new Date(value) > new Date() || 'Date must be in the future';
  },
};

// Form validation composable
export const useFormValidation = () => {
  const errors = ref({});

  const validate = (rules, data) => {
    errors.value = {};
    let isValid = true;

    for (const field in rules) {
      for (const rule of rules[field]) {
        const result = rule(data[field]);
        if (result !== true) {
          errors.value[field] = result;
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  };

  return {
    errors,
    validate,
  };
};

// Usage example
const { errors, validate } = useFormValidation();

const rules = {
  name: [validators.required, validators.minLength(2)],
  barcode: [validators.required, validators.barcode],
  selling_price: [validators.required, validators.numeric, validators.positive],
};

const isValid = validate(rules, formData.value);
```

---

## 🧪 Testing Standards

### Component Testing

```javascript
// ProductList.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ProductList from '@/views/Inventory/ProductList.vue';

describe('ProductList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders product list', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.find('.product-list').exists()).toBe(true);
  });

  it('displays products from store', async () => {
    const wrapper = mount(ProductList);
    // Add test assertions
  });

  it('handles search functionality', async () => {
    const wrapper = mount(ProductList);
    const searchInput = wrapper.find('input[type="search"]');
    await searchInput.setValue('Aspirin');
    // Add test assertions
  });
});
```

---

## 📝 Documentation Standards

### Function/Method Documentation

```javascript
/**
 * Calculate total amount for sale items
 *
 * @param {Array<Object>} items - Array of sale items
 * @param {number} items[].quantity - Quantity of item
 * @param {number} items[].unit_price - Unit price of item
 * @param {number} discount - Discount percentage (0-100)
 * @param {number} tax - Tax percentage (0-100)
 * @returns {Object} Calculation result
 * @returns {number} return.subtotal - Subtotal before discount and tax
 * @returns {number} return.discountAmount - Discount amount
 * @returns {number} return.taxAmount - Tax amount
 * @returns {number} return.total - Final total amount
 *
 * @example
 * const result = calculateTotal(
 *   [{quantity: 2, unit_price: 100}],
 *   10, // 10% discount
 *   15  // 15% tax
 * )
 * // result: { subtotal: 200, discountAmount: 20, taxAmount: 27, total: 207 }
 */
function calculateTotal(items, discount = 0, tax = 0) {
  // Implementation
}
```

### Component Documentation

```vue
<script setup>
/**
 * ProductCard Component
 *
 * Displays product information in a card format
 *
 * @component
 * @example
 * <ProductCard
 *   :product="product"
 *   @edit="handleEdit"
 *   @delete="handleDelete"
 * />
 */

/**
 * @typedef {Object} Product
 * @property {number} id - Product ID
 * @property {string} name - Product name
 * @property {number} selling_price - Selling price
 * @property {number} total_quantity - Total available quantity
 */

/**
 * Product data
 * @type {Product}
 */
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

/**
 * Emitted when edit button is clicked
 * @event edit
 * @type {number} Product ID
 */

/**
 * Emitted when delete button is clicked
 * @event delete
 * @type {number} Product ID
 */
const emit = defineEmits(['edit', 'delete']);
</script>
```

---

## 📷 Barcode Scanning (Future Implementation)

**Note**: Barcode scanning will be implemented in Phase 2.

### Planned Approach:

- **USB Barcode Scanner**: Treated as keyboard input (primary method)
- **Webcam Scanning**: QuaggaJS library (backup method)
- Search products on barcode scan
- Auto-add to cart in POS

### Implementation Guidelines (when ready):

1. Listen for keyboard events in POS component
2. Detect barcode patterns (typically end with Enter key)
3. Auto-trigger product search
4. Handle multiple rapid scans
5. Provide visual feedback on successful scan

---

## 🚀 Performance Best Practices

1. **Use `v-show` for frequent toggles, `v-if` for conditional rendering**
2. **Implement pagination for large lists** (max 50 items per page)
3. **Debounce search inputs** (300ms delay)
4. **Lazy load components** with `defineAsyncComponent`
5. **Use `computed` for derived state** instead of methods
6. **Avoid deep watchers** unless necessary
7. **Use `shallowRef` for large objects** that don't need deep reactivity
8. **Index database columns** used in WHERE, ORDER BY, and JOIN clauses
9. **Limit database queries** with proper pagination
10. **Cache frequently accessed data** in Pinia stores

---

## 🔒 Security Best Practices

1. **Never store plain text passwords** - Always hash with bcrypt
2. **Validate all user inputs** on both frontend and backend
3. **Use parameterized queries** (Sequelize handles this)
4. **Sanitize data before display** to prevent XSS
5. **Implement SQL injection prevention** via ORM
6. **Log security-related events** (login attempts, data changes)
7. **Use environment variables** for sensitive configuration
8. **Implement session timeout** for idle users
9. **Validate file uploads** if implementing import functionality
10. **Regular database backups**

---

## 📋 Pre-Implementation Checklist

Before starting any new feature or phase:

- [ ] Read this document thoroughly
- [ ] Review the database schema for related tables
- [ ] Check existing similar components for patterns
- [ ] Plan the folder structure for new files
- [ ] Identify reusable components
- [ ] Define Pinia store structure if needed
- [ ] Plan IPC channels and handlers
- [ ] Define validation rules
- [ ] Plan error handling strategy
- [ ] Consider responsive design requirements
- [ ] Plan for loading and empty states
- [ ] Review security implications

---

## 🔄 Code Review Checklist

Before committing code:

- [ ] Code follows naming conventions
- [ ] Components follow the standard structure
- [ ] Error handling is implemented
- [ ] Validation is implemented on both frontend and backend
- [ ] Loading states are handled
- [ ] Empty states are handled
- [ ] Success/error notifications are shown to user
- [ ] Code is properly commented
- [ ] No console.logs in production code
- [ ] Responsive design is implemented
- [ ] Accessibility considerations (ARIA labels, keyboard navigation)
- [ ] No hard-coded values (use constants)
- [ ] Database queries are optimized
- [ ] IPC channels follow naming convention

---

**Last Updated**: November 18, 2025  
**Version**: 1.0.0

**Remember**: Consistency is key. When in doubt, refer to this document!
