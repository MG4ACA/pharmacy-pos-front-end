import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'inventory/products',
        name: 'ProductList',
        component: () => import('@/views/inventory/ProductList.vue'),
      },
      {
        path: 'inventory/products/add',
        name: 'AddProduct',
        component: () => import('@/views/inventory/AddProduct.vue'),
      },
      {
        path: 'inventory/products/:id/edit',
        name: 'EditProduct',
        component: () => import('@/views/inventory/EditProduct.vue'),
      },
      {
        path: 'inventory/stock-entry',
        name: 'StockEntry',
        component: () => import('@/views/inventory/StockEntry.vue'),
      },
      {
        path: 'inventory/stock-history',
        name: 'StockHistory',
        component: () => import('@/views/inventory/StockHistory.vue'),
      },
      {
        path: 'suppliers',
        name: 'SupplierList',
        component: () => import('@/views/suppliers/SupplierList.vue'),
      },
      {
        path: 'sales/pos',
        name: 'POS',
        component: () => import('@/views/sales/POS.vue'),
      },
      {
        path: 'sales/history',
        name: 'SalesHistory',
        component: () => import('@/views/sales/SalesHistory.vue'),
      },
      {
        path: 'reports/daily-sales',
        name: 'DailySales',
        component: () => import('@/views/reports/DailySales.vue'),
      },
      {
        path: 'reports/stock',
        name: 'StockReport',
        component: () => import('@/views/reports/StockReport.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
