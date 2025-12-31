# Free Items Feature - Quick Start Guide

## 🚀 Getting Started

This guide will help you quickly get the Free Items feature up and running.

---

## ⚡ 3-Step Setup

### Step 1: Sync Database Schema

The free items feature requires new database columns. Run the database sync command:

```powershell
cd backend-project
npm run db:create
```

**What this does:**

- Adds `free_quantity` and `total_quantity` columns to `stock_entries` table
- Adds `is_free_item` and `free_item_quantity` columns to `sale_items` table

**Expected output:**

```
Executing (default): ALTER TABLE `stock_entries` ADD `free_quantity` INTEGER DEFAULT 0;
Executing (default): ALTER TABLE `sale_items` ADD `is_free_item` TINYINT(1) DEFAULT 0;
...
Database synchronized successfully
```

### Step 2: Restart Backend Server

```powershell
npm run dev
```

Verify backend is running at http://localhost:3000

### Step 3: Restart Frontend

```powershell
cd ..
npm run dev
```

Access application at http://localhost:5173

---

## ✅ Verify Installation

### Quick Test Workflow

1. **Create Stock Receipt with Free Items**

   - Navigate to: Stock Receipts → Create New
   - Add a product
   - Enter Purchased Quantity: `10`
   - Enter Free Quantity: `2`
   - Save receipt
   - ✅ Should see total quantity = 12
   - ✅ Should see FREE badge in receipt list

2. **Check Inventory**

   - Navigate to: Inventory → Stock Batches
   - ✅ Should see quantity breakdown: "Purchased: 10 | Free: 2"
   - ✅ Should see green FREE badge

3. **Process a Sale**

   - Navigate to: Sales → New Sale
   - Add the same product, quantity: 8
   - Complete sale
   - ✅ Deducts from purchased stock first (FIFO)

4. **View Reports**

   - Navigate to: Reports → Free Items
   - ✅ Should see summary cards
   - ✅ Should see product breakdown

5. **Check Dashboard**
   - Navigate to: Dashboard
   - ✅ Should see "Free Items in Stock" card
   - ✅ Should see "Free Items Revenue" card

---

## 📊 Understanding the Feature

### How Free Items Work

**Scenario**: Supplier gives you "Buy 10, Get 2 Free"

**In Stock Receipt:**

- Purchased Qty: 10 (costs money)
- Free Qty: 2 (zero cost)
- Total Qty: 12

**Cost Calculation:**

- You pay only for 10 items
- Free items have zero cost

**In Sales:**

- All 12 items sell at same price
- System tracks which are from free stock

**Profit Calculation:**

- **Gross Profit**: Includes revenue from selling all 12 items
- **Net Profit**: Only profit from the 10 purchased items
- **Free Items Revenue**: Revenue from selling the 2 free items

### FIFO Deduction Logic

When you sell items, the system deducts in this order:

1. Purchased items first
2. Free items second (only if purchased are exhausted)

**Example:**

```
Batch: 10 purchased + 2 free

Sell 8:  → Deduct 8 purchased  → Remaining: 2 purchased + 2 free
Sell 5:  → Deduct 2 purchased  → Remaining: 0 purchased + 2 free
         → Deduct 3 free       → Remaining: 0 purchased + 0 free (sold out)
```

---

## 🎨 Visual Indicators

Look for these throughout the UI:

- 🎁 **Gift Icon** (`pi-gift`): Indicates free items
- 🏷️ **FREE Badge**: Green tag showing free item count
- 📊 **Breakdown Text**: "Purchased: X | Free: Y | Total: Z"
- 💰 **Dual Profit**: Gross (with free) / Net (without free)

---

## 📍 Where to Find Free Items

### 1. Stock Receipts

**Create Receipt**: `Stock Receipts → Create New`

- Input field for "Free Quantity"
- Total quantity auto-calculates
- Summary shows breakdown

**View Receipt**: Click any receipt

- Columns: Purchased Qty | Free Qty | Total Qty
- FREE badge when free items exist

**Receipt List**: `Stock Receipts → List`

- "Free Items" column with badge

### 2. Inventory

**Stock Batches**: `Inventory → Stock Batches`

- Quantity details with breakdown
- Filter: "Show only free items"

**Product List**: `Inventory → Products`

- Shows free items count below stock

### 3. Sales

**Sales History**: `Sales → History`

- "Free Items" column
- Profit shows gross and net
- Filter: "Has free items"

### 4. Reports

**Free Items Report**: `Reports → Free Items`

- Summary cards (received/sold/stock/revenue)
- Product breakdown table
- CSV export
- Date range filter

### 5. Dashboard

**Main Dashboard**: `Dashboard`

- "Free Items in Stock" card (click to view report)
- "Free Items Revenue" card

---

## 🔍 Sample Data Entry

### Example 1: Simple Receipt

```
Product: Paracetamol 500mg
Supplier: ABC Pharma
Batch: BATCH001
Expiry: 2025-12-31
Cost Price: $5.00

Purchased Quantity: 24
Free Quantity: 4
Total Quantity: 28 (auto-calculated)

Total Amount: $120.00 (24 × $5, free items excluded)
```

### Example 2: Mixed Sale

```
Sale with 3 items sold:
- 2 from purchased stock (cost $5 each)
- 1 from free stock (cost $0)

Selling Price: $8 each
Total Revenue: $24 (3 × $8)
Total Cost: $10 (2 × $5)
Gross Profit: $14
Free Items Revenue: $8 (1 × $8)
Net Profit: $6 ($14 - $8)
```

---

## 🆕 Recent Updates (December 31, 2025)

### Editing Stock Receipts with Free Items

**New Capability**: You can now edit completed stock receipts (not just drafts)!

**What Changed**:

- Edit button now appears for both **draft** and **completed** receipts
- Free quantities are properly loaded when editing existing receipts
- Only **cancelled** receipts cannot be edited

**How to Edit a Receipt**:

1. Go to: Stock Receipts → List
2. Find the receipt (draft or completed)
3. Click the **Edit** (pencil) icon
4. Make your changes to quantities, including free items
5. Save as Draft or Complete Receipt

**Bug Fixes**:

- ✅ Free quantities now load correctly in edit mode
- ✅ Receipt numbers auto-generate for drafts (no more validation errors)
- ✅ Product line editing targets correct product (index mapping fixed)

---

## 🛠️ Troubleshooting

### Issue: "free_quantity column doesn't exist"

**Solution**: Run database sync

```powershell
cd backend-project
npm run db:create
```

### Issue: Free items not showing in UI

**Check:**

1. Backend includes free_quantity in API response
2. Frontend components updated
3. Browser cache cleared (Ctrl+Shift+R)

### Issue: Profit calculations seem wrong

**Verify:**

1. Gross profit = total revenue - purchased cost
2. Net profit = gross profit - free items revenue
3. Free items have zero cost in stock entries

### Issue: FIFO not working correctly

**Check:**

1. StockController.deductStock() implementation
2. Batches ordered by entry_date ASC
3. Deduction logs show purchased vs free breakdown

---

## 📚 Additional Resources

- **Full Implementation Plan**: See `FREE_ITEMS_FEATURE.md`
- **Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md`
- **Development Standards**: See `DEVELOPMENT_STANDARDS.md`
- **Database Schema**: See `backend-project/database-init.sql`

---

## 💡 Pro Tips

1. **Always sync database first** before starting frontend
2. **Use filters** to quickly find receipts/sales with free items
3. **Check utilization %** in reports to track promotion effectiveness
4. **Export reports to CSV** for external analysis
5. **Dashboard cards are clickable** - quick access to detailed report

---

## ✨ Key Features Summary

✅ Track free items separately  
✅ Zero cost accounting for free items  
✅ FIFO stock deduction  
✅ Dual profit calculations (gross & net)  
✅ Visual FREE badges throughout  
✅ Comprehensive reporting  
✅ Dashboard metrics  
✅ CSV export capability  
✅ Date range filtering  
✅ Utilization tracking

---

## 🎯 Next Steps

After setup:

1. Create test stock receipts with free items
2. Process some test sales
3. Generate free items report
4. Verify profit calculations
5. Train staff on new features

**Need Help?** Check the detailed documentation in `FREE_ITEMS_FEATURE.md`

---

**Feature Version**: 1.0  
**Last Updated**: December 31, 2025  
**Status**: ✅ Production Ready (with editing enhancements)
