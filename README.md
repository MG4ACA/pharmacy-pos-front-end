# Pharmacy POS System - MVP

A standalone Point of Sale (POS) system for pharmacies built with Electron.js, Vue.js, and MySQL.

## 🎯 Project Overview

This is an MVP (Minimum Viable Product) for a pharmacy and general store POS system that handles inventory for both medicines and general products (snacks, beverages, biscuits, etc.), sales, supplier management, stock tracking, and basic reporting with single user authentication.

## 🏗️ Tech Stack

- **Frontend**: Vue 3 + Vite
- **Desktop Framework**: Electron.js
- **Database**: MySQL
- **ORM**: Sequelize (for database operations)
- **UI Components**: Element Plus / Ant Design Vue
- **State Management**: Pinia
- **Authentication**: JWT tokens
- **Barcode**: Vue-Barcode-Reader / QuaggaJS

## ✨ Core Features

### 1. User Management

- Single user authentication (Phase 1)
- Login/Logout functionality
- Password-based authentication
- Full access to all features

### 2. Product Inventory Management

> **Note**: System handles both medicines and general products (snacks, beverages, biscuits, etc.)

- Add new products with complete details
- Edit existing product information
- Delete products (with validation)
- Search by name or barcode
- Track stock levels with alerts
- Multiple stock batches tracking (each stock entry recorded separately)
- Product type variants (Tablets, Capsules, Syrups, Bottles, Packets, Tubs, etc.)

**Product Fields:**

- Product Name
- Generic Name (for medicines)
- Product Type (Tablet/Capsule/Syrup/Bottle/Packet/Tub/Box/Unit/etc.)
- Category (Medicine/Beverage/Snack/Biscuit/Other)
- Barcode
- Supplier Information
- Prescription Requirement (Yes/No) - for medicines only
- Reorder Level
- Description
- Status (Active/Inactive)

**Stock Entry Fields** (Separate table for each stock batch):

- Product ID (FK)
- Batch Number
- Stock Entry Date
- Quantity Received
- Remaining Quantity
- Cost Price (per unit)
- Selling Price (per unit)
- Expiry Date (if applicable)
- Supplier ID (FK)
- Notes

### 3. Stock Management System

- Record new stock entries (weekly/monthly)
- Each stock batch tracked separately with unique prices and expiry dates
- Automatic quantity deduction on sales (FIFO - First In First Out)
- Stock history and audit trail
- Price variance tracking across different stock batches
- Expiry date management per batch
- Low stock alerts based on reorder levels

**Stock Entry Workflow:**

1. Receive new stock from supplier
2. Create stock entry with batch details
3. Set cost price and selling price for this batch
4. System maintains separate records for each batch
5. During sales, system uses FIFO to deduct from oldest batch first

### 4. Supplier Management

- Add/Edit/Delete suppliers
- Supplier contact information
- Link medicines to suppliers
- Track purchases from suppliers

**Supplier Fields:**

- Supplier Name
- Contact Person
- Company Name
- Phone Number
- Email
- Address
- Status (Active/Inactive)

### 5. Sales & Billing

- Quick product search (by name or barcode)
- Add items to cart
- Automatic batch selection (FIFO)
- Display batch-specific pricing
- Calculate total with tax
- Process payment (Cash/Card)
- Generate invoice/receipt
- Print receipt (Phase 2)
- Return/Refund handling

### 6. Reporting

- Daily Sales Report
- Current Stock Level Report (across all batches)
- Stock Entry History Report
- Low Stock Alert (based on reorder level)
- Expiry Alert (products expiring soon)
- Sales by Date Range
- Top Selling Products
- Supplier-wise Purchase Report
- Product Category-wise Sales
- Batch-wise Stock Report
- Profit Analysis (based on cost vs selling price)

## 📁 Project Structure

```
pharmacy-standalone-pos/
├── electron/                      # Electron main process
│   ├── main.js                   # Main Electron entry point
│   ├── preload.js                # Preload scripts for IPC
│   └── database/
│       ├── connection.js         # MySQL connection setup
│       ├── models/               # Sequelize models
│       │   ├── User.js
│       │   ├── Product.js
│       │   ├── StockEntry.js
│       │   ├── Supplier.js
│       │   ├── Sale.js
│       │   ├── SaleItem.js
│       │   ├── ProductType.js
│       │   ├── Category.js
│       │   └── index.js          # Model associations
│       └── migrations/           # Database migrations
│
├── src/                          # Vue.js frontend
│   ├── main.js                   # Vue app entry
│   ├── App.vue
│   ├── router/
│   │   └── index.js              # Vue Router configuration
│   ├── stores/                   # Pinia stores
│   │   ├── auth.js               # Authentication store
│   │   ├── product.js            # Product inventory store
│   │   ├── stock.js              # Stock management store
│   │   ├── supplier.js           # Supplier store
│   │   └── sale.js               # Sales store
│   ├── views/                    # Page components
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Inventory/
│   │   │   ├── ProductList.vue
│   │   │   ├── AddProduct.vue
│   │   │   ├── EditProduct.vue
│   │   │   └── StockEntry.vue
│   │   ├── Suppliers/
│   │   │   ├── SupplierList.vue
│   │   │   └── AddEditSupplier.vue
│   │   ├── Sales/
│   │   │   ├── POS.vue           # Main POS interface
│   │   │   └── SalesHistory.vue
│   │   └── Reports/
│   │       ├── DailySales.vue
│   │       ├── StockReport.vue
│   │       ├── StockHistory.vue
│   │       ├── ExpiryAlert.vue
│   │       └── ProfitAnalysis.vue
│   ├── components/               # Reusable components
│   │   ├── Navbar.vue
│   │   ├── Sidebar.vue
│   │   ├── BarcodeScanner.vue
│   │   └── ReceiptPreview.vue
│   ├── composables/              # Vue composables
│   │   ├── useApi.js             # API calls via IPC
│   │   └── useAuth.js            # Auth helpers
│   ├── assets/                   # Static assets
│   │   ├── styles/
│   │   │   └── main.css
│   │   └── images/
│   └── utils/                    # Utility functions
│       ├── formatters.js
│       └── validators.js
│
├── public/                       # Static public files
│   └── icon.png                  # App icon
│
├── database/
│   └── schema.sql                # Initial database schema
│
├── .env.example                  # Environment variables template
├── package.json
├── vite.config.js               # Vite configuration
├── electron-builder.json        # Electron builder config
└── README.md
```

## 🗄️ Database Schema

### Users Table

```sql
- id (PK)
- username (unique)
- password (hashed)
- full_name
- email
- phone
- status (active/inactive)
- created_at
- updated_at
```

### Product_Types Table

```sql
- id (PK)
- name (Tablet/Capsule/Syrup/Bottle/Packet/Tub/Box/Unit/etc.)
- description
- created_at
- updated_at
```

### Categories Table

```sql
- id (PK)
- name (Medicine/Beverage/Snack/Biscuit/Personal Care/Other)
- description
- created_at
- updated_at
```

### Suppliers Table

```sql
- id (PK)
- name
- contact_person
- company_name
- phone
- email
- address
- status (active/inactive)
- created_at
- updated_at
```

### Products Table

```sql
- id (PK)
- name
- generic_name (nullable - for medicines)
- barcode (unique)
- product_type_id (FK)
- category_id (FK)
- prescription_required (boolean - default false)
- reorder_level
- description
- status (active/inactive)
- created_at
- updated_at
```

### Stock_Entries Table

```sql
- id (PK)
- product_id (FK)
- supplier_id (FK)
- batch_number
- stock_entry_date
- quantity_received
- remaining_quantity
- cost_price
- selling_price
- expiry_date (nullable)
- notes
- created_at
- updated_at
```

**Note**: This table maintains separate records for each stock batch. When products are sold, the `remaining_quantity` is decremented using FIFO method.

### Sales Table

```sql
- id (PK)
- sale_number (unique)
- customer_name (optional)
- total_amount
- discount
- tax
- payment_method (cash/card)
- user_id (FK - who made the sale)
- sale_date
- created_at
```

### Sale_Items Table

```sql
- id (PK)
- sale_id (FK)
- product_id (FK)
- stock_entry_id (FK - which batch was used)
- quantity
- unit_price
- cost_price (for profit calculation)
- subtotal
- batch_number
- created_at
```

## 🚀 Development Phases

### Phase 1: Setup & Authentication (Week 1)

- [ ] Initialize Electron + Vite + Vue project
- [ ] Setup MySQL connection
- [ ] Create database models with Sequelize
- [ ] Implement single user authentication (login/logout)
- [ ] Setup routing and layout structure
- [ ] Create basic dashboard
- [ ] Create Product Types and Categories seed data

### Phase 2: Product & Stock Management (Week 2)

- [ ] Product CRUD operations
- [ ] Product type and category management
- [ ] Stock entry system (add new stock batches)
- [ ] Supplier CRUD operations
- [ ] Search functionality (name + barcode)
- [ ] Stock level indicators (aggregated across batches)
- [ ] FIFO implementation for stock deduction

### Phase 3: POS & Sales (Week 3)

- [ ] POS interface development
- [ ] Shopping cart functionality
- [ ] Automatic batch selection (FIFO)
- [ ] Barcode scanning integration
- [ ] Payment processing
- [ ] Invoice generation with batch details
- [ ] Sales history
- [ ] Stock quantity auto-deduction

### Phase 4: Reports & Polish (Week 4)

- [ ] Daily sales report
- [ ] Current stock level reports (all batches)
- [ ] Stock entry history
- [ ] Low stock alerts
- [ ] Expiry alerts (batch-wise)
- [ ] Batch-wise stock report
- [ ] Profit analysis report
- [ ] UI/UX improvements
- [ ] Testing and bug fixes

### Phase 5: Future Enhancements

- [ ] Thermal receipt printing
- [ ] Advanced reporting with charts
- [ ] Customer management
- [ ] Purchase order management
- [ ] Stock adjustment/wastage management
- [ ] Multi-user support with role-based access
- [ ] Backup and restore functionality
- [ ] Barcode label printing for products

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v18+)
- MySQL Server (v8+)
- npm or yarn

### Steps

```bash
# Clone the repository
git clone <repo-url>
cd pharmacy-standalone-pos

# Install dependencies
npm install

# Setup database
# Create a MySQL database named 'pharmacy_pos'
# Import the schema from database/schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run in development mode
npm run dev

# Build for production
npm run build
```

## 📝 Environment Variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pharmacy_pos
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

## 🎨 UI Design Considerations

- Clean, minimalist interface
- Easy navigation with sidebar menu
- Quick access to POS from anywhere
- Color-coded alerts (low stock in yellow, expired in red)
- Responsive design for different screen sizes
- Keyboard shortcuts for common actions
- Dark/Light theme support (optional)

## 🔐 Security Features

- Password hashing (bcrypt)
- Session-based authentication
- SQL injection prevention (via Sequelize)
- Input validation and sanitization
- Audit trail for stock entries and sales
- Automatic stock deduction logging

## 📊 Key User Workflows

### Primary User Workflow

**Daily Operations:**

1. Login → Dashboard (shows today's sales, low stock alerts, expiring items)
2. Navigate to POS for sales
3. Search product (by name/barcode)
4. Add to cart (system automatically selects batch using FIFO)
5. Process payment
6. Generate receipt

**Stock Management (Weekly/Monthly):**

1. Navigate to Stock Entry
2. Select supplier
3. Add new stock batch with:
   - Product selection
   - Batch number
   - Quantity received
   - Cost price
   - Selling price
   - Expiry date (if applicable)
4. Save entry (system maintains separate record)

**Product Management:**

1. Navigate to Products
2. Add new products (medicines, snacks, beverages, etc.)
3. Set product type (tablet/bottle/packet/etc.)
4. Set category (medicine/snack/beverage/etc.)
5. Set reorder level
6. Link to preferred supplier

**Reporting:**

1. View daily sales summary
2. Check stock levels (consolidated across all batches)
3. Review expiry alerts
4. Analyze profit margins
5. Check stock entry history

## 🐛 Testing Strategy

- Unit tests for database models
- Integration tests for IPC communication
- E2E tests for critical workflows (login, sale process)
- Manual testing checklist before releases

## 📦 Deployment

- Package as standalone desktop app for Windows
- Include MySQL installation guide
- Setup wizard for initial configuration
- Auto-update mechanism (optional)

## 🤝 Contributing

This is an MVP project. Future contributions for enhancements are welcome.

## 📄 License

[Choose appropriate license]

---

**Version**: 1.0.0-MVP  
**Last Updated**: November 18, 2025  
**Status**: Planning Phase
