# Bug Fixes and Issue Resolution Log

This document tracks all bug fixes and issues resolved in the Pharmacy POS System.

---

## December 31, 2025

### 1. Stock Receipt Editing - Completed Status Restriction

**Issue**: Only draft stock receipts could be edited. Completed receipts showed no edit button.

**Impact**: Users couldn't make corrections to completed receipts, requiring cancellation and re-creation.

**Root Cause**:

- Frontend condition: `v-if="data.status === 'draft'"` in `StockReceiptList.vue`
- Backend validation: `if (receipt.status !== 'draft')` throwing error

**Solution**:

- Updated `StockReceiptList.vue` line 177: Changed condition to `v-if="data.status === 'draft' || data.status === 'completed'"`
- Updated `StockReceiptController.js` line 305-307: Changed to only block cancelled receipts
- Now allows editing both draft and completed receipts
- Only cancelled receipts are locked from editing

**Files Modified**:

- `src/views/stockReceipts/StockReceiptList.vue`
- `backend-project/src/controllers/StockReceiptController.js`

**Testing**:

- ✅ Can edit draft receipts
- ✅ Can edit completed receipts
- ✅ Cannot edit cancelled receipts
- ✅ Edit button shows for appropriate statuses

---

### 2. Free Quantity Not Loading in Edit Mode

**Issue**: When editing existing stock receipts, free quantities weren't populated in the form.

**Impact**: Users lost free item data when editing receipts, or had to manually re-enter free quantities.

**Root Cause**: The `loadReceipt()` function in `CreateStockReceipt.vue` wasn't mapping the `free_quantity` field from API response to the form entries.

**Solution**:

- Updated `CreateStockReceipt.vue` around line 1168
- Added `freeQuantity: entry.free_quantity || 0` to the entry mapping
- Free quantities now properly load when editing

**Code Change**:

```javascript
// Before
entry: {
  quantity: entry.quantity_received,
  // free_quantity was missing
}

// After
entry: {
  quantity: entry.quantity_received,
  freeQuantity: entry.free_quantity || 0,
}
```

**Files Modified**:

- `src/views/stockReceipts/CreateStockReceipt.vue`

**Testing**:

- ✅ Free quantities load when editing receipts
- ✅ Can modify free quantities in edit mode
- ✅ Free items save correctly on update

---

### 3. Receipt Number Validation Error for Drafts

**Issue**: Saving stock receipts as drafts failed with error: "Validation error: Validation notEmpty on receipt_number failed"

**Impact**: Users couldn't save drafts, blocking workflow for partial receipt entry.

**Root Cause**:

- Database model requires `receipt_number` to be non-empty
- Frontend only generated receipt numbers when status was 'completed'
- Drafts were submitted with empty `receipt_number`

**Solution**:

- Updated `CreateStockReceipt.vue` around line 1005
- Changed condition from `if (status === 'completed' && !header.value.receiptNumber)`
- To: `if (!header.value.receiptNumber)`
- Now generates receipt number for both draft and completed statuses

**Code Change**:

```javascript
// Before
if (status === 'completed' && !header.value.receiptNumber) {
  // generate receipt number
}

// After
if (!header.value.receiptNumber) {
  // generate receipt number for both draft and completed
}
```

**Files Modified**:

- `src/views/stockReceipts/CreateStockReceipt.vue`

**Testing**:

- ✅ Drafts save successfully with auto-generated receipt number
- ✅ Completed receipts also get auto-generated numbers
- ✅ No validation errors on save

---

### 4. Wrong Product Edited/Deleted in Reversed Display

**Issue**: When clicking edit/delete on a product line in the stock receipt table, the wrong product was targeted.

**Symptoms**:

- Clicking 1st product opened 5th product
- Clicking 2nd product opened 4th product
- Clicking 5th product opened 1st product

**Impact**: Users edited/deleted wrong products, causing data corruption and confusion.

**Root Cause**:

- Table displays products in reversed order (newest first) via `displayEntries = [...entries].reverse()`
- `editProductLine(index)` and `removeProductLine(index)` used the index directly on original `entries` array
- Index mapping was inverted

**Solution**:

- Updated `CreateStockReceipt.vue` functions:
  - `editProductLine` (line 767)
  - `removeProductLine` (line 828)
- Added index conversion: `const originalIndex = entries.value.length - 1 - index`
- Now correctly maps reversed display index to original array index

**Code Change**:

```javascript
// Before
const editProductLine = (index) => {
  const entry = entries.value[index]; // Wrong index
};

// After
const editProductLine = (index) => {
  const originalIndex = entries.value.length - 1 - index; // Convert
  const entry = entries.value[originalIndex]; // Correct index
};
```

**Files Modified**:

- `src/views/stockReceipts/CreateStockReceipt.vue`

**Testing**:

- ✅ Editing 1st displayed product opens correct product
- ✅ Editing last displayed product opens correct product
- ✅ Deleting products removes the correct one
- ✅ Works with any number of products in list

---

## Summary

**Total Issues Fixed**: 4  
**Files Modified**: 3

- `src/views/stockReceipts/CreateStockReceipt.vue` (3 fixes)
- `src/views/stockReceipts/StockReceiptList.vue` (1 fix)
- `backend-project/src/controllers/StockReceiptController.js` (1 fix)

**Impact**:

- ✅ Improved stock receipt editing workflow
- ✅ Fixed data loss issues with free items
- ✅ Eliminated validation errors
- ✅ Corrected UI interaction bugs

---

## Testing Checklist

When testing stock receipt functionality, verify:

- [ ] Can create new stock receipt with free items
- [ ] Can save as draft with auto-generated receipt number
- [ ] Can edit draft receipts
- [ ] Can edit completed receipts
- [ ] Cannot edit cancelled receipts
- [ ] Free quantities load correctly when editing
- [ ] Can modify free quantities in edit mode
- [ ] Editing specific product line opens correct product
- [ ] Deleting specific product line removes correct product
- [ ] Display order doesn't affect edit/delete operations

---

**Last Updated**: December 31, 2025  
**Maintenance**: Update this file whenever bugs are fixed
