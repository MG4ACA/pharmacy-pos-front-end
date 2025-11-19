# Pharmacy POS System - Project Plan

## 📌 Important Notice

**BEFORE STARTING ANY IMPLEMENTATION TASK:**

1. ✅ Read and review `DEVELOPMENT_STANDARDS.md` thoroughly
2. ✅ Follow the coding standards, naming conventions, and patterns
3. ✅ Use PrimeVue components as specified
4. ✅ Ensure offline-first approach (no CDN, no external APIs)
5. ✅ Test each feature before moving to the next

---

## 🎯 Project Overview

**System Type**: Standalone Desktop Application (Offline-First)  
**Target Users**: Single pharmacy/general store  
**Development Approach**: Phase-wise incremental development

### Key Requirements

- ✅ Offline-first operation (no internet required)
- ✅ Single user authentication (Phase 1)
- ✅ Product inventory for medicines AND general items
- ✅ Stock batch tracking (FIFO method)
- ✅ POS with barcode search support (Phase 2)
- ✅ Supplier management
- ✅ Sales tracking and reporting
- ✅ Local MySQL database

---

## 📅 Development Timeline

### Phase 1: Foundation (Week 1) - ✅ **COMPLETED**

**Goal**: Setup project structure, database, authentication, and basic layout

### Phase 2: Inventory & Stock Management (Week 2) - **CURRENT PHASE**

**Goal**: Product CRUD, stock entry system, supplier management

### Phase 3: POS & Sales (Week 3)

**Goal**: Point of Sale interface, cart functionality, sales processing

### Phase 4: Reports & Polish (Week 4)

**Goal**: Reporting dashboard, alerts, UI/UX improvements

---

## 📋 Phase 1: Foundation Setup (Week 1)

**Status**: 🔄 In Progress  
**Prerequisite**: Review `DEVELOPMENT_STANDARDS.md`

### 1.1 Project Initialization ✅

**Tasks**:

- [x] Initialize Electron + Vite + Vue 3 project
- [x] Install and configure PrimeVue & PrimeFlex
- [x] Setup project folder structure (as per standards)
- [x] Configure Vite for Electron
- [x] Setup path aliases (@/ for src)
- [x] Create .env file with database credentials

**Files to Create**:

```
pharmacy-standalone-pos/
├── package.json
├── vite.config.js
├── electron.vite.config.js
├── .env.example
├── .env
├── .gitignore
└── src/
    ├── main.js
    └── App.vue
```

**Dependencies**:

```json
{
  "vue": "^3.4.0",
  "electron": "^28.0.0",
  "vite": "^5.0.0",
  "primevue": "^3.50.0",
  "primeicons": "^6.0.1",
  "primeflex": "^3.3.1",
  "pinia": "^2.1.7",
  "vue-router": "^4.2.5",
  "sequelize": "^6.35.0",
  "mysql2": "^3.6.5",
  "bcrypt": "^5.1.1"
}
```

**Reference**: DEVELOPMENT_STANDARDS.md → Tech Stack & Folder Structure

---

### 1.2 Database Setup ✅

**Tasks**:

- [x] Create MySQL database `pharmacy_pos`
- [x] Setup Sequelize connection (`electron/database/connection.js`)
- [x] Create all Sequelize models:
  - [x] User model
  - [x] ProductType model
  - [x] Category model
  - [x] Product model
  - [x] Supplier model
  - [x] StockEntry model
  - [x] Sale model
  - [x] SaleItem model
- [x] Setup model associations
- [x] Create database sync script
- [x] Add seed data for ProductTypes and Categories

**Models to Create**:

```
electron/database/
├── connection.js
├── models/
│   ├── User.js
│   ├── ProductType.js
│   ├── Category.js
│   ├── Product.js
│   ├── Supplier.js
│   ├── StockEntry.js
│   ├── Sale.js
│   ├── SaleItem.js
│   └── index.js (associations)
└── seeders/
    ├── productTypes.js
    └── categories.js
```

**Seed Data**:

**Product Types**:

- Tablet
- Capsule
- Syrup
- Injection
- Cream/Ointment
- Drops
- Inhaler
- Bottle (for beverages)
- Packet
- Tub
- Box
- Unit (general)

**Categories**:

- Medicine
- Beverage
- Snack
- Biscuit
- Personal Care
- Baby Care
- Other

**Reference**:

- DEVELOPMENT_STANDARDS.md → Database Layer
- README.md → Database Schema

---

### 1.3 Authentication System ✅

**Tasks**:

- [x] Create User controller (`electron/controllers/UserController.js`)
- [x] Implement IPC handlers for auth
- [x] Create AuthService (`src/services/AuthService.js`)
- [x] Create auth store (`src/stores/auth.js`)
- [x] Create Login view (`src/views/Login.vue`)
- [x] Implement password hashing with bcrypt
- [x] Create default admin user on first run
- [x] Setup auth route guards

**IPC Channels**:

- `auth:login` - Authenticate user
- `auth:logout` - End session
- `auth:getCurrentUser` - Get logged-in user
- `auth:changePassword` - Update password
- `auth:checkFirstRun` - Check if first run

**Default User Creation**:

```javascript
// On first run, create:
{
  username: 'admin',
  password: 'admin123', // hashed
  full_name: 'System Administrator',
  email: 'admin@pharmacy.local',
  phone: null,
  status: 'active'
}
```

**Files to Create**:

```
electron/
├── controllers/
│   └── UserController.js
src/
├── services/
│   └── AuthService.js
├── stores/
│   └── auth.js
└── views/
    └── Login.vue
```

**Reference**:

- DEVELOPMENT_STANDARDS.md → Service Layer, State Management
- Security Best Practices

---

### 1.4 Base Layout & Navigation ✅

**Tasks**:

- [x] Create MainLayout component with PrimeVue
- [x] Create Navbar component (top bar)
- [x] Create Sidebar component (navigation menu)
- [x] Setup Vue Router with routes
- [x] Add route guards for authentication
- [x] Create 404 Not Found page
- [x] Add PrimeVue Toast for notifications
- [x] Add PrimeVue ConfirmDialog for confirmations

**Navigation Menu Items**:

```
📊 Dashboard
📦 Inventory
   ├── Products
   ├── Stock Entry
   └── Stock History
🏪 Suppliers
💰 Sales
   ├── POS
   └── Sales History
📈 Reports
   ├── Daily Sales
   ├── Stock Report
   └── Expiry Alerts
⚙️ Settings
```

**Routes**:

```javascript
const routes = [
  { path: '/login', component: Login, meta: { requiresAuth: false } },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'inventory/products', component: ProductList },
      { path: 'inventory/products/add', component: AddProduct },
      { path: 'inventory/products/:id/edit', component: EditProduct },
      { path: 'inventory/stock-entry', component: StockEntry },
      { path: 'suppliers', component: SupplierList },
      { path: 'sales/pos', component: POS },
      { path: 'sales/history', component: SalesHistory },
      { path: 'reports/daily-sales', component: DailySales },
      { path: 'reports/stock', component: StockReport },
      { path: 'settings', component: Settings },
    ],
  },
];
```

**Files to Create**:

```
src/
├── router/
│   └── index.js
├── components/
│   └── layout/
│       ├── MainLayout.vue
│       ├── Navbar.vue
│       └── Sidebar.vue
├── views/
│   ├── Dashboard.vue
│   └── NotFound.vue
└── App.vue (updated with router-view and Toast)
```

**Reference**:

- DEVELOPMENT_STANDARDS.md → Layout Standards
- PrimeVue Components

---

### 1.5 Dashboard (Basic) ✅

**Tasks**:

- [x] Create Dashboard view
- [x] Display summary cards:
  - Today's Sales
  - Total Products
  - Low Stock Items Count
  - Expiring Soon Count
- [x] Add quick action buttons
- [x] Use PrimeVue Card components
- [x] Make responsive with PrimeFlex grid

**Dashboard Widgets**:

1. **Today's Sales** - Total amount sold today
2. **Total Products** - Active product count
3. **Low Stock Alert** - Products below reorder level
4. **Expiring Soon** - Products expiring in 30 days
5. **Quick Actions**:
   - Open POS
   - Add Stock Entry
   - Add New Product

**Files to Create**:

```
src/
├── views/
│   └── Dashboard.vue
├── components/
│   └── dashboard/
│       ├── SummaryCard.vue
│       └── QuickActions.vue
└── services/
    └── DashboardService.js
```

**IPC Channels**:

- `dashboard:getSummary` - Get dashboard statistics

**Reference**:

- DEVELOPMENT_STANDARDS.md → PrimeVue Card component
- Dashboard Grid

---

### 1.6 Utility Functions & Constants ✅

**Tasks**:

- [x] Create formatter utilities (currency, date)
- [x] Create validator utilities
- [x] Create error handler utility
- [x] Create constants for product types & categories
- [x] Create composables for common functionality

**Files to Create**:

```
src/
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── errorHandler.js
├── constants/
│   ├── productTypes.js
│   ├── categories.js
│   └── config.js
└── composables/
    └── useNotification.js
```

**Formatter Functions**:

```javascript
// formatters.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date, format = 'short') => {
  // Implementation
};

export const formatDateTime = (dateTime) => {
  // Implementation
};
```

**Reference**:

- DEVELOPMENT_STANDARDS.md → Validation Standards
- Error Handling

---

### Phase 1 Completion Checklist ✅

Before moving to Phase 2, ensure:

- [x] DEVELOPMENT_STANDARDS.md reviewed
- [x] Project initializes without errors
- [x] Database connects successfully
- [x] All models created and associations work
- [x] Seed data loaded (ProductTypes, Categories)
- [x] Default admin user created
- [x] Login/logout works correctly
- [x] Main layout displays properly
- [x] Sidebar navigation works
- [x] Dashboard shows summary cards
- [x] Toast notifications work
- [x] All routes are accessible
- [x] No console errors
- [x] Code follows standards (naming, structure)
- [x] Git repository initialized with proper .gitignore

---

## 📋 Phase 2: Inventory & Stock Management (Week 2)

**Status**: 🔄 Ready to Start  
**Prerequisite**: Phase 1 Complete ✅ + Review `DEVELOPMENT_STANDARDS.md`

### 2.1 Product Management

**Tasks**:

- [ ] Create ProductController (`electron/controllers/ProductController.js`)
- [ ] Create ProductService (`src/services/ProductService.js`)
- [ ] Create product store (`src/stores/product.js`)
- [ ] Create ProductList view with DataTable
- [ ] Create AddProduct view with form
- [ ] Create EditProduct view
- [ ] Implement search functionality
- [ ] Add delete confirmation dialog
- [ ] Implement form validation

**Features**:

- List all products with pagination
- Search by name or barcode
- Filter by category, type, status
- Add new product
- Edit existing product
- Soft delete product (set status=inactive)
- Display total stock (aggregated from stock entries)
- Show low stock indicators

**IPC Channels**:

- `product:getAll`
- `product:getById`
- `product:create`
- `product:update`
- `product:delete`
- `product:search`

**Reference**: DEVELOPMENT_STANDARDS.md → Controller/Handler Pattern

---

### 2.2 Stock Entry System

**Tasks**:

- [ ] Create StockController (`electron/controllers/StockController.js`)
- [ ] Create StockService (`src/services/StockService.js`)
- [ ] Create stock store (`src/stores/stock.js`)
- [ ] Create StockEntry view (form)
- [ ] Create StockHistory view (list)
- [ ] Implement FIFO logic for stock deduction
- [ ] Add batch number validation

**Features**:

- Add new stock entry (with batch details)
- View stock entry history
- See remaining quantity per batch
- Link to supplier
- Set cost price and selling price per batch
- Expiry date tracking

**Stock Entry Form Fields**:

- Product (dropdown/search)
- Supplier (dropdown)
- Batch Number
- Quantity Received
- Cost Price (per unit)
- Selling Price (per unit)
- Expiry Date (optional)
- Stock Entry Date (auto)
- Notes

**IPC Channels**:

- `stock:addEntry`
- `stock:getByProduct`
- `stock:getHistory`
- `stock:getBatchDetails`

---

### 2.3 Supplier Management

**Tasks**:

- [ ] Create SupplierController
- [ ] Create SupplierService
- [ ] Create supplier store
- [ ] Create SupplierList view
- [ ] Create AddEditSupplier dialog
- [ ] Link suppliers to products

**Features**:

- List all suppliers
- Add new supplier
- Edit supplier details
- Soft delete supplier
- View products from supplier

**IPC Channels**:

- `supplier:getAll`
- `supplier:getById`
- `supplier:create`
- `supplier:update`
- `supplier:delete`

---

### Phase 2 Completion Checklist

- [ ] DEVELOPMENT_STANDARDS.md reviewed
- [ ] Product CRUD fully functional
- [ ] Stock entry system works
- [ ] FIFO logic implemented
- [ ] Supplier management complete
- [ ] Search and filters work
- [ ] Validations in place
- [ ] Error handling implemented
- [ ] Toast notifications for all actions
- [ ] Code follows standards

---

## 📋 Phase 3: POS & Sales (Week 3)

**Status**: ⏸️ Not Started  
**Prerequisite**: Phase 2 Complete + Review `DEVELOPMENT_STANDARDS.md`

### 3.1 Point of Sale (POS)

**Tasks**:

- [ ] Create SaleController
- [ ] Create SaleService
- [ ] Create sale store
- [ ] Create POS view
- [ ] Implement cart functionality
- [ ] Implement product search (name + barcode)
- [ ] Auto-select stock batch (FIFO)
- [ ] Calculate totals with tax/discount
- [ ] Process payment
- [ ] Generate invoice
- [ ] Reduce stock automatically

**Features**:

- Product search with autocomplete
- Barcode input (USB scanner support)
- Shopping cart with quantity adjustment
- Real-time total calculation
- Payment methods (Cash/Card)
- Print invoice (Phase 2 feature - planned)
- Clear cart
- Sales history

**IPC Channels**:

- `sale:create`
- `sale:getHistory`
- `sale:getById`
- `sale:getTodaySales`

---

### 3.2 Sales History

**Tasks**:

- [ ] Create SalesHistory view
- [ ] Display all sales with filters
- [ ] View sale details
- [ ] Search by date range
- [ ] Export to CSV/PDF (optional)

---

### Phase 3 Completion Checklist

- [ ] DEVELOPMENT_STANDARDS.md reviewed
- [ ] POS fully functional
- [ ] Cart operations work
- [ ] Stock deduction works (FIFO)
- [ ] Payment processing complete
- [ ] Invoice generation works
- [ ] Sales history displays correctly
- [ ] All validations in place
- [ ] Error handling implemented
- [ ] Code follows standards

---

## 📋 Phase 4: Reports & Polish (Week 4)

**Status**: ⏸️ Not Started  
**Prerequisite**: Phase 3 Complete + Review `DEVELOPMENT_STANDARDS.md`

### 4.1 Reporting

**Tasks**:

- [ ] Create ReportService
- [ ] Daily Sales Report
- [ ] Stock Level Report
- [ ] Stock Entry History
- [ ] Low Stock Alert
- [ ] Expiry Alert (30 days)
- [ ] Batch-wise Stock Report
- [ ] Profit Analysis Report
- [ ] Product Category-wise Sales

**Features**:

- Date range filters
- Export to PDF/CSV
- Visual charts (optional)
- Summary cards

---

### 4.2 Settings

**Tasks**:

- [ ] Create Settings view
- [ ] Change password functionality
- [ ] Database backup option
- [ ] Application settings

---

### 4.3 UI/UX Polish

**Tasks**:

- [ ] Review all screens for consistency
- [ ] Add loading states everywhere
- [ ] Add empty states
- [ ] Improve error messages
- [ ] Add keyboard shortcuts
- [ ] Responsive design check
- [ ] Performance optimization
- [ ] Final testing

---

### Phase 4 Completion Checklist

- [ ] All reports working
- [ ] Settings functional
- [ ] UI/UX polished
- [ ] No bugs or errors
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Ready for deployment

---

## 🚀 Deployment Checklist

- [ ] Build Electron app for Windows
- [ ] Create installer
- [ ] Test on clean system
- [ ] Prepare MySQL installation guide
- [ ] Create user manual
- [ ] Setup backup strategy

---

## 📝 Notes

### Important Reminders

1. **Always review DEVELOPMENT_STANDARDS.md before starting new tasks**
2. **Use PrimeVue components (no custom components for standard UI)**
3. **No internet connection required - bundle everything**
4. **Test thoroughly after each feature**
5. **Commit code regularly with meaningful messages**
6. **Follow naming conventions strictly**
7. **Implement error handling and loading states**
8. **Use PrimeFlex for layouts (avoid custom CSS)**

### Future Enhancements (Post-MVP)

- Thermal receipt printing
- Barcode label printing
- Advanced charts and analytics
- Multi-user with roles
- Customer management
- Purchase order management
- Stock adjustment/wastage
- Automated backups
- Multi-store support

---

**Last Updated**: November 18, 2025  
**Current Phase**: Phase 1 - Foundation Setup  
**Next Review Date**: After Phase 1 Completion

**Remember**: Quality over speed. Build it right the first time! ✨
