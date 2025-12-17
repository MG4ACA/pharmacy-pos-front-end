<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="sidebar-item"
        :class="{ 'has-children': item.children }"
      >
        <div class="sidebar-item-content">
          <i :class="item.icon" class="sidebar-item-icon"></i>
          <span class="sidebar-item-label">{{ item.label }}</span>
        </div>
      </router-link>

      <!-- Sales Section with Children -->
      <div class="sidebar-section">
        <div class="sidebar-item-content sidebar-section-header">
          <i class="pi pi-shopping-cart sidebar-item-icon"></i>
          <span class="sidebar-item-label">Sales</span>
        </div>
        <router-link
          v-for="child in salesItems"
          :key="child.path"
          :to="child.path"
          class="sidebar-item sidebar-child"
        >
          <div class="sidebar-item-content">
            <i :class="child.icon" class="sidebar-item-icon"></i>
            <span class="sidebar-item-label">{{ child.label }}</span>
          </div>
        </router-link>
      </div>

      <!-- Inventory Section with Children -->
      <div class="sidebar-section">
        <div class="sidebar-item-content sidebar-section-header">
          <i class="pi pi-box sidebar-item-icon"></i>
          <span class="sidebar-item-label">Inventory</span>
        </div>
        <router-link
          v-for="child in inventoryItems"
          :key="child.path"
          :to="child.path"
          class="sidebar-item sidebar-child"
        >
          <div class="sidebar-item-content">
            <i :class="child.icon" class="sidebar-item-icon"></i>
            <span class="sidebar-item-label">{{ child.label }}</span>
          </div>
        </router-link>
      </div>

      <router-link to="/suppliers" class="sidebar-item">
        <div class="sidebar-item-content">
          <i class="pi pi-building sidebar-item-icon"></i>
          <span class="sidebar-item-label">Suppliers</span>
        </div>
      </router-link>

      <!-- Reports Section with Children -->
      <div class="sidebar-section">
        <div class="sidebar-item-content sidebar-section-header">
          <i class="pi pi-chart-line sidebar-item-icon"></i>
          <span class="sidebar-item-label">Reports</span>
        </div>
        <router-link
          v-for="child in reportItems"
          :key="child.path"
          :to="child.path"
          class="sidebar-item sidebar-child"
        >
          <div class="sidebar-item-content">
            <i :class="child.icon" class="sidebar-item-icon"></i>
            <span class="sidebar-item-label">{{ child.label }}</span>
          </div>
        </router-link>
      </div>

      <router-link to="/export" class="sidebar-item">
        <div class="sidebar-item-content">
          <i class="pi pi-download sidebar-item-icon"></i>
          <span class="sidebar-item-label">Data Export</span>
        </div>
      </router-link>

      <router-link to="/settings" class="sidebar-item">
        <div class="sidebar-item-content">
          <i class="pi pi-cog sidebar-item-icon"></i>
          <span class="sidebar-item-label">Settings</span>
        </div>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
const menuItems = [{ path: '/dashboard', label: 'Dashboard', icon: 'pi pi-home' }];

const inventoryItems = [
  { path: '/inventory/products', label: 'Products', icon: 'pi pi-list' },
  { path: '/inventory/stock-receipts', label: 'Stock Receipts', icon: 'pi pi-file-import' },
  { path: '/inventory/stock-batches', label: 'Stock Batches', icon: 'pi pi-inbox' },
];

const salesItems = [
  { path: '/sales/pos', label: 'POS', icon: 'pi pi-calculator' },
  { path: '/sales/history', label: 'Sales History', icon: 'pi pi-list' },
];

const reportItems = [
  { path: '/reports/daily-sales', label: 'Daily Sales', icon: 'pi pi-calendar' },
  { path: '/reports/stock', label: 'Stock Report', icon: 'pi pi-box' },
  {
    path: '/reports/expiring-products',
    label: 'Expiring Products',
    icon: 'pi pi-exclamation-triangle',
  },
  { path: '/reports/top-selling', label: 'Top Selling', icon: 'pi pi-chart-line' },
  { path: '/reports/free-items', label: 'Free Items', icon: 'pi pi-gift' },
];
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--navbar-height));
  background-color: var(--surface-card);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  z-index: 999;
}

.sidebar-nav {
  padding: 1rem 0;
}

.sidebar-section {
  margin-bottom: 0.5rem;
}

.sidebar-section-header {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: default;
}

.sidebar-item {
  display: block;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
}

.sidebar-item-content {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
}

.sidebar-child .sidebar-item-content {
  padding-left: 3rem;
}

.sidebar-item:hover {
  background-color: var(--surface-ground);
}

.sidebar-item.router-link-active {
  background-color: #eff6ff;
  border-left: 3px solid var(--primary-color);
}

.sidebar-item.router-link-active .sidebar-item-label {
  color: var(--primary-color);
  font-weight: 600;
}

.sidebar-item-icon {
  font-size: 1.125rem;
  margin-right: 0.75rem;
  width: 1.25rem;
}

.sidebar-item-label {
  font-size: 0.9375rem;
}
</style>
