# Pharmacy POS System - Test Plan

**Project**: Pharmacy Standalone POS  
**Version**: 1.0  
**Last Updated**: November 20, 2025  
**Test Type**: Manual Testing - UI & Functional  
**Tester**: **\*\***\_\_\_**\*\***  
**Test Date**: **\*\***\_\_\_**\*\***

---

## 📋 Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Product Management](#2-product-management)
3. [Stock Receipt System](#3-stock-receipt-system)
4. [Supplier Management](#4-supplier-management)
5. [Search & Filter Functionality](#5-search--filter-functionality)
6. [Data Validation](#6-data-validation)
7. [Error Handling](#7-error-handling)
8. [UI/UX & Navigation](#8-uiux--navigation)
9. [Integration Tests](#9-integration-tests)
10. [Performance & Stability](#10-performance--stability)

---

## Test Status Legend

- ✅ **Pass** - Feature works as expected
- ❌ **Fail** - Feature not working or has bugs
- ⚠️ **Partial** - Feature works but with issues
- ⏭️ **Skip** - Test not applicable or postponed
- 🔄 **Retest** - Needs retesting after fix

---

## 1. Authentication & User Management

### Test Suite: AUTH

**Default Admin Creation:**
[ ] AUTH-001: Start app for first time and verify default admin user is created
[ ] AUTH-002: Verify default credentials: username=`admin`, password=`admin123`
[ ] AUTH-003: Check user status is `active` in database

**Login - Valid Credentials:**
[ ] AUTH-004: Open app and enter username: `admin`
[ ] AUTH-005: Enter password: `admin123` and click Login
[ ] AUTH-006: Verify successful login and redirect to Dashboard
[ ] AUTH-007: Check success toast message is shown

**Login - Invalid Credentials:**
[ ] AUTH-008: Enter invalid username - should show "Invalid credentials" error
[ ] AUTH-009: Enter valid username with wrong password - should show error
[ ] AUTH-010: Verify user remains on login page after failed login
[ ] AUTH-011: Check red error toast is displayed

**Login - Validation:**
[ ] AUTH-012: Leave username field empty and click Login - should show validation error
[ ] AUTH-013: Leave password field empty and click Login - should show validation error
[ ] AUTH-014: Leave both fields empty - should show both validation errors

**Logout:**
[ ] AUTH-015: Login successfully, then click logout button in navbar
[ ] AUTH-016: Verify redirect to login page
[ ] AUTH-017: Verify session is cleared

**Session & Security:**
[ ] AUTH-018: Login, close app, reopen - check session persistence behavior
[ ] AUTH-019: Try accessing `/dashboard` URL without login - should redirect to login
[ ] AUTH-020: Verify protected routes are inaccessible without authentication

---

## 2. Product Management

### Test Suite: PRODUCT

#### 2.1 View/List Products

[ ] PROD-001: Navigate to Inventory > Products and verify page loads
[ ] PROD-002: Check DataTable displays columns: ID, Name, Generic Name, Category, Type, Status, Actions
[ ] PROD-003: View products on fresh database - should show "No products found"
[ ] PROD-004: Verify "Add Product" button is visible in empty state
[ ] PROD-005: Add sample products and view list
[ ] PROD-006: Verify all products display correctly with proper data formatting
[ ] PROD-007: Test pagination if more than 10 products exist

#### 2.2 Create Product

**Complete Product Creation:**
[ ] PROD-008: Click "Add Product" button
[ ] PROD-009: Fill all fields: Name=`Paracetamol 500mg`, Generic=`Paracetamol`, Type=`Tablet`
[ ] PROD-010: Fill Category=`Medicine`, Barcode=`123456789`, Reorder Level=`50`
[ ] PROD-011: Add Description: `Pain reliever` and click Save
[ ] PROD-012: Verify success toast is shown
[ ] PROD-013: Verify redirect to product list
[ ] PROD-014: Check new product is visible in table

**Minimum Required Fields:**
[ ] PROD-015: Click "Add Product" and fill only required fields
[ ] PROD-016: Enter Name=`Aspirin`, Type=`Tablet`, Category=`Medicine`
[ ] PROD-017: Click Save and verify product is created
[ ] PROD-018: Verify optional fields are saved as null
[ ] PROD-019: Check default status is `active`

**Sample Data & Validation:**
[ ] PROD-020: Click "Add Product" then "Fill Sample Data" button
[ ] PROD-021: Verify all fields are populated with sample data
[ ] PROD-022: Save and verify product creation succeeds
[ ] PROD-023: Try saving product without name - should show validation error
[ ] PROD-024: Try saving without type - should show validation error
[ ] PROD-025: Try saving without category - should show validation error
[ ] PROD-026: Create product with barcode `111222`
[ ] PROD-027: Try creating another product with same barcode - check if prevented

#### 2.3 Edit Product

[ ] PROD-028: Click edit icon on any product
[ ] PROD-029: Change name to `Updated Name` and click Update
[ ] PROD-030: Verify success toast is shown
[ ] PROD-031: Check name is updated in product list
[ ] PROD-032: Edit product and change all editable fields
[ ] PROD-033: Click Update and verify all changes are saved
[ ] PROD-034: Check changes are reflected in database
[ ] PROD-035: Click edit, make changes, then click Cancel
[ ] PROD-036: Verify no changes were saved and original data is intact
[ ] PROD-037: Edit product and clear the product name field
[ ] PROD-038: Try saving - should show validation error and prevent update
[ ] PROD-039: Edit product and change status to "Inactive"
[ ] PROD-040: Save and verify status updates correctly
[ ] PROD-041: Check status tag shows correct color in list

#### 2.4 Delete Product

[ ] PROD-042: Click delete icon on a product
[ ] PROD-043: Verify confirmation dialog appears with warning icon
[ ] PROD-044: Check dialog shows product name
[ ] PROD-045: Verify Confirm and Cancel buttons are present
[ ] PROD-046: Click Confirm to delete
[ ] PROD-047: Verify product is soft deleted (status changed to inactive)
[ ] PROD-048: Check success toast is shown
[ ] PROD-049: Verify product still exists in database but marked inactive
[ ] PROD-050: Click delete on another product, then click Cancel
[ ] PROD-051: Verify dialog closes and product is NOT deleted
[ ] PROD-052: Create product with stock entries
[ ] PROD-053: Try deleting product - check if blocked or warning shown

---

## 3. Stock Receipt System

### Test Suite: STOCK_RECEIPT

#### 3.1 Create Stock Receipt

**Stock Receipt Tests:**

[ ] SR-001: Navigate to Inventory > Stock Receipts and verify page loads
[ ] SR-002: Click "Create Stock Receipt" button
[ ] SR-003: Verify receipt number is auto-generated
[ ] SR-004: Select supplier from dropdown
[ ] SR-005: Enter receipt date
[ ] SR-006: Enter supplier invoice number
[ ] SR-007: Add first product to receipt
[ ] SR-008: Enter product batch number
[ ] SR-009: Enter quantity received (e.g., 100)
[ ] SR-010: Enter cost price per unit (e.g., 10.00)
[ ] SR-011: Enter selling price per unit (e.g., 15.00)
[ ] SR-012: Enter expiry date (optional)
[ ] SR-013: Verify profit margin is calculated and displayed
[ ] SR-014: Add second product to same receipt
[ ] SR-015: Verify total amount is calculated correctly
[ ] SR-016: Add notes (optional)
[ ] SR-017: Save receipt as "Draft" status
[ ] SR-018: Verify success message is shown
[ ] SR-019: View draft receipt in list
[ ] SR-020: Edit draft receipt
[ ] SR-021: Complete/finalize the receipt
[ ] SR-022: Verify stock entries are created automatically for each product
[ ] SR-023: Try creating receipt without supplier - should fail validation
[ ] SR-024: Try creating receipt without products - should fail validation
[ ] SR-025: Try entering zero or negative quantity - should fail validation
[ ] SR-026: Try entering zero or negative prices - should fail validation
[ ] SR-027: Cancel receipt and verify status changes to "cancelled"

#### 3.2 View Stock Receipts

[ ] SR-028: View all stock receipts list
[ ] SR-029: Verify receipt list shows: receipt number, supplier, date, total amount, status
[ ] SR-030: Filter receipts by supplier
[ ] SR-031: Filter receipts by status (Draft/Completed/Cancelled)
[ ] SR-032: Filter receipts by date range
[ ] SR-033: Search receipts by receipt number
[ ] SR-034: Search receipts by invoice number
[ ] SR-035: Clear all filters
[ ] SR-036: View individual receipt details
[ ] SR-037: Verify receipt details show all products with batch info
[ ] SR-038: View receipt on empty database - should show empty state

#### 3.3 Stock Entry Verification (Internal)

[ ] SR-039: After completing receipt, verify stock entries are created in database
[ ] SR-040: Verify each product has separate stock entry with receipt_id
[ ] SR-041: Verify quantity_remaining equals quantity_received initially
[ ] SR-042: Verify stock entries have correct cost/selling prices from receipt

#### 3.4 Stock Deduction (FIFO)

**Note:** These tests will be performed during POS/Sales testing in Phase 3

[ ] SR-043: Create receipt with single product batch (100 units)
[ ] SR-044: Sell 30 units and verify remaining is 70 units
[ ] SR-045: Verify deduction from oldest batch first (FIFO)
[ ] SR-046: Create receipt with 2 batches (50 units each)
[ ] SR-047: Sell 70 units and verify Batch1 = 0, Batch2 = 30
[ ] SR-048: Sell exactly all units in a batch and verify batch shows 0 remaining
[ ] SR-049: Try selling more than available stock - should show error
[ ] SR-050: Verify error message: "Insufficient stock"

**Test Data:**

```javascript
Sample Stock Receipt 1:
- Receipt Number: SR-2025-11-0001
- Supplier: ABC Pharma
- Receipt Date: 2025-11-20
- Invoice Number: INV-ABC-12345
- Products:
  1. Paracetamol 500mg
     - Batch: BATCH001
     - Quantity: 100
     - Cost: 10.00
     - Selling: 15.00
     - Expiry: 2026-12-31
  2. Aspirin 75mg
     - Batch: BATCH002
     - Quantity: 50
     - Cost: 8.00
     - Selling: 12.00
     - Expiry: 2026-06-30

Sample Stock Receipt 2:
- Receipt Number: SR-2025-11-0002
- Supplier: Beverage Distributors
- Receipt Date: 2025-11-20
- Invoice Number: INV-BEV-98765
- Products:
  1. Coca Cola 1.5L
     - Batch: BATCH003
     - Quantity: 200
     - Cost: 50.00
     - Selling: 75.00
     - Expiry: 2025-12-31
  2. Sprite 1.5L
     - Batch: BATCH004
     - Quantity: 150
     - Cost: 48.00
     - Selling: 72.00
     - Expiry: 2025-12-31
```

---

## 4. Supplier Management

### Test Suite: SUPPLIER

#### 4.1 View/List Suppliers

[ ] SUPP-001: Navigate to Suppliers page and verify it loads
[ ] SUPP-002: Check DataTable displays columns: ID, Supplier name, Contact person, Email, Phone, Address, Status, Actions
[ ] SUPP-003: View suppliers on fresh database - should show "No suppliers found"
[ ] SUPP-004: Verify "Add Supplier" button is visible in empty state
[ ] SUPP-005: Add sample suppliers and verify list displays correctly

#### 4.2 Create Supplier

**Complete Supplier Creation:**
[ ] SUPP-006: Click "Add Supplier" button
[ ] SUPP-007: Fill Name: `ABC Pharma`, Contact: `John Doe`
[ ] SUPP-008: Fill Email: `john@abc.com`, Phone: `+94112345678`
[ ] SUPP-009: Fill Address: `123 Main St` and click Save
[ ] SUPP-010: Verify success toast is shown
[ ] SUPP-011: Verify supplier appears at top of list
[ ] SUPP-012: Check default status is Active

**Minimum Required Fields:**
[ ] SUPP-013: Click "Add Supplier" and enter only Name: `XYZ Supplier`
[ ] SUPP-014: Click Save and verify supplier is created
[ ] SUPP-015: Check optional fields are saved as null

**Sample Data & Validation:**
[ ] SUPP-016: Click "Add Supplier" then "Fill Sample Data" button
[ ] SUPP-017: Verify fields are populated and save successfully
[ ] SUPP-018: Try saving supplier without name - should show validation error
[ ] SUPP-019: Try saving with invalid email format - should show error
[ ] SUPP-020: Enter valid email formats (test@example.com, user.name@domain.co.uk)
[ ] SUPP-021: Verify valid emails are accepted and supplier saves

#### 4.3 Edit Supplier

[ ] SUPP-022: Click edit icon on any supplier
[ ] SUPP-023: Change contact person and phone number
[ ] SUPP-024: Click Save and verify success toast
[ ] SUPP-025: Check changes are saved correctly in list
[ ] SUPP-026: Edit supplier and change status to Inactive
[ ] SUPP-027: Verify status tag shows "Inactive" in red
[ ] SUPP-028: Check status updated in database
[ ] SUPP-029: Edit supplier and clear the name field
[ ] SUPP-030: Try saving - should show validation error
[ ] SUPP-031: Edit supplier and enter invalid email
[ ] SUPP-032: Try saving - should show email format error

#### 4.4 Delete Supplier

[ ] SUPP-033: Click delete icon on a supplier
[ ] SUPP-034: Verify confirmation dialog appears with warning icon
[ ] SUPP-035: Check dialog shows supplier name
[ ] SUPP-036: Verify Confirm and Cancel buttons are present
[ ] SUPP-037: Click Confirm to delete
[ ] SUPP-038: Verify supplier is soft deleted (status changed to inactive)
[ ] SUPP-039: Check success toast is shown
[ ] SUPP-040: Verify supplier still exists in database
[ ] SUPP-041: Click delete on another supplier, then click Cancel
[ ] SUPP-042: Verify dialog closes and supplier is NOT deleted

#### 4.5 View Products from Supplier

[ ] SUPP-043: Click eye icon (View Products) on a supplier
[ ] SUPP-044: Verify dialog opens with supplier name in header
[ ] SUPP-045: Check DataTable shows product details (ID, Name, Generic, Category, Type)
[ ] SUPP-046: View products for supplier with stock receipts
[ ] SUPP-047: Verify all unique products from that supplier are shown
[ ] SUPP-048: Check no duplicate products appear
[ ] SUPP-049: View products for new supplier with no stock
[ ] SUPP-050: Verify "No products found for this supplier" message shows
[ ] SUPP-051: Open products dialog and click Close button
[ ] SUPP-052: Verify dialog closes and returns to supplier list

---

## 4B. Stock Batches Management

### Test Suite: BATCH

**Objective**: Verify stock batches viewing, filtering, FIFO order, expiry alerts, and batch details display

#### 4B.1 Access Stock Batches Page

[ ] BATCH-001: Navigate to Inventory section in sidebar
[ ] BATCH-002: Verify "Stock Batches" menu item is present with inbox icon
[ ] BATCH-003: Click on "Stock Batches" menu item
[ ] BATCH-004: Verify Stock Batches page loads successfully
[ ] BATCH-005: Verify page header shows "Stock Batches" title
[ ] BATCH-006: Verify subtitle shows "View all stock batches with expiry dates and quantities"
[ ] BATCH-007: Verify "Expiring Soon" and "Refresh" buttons are present in header
[ ] BATCH-008: Verify Filters panel is visible and toggleable
[ ] BATCH-009: Verify DataTable displays with pagination controls

#### 4B.2 View All Stock Batches

[ ] BATCH-010: On initial load, verify all stock batches from all products are displayed
[ ] BATCH-011: Verify DataTable columns: Product, Batch #, Supplier, Quantity, Cost Price, Selling Price, Expiry Date, Entry Date, Actions
[ ] BATCH-012: Verify batches are sorted by expiry date (oldest first - FIFO order)
[ ] BATCH-013: Check Product column shows product name and category
[ ] BATCH-014: Check Batch # column displays batch number with bold font
[ ] BATCH-015: Check Supplier column shows supplier name or "N/A" if not linked
[ ] BATCH-016: Check Quantity column shows units with color tags (green > 10, yellow ≤ 10)
[ ] BATCH-017: Check Cost Price and Selling Price display with "Rs." prefix and 2 decimals
[ ] BATCH-018: Check Expiry Date column shows formatted date (DD/MM/YYYY)
[ ] BATCH-019: Verify "Expired" tag (red) appears for batches with expiry date < today
[ ] BATCH-020: Verify "Expiring Soon" tag (yellow) appears for batches expiring within 30 days
[ ] BATCH-021: Verify batches with no expiry date show "No expiry" text
[ ] BATCH-022: Check Entry Date column shows formatted date in smaller font

#### 4B.3 Product Filter (AutoComplete)

[ ] BATCH-023: Click on Product AutoComplete field in Filters panel
[ ] BATCH-024: Type "para" (partial search)
[ ] BATCH-025: Verify dropdown shows matching products with name and category
[ ] BATCH-026: Select a product from the dropdown
[ ] BATCH-027: Verify DataTable refreshes and shows only batches for selected product
[ ] BATCH-028: Verify success toast shows "Showing batches for [Product Name]"
[ ] BATCH-029: Verify other products' batches are hidden
[ ] BATCH-030: Clear product selection by backspace
[ ] BATCH-031: Verify all batches are displayed again

#### 4B.4 Supplier Filter

[ ] BATCH-032: Open Supplier dropdown in Filters panel
[ ] BATCH-033: Verify dropdown shows all active suppliers
[ ] BATCH-034: Select a supplier from the list
[ ] BATCH-035: Verify only batches supplied by that supplier are shown
[ ] BATCH-036: Verify batches from other suppliers are hidden
[ ] BATCH-037: Click "X" (clear) button in Supplier dropdown
[ ] BATCH-038: Verify filter is cleared and all batches are displayed

#### 4B.5 Expiry Status Filter

[ ] BATCH-039: Open Expiry Status dropdown in Filters panel
[ ] BATCH-040: Verify options: "All Batches", "Expiring Soon (30 days)", "Expired", "Valid"
[ ] BATCH-041: Select "Expiring Soon (30 days)"
[ ] BATCH-042: Verify only batches with expiry ≤ 30 days from today are shown
[ ] BATCH-043: Verify each shown batch has "Expiring Soon" yellow tag
[ ] BATCH-044: Select "Expired"
[ ] BATCH-045: Verify only batches with expiry date < today are shown
[ ] BATCH-046: Verify each shown batch has "Expired" red tag
[ ] BATCH-047: Select "Valid"
[ ] BATCH-048: Verify only batches with no expiry or expiry > 30 days are shown
[ ] BATCH-049: Verify none have "Expired" or "Expiring Soon" tags
[ ] BATCH-050: Select "All Batches"
[ ] BATCH-051: Verify all batches regardless of expiry status are shown

#### 4B.6 Combined Filters

[ ] BATCH-052: Select a product from AutoComplete
[ ] BATCH-053: Select a supplier from dropdown
[ ] BATCH-054: Verify only batches matching BOTH criteria are shown
[ ] BATCH-055: Add expiry status filter "Expiring Soon"
[ ] BATCH-056: Verify only batches matching ALL THREE criteria are shown
[ ] BATCH-057: Change one filter while others are active
[ ] BATCH-058: Verify results update correctly based on new filter combination

#### 4B.7 Clear Filters

[ ] BATCH-059: Apply multiple filters (product, supplier, expiry status)
[ ] BATCH-060: Verify filtered results are displayed
[ ] BATCH-061: Click "Clear Filters" button
[ ] BATCH-062: Verify Product AutoComplete is cleared
[ ] BATCH-063: Verify Supplier dropdown is cleared
[ ] BATCH-064: Verify Expiry Status dropdown is cleared
[ ] BATCH-065: Verify all batches from all products are displayed again

#### 4B.8 Expiring Soon Badge Button

[ ] BATCH-066: Verify "Expiring Soon" button in header shows a badge with count
[ ] BATCH-067: Verify badge count matches number of batches expiring within 30 days
[ ] BATCH-068: Click "Expiring Soon" button
[ ] BATCH-069: Verify Expiry Status filter is automatically set to "Expiring Soon"
[ ] BATCH-070: Verify DataTable shows only expiring batches
[ ] BATCH-071: Verify info toast shows "Showing X expiring batches"

#### 4B.9 Refresh Button

[ ] BATCH-072: Make changes to stock (add new stock receipt in another tab/window)
[ ] BATCH-073: Return to Stock Batches page
[ ] BATCH-074: Click "Refresh" button in header
[ ] BATCH-075: Verify button shows loading spinner during refresh
[ ] BATCH-076: Verify DataTable refreshes with latest stock data
[ ] BATCH-077: Verify newly added batches appear in the list

#### 4B.10 View Batch Details Dialog

[ ] BATCH-078: Click eye icon (View Details) on any batch row
[ ] BATCH-079: Verify "Batch Details" dialog opens
[ ] BATCH-080: Verify dialog displays three sections: Product Information, Batch Information, Supplier Information
[ ] BATCH-081: In Product Information section, verify: Product Name, Category, Barcode
[ ] BATCH-082: In Batch Information section, verify: Batch Number, Quantity Remaining (with color tag), Cost Price, Selling Price, Entry Date, Expiry Date (with status tag)
[ ] BATCH-083: In Supplier Information section, verify: Supplier Name, Contact Person, Phone, Email
[ ] BATCH-084: Verify expiry status tag appears correctly (Expired/Expiring Soon)
[ ] BATCH-085: Verify prices display with "Rs." prefix and 2 decimal places
[ ] BATCH-086: Verify dates are formatted correctly (DD/MM/YYYY)
[ ] BATCH-087: Click "Close" button in dialog footer
[ ] BATCH-088: Verify dialog closes and returns to batches list

#### 4B.11 DataTable Features

[ ] BATCH-089: Verify DataTable has alternating row colors (striped)
[ ] BATCH-090: Verify pagination controls are visible at bottom
[ ] BATCH-091: Verify default rows per page is 20
[ ] BATCH-092: Click page number button (2, 3, etc.) if available
[ ] BATCH-093: Verify next page of batches is displayed
[ ] BATCH-094: Click "Rows per page" dropdown
[ ] BATCH-095: Change to 10 rows per page
[ ] BATCH-096: Verify DataTable refreshes and shows only 10 rows
[ ] BATCH-097: Change to 50 rows per page
[ ] BATCH-098: Verify DataTable shows up to 50 rows
[ ] BATCH-099: Verify current page report shows "Showing X to Y of Z batches"

#### 4B.12 Sorting

[ ] BATCH-100: Click on "Expiry Date" column header
[ ] BATCH-101: Verify batches are sorted by expiry date ascending (oldest first)
[ ] BATCH-102: Click "Expiry Date" header again
[ ] BATCH-103: Verify batches are sorted by expiry date descending (newest first)
[ ] BATCH-104: Click on "Product" column header
[ ] BATCH-105: Verify batches are sorted alphabetically by product name
[ ] BATCH-106: Click on "Quantity" column header
[ ] BATCH-107: Verify batches are sorted by quantity remaining (low to high)
[ ] BATCH-108: Click on "Batch #" column header
[ ] BATCH-109: Verify batches are sorted by batch number
[ ] BATCH-110: Click on "Supplier" column header
[ ] BATCH-111: Verify batches are sorted by supplier name

#### 4B.13 Empty States

[ ] BATCH-112: Filter batches with criteria that returns no results (e.g., expired batches when none exist)
[ ] BATCH-113: Verify DataTable shows empty state with inbox icon
[ ] BATCH-114: Verify message displays "No stock batches found"
[ ] BATCH-115: Verify subtitle shows "Try adjusting your filters or add stock receipts"
[ ] BATCH-116: Clear filters and verify batches reappear

#### 4B.14 Responsive Design

[ ] BATCH-117: Resize window to tablet size (768px - 1024px)
[ ] BATCH-118: Verify DataTable columns adjust responsively
[ ] BATCH-119: Verify filter panel remains usable
[ ] BATCH-120: Resize window to mobile size (< 768px)
[ ] BATCH-121: Verify horizontal scroll appears for DataTable
[ ] BATCH-122: Verify all columns are accessible via scroll

#### 4B.15 Error Handling

[ ] BATCH-123: Stop the backend/database service
[ ] BATCH-124: Try to load Stock Batches page
[ ] BATCH-125: Verify error toast appears with "Failed to load stock batches" message
[ ] BATCH-126: Restart backend and click Refresh
[ ] BATCH-127: Verify batches load successfully
[ ] BATCH-128: Click View Details on a batch while backend is stopped
[ ] BATCH-129: Verify error toast shows "Failed to load batch details"

#### 4B.16 Performance

[ ] BATCH-130: Add 100+ stock batches across multiple products
[ ] BATCH-131: Load Stock Batches page and measure load time (should be < 2 seconds)
[ ] BATCH-132: Verify pagination handles large dataset smoothly
[ ] BATCH-133: Apply filters on large dataset
[ ] BATCH-134: Verify filtering completes within 500ms
[ ] BATCH-135: Open batch details for multiple batches sequentially
[ ] BATCH-136: Verify each details dialog loads within 500ms

---

**Test Data:**

```javascript
Suppliers:
1. ABC Pharma Ltd
   - Contact: John Smith
   - Email: john@abcpharma.lk
   - Phone: +94 11 234 5678
   - Address: No. 123, Main Street, Colombo 07

2. Beverage Distributors
   - Contact: Jane Doe
   - Email: jane@beverages.lk
   - Phone: +94 11 876 5432
   - Address: No. 456, Galle Road, Colombo 03
```

---

## 5. Search & Filter Functionality

### Test Suite: SEARCH

#### 5.1 Product Search

**Search by Name/Barcode:**
[ ] SEARCH-001: Navigate to Product List page
[ ] SEARCH-002: Enter partial name `para` in search box
[ ] SEARCH-003: Verify products containing "para" are shown (case-insensitive)
[ ] SEARCH-004: Enter barcode in search box
[ ] SEARCH-005: Verify exact product match or products with matching barcode

**Filter by Category/Type/Status:**
[ ] SEARCH-006: Select category filter: `Medicine`
[ ] SEARCH-007: Verify only Medicine products are shown
[ ] SEARCH-008: Select type filter: `Tablet`
[ ] SEARCH-009: Verify only Tablet products are shown
[ ] SEARCH-010: Select status filter: `Active`
[ ] SEARCH-011: Verify only active products are shown, inactive hidden

**Combined Filters & Edge Cases:**
[ ] SEARCH-012: Enter name: `para`, select category: `Medicine`, select status: `Active`
[ ] SEARCH-013: Verify products matching ALL filters (AND logic)
[ ] SEARCH-014: Search for non-existent product
[ ] SEARCH-015: Verify "No products found" empty state shows
[ ] SEARCH-016: Apply multiple filters and click "Clear" button
[ ] SEARCH-017: Verify all filters reset and full product list shows

#### 5.2 Stock Receipt Search & Filters

[ ] SEARCH-009: Filter stock receipts by supplier
[ ] SEARCH-010: Filter stock receipts by status (Draft/Completed/Cancelled)
[ ] SEARCH-011: Filter stock receipts by date range
[ ] SEARCH-012: Search by receipt number
[ ] SEARCH-013: Search by supplier invoice number
[ ] SEARCH-014: Apply multiple filters together
[ ] SEARCH-015: Clear all filters and verify full list shows
[ ] SEARCH-016: Verify empty search results show appropriate message

#### 5.3 Stock Batches Search & Filters

[ ] SEARCH-017: Navigate to Inventory > Stock Batches page
[ ] SEARCH-018: Use product AutoComplete to search and select a product
[ ] SEARCH-019: Verify only batches for selected product are displayed
[ ] SEARCH-020: Select a supplier from the supplier dropdown filter
[ ] SEARCH-021: Verify only batches from that supplier are displayed
[ ] SEARCH-022: Select "Expiring Soon (30 days)" from expiry status filter
[ ] SEARCH-023: Verify only batches expiring within 30 days are shown with yellow/red tags
[ ] SEARCH-024: Select "Expired" from expiry status filter
[ ] SEARCH-025: Verify only expired batches are shown with red "Expired" tags
[ ] SEARCH-026: Select "Valid" from expiry status filter
[ ] SEARCH-027: Verify only batches with no expiry or expiry > 30 days are shown
[ ] SEARCH-028: Apply multiple filters together (product + supplier + expiry status)
[ ] SEARCH-029: Verify results match ALL selected criteria (AND logic)
[ ] SEARCH-030: Click "Clear Filters" button
[ ] SEARCH-031: Verify all filters are reset and all batches are displayed
[ ] SEARCH-032: Click "Expiring Soon" badge button in header
[ ] SEARCH-033: Verify expiry status filter is automatically set to "Expiring Soon"
[ ] SEARCH-034: Verify badge shows correct count of expiring batches

#### 5.4 Supplier Search

**Search by Name/Contact:**
[ ] SEARCH-035: Navigate to Suppliers page
[ ] SEARCH-036: Enter supplier name in search box
[ ] SEARCH-037: Verify matching suppliers are shown (partial match works)
[ ] SEARCH-038: Enter contact person name in search box
[ ] SEARCH-039: Verify suppliers with matching contact person are shown

**Search by Email/Phone:**
[ ] SEARCH-040: Enter email or part of it in search box
[ ] SEARCH-041: Verify suppliers with matching email are shown
[ ] SEARCH-042: Enter phone number in search box
[ ] SEARCH-043: Verify suppliers with matching phone are shown

**Status Filter & Combined Search:**
[ ] SEARCH-044: Select status filter: `Active`
[ ] SEARCH-045: Verify only active suppliers are shown, inactive hidden
[ ] SEARCH-046: Enter search term and select status filter
[ ] SEARCH-047: Verify results match both criteria (AND logic applied)

---

## 6. Data Validation

### Test Suite: VALIDATION

#### 6.1 Required Field Validation

[ ] VAL-001: Try saving product without name - should show error
[ ] VAL-002: Try saving product without type - should show error
[ ] VAL-003: Try saving product without category - should show error
[ ] VAL-004: Try saving stock receipt without supplier - should show error
[ ] VAL-005: Try saving stock receipt without products - should show error
[ ] VAL-006: Try saving stock receipt product without quantity - should show error
[ ] VAL-007: Try saving stock receipt product without prices - should show error
[ ] VAL-008: Try saving supplier without name - should show error

#### 6.2 Format Validation

[ ] VAL-009: Test valid email formats (test@example.com, user.name@domain.co.uk)
[ ] VAL-010: Test invalid email formats (invalidemail, @example.com, user@)
[ ] VAL-011: Try entering negative quantity - should be rejected
[ ] VAL-012: Try entering zero quantity - should be rejected
[ ] VAL-013: Try entering negative prices - should be rejected
[ ] VAL-014: Enter decimal prices (10.50, 99.99) - should be accepted and formatted

#### 6.3 Business Logic Validation

[ ] VAL-015: Enter cost price higher than selling price - check if warning shown
[ ] VAL-016: Enter past expiry date - check if validation prevents or warns
[ ] VAL-017: Try editing completed stock receipt - should be blocked
[ ] VAL-018: Try cancelling already completed receipt - verify behavior
[ ] VAL-019: Create product with duplicate barcode - check if prevented

---

## 7. Error Handling

### Test Suite: ERROR

[ ] ERR-001: Stop MySQL and start app - should show connection error gracefully
[ ] ERR-002: Try loading data when backend unavailable - should show error message
[ ] ERR-003: Enter text in number field - should prevent or show validation error
[ ] ERR-004: Load product with null fields - should show as "-" or "N/A", not "null"
[ ] ERR-005: View empty lists - should show empty state, not errors
[ ] ERR-006: Enter very large numbers - should handle gracefully or show max limit
[ ] ERR-007: Enter special characters - should be sanitized or handled properly
[ ] ERR-008: Test SQL injection attempts - should be prevented by Sequelize
[ ] ERR-009: Test IPC cloning errors - should return plain objects, not Sequelize instances

---

## 8. UI/UX & Navigation

### Test Suite: UI

#### 8.1 Layout & Navigation

[ ] UI-001: Click Dashboard menu item - verify route loads
[ ] UI-002: Click Products menu item - verify route loads
[ ] UI-003: Click Stock Receipts menu item - verify route loads  
[ ] UI-004: Click Suppliers menu item - verify route loads
[ ] UI-005: Verify active menu is highlighted
[ ] UI-006: Check navbar shows app title and user info
[ ] UI-007: Click logout button - verify works correctly
[ ] UI-008: View on desktop (1920x1080) - verify layout looks good
[ ] UI-009: Resize to tablet size - verify responsive behavior
[ ] UI-010: Check all pages for overflow or layout issues

#### 8.2 Forms & Inputs

[ ] UI-011: Check all forms have clear labels for fields
[ ] UI-012: Verify required fields are marked with asterisk (\*)
[ ] UI-013: Test dropdown menus (product type, category, supplier, status)
[ ] UI-014: Test date picker opens and allows date selection
[ ] UI-015: Verify dates format correctly (YYYY-MM-DD)
[ ] UI-016: Test product autocomplete search shows suggestions
[ ] UI-017: Fill form and click Cancel - verify form resets
[ ] UI-018: Test form validation errors display clearly

#### 8.3 Tables & Data Display

[ ] UI-019: Check all tables display columns correctly
[ ] UI-020: Verify table headers are clear and descriptive
[ ] UI-021: Check data alignment (numbers right-aligned, text left-aligned)
[ ] UI-022: Test table pagination if more than 10 records
[ ] UI-023: Verify page navigation controls work
[ ] UI-024: Check status tags show correct colors (Active=Green, Inactive=Red)
[ ] UI-025: Verify action buttons (Edit, Delete, View) are visible and clickable
[ ] UI-026: Test tooltips show on hover over action buttons

#### 8.4 Notifications & Feedback

[ ] UI-027: Perform successful create/update/delete - verify green success toast shows
[ ] UI-028: Trigger validation error - verify red error toast shows
[ ] UI-029: Check success toast auto-dismisses after 3-5 seconds
[ ] UI-030: Trigger slow operation - verify loading spinner appears
[ ] UI-031: Verify buttons are disabled during loading
[ ] UI-032: Click delete - verify confirmation dialog appears
[ ] UI-033: Check confirmation dialog has clear warning message
[ ] UI-034: Test Cancel button in confirmation dialog
[ ] UI-035: View empty lists - verify friendly "No items found" message shows
[ ] UI-036: Check empty state has "Add" button visible

---

### Test Suite: INTEGRATION

[ ] INT-001: Create product, then create stock receipt with that product
[ ] INT-002: Verify stock entries are created automatically from receipt
[ ] INT-003: Create supplier, then create stock receipt for that supplier
[ ] INT-004: View supplier products - should show products from receipts
[ ] INT-005: Create receipt with multiple products - verify all stock entries created
[ ] INT-006: Edit product details - verify existing stock entries remain intact
[ ] INT-007: Edit supplier details - verify existing receipts remain intact
[ ] INT-008: Complete a draft receipt - verify stock entries are created
[ ] INT-009: Cancel a completed receipt - verify behavior (stock adjustment if implemented)
[ ] INT-010: Create receipt, navigate away, return - verify data persists
[ ] INT-011: Perform CRUD operations - verify list auto-refreshes
[ ] INT-012: Test session persistence across app restarts
[ ] INT-013: Verify data consistency between receipts and stock entries
[ ] INT-014: Create item and check list updates automatically
[ ] INT-015: Edit item and verify list refreshes immediately
[ ] INT-016: Delete item and verify list updates (no manual refresh needed)
[ ] INT-017: Open app in 2 windows (if possible)
[ ] INT-018: Perform operations in both windows
[ ] INT-019: Check data consistency and synchronization across windows
[ ] INT-020: Login and perform operations
[ ] INT-021: Check session timeout behavior (if implemented)
[ ] INT-022: Verify re-login is required after session expires

---

## 10. Performance & Stability

### Test Suite: PERFORMANCE

[ ] PERF-001: Measure app startup time - should be under 5 seconds
[ ] PERF-002: Navigate between pages - should load in under 2 seconds each
[ ] PERF-003: Add 100+ products - verify list still loads smoothly
[ ] PERF-004: Create 50+ stock receipts - verify list performance
[ ] PERF-005: Test search with large dataset - should respond in under 1 second
[ ] PERF-006: Use app for extended period - monitor memory usage in task manager
[ ] PERF-007: Check for memory leaks - memory should remain stable
[ ] PERF-008: Click buttons rapidly - app should not crash or freeze
[ ] PERF-009: Keep app open for hours - verify no performance degradation
[ ] PERF-010: Compare performance with empty database
[ ] PERF-011: Compare performance with large dataset
[ ] PERF-012: Verify queries are optimized and indexes help (if implemented)

---

## Test Execution Summary

## Test Execution Summary

**Authentication & User Management:** \_\_/8 tests passed  
**Product Management:** \_\_/17 tests passed  
**Stock Receipt System:** \_\_/50 tests passed  
**Supplier Management:** \_\_/19 tests passed  
**Search & Filter:** \_\_/20 tests passed  
**Data Validation:** \_\_/19 tests passed  
**Error Handling:** \_\_/9 tests passed  
**UI/UX & Navigation:** \_\_/36 tests passed  
**Integration Tests:** \_\_/13 tests passed  
**Performance & Stability:** \_\_/10 tests passed

**Total Tests:** ~200  
**Pass Rate:** \_\_\_\_%

---

## Issues Found

| Issue ID | Severity | Test ID | Description | Status | Fix Notes |
| -------- | -------- | ------- | ----------- | ------ | --------- |
| ISS-001  | High     |         |             | Open   |           |
| ISS-002  | Medium   |         |             | Open   |           |
| ISS-003  | Low      |         |             | Open   |           |

**Severity Levels:**

- **Critical**: App crash, data loss, security issue
- **High**: Feature doesn't work, blocks testing
- **Medium**: Feature works but with issues
- **Low**: UI/UX issues, minor bugs

---

## Recommendations for Phase 3

Based on testing results, list any improvements or fixes needed before proceeding to Phase 3:

1. ***
2. ***
3. ***

---

## Sign-Off

**Tested By**: **\*\***\_\_\_**\*\***  
**Date**: **\*\***\_\_\_**\*\***  
**Phase 2 Testing Complete**: [ ] Yes [ ] No  
**Ready for Phase 3**: [ ] Yes [ ] No

**Notes**:

---

---

---

---

## 11. Sales History & Management

### Test Suite: SALES_HISTORY

**Objective**: Verify sales history viewing, filtering, date range picker, auto-trigger filters, and sales editing with item management

#### 11.1 Access Sales History Page

[ ] SALES-001: Navigate to Sales section in sidebar
[ ] SALES-002: Verify "Sales History" menu item is present
[ ] SALES-003: Click on "Sales History" menu item
[ ] SALES-004: Verify Sales History page loads successfully
[ ] SALES-005: Verify page header shows "Sales History" title
[ ] SALES-006: Verify Filters panel is visible with date range picker, payment method, and payment status dropdowns
[ ] SALES-007: Verify Clear and Refresh buttons are present
[ ] SALES-008: Verify DataTable displays with pagination controls

#### 11.2 View All Sales

[ ] SALES-009: On initial load, verify all sales are displayed
[ ] SALES-010: Verify DataTable columns: ID, Date & Time, Items, Total Amount, Discount, Tax, Paid, Payment Method, Payment Status, User, Actions
[ ] SALES-011: Verify sales are sorted by date descending (newest first)
[ ] SALES-012: Check Date & Time column shows formatted date and time
[ ] SALES-013: Check Items column shows count of items in sale
[ ] SALES-014: Check Total Amount, Discount, Tax, Paid display with "Rs." prefix and 2 decimals
[ ] SALES-015: Check Payment Method column shows Cash/Card/Other with color badges
[ ] SALES-016: Check Payment Status column shows Pending/Partial/Paid with color badges (red/yellow/green)
[ ] SALES-017: Check User column shows cashier's full name
[ ] SALES-018: Verify Actions column has View and Edit buttons

#### 11.3 Date Range Filter (Calendar with Range Selection)

[ ] SALES-019: Click on Date Range Calendar field in Filters panel
[ ] SALES-020: Verify Calendar popup opens with range selection mode
[ ] SALES-021: Click on a start date in the calendar
[ ] SALES-022: Click on an end date (after start date)
[ ] SALES-023: Verify both dates are highlighted in the calendar
[ ] SALES-024: Verify filter applies automatically without clicking "Apply" button
[ ] SALES-025: Verify DataTable refreshes and shows only sales within selected date range
[ ] SALES-026: Verify sales outside date range are hidden
[ ] SALES-027: Select same date for start and end (single day filter)
[ ] SALES-028: Verify only sales from that specific day are shown
[ ] SALES-029: Clear date range by clicking "X" button
[ ] SALES-030: Verify all sales are displayed again

#### 11.4 Payment Method Filter (Auto-Trigger)

[ ] SALES-031: Open Payment Method dropdown in Filters panel
[ ] SALES-032: Verify dropdown shows options: All, Cash, Card, Other
[ ] SALES-033: Select "Cash" from dropdown
[ ] SALES-034: Verify filter applies automatically (no Apply button needed)
[ ] SALES-035: Verify DataTable refreshes and shows only Cash sales
[ ] SALES-036: Verify sales with Card or Other payment methods are hidden
[ ] SALES-037: Select "Card" from dropdown
[ ] SALES-038: Verify only Card sales are shown
[ ] SALES-039: Select "Other" from dropdown
[ ] SALES-040: Verify only Other payment method sales are shown
[ ] SALES-041: Select "All" from dropdown
[ ] SALES-042: Verify all sales regardless of payment method are shown

#### 11.5 Payment Status Filter (Auto-Trigger)

[ ] SALES-043: Open Payment Status dropdown in Filters panel
[ ] SALES-044: Verify dropdown shows options: All, Pending, Partial, Paid
[ ] SALES-045: Select "Pending" from dropdown
[ ] SALES-046: Verify filter applies automatically
[ ] SALES-047: Verify only sales with Pending status are shown (red badge)
[ ] SALES-048: Select "Partial" from dropdown
[ ] SALES-049: Verify only sales with Partial status are shown (yellow badge)
[ ] SALES-050: Select "Paid" from dropdown
[ ] SALES-051: Verify only sales with Paid status are shown (green badge)
[ ] SALES-052: Select "All" from dropdown
[ ] SALES-053: Verify all sales regardless of payment status are shown

#### 11.6 Combined Filters

[ ] SALES-054: Select a date range
[ ] SALES-055: Select payment method "Cash"
[ ] SALES-056: Verify only Cash sales within date range are shown
[ ] SALES-057: Add payment status filter "Paid"
[ ] SALES-058: Verify only Paid Cash sales within date range are shown (all 3 filters active)
[ ] SALES-059: Change one filter while others are active
[ ] SALES-060: Verify results update correctly based on new filter combination
[ ] SALES-061: Verify all filters apply automatically without manual trigger

#### 11.7 Clear Filters Button

[ ] SALES-062: Apply multiple filters (date range, payment method, payment status)
[ ] SALES-063: Verify filtered results are displayed
[ ] SALES-064: Click "Clear" button
[ ] SALES-065: Verify Date Range Calendar is cleared
[ ] SALES-066: Verify Payment Method dropdown is reset to "All"
[ ] SALES-067: Verify Payment Status dropdown is reset to "All"
[ ] SALES-068: Verify all sales are displayed again

#### 11.8 Refresh Button

[ ] SALES-069: Make a new sale in POS (in another window/tab if possible)
[ ] SALES-070: Return to Sales History page
[ ] SALES-071: Click "Refresh" button in filters panel
[ ] SALES-072: Verify button shows loading spinner during refresh
[ ] SALES-073: Verify DataTable refreshes with latest sales data
[ ] SALES-074: Verify newly created sale appears in the list

#### 11.9 View Sale Details (Read-Only)

[ ] SALES-075: Click eye icon (View Details) on any sale row
[ ] SALES-076: Verify "Sale Details" dialog opens
[ ] SALES-077: Verify dialog displays sale information: Date & Time, Payment Method, Payment Status, User (Cashier)
[ ] SALES-078: Verify Sale Items table shows: Product Name, Unit Price, Quantity, Subtotal
[ ] SALES-079: Verify Batch Number is displayed per item
[ ] SALES-080: Verify Summary section shows: Subtotal, Discount, Tax, Total Amount
[ ] SALES-081: Verify all prices display with "Rs." prefix and 2 decimal places
[ ] SALES-082: Verify payment method and status badges display with correct colors
[ ] SALES-083: Click "Close" button in dialog footer
[ ] SALES-084: Verify dialog closes and returns to sales list

#### 11.10 Edit Sale (Basic Fields)

[ ] SALES-085: Click edit icon (pencil) on any sale row
[ ] SALES-086: Verify "Edit Sale" dialog opens (800px width, maximizable)
[ ] SALES-087: Verify dialog shows sale ID in header (e.g., "Edit Sale #123")
[ ] SALES-088: Verify editable items DataTable is displayed
[ ] SALES-089: Verify editable fields: Discount, Tax, Payment Method, Payment Status, Notes
[ ] SALES-090: Change Discount value to 50
[ ] SALES-091: Verify Total Amount recalculates automatically: `subtotal - 50 + tax`
[ ] SALES-092: Change Tax value to 100
[ ] SALES-093: Verify Total Amount recalculates: `subtotal - discount + 100`
[ ] SALES-094: Change Payment Method from Cash to Card
[ ] SALES-095: Verify dropdown updates correctly
[ ] SALES-096: Change Payment Status from Pending to Paid
[ ] SALES-097: Verify dropdown updates correctly
[ ] SALES-098: Enter notes: "Customer requested discount"
[ ] SALES-099: Click "Update Sale" button
[ ] SALES-100: Verify success toast appears: "Sale updated successfully"
[ ] SALES-101: Verify dialog closes automatically
[ ] SALES-102: Verify sales list refreshes with updated data
[ ] SALES-103: Verify updated discount, tax, payment method, and status are visible in list

#### 11.11 Edit Sale Items - Quantity Increase

[ ] SALES-104: Click edit icon on a sale with 2+ items
[ ] SALES-105: Verify items table shows: Product, Unit Price, Quantity (+/- buttons), Subtotal, Remove button
[ ] SALES-106: Note original quantity of first item (e.g., 2)
[ ] SALES-107: Click "+" button on first item to increase quantity to 3
[ ] SALES-108: Verify quantity field updates to 3
[ ] SALES-109: Verify item subtotal recalculates: `unit_price × 3`
[ ] SALES-110: Verify Sale Total recalculates automatically
[ ] SALES-111: Click "Update Sale" button
[ ] SALES-112: Verify success toast appears
[ ] SALES-113: Check database: Verify stock was deducted by 1 unit (increase from 2 to 3)
[ ] SALES-114: Verify stock deduction used FIFO method (oldest batch first)
[ ] SALES-115: Verify sale item quantity is updated in database
[ ] SALES-116: Verify sale subtotal and total_amount are recalculated in database

#### 11.12 Edit Sale Items - Quantity Decrease

[ ] SALES-117: Click edit icon on a sale with item quantity > 1
[ ] SALES-118: Note original quantity of item (e.g., 5)
[ ] SALES-119: Click "-" button to decrease quantity to 4
[ ] SALES-120: Verify quantity field updates to 4
[ ] SALES-121: Verify item subtotal recalculates: `unit_price × 4`
[ ] SALES-122: Verify Sale Total recalculates automatically
[ ] SALES-123: Click "Update Sale" button
[ ] SALES-124: Verify success toast appears
[ ] SALES-125: Check database: Verify 1 unit was returned to original stock batch
[ ] SALES-126: Verify stock entry quantity_remaining increased by 1
[ ] SALES-127: Verify sale item quantity is updated to 4 in database
[ ] SALES-128: Verify sale subtotal and total_amount are recalculated

#### 11.13 Edit Sale Items - Unit Price Change

[ ] SALES-129: Click edit icon on any sale
[ ] SALES-130: Click on Unit Price field of first item
[ ] SALES-131: Change unit price from (e.g., 100.00) to 120.00
[ ] SALES-132: Press Tab or click outside field
[ ] SALES-133: Verify item subtotal recalculates: `120.00 × quantity`
[ ] SALES-134: Verify Sale Total recalculates automatically
[ ] SALES-135: Click "Update Sale" button
[ ] SALES-136: Verify success toast appears
[ ] SALES-137: Check database: Verify sale item unit_price is updated to 120.00
[ ] SALES-138: Verify sale item subtotal is updated
[ ] SALES-139: Verify sale total_amount is recalculated
[ ] SALES-140: Verify stock is NOT affected (no deduction or return)

#### 11.14 Edit Sale Items - Remove Item

[ ] SALES-141: Click edit icon on a sale with 3+ items
[ ] SALES-142: Note total number of items (e.g., 3)
[ ] SALES-143: Note quantity of second item (e.g., 2 units)
[ ] SALES-144: Click "Remove" button (trash icon) on second item
[ ] SALES-145: Verify item is removed from table
[ ] SALES-146: Verify items count decreases (from 3 to 2)
[ ] SALES-147: Verify Sale Total recalculates without removed item
[ ] SALES-148: Click "Update Sale" button
[ ] SALES-149: Verify success toast appears
[ ] SALES-150: Check database: Verify 2 units were returned to original stock batch
[ ] SALES-151: Verify stock entry quantity_remaining increased by 2
[ ] SALES-152: Verify sale item record is deleted from database
[ ] SALES-153: Verify sale subtotal and total_amount are recalculated
[ ] SALES-154: Verify sale items count is updated

#### 11.15 Edit Sale Items - Minimum Item Validation

[ ] SALES-155: Click edit icon on a sale with exactly 1 item
[ ] SALES-156: Try to click "Remove" button on the only item
[ ] SALES-157: Verify error toast appears: "Cannot remove last item. Sale must have at least one item."
[ ] SALES-158: Verify item is NOT removed
[ ] SALES-159: Verify sale remains editable

#### 11.16 Edit Sale Items - Stock Availability Validation

[ ] SALES-160: Click edit icon on a sale
[ ] SALES-161: Try to increase quantity to more than available stock
[ ] SALES-162: Click "Update Sale" button
[ ] SALES-163: Verify error toast appears: "Insufficient stock"
[ ] SALES-164: Verify sale is NOT updated
[ ] SALES-165: Verify dialog remains open for correction
[ ] SALES-166: Reduce quantity to available stock level
[ ] SALES-167: Click "Update Sale" and verify success

#### 11.17 Edit Sale - Combined Item Changes

[ ] SALES-168: Click edit on a sale with 3 items
[ ] SALES-169: Increase quantity of item 1 from 2 to 4 (+2 units)
[ ] SALES-170: Decrease quantity of item 2 from 5 to 3 (-2 units)
[ ] SALES-171: Change unit price of item 3 from 100 to 150
[ ] SALES-172: Remove item 4 (if exists) or add discount of 50
[ ] SALES-173: Change Payment Status to "Paid"
[ ] SALES-174: Add notes: "Multiple adjustments made"
[ ] SALES-175: Verify Sale Total recalculates correctly based on all changes
[ ] SALES-176: Click "Update Sale" button
[ ] SALES-177: Verify success toast appears
[ ] SALES-178: Check database for item 1: Verify 2 units deducted from stock (FIFO)
[ ] SALES-179: Check database for item 2: Verify 2 units returned to original batch
[ ] SALES-180: Check database for item 3: Verify unit_price updated, stock unchanged
[ ] SALES-181: Verify all sale totals recalculated correctly
[ ] SALES-182: Verify payment status updated to "Paid"

#### 11.18 Edit Sale - Cancel Changes

[ ] SALES-183: Click edit icon on any sale
[ ] SALES-184: Make several changes: edit quantities, prices, discount, tax
[ ] SALES-185: Click "Cancel" button
[ ] SALES-186: Verify dialog closes
[ ] SALES-187: Verify NO changes were saved to database
[ ] SALES-188: Verify stock was NOT adjusted
[ ] SALES-189: Re-open same sale for editing
[ ] SALES-190: Verify all original values are intact

#### 11.19 Edit Sale - Transaction Rollback on Error

[ ] SALES-191: Simulate error scenario: Stop database service or create constraint violation
[ ] SALES-192: Click edit on a sale and make changes
[ ] SALES-193: Click "Update Sale" button
[ ] SALES-194: Verify error toast appears with descriptive message
[ ] SALES-195: Check database: Verify NO partial changes were saved
[ ] SALES-196: Verify stock adjustments were rolled back
[ ] SALES-197: Verify sale data remains in original state
[ ] SALES-198: Verify sale items remain unchanged
[ ] SALES-199: Restore database service
[ ] SALES-200: Retry edit and verify success

#### 11.20 Edit Sale - Real-Time Calculation Accuracy

[ ] SALES-201: Click edit on a sale
[ ] SALES-202: Note original values: Subtotal, Discount, Tax, Total
[ ] SALES-203: Increase item quantity and verify subtotal increases
[ ] SALES-204: Verify Total = Subtotal - Discount + Tax
[ ] SALES-205: Change discount to 100 and verify Total decreases by 100
[ ] SALES-206: Change tax to 50 and verify Total increases by 50
[ ] SALES-207: Remove an item and verify Subtotal decreases by item's subtotal
[ ] SALES-208: Verify Total recalculates correctly after item removal
[ ] SALES-209: Change unit price of item and verify cascading calculations
[ ] SALES-210: Verify all displayed amounts match manual calculations

#### 11.21 DataTable Features

[ ] SALES-211: Verify DataTable has alternating row colors (striped)
[ ] SALES-212: Verify pagination controls are visible at bottom
[ ] SALES-213: Verify default rows per page is 10
[ ] SALES-214: Click page number button (2, 3, etc.) if available
[ ] SALES-215: Verify next page of sales is displayed
[ ] SALES-216: Change rows per page to 20
[ ] SALES-217: Verify DataTable shows up to 20 rows
[ ] SALES-218: Verify current page report shows "Showing X to Y of Z sales"

#### 11.22 Empty States

[ ] SALES-219: Filter sales with criteria that returns no results
[ ] SALES-220: Verify DataTable shows empty state message
[ ] SALES-221: Verify message displays "No sales found"
[ ] SALES-222: Clear filters and verify sales reappear

#### 11.23 Error Handling

[ ] SALES-223: Stop the backend/database service
[ ] SALES-224: Try to load Sales History page
[ ] SALES-225: Verify error toast appears with "Failed to load sales history" message
[ ] SALES-226: Restart backend and click Refresh
[ ] SALES-227: Verify sales load successfully
[ ] SALES-228: Click Edit on a sale while backend is stopped
[ ] SALES-229: Verify error toast shows "Failed to load sale details"
[ ] SALES-230: Try updating sale with backend stopped
[ ] SALES-231: Verify error toast shows "Failed to update sale"

#### 11.24 Performance

[ ] SALES-232: Create 100+ sales across multiple days
[ ] SALES-233: Load Sales History page and measure load time (should be < 2 seconds)
[ ] SALES-234: Verify pagination handles large dataset smoothly
[ ] SALES-235: Apply filters on large dataset
[ ] SALES-236: Verify filtering completes within 500ms
[ ] SALES-237: Open edit dialog for multiple sales sequentially
[ ] SALES-238: Verify each dialog loads within 500ms
[ ] SALES-239: Make complex changes (multiple items) and save
[ ] SALES-240: Verify update completes within 2 seconds

#### 11.25 UI/UX Consistency

[ ] SALES-241: Compare Sales History filter layout with Stock Receipts and Products
[ ] SALES-242: Verify filter section uses flex layout consistently
[ ] SALES-243: Verify font sizes match (0.85em for labels)
[ ] SALES-244: Verify Clear and Refresh buttons are in same position as other pages
[ ] SALES-245: Verify date range picker matches Stock Receipts implementation
[ ] SALES-246: Verify edit dialog width is 800px (consistent with other edit dialogs)
[ ] SALES-247: Verify edit dialog is maximizable
[ ] SALES-248: Verify color scheme for badges matches other components

---

## Test Execution Summary

**Authentication & User Management:** \_\_/20 tests passed  
**Product Management:** \_\_/52 tests passed  
**Stock Receipt System:** \_\_/50 tests passed  
**Supplier Management:** \_\_/52 tests passed  
**Stock Batches Management:** \_\_/136 tests passed  
**Search & Filter:** \_\_/47 tests passed  
**Data Validation:** \_\_/19 tests passed  
**Error Handling:** \_\_/9 tests passed  
**UI/UX & Navigation:** \_\_/36 tests passed  
**Integration Tests:** \_\_/22 tests passed  
**Performance & Stability:** \_\_/12 tests passed  
**Sales History & Management:** \_\_/248 tests passed

**Total Tests:** ~703  
**Pass Rate:** \_\_\_\_%

---

## Issues Found

| Issue ID | Severity | Test ID | Description | Status | Fix Notes |
| -------- | -------- | ------- | ----------- | ------ | --------- |
| ISS-001  | High     |         |             | Open   |           |
| ISS-002  | Medium   |         |             | Open   |           |
| ISS-003  | Low      |         |             | Open   |           |

**Severity Levels:**

- **Critical**: App crash, data loss, security issue
- **High**: Feature doesn't work, blocks testing
- **Medium**: Feature works but with issues
- **Low**: UI/UX issues, minor bugs

---

## Recommendations for Phase 4

Based on testing results, list any improvements or fixes needed before proceeding to Phase 4:

1. ***
2. ***
3. ***

---

## Sign-Off

**Tested By**: **\*\***\_\_\_**\*\***  
**Date**: **\*\***\_\_\_**\*\***  
**Phase 3 Testing Complete**: [ ] Yes [ ] No  
**Ready for Phase 4**: [ ] Yes [ ] No

**Notes**:

---

**End of Test Plan**
