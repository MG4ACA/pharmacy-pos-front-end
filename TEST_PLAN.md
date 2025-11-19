# Pharmacy POS System - Test Plan

**Project**: Pharmacy Standalone POS  
**Version**: 1.0  
**Last Updated**: November 19, 2025  
**Test Type**: Manual Testing - UI & Functional  
**Tester**: ******\_\_\_******  
**Test Date**: ******\_\_\_******

---

## 📋 Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Product Management (CRUD)](#2-product-management-crud)
3. [Stock Entry System](#3-stock-entry-system)
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

| Test ID  | Test Case                              | Steps                                                                                        | Expected Result                                                                                    | Status | Notes |
| -------- | -------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------ | ----- |
| AUTH-001 | **First Run - Default Admin Creation** | 1. Start app for first time<br>2. Check database for default user                            | Default admin user created:<br>- Username: `admin`<br>- Password: `admin123`<br>- Status: `active` | [ ]    |       |
| AUTH-002 | **Login - Valid Credentials**          | 1. Open app<br>2. Enter username: `admin`<br>3. Enter password: `admin123`<br>4. Click Login | Successfully logged in<br>Redirected to Dashboard<br>Success toast message shown                   | [ ]    |       |
| AUTH-003 | **Login - Invalid Username**           | 1. Enter invalid username<br>2. Enter any password<br>3. Click Login                         | Error message: "Invalid credentials"<br>Remain on login page<br>Red error toast shown              | [ ]    |       |
| AUTH-004 | **Login - Invalid Password**           | 1. Enter username: `admin`<br>2. Enter wrong password<br>3. Click Login                      | Error message: "Invalid credentials"<br>Remain on login page<br>Red error toast shown              | [ ]    |       |
| AUTH-005 | **Login - Empty Fields**               | 1. Leave fields empty<br>2. Click Login                                                      | Form validation errors shown<br>Username required<br>Password required                             | [ ]    |       |
| AUTH-006 | **Logout Functionality**               | 1. Login successfully<br>2. Click logout button in navbar<br>3. Verify redirect              | Logged out successfully<br>Redirected to login page<br>Session cleared                             | [ ]    |       |
| AUTH-007 | **Session Persistence**                | 1. Login<br>2. Close app<br>3. Reopen app                                                    | Should remain logged in<br>OR require login based on session settings                              | [ ]    |       |
| AUTH-008 | **Auth Route Guards**                  | 1. Try accessing `/dashboard` without login<br>2. Type URL directly                          | Redirected to login page<br>Protected routes inaccessible                                          | [ ]    |       |

**Test Data:**

- Default Username: `admin`
- Default Password: `admin123`

---

## 2. Product Management (CRUD)

### Test Suite: PRODUCT

#### 2.1 View/List Products

| Test ID  | Test Case                  | Steps                                                         | Expected Result                                                                                                       | Status | Notes |
| -------- | -------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| PROD-001 | **Display Product List**   | 1. Navigate to Inventory > Products<br>2. Verify table loads  | DataTable displays with columns:<br>- ID<br>- Name<br>- Generic Name<br>- Category<br>- Type<br>- Status<br>- Actions | [ ]    |       |
| PROD-002 | **Empty State**            | 1. Navigate to Products (on fresh DB)<br>2. Check empty state | "No products found" message shown<br>Add Product button visible                                                       | [ ]    |       |
| PROD-003 | **Product List with Data** | 1. Add products via sample data<br>2. View product list       | All products displayed correctly<br>Pagination works if >10 items<br>Data formatted properly                          | [ ]    |       |

#### 2.2 Create Product

| Test ID  | Test Case                                 | Steps                                                                                                                                                                                                                                                               | Expected Result                                                                                                          | Status | Notes                |
| -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------- |
| PROD-004 | **Add Product - Complete Form**           | 1. Click "Add Product" button<br>2. Fill all fields:<br>- Name: `Paracetamol 500mg`<br>- Generic: `Paracetamol`<br>- Type: `Tablet`<br>- Category: `Medicine`<br>- Barcode: `123456789`<br>- Reorder Level: `50`<br>- Description: `Pain reliever`<br>3. Click Save | Product created successfully<br>Success toast shown<br>Redirected to product list<br>New product visible in table        | [ ]    |                      |
| PROD-005 | **Add Product - Minimum Required Fields** | 1. Click "Add Product"<br>2. Fill required fields only:<br>- Name: `Aspirin`<br>- Type: `Tablet`<br>- Category: `Medicine`<br>3. Click Save                                                                                                                         | Product created with:<br>- Filled fields saved<br>- Optional fields null<br>- Status: `active` (default)                 | [ ]    |                      |
| PROD-006 | **Add Product - Sample Data Button**      | 1. Click "Add Product"<br>2. Click "Fill Sample Data" button<br>3. Verify fields populated<br>4. Click Save                                                                                                                                                         | Sample data fills form correctly<br>Product saved successfully                                                           | [ ]    |                      |
| PROD-007 | **Add Product - Validation Errors**       | 1. Click "Add Product"<br>2. Leave required fields empty<br>3. Click Save                                                                                                                                                                                           | Validation errors shown:<br>- "Product name required"<br>- "Type required"<br>- "Category required"<br>Product NOT saved | [ ]    |                      |
| PROD-008 | **Add Product - Duplicate Barcode**       | 1. Add product with barcode `111222`<br>2. Try adding another with same barcode<br>3. Click Save                                                                                                                                                                    | Error: "Barcode already exists"<br>Product NOT saved<br>(If barcode validation implemented)                              | [ ]    | Check if implemented |

#### 2.3 Edit Product

| Test ID  | Test Case                               | Steps                                                                                    | Expected Result                                                                             | Status | Notes |
| -------- | --------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------ | ----- |
| PROD-009 | **Edit Product - Update Name**          | 1. Click edit icon on any product<br>2. Change name to `Updated Name`<br>3. Click Update | Product updated successfully<br>Success toast shown<br>Name updated in list                 | [ ]    |       |
| PROD-010 | **Edit Product - Update All Fields**    | 1. Edit any product<br>2. Change all editable fields<br>3. Click Update                  | All fields updated correctly<br>Changes reflected in database<br>Success notification shown | [ ]    |       |
| PROD-011 | **Edit Product - Cancel Operation**     | 1. Click edit on product<br>2. Make changes<br>3. Click Cancel                           | No changes saved<br>Returned to list<br>Original data intact                                | [ ]    |       |
| PROD-012 | **Edit Product - Clear Required Field** | 1. Edit product<br>2. Clear product name<br>3. Click Update                              | Validation error shown<br>Product NOT updated<br>Error message displayed                    | [ ]    |       |
| PROD-013 | **Edit Product - Change Status**        | 1. Edit product<br>2. Change status to "Inactive"<br>3. Save                             | Status updated to inactive<br>Product marked inactive in list<br>Status tag color changes   | [ ]    |       |

#### 2.4 Delete Product

| Test ID  | Test Case                     | Steps                                                           | Expected Result                                                                                   | Status | Notes          |
| -------- | ----------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------ | -------------- |
| PROD-014 | **Delete Product - Confirm**  | 1. Click delete icon<br>2. Confirm deletion in dialog           | Confirmation dialog shows:<br>- Warning icon<br>- Product name<br>- Confirm/Cancel buttons        | [ ]    |                |
| PROD-015 | **Delete Product - Execute**  | 1. Click delete<br>2. Confirm                                   | Product soft deleted (status=inactive)<br>Success toast shown<br>Product still in DB but inactive | [ ]    |                |
| PROD-016 | **Delete Product - Cancel**   | 1. Click delete<br>2. Click Cancel                              | Dialog closes<br>Product NOT deleted<br>Remains in list                                           | [ ]    |                |
| PROD-017 | **Delete Product with Stock** | 1. Create product with stock entries<br>2. Try deleting product | Deletion blocked OR<br>Warning shown about existing stock<br>(Based on implementation)            | [ ]    | Check behavior |

**Test Data:**

```javascript
Sample Products:
1. Paracetamol 500mg (Tablet, Medicine)
2. Coca Cola 1.5L (Bottle, Beverage)
3. Marie Biscuit (Packet, Biscuit)
4. Dettol Soap (Unit, Personal Care)
```

---

## 3. Stock Entry System

### Test Suite: STOCK

#### 3.1 Add Stock Entry

| Test ID   | Test Case                                 | Steps                                                                                                                                                                                                                                            | Expected Result                                                                                | Status | Notes          |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------ | -------------- |
| STOCK-001 | **Add Stock - Complete Entry**            | 1. Navigate to Stock Entry<br>2. Select product: `Paracetamol`<br>3. Select supplier<br>4. Batch Number: `BATCH001`<br>5. Quantity: `100`<br>6. Cost Price: `10.00`<br>7. Selling Price: `15.00`<br>8. Expiry Date: Future date<br>9. Click Save | Stock entry created<br>Success toast shown<br>Form resets<br>Profit margin calculated (33.33%) | [ ]    |                |
| STOCK-002 | **Add Stock - Profit Margin Calculation** | 1. Enter Cost: `100`<br>2. Enter Selling: `150`<br>3. Observe profit margin                                                                                                                                                                      | Profit margin: `50%`<br>Color coded:<br>- Green if >20%<br>- Orange if 10-20%<br>- Red if <10% | [ ]    |                |
| STOCK-003 | **Add Stock - Sample Data Button**        | 1. Click "Fill Sample Data"<br>2. Verify data populated<br>3. Save                                                                                                                                                                               | Sample data fills correctly<br>Entry saved successfully                                        | [ ]    |                |
| STOCK-004 | **Add Stock - Supplier Required**         | 1. Fill form without supplier<br>2. Click Save                                                                                                                                                                                                   | Error: "Supplier is required"<br>Red asterisk on supplier field<br>Entry NOT saved             | [ ]    |                |
| STOCK-005 | **Add Stock - Product Required**          | 1. Fill form without product<br>2. Click Save                                                                                                                                                                                                    | Error: "Product is required"<br>Entry NOT saved                                                | [ ]    |                |
| STOCK-006 | **Add Stock - Quantity Validation**       | 1. Enter quantity: `0` or negative<br>2. Click Save                                                                                                                                                                                              | Error: "Quantity must be positive"<br>Entry NOT saved                                          | [ ]    |                |
| STOCK-007 | **Add Stock - Price Validation**          | 1. Enter cost price: `0`<br>2. Click Save                                                                                                                                                                                                        | Error: "Cost price must be positive"<br>Entry NOT saved                                        | [ ]    |                |
| STOCK-008 | **Add Stock - Expiry Date (Optional)**    | 1. Fill form without expiry date<br>2. Save                                                                                                                                                                                                      | Entry saved successfully<br>Expiry date stored as null                                         | [ ]    |                |
| STOCK-009 | **Add Stock - Past Expiry Date**          | 1. Select expiry date in past<br>2. Try saving                                                                                                                                                                                                   | Warning shown (if implemented)<br>OR entry saved with warning                                  | [ ]    | Check behavior |

#### 3.2 View Stock History

| Test ID   | Test Case                     | Steps                                                         | Expected Result                                                                                                                                                                    | Status | Notes |
| --------- | ----------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| STOCK-010 | **View Stock History**        | 1. Navigate to Stock History<br>2. Verify table loads         | DataTable displays:<br>- Product name<br>- Supplier name<br>- Batch number<br>- Quantity received<br>- Remaining quantity<br>- Cost/Selling price<br>- Expiry date<br>- Entry date | [ ]    |       |
| STOCK-011 | **Empty Stock History**       | 1. View history on fresh DB                                   | "No stock entries found"<br>Empty state shown                                                                                                                                      | [ ]    |       |
| STOCK-012 | **Filter by Product**         | 1. Enter product name in search<br>2. Click Search            | Shows only matching product entries<br>Other entries filtered out                                                                                                                  | [ ]    |       |
| STOCK-013 | **Filter by Supplier**        | 1. Select supplier from dropdown<br>2. Click Search           | Shows only that supplier's entries<br>Filtered correctly                                                                                                                           | [ ]    |       |
| STOCK-014 | **Filter by Date Range**      | 1. Select start date<br>2. Select end date<br>3. Click Search | Shows entries within date range<br>Outside range filtered out                                                                                                                      | [ ]    |       |
| STOCK-015 | **Filter - Has Stock Toggle** | 1. Toggle "Has Stock" to ON<br>2. Click Search                | Shows only entries with remaining qty > 0<br>Empty batches hidden                                                                                                                  | [ ]    |       |
| STOCK-016 | **View Expiring Soon**        | 1. Click "Expiring Soon" button<br>2. Verify results          | Shows products expiring in 30 days<br>Sorted by expiry date<br>Expiring tags color-coded                                                                                           | [ ]    |       |
| STOCK-017 | **Clear Filters**             | 1. Apply filters<br>2. Click "Clear" button                   | All filters reset<br>Full list shown                                                                                                                                               | [ ]    |       |
| STOCK-018 | **View Batch Details**        | 1. Click on any batch row<br>2. Verify details dialog         | Dialog shows:<br>- Complete batch info<br>- Product details<br>- Supplier details<br>- Dates and prices                                                                            | [ ]    |       |
| STOCK-019 | **Pagination**                | 1. Add >10 stock entries<br>2. View history                   | Pagination controls shown<br>Can navigate pages<br>Page size options work                                                                                                          | [ ]    |       |

#### 3.3 Stock Deduction (FIFO)

| Test ID   | Test Case                                | Steps                                                                                                        | Expected Result                                                                 | Status | Notes         |
| --------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------ | ------------- |
| STOCK-020 | **FIFO Logic - Single Batch**            | 1. Add stock entry: 100 units<br>2. Deduct 30 units (via sale)<br>3. Check remaining                         | Remaining: 70 units<br>Deducted from oldest batch<br>Quantity updated correctly | [ ]    | Via POS later |
| STOCK-021 | **FIFO Logic - Multiple Batches**        | 1. Add Batch1: 50 units (older)<br>2. Add Batch2: 50 units (newer)<br>3. Deduct 70 units<br>4. Check batches | Batch1: 0 remaining<br>Batch2: 30 remaining<br>Deduction follows FIFO order     | [ ]    | Via POS later |
| STOCK-022 | **FIFO Logic - Exact Batch Depletion**   | 1. Add batch: 100 units<br>2. Deduct exactly 100 units<br>3. Verify batch                                    | Batch remaining: 0<br>Batch marked depleted<br>No errors                        | [ ]    | Via POS later |
| STOCK-023 | **Stock Deduction - Insufficient Stock** | 1. Product has 10 units<br>2. Try deducting 20 units<br>3. Check response                                    | Error: "Insufficient stock"<br>No deduction occurs<br>Stock unchanged           | [ ]    | Via POS later |

**Test Data:**

```javascript
Stock Entry 1:
- Product: Paracetamol
- Supplier: ABC Pharma
- Batch: BATCH001
- Quantity: 100
- Cost: 10.00
- Selling: 15.00
- Expiry: 2026-12-31

Stock Entry 2:
- Product: Coca Cola
- Supplier: Beverage Co
- Batch: BATCH002
- Quantity: 50
- Cost: 50.00
- Selling: 75.00
- Expiry: 2025-12-31
```

---

## 4. Supplier Management

### Test Suite: SUPPLIER

#### 4.1 View/List Suppliers

| Test ID  | Test Case                 | Steps                                             | Expected Result                                                                                                                   | Status | Notes |
| -------- | ------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| SUPP-001 | **Display Supplier List** | 1. Navigate to Suppliers<br>2. Verify table loads | DataTable displays:<br>- ID<br>- Supplier name<br>- Contact person<br>- Email & Phone<br>- Address<br>- Status (tag)<br>- Actions | [ ]    |       |
| SUPP-002 | **Empty Supplier List**   | 1. View on fresh DB                               | "No suppliers found"<br>Add Supplier button visible                                                                               | [ ]    |       |

#### 4.2 Create Supplier

| Test ID  | Test Case                               | Steps                                                                                                                                                                                        | Expected Result                                                                                      | Status | Notes |
| -------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------ | ----- |
| SUPP-003 | **Add Supplier - Complete Form**        | 1. Click "Add Supplier"<br>2. Fill form:<br>- Name: `ABC Pharma`<br>- Contact: `John Doe`<br>- Email: `john@abc.com`<br>- Phone: `+94112345678`<br>- Address: `123 Main St`<br>3. Click Save | Supplier created<br>Success toast shown<br>Added to top of list<br>Status: Active (default)          | [ ]    |       |
| SUPP-004 | **Add Supplier - Required Fields Only** | 1. Click "Add Supplier"<br>2. Enter only Name: `XYZ Supplier`<br>3. Click Save                                                                                                               | Supplier created<br>Optional fields null<br>Saved successfully                                       | [ ]    |       |
| SUPP-005 | **Add Supplier - Sample Data**          | 1. Click "Add Supplier"<br>2. Click "Fill Sample Data"<br>3. Save                                                                                                                            | Sample data populated:<br>- Name: ABC Pharma<br>- Email, phone, address filled<br>Saved successfully | [ ]    |       |
| SUPP-006 | **Add Supplier - Name Required**        | 1. Click "Add Supplier"<br>2. Leave name empty<br>3. Click Save                                                                                                                              | Error: "Supplier name is required"<br>Supplier NOT saved<br>Red error shown                          | [ ]    |       |
| SUPP-007 | **Add Supplier - Invalid Email**        | 1. Enter name: `Test Supplier`<br>2. Enter email: `invalidemail`<br>3. Click Save                                                                                                            | Error: "Invalid email format"<br>Supplier NOT saved                                                  | [ ]    |       |
| SUPP-008 | **Add Supplier - Valid Email Format**   | 1. Enter valid email formats:<br>- `test@example.com`<br>- `user.name@domain.co.uk`<br>2. Save                                                                                               | Email accepted<br>Supplier saved<br>Format validated correctly                                       | [ ]    |       |

#### 4.3 Edit Supplier

| Test ID  | Test Case                            | Steps                                                                              | Expected Result                                                     | Status | Notes |
| -------- | ------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------ | ----- |
| SUPP-009 | **Edit Supplier - Update Details**   | 1. Click edit icon<br>2. Change contact person<br>3. Update phone<br>4. Click Save | Supplier updated<br>Changes saved correctly<br>Success toast shown  | [ ]    |       |
| SUPP-010 | **Edit Supplier - Change Status**    | 1. Edit supplier<br>2. Change status to Inactive<br>3. Save                        | Status updated<br>Tag shows "Inactive" (red)<br>Updated in database | [ ]    |       |
| SUPP-011 | **Edit Supplier - Clear Name**       | 1. Edit supplier<br>2. Clear name field<br>3. Try saving                           | Error: "Supplier name is required"<br>Changes NOT saved             | [ ]    |       |
| SUPP-012 | **Edit Supplier - Email Validation** | 1. Edit supplier<br>2. Enter invalid email<br>3. Try saving                        | Error: "Invalid email format"<br>Changes NOT saved                  | [ ]    |       |

#### 4.4 Delete Supplier

| Test ID  | Test Case                     | Steps                                  | Expected Result                                                                             | Status | Notes |
| -------- | ----------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- | ------ | ----- |
| SUPP-013 | **Delete Supplier - Confirm** | 1. Click delete icon<br>2. View dialog | Confirmation dialog shows:<br>- Warning icon<br>- Supplier name<br>- Confirm/Cancel buttons | [ ]    |       |
| SUPP-014 | **Delete Supplier - Execute** | 1. Confirm delete                      | Supplier soft deleted<br>Status set to Inactive<br>Success toast shown<br>Still in DB       | [ ]    |       |
| SUPP-015 | **Delete Supplier - Cancel**  | 1. Click delete<br>2. Click Cancel     | Dialog closes<br>Supplier NOT deleted<br>Remains active                                     | [ ]    |       |

#### 4.5 View Products from Supplier

| Test ID  | Test Case                         | Steps                                                       | Expected Result                                                                                                                   | Status | Notes |
| -------- | --------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| SUPP-016 | **View Supplier Products**        | 1. Click eye icon (View Products)<br>2. Verify dialog opens | Dialog displays:<br>- Supplier name in header<br>- DataTable of products<br>- Product details (ID, Name, Generic, Category, Type) | [ ]    |       |
| SUPP-017 | **View Products - With Products** | 1. Supplier with stock entries<br>2. Click view products    | Shows all unique products<br>Purchased from this supplier<br>No duplicates                                                        | [ ]    |       |
| SUPP-018 | **View Products - No Products**   | 1. New supplier (no stock)<br>2. Click view products        | "No products found for this supplier"<br>Empty state shown                                                                        | [ ]    |       |
| SUPP-019 | **View Products - Close Dialog**  | 1. Open products dialog<br>2. Click Close button            | Dialog closes<br>Returns to supplier list                                                                                         | [ ]    |       |

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

| Test ID    | Test Case                        | Steps                                                                                                    | Expected Result                                                             | Status | Notes |
| ---------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------ | ----- |
| SEARCH-001 | **Product - Search by Name**     | 1. Go to Product List<br>2. Enter partial name: `para`<br>3. Click Search                                | Shows products containing "para"<br>(e.g., Paracetamol)<br>Case-insensitive | [ ]    |       |
| SEARCH-002 | **Product - Search by Barcode**  | 1. Enter barcode in search<br>2. Click Search                                                            | Shows exact product match<br>OR products with matching barcode              | [ ]    |       |
| SEARCH-003 | **Product - Filter by Category** | 1. Select category: `Medicine`<br>2. Click Search                                                        | Shows only Medicine products<br>Other categories filtered out               | [ ]    |       |
| SEARCH-004 | **Product - Filter by Type**     | 1. Select type: `Tablet`<br>2. Click Search                                                              | Shows only Tablet products<br>Other types filtered out                      | [ ]    |       |
| SEARCH-005 | **Product - Filter by Status**   | 1. Select status: `Active`<br>2. Click Search                                                            | Shows only active products<br>Inactive products hidden                      | [ ]    |       |
| SEARCH-006 | **Product - Combined Filters**   | 1. Enter name: `para`<br>2. Select category: `Medicine`<br>3. Select status: `Active`<br>4. Click Search | Shows products matching ALL filters<br>AND logic applied                    | [ ]    |       |
| SEARCH-007 | **Product - No Results**         | 1. Search for non-existent product<br>2. Click Search                                                    | "No products found"<br>Empty state shown                                    | [ ]    |       |
| SEARCH-008 | **Product - Clear Filters**      | 1. Apply multiple filters<br>2. Click "Clear" button                                                     | All filters reset<br>Full product list shown                                | [ ]    |       |

#### 5.2 Stock History Search

| Test ID    | Test Case                      | Steps                                                                                            | Expected Result                                                | Status | Notes |
| ---------- | ------------------------------ | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ------ | ----- |
| SEARCH-009 | **Stock - Filter by Product**  | 1. Enter product name<br>2. Click Search                                                         | Shows only that product's entries<br>Other products hidden     | [ ]    |       |
| SEARCH-010 | **Stock - Filter by Supplier** | 1. Select supplier dropdown<br>2. Click Search                                                   | Shows only that supplier's entries<br>Filtered correctly       | [ ]    |       |
| SEARCH-011 | **Stock - Date Range Filter**  | 1. Select start: 2025-01-01<br>2. Select end: 2025-12-31<br>3. Click Search                      | Shows entries in date range<br>Outside range excluded          | [ ]    |       |
| SEARCH-012 | **Stock - Has Stock Toggle**   | 1. Toggle "Has Stock" ON<br>2. Click Search                                                      | Shows only entries where remaining > 0<br>Empty batches hidden | [ ]    |       |
| SEARCH-013 | **Stock - Combined Filters**   | 1. Select product<br>2. Select supplier<br>3. Set date range<br>4. Toggle has stock<br>5. Search | Results match ALL filters<br>AND logic applied                 | [ ]    |       |
| SEARCH-014 | **Stock - Clear All Filters**  | 1. Apply all filters<br>2. Click Clear                                                           | All filters reset<br>Full history shown                        | [ ]    |       |

#### 5.3 Supplier Search

| Test ID    | Test Case                        | Steps                                                              | Expected Result                                                        | Status | Notes |
| ---------- | -------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- | ------ | ----- |
| SEARCH-015 | **Supplier - Search by Name**    | 1. Enter supplier name<br>2. Click Search                          | Shows matching suppliers<br>Partial match works                        | [ ]    |       |
| SEARCH-016 | **Supplier - Search by Contact** | 1. Enter contact person name<br>2. Click Search                    | Shows suppliers with matching contact<br>Search works on contact field | [ ]    |       |
| SEARCH-017 | **Supplier - Search by Email**   | 1. Enter email or part of it<br>2. Click Search                    | Shows suppliers with matching email<br>Partial email search works      | [ ]    |       |
| SEARCH-018 | **Supplier - Search by Phone**   | 1. Enter phone number<br>2. Click Search                           | Shows suppliers with matching phone<br>Partial phone search works      | [ ]    |       |
| SEARCH-019 | **Supplier - Filter by Status**  | 1. Select status: `Active`<br>2. Click Search                      | Shows only active suppliers<br>Inactive suppliers hidden               | [ ]    |       |
| SEARCH-020 | **Supplier - Combined Search**   | 1. Enter search term<br>2. Select status filter<br>3. Click Search | Results match both criteria<br>AND logic applied                       | [ ]    |       |

---

## 6. Data Validation

### Test Suite: VALIDATION

#### 6.1 Required Field Validation

| Test ID | Test Case                      | Steps                                                                                                    | Expected Result                                                                                                            | Status | Notes |
| ------- | ------------------------------ | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| VAL-001 | **Product - Required Fields**  | 1. Try saving product without:<br>- Name<br>- Type<br>- Category                                         | Validation errors shown:<br>- "Name is required"<br>- "Type is required"<br>- "Category is required"<br>Form NOT submitted | [ ]    |       |
| VAL-002 | **Stock - Required Fields**    | 1. Try saving stock without:<br>- Product<br>- Supplier<br>- Quantity<br>- Cost Price<br>- Selling Price | Errors shown for each field<br>Red asterisks visible<br>Form NOT submitted                                                 | [ ]    |       |
| VAL-003 | **Supplier - Required Fields** | 1. Try saving supplier without name                                                                      | Error: "Supplier name is required"<br>Form NOT submitted                                                                   | [ ]    |       |

#### 6.2 Format Validation

| Test ID | Test Case                      | Steps                                                                                              | Expected Result                                    | Status | Notes |
| ------- | ------------------------------ | -------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------ | ----- |
| VAL-004 | **Email - Valid Format**       | Test emails:<br>- `test@example.com` ✓<br>- `user.name@domain.co.uk` ✓<br>- `name+tag@email.com` ✓ | All valid emails accepted                          | [ ]    |       |
| VAL-005 | **Email - Invalid Format**     | Test emails:<br>- `invalidemail` ✗<br>- `@example.com` ✗<br>- `user@` ✗<br>- `user @example.com` ✗ | All rejected with error:<br>"Invalid email format" | [ ]    |       |
| VAL-006 | **Numeric - Positive Numbers** | 1. Try negative quantity: `-5`<br>2. Try zero: `0`<br>3. Try negative price: `-10`                 | Error: "Must be positive"<br>Values NOT accepted   | [ ]    |       |
| VAL-007 | **Numeric - Decimal Prices**   | 1. Enter price: `10.50`<br>2. Enter price: `99.99`                                                 | Decimal values accepted<br>Formatted to 2 decimals | [ ]    |       |

#### 6.3 Business Logic Validation

| Test ID | Test Case                           | Steps                                                                            | Expected Result                                                                        | Status | Notes                |
| ------- | ----------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------ | -------------------- |
| VAL-008 | **Stock - Cost vs Selling Price**   | 1. Cost Price: `100`<br>2. Selling Price: `80`                                   | Warning shown (optional):<br>OR allowed but profit margin negative<br>Margin shows red | [ ]    | Check behavior       |
| VAL-009 | **Stock - Expiry Date Past**        | 1. Select past date for expiry<br>2. Try saving                                  | Warning shown OR blocked<br>Based on implementation                                    | [ ]    | Check behavior       |
| VAL-010 | **Stock - Batch Number Uniqueness** | 1. Add stock with batch: `BATCH001`<br>2. Try adding same batch for same product | Warning OR allowed<br>(Batches can repeat if different dates)                          | [ ]    | Check behavior       |
| VAL-011 | **Product - Duplicate Barcode**     | 1. Create product with barcode<br>2. Try creating another with same barcode      | Error OR warning shown<br>Based on implementation                                      | [ ]    | Check if implemented |

---

## 7. Error Handling

### Test Suite: ERROR

| Test ID | Test Case                     | Steps                                                                        | Expected Result                                                               | Status | Notes         |
| ------- | ----------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------ | ------------- |
| ERR-001 | **Database Connection Error** | 1. Stop MySQL<br>2. Start app<br>3. Try any operation                        | Error message displayed<br>"Database connection failed"<br>App doesn't crash  | [ ]    |               |
| ERR-002 | **API/IPC Call Failure**      | 1. Simulate IPC failure<br>2. Try CRUD operation                             | Error toast shown<br>User-friendly message<br>No console errors exposed to UI | [ ]    | Dev test      |
| ERR-003 | **Network Timeout**           | Simulate slow operation                                                      | Loading state shown<br>Timeout error after delay<br>User notified             | [ ]    | Dev test      |
| ERR-004 | **Invalid Data Type**         | 1. Enter text in number field<br>2. Try saving                               | Validation prevents submission<br>OR error shown<br>No crash                  | [ ]    |               |
| ERR-005 | **Null/Undefined Handling**   | 1. Load product with null fields<br>2. Display in UI                         | Shows as "-" or "N/A"<br>No "undefined" or "null" text<br>No UI breaks        | [ ]    |               |
| ERR-006 | **Empty Array Handling**      | 1. Load empty product list<br>2. Load empty stock history                    | Empty state shown<br>"No items found"<br>No errors                            | [ ]    |               |
| ERR-007 | **Large Number Handling**     | 1. Enter very large quantity: `99999999`<br>2. Enter large price: `99999.99` | Handled gracefully<br>OR validation max limit shown<br>No overflow            | [ ]    |               |
| ERR-008 | **Special Characters**        | 1. Enter special chars in name: `Test!@#$%`<br>2. Save                       | Accepted OR sanitized<br>No SQL injection<br>No errors                        | [ ]    |               |
| ERR-009 | **SQL Injection Attempt**     | 1. Enter: `'; DROP TABLE products; --`<br>2. Try saving                      | Input sanitized<br>No SQL executed<br>Safe handling                           | [ ]    | Security test |

---

## 8. UI/UX & Navigation

### Test Suite: UI

#### 8.1 Layout & Navigation

| Test ID | Test Case                       | Steps                                                                                                    | Expected Result                                                                       | Status | Notes          |
| ------- | ------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------ | -------------- |
| UI-001  | **Sidebar Navigation**          | 1. Click each menu item:<br>- Dashboard<br>- Products<br>- Stock Entry<br>- Stock History<br>- Suppliers | Each route loads correctly<br>Active menu highlighted<br>No errors                    | [ ]    |                |
| UI-002  | **Breadcrumbs**                 | 1. Navigate through pages<br>2. Check breadcrumb trail                                                   | Breadcrumbs show current path<br>Clickable to go back                                 | [ ]    | If implemented |
| UI-003  | **Navbar Elements**             | 1. Check navbar displays:<br>- App title/logo<br>- User name<br>- Logout button                          | All elements visible<br>Properly aligned<br>Responsive                                | [ ]    |                |
| UI-004  | **Responsive Design - Desktop** | 1. View on desktop (1920x1080)<br>2. Check all pages                                                     | Layout looks good<br>No overflow<br>Proper spacing                                    | [ ]    |                |
| UI-005  | **Responsive Design - Tablet**  | 1. Resize to tablet (768px)<br>2. Check all pages                                                        | Responsive layout<br>Sidebar collapses (if implemented)<br>Tables scroll horizontally | [ ]    |                |
| UI-006  | **Responsive Design - Mobile**  | 1. Resize to mobile (375px)<br>2. Check key pages                                                        | Mobile-friendly layout<br>Touch-friendly buttons<br>Readable text                     | [ ]    | Optional       |

#### 8.2 Forms & Inputs

| Test ID | Test Case                         | Steps                                                                         | Expected Result                                                                      | Status | Notes |
| ------- | --------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------ | ----- |
| UI-007  | **Form Field Labels**             | 1. Check all forms<br>2. Verify labels                                        | All fields have labels<br>Required fields marked with \*<br>Clear and descriptive    | [ ]    |       |
| UI-008  | **Dropdown Functionality**        | 1. Click dropdowns:<br>- Product type<br>- Category<br>- Supplier<br>- Status | Dropdown opens<br>Options displayed<br>Selection works<br>Can clear selection        | [ ]    |       |
| UI-009  | **Date Picker**                   | 1. Click date fields<br>2. Select dates                                       | Calendar popup opens<br>Date selection works<br>Formatted correctly (YYYY-MM-DD)     | [ ]    |       |
| UI-010  | **AutoComplete - Product Search** | 1. Type in product search<br>2. View suggestions<br>3. Select product         | Suggestions appear as typing<br>Matching products shown<br>Selection populates field | [ ]    |       |
| UI-011  | **Form Reset**                    | 1. Fill form<br>2. Click Cancel or Reset                                      | Form clears all fields<br>Returns to default state<br>No data retained               | [ ]    |       |

#### 8.3 Tables & Data Display

| Test ID | Test Case                | Steps                                            | Expected Result                                                       | Status | Notes          |
| ------- | ------------------------ | ------------------------------------------------ | --------------------------------------------------------------------- | ------ | -------------- |
| UI-012  | **DataTable Columns**    | 1. Check product table<br>2. Verify columns      | All columns visible<br>Headers clear<br>Data aligned properly         | [ ]    |                |
| UI-013  | **DataTable Sorting**    | 1. Click column headers<br>2. Test sorting       | Columns sortable<br>Asc/Desc toggle<br>Sort icon shown                | [ ]    | If implemented |
| UI-014  | **DataTable Pagination** | 1. Add >10 records<br>2. Check pagination        | Page controls shown<br>Can navigate pages<br>Page size dropdown works | [ ]    |                |
| UI-015  | **Status Tags**          | 1. View items with status<br>2. Check tag colors | Active = Green<br>Inactive = Red<br>Clear visual distinction          | [ ]    |                |
| UI-016  | **Action Buttons**       | 1. Check action column<br>2. Hover over buttons  | Tooltips show on hover<br>Icons clear and intuitive<br>Proper spacing | [ ]    |                |

#### 8.4 Notifications & Feedback

| Test ID | Test Case                | Steps                                                    | Expected Result                                                                                | Status | Notes |
| ------- | ------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ | ----- |
| UI-017  | **Success Toast**        | 1. Perform successful action<br>(Create, Update, Delete) | Green success toast shown<br>Clear message<br>Auto-dismiss in 3-5 seconds                      | [ ]    |       |
| UI-018  | **Error Toast**          | 1. Trigger validation error<br>2. Trigger API error      | Red error toast shown<br>Clear error message<br>Auto-dismiss or closable                       | [ ]    |       |
| UI-019  | **Loading States**       | 1. Trigger slow operation<br>2. Observe loading          | Loading spinner shown<br>Buttons disabled<br>"Loading..." text shown                           | [ ]    |       |
| UI-020  | **Confirmation Dialogs** | 1. Click delete<br>2. View confirmation                  | Modal dialog shown<br>Clear warning message<br>Confirm/Cancel buttons<br>Modal overlay visible | [ ]    |       |
| UI-021  | **Empty States**         | 1. View empty lists<br>2. Check messages                 | Friendly empty state message<br>"No items found"<br>Add button visible                         | [ ]    |       |

---

## 9. Integration Tests

### Test Suite: INTEGRATION

| Test ID | Test Case                                 | Steps                                                                                                                       | Expected Result                                                                          | Status | Notes    |
| ------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ | -------- |
| INT-001 | **Product + Stock Flow**                  | 1. Create product<br>2. Add stock entry for product<br>3. View stock history<br>4. Verify product shows stock               | End-to-end flow works<br>Product has stock<br>Stock history displays<br>Data consistent  | [ ]    |          |
| INT-002 | **Supplier + Stock + Product**            | 1. Create supplier<br>2. Create product<br>3. Add stock with supplier & product<br>4. View supplier products                | Complete flow works<br>Stock entry saved<br>Supplier shows product<br>Relations correct  | [ ]    |          |
| INT-003 | **Stock Entry + History + Batch Details** | 1. Add stock entry<br>2. View in stock history<br>3. Click batch details<br>4. Verify all data matches                      | Data consistency across views<br>Batch details correct<br>No data loss                   | [ ]    |          |
| INT-004 | **Multiple Stock Entries - Same Product** | 1. Create product<br>2. Add 3 stock entries (different batches)<br>3. View stock by product<br>4. Check FIFO order          | All 3 batches shown<br>Sorted by entry_date ASC<br>FIFO order maintained                 | [ ]    |          |
| INT-005 | **Product Edit + Stock Integrity**        | 1. Product with stock<br>2. Edit product details<br>3. Check stock entries                                                  | Product updated<br>Stock entries intact<br>Relations maintained                          | [ ]    |          |
| INT-006 | **Supplier Edit + Stock Integrity**       | 1. Supplier with stock entries<br>2. Edit supplier details<br>3. Check stock entries                                        | Supplier updated<br>Stock entries intact<br>Relations maintained                         | [ ]    |          |
| INT-007 | **Filter Persistence**                    | 1. Apply filters on product list<br>2. Navigate away<br>3. Return to product list                                           | Filters reset OR persisted<br>Based on design decision<br>Consistent behavior            | [ ]    |          |
| INT-008 | **Data Refresh After CRUD**               | 1. Create item<br>2. Check list updates<br>3. Edit item<br>4. Check list updates<br>5. Delete item<br>6. Check list updates | List refreshes automatically<br>New data shown immediately<br>No need for manual refresh | [ ]    |          |
| INT-009 | **Multi-User Simulation**                 | 1. Open app in 2 windows (if possible)<br>2. Perform operations in both<br>3. Check data consistency                        | Data syncs correctly<br>OR isolation maintained<br>No data corruption                    | [ ]    | Advanced |
| INT-010 | **Session Management**                    | 1. Login<br>2. Perform operations<br>3. Check session timeout (if implemented)<br>4. Verify re-login required               | Session handled correctly<br>User remains logged in OR<br>Timeout works as expected      | [ ]    |          |

---

## 10. Performance & Stability

### Test Suite: PERFORMANCE

| Test ID  | Test Case                         | Steps                                                                                    | Expected Result                                                                        | Status | Notes         |
| -------- | --------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------ | ------------- |
| PERF-001 | **App Startup Time**              | 1. Close app<br>2. Start app<br>3. Measure time to dashboard                             | App loads in <5 seconds<br>Reasonable startup time                                     | [ ]    |               |
| PERF-002 | **Page Load Time**                | 1. Navigate to each page<br>2. Measure load time                                         | Each page loads in <2 seconds<br>Smooth transitions                                    | [ ]    |               |
| PERF-003 | **Large Dataset - Products**      | 1. Add 100+ products<br>2. Load product list<br>3. Check performance                     | List loads smoothly<br>Pagination helps<br>No lag or freeze                            | [ ]    |               |
| PERF-004 | **Large Dataset - Stock History** | 1. Add 200+ stock entries<br>2. Load stock history<br>3. Check performance               | History loads smoothly<br>Pagination works<br>Filters responsive                       | [ ]    |               |
| PERF-005 | **Search Performance**            | 1. Search in large dataset<br>2. Measure response time                                   | Search results in <1 second<br>Responsive typing                                       | [ ]    |               |
| PERF-006 | **Memory Usage**                  | 1. Use app for extended period<br>2. Check task manager<br>3. Monitor memory             | No memory leaks<br>Memory usage stable<br>App doesn't slow down                        | [ ]    |               |
| PERF-007 | **Database Queries**              | 1. Monitor console for query logs<br>2. Check for N+1 queries<br>3. Verify eager loading | Optimized queries<br>No excessive DB calls<br>Includes used properly                   | [ ]    | Dev test      |
| PERF-008 | **Concurrent Operations**         | 1. Perform multiple actions quickly<br>2. Click buttons rapidly<br>3. Check stability    | No crashes<br>Debouncing works<br>Operations queued properly                           | [ ]    |               |
| PERF-009 | **Long-Running App**              | 1. Keep app open for hours<br>2. Perform various operations<br>3. Monitor stability      | No degradation<br>No crashes<br>Memory stable                                          | [ ]    | Extended test |
| PERF-010 | **Database Size Impact**          | 1. App with empty DB<br>2. App with large dataset<br>3. Compare performance              | Performance acceptable with data<br>Queries optimized<br>Indexes help (if implemented) | [ ]    |               |

---

## Test Execution Summary

### Phase 1: Authentication & Foundation

- **Total Tests**: 8
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### Phase 2.1: Product Management

- **Total Tests**: 17
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### Phase 2.2: Stock Entry System

- **Total Tests**: 23
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### Phase 2.3: Supplier Management

- **Total Tests**: 19
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### Search & Filters

- **Total Tests**: 20
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### Validation

- **Total Tests**: 11
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### Error Handling

- **Total Tests**: 9
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### UI/UX

- **Total Tests**: 21
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### Integration

- **Total Tests**: 10
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

### Performance

- **Total Tests**: 10
- **Passed**: \_\_\_
- **Failed**: \_\_\_
- **Skipped**: \_\_\_

---

## Overall Test Results

**Total Test Cases**: 148  
**Passed**: **_  
**Failed**: _**  
**Skipped**: **_  
**Pass Rate**: _**%

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

**Tested By**: ******\_\_\_******  
**Date**: ******\_\_\_******  
**Phase 2 Testing Complete**: [ ] Yes [ ] No  
**Ready for Phase 3**: [ ] Yes [ ] No

**Notes**:

---

---

---

---

**End of Test Plan**
