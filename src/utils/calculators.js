/**
 * Calculation utilities for free items feature
 */

/**
 * Calculate profit with and without free items
 * @param {Array} saleItems - Sale items with free item flags
 * @returns {Object} { totalRevenue, totalCost, grossProfit, netProfit, freeItemsRevenue }
 */
export function calculateProfitBreakdown(saleItems) {
  let totalRevenue = 0;
  let totalCost = 0;
  let freeItemsRevenue = 0;

  saleItems.forEach((item) => {
    const itemRevenue = item.quantity * item.unit_price;
    totalRevenue += itemRevenue;

    // If this sale item has free items
    if (item.is_free_item && item.free_item_quantity > 0) {
      // Calculate revenue from free items
      const freeRevenue = item.free_item_quantity * item.unit_price;
      freeItemsRevenue += freeRevenue;

      // For free items, there's no cost
      // Only add cost for purchased items
      const purchasedQty = item.quantity - item.free_item_quantity;
      totalCost += purchasedQty * (item.cost_price || 0);
    } else {
      // Regular items: all quantity has cost
      totalCost += item.quantity * (item.cost_price || 0);
    }
  });

  return {
    totalRevenue,
    totalCost,
    grossProfit: totalRevenue - totalCost, // Includes free items profit
    netProfit: totalRevenue - totalCost - freeItemsRevenue, // Excludes free items revenue
    freeItemsRevenue,
    grossProfitMargin: totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0,
    netProfitMargin:
      totalRevenue > 0 ? ((totalRevenue - totalCost - freeItemsRevenue) / totalRevenue) * 100 : 0,
  };
}

/**
 * Calculate total quantity including free items
 * @param {number} purchasedQty - Purchased quantity
 * @param {number} freeQty - Free quantity
 * @returns {number} Total quantity
 */
export function calculateTotalQuantity(purchasedQty, freeQty = 0) {
  return (purchasedQty || 0) + (freeQty || 0);
}

/**
 * Calculate utilization percentage for free items
 * @param {number} freeReceived - Total free items received
 * @param {number} freeSold - Total free items sold
 * @returns {number} Utilization percentage
 */
export function calculateFreeItemUtilization(freeReceived, freeSold) {
  if (!freeReceived || freeReceived === 0) return 0;
  return (freeSold / freeReceived) * 100;
}

/**
 * Calculate stock value breakdown (purchased vs free)
 * @param {Array} stockEntries - Stock entries with free_quantity
 * @returns {Object} { totalValue, purchasedValue, freeItemsCount }
 */
export function calculateStockValueBreakdown(stockEntries) {
  let totalValue = 0;
  let purchasedValue = 0;
  let totalFreeItems = 0;

  stockEntries.forEach((entry) => {
    const purchasedQty = (entry.quantity || 0) - (entry.free_quantity || 0);
    const freeQty = entry.free_quantity || 0;
    const costPrice = entry.cost_price || 0;

    // Only purchased items have cost value
    const entryPurchasedValue = purchasedQty * costPrice;
    purchasedValue += entryPurchasedValue;

    // Total value includes all items at cost price (free items are zero cost)
    totalValue += entryPurchasedValue;

    totalFreeItems += freeQty;
  });

  return {
    totalValue,
    purchasedValue,
    freeItemsCount: totalFreeItems,
    freeItemsPercentage:
      stockEntries.length > 0
        ? (totalFreeItems / stockEntries.reduce((sum, e) => sum + (e.quantity || 0), 0)) * 100
        : 0,
  };
}

/**
 * Calculate receipt totals with free items breakdown
 * @param {Array} entries - Receipt entries with quantity and free_quantity
 * @returns {Object} { totalItems, totalPurchased, totalFree, totalAmount }
 */
export function calculateReceiptTotals(entries) {
  let totalPurchased = 0;
  let totalFree = 0;
  let totalAmount = 0;

  entries.forEach((entry) => {
    const purchasedQty = entry.quantity || 0;
    const freeQty = entry.freeQuantity || entry.free_quantity || 0;
    const costPrice = entry.costPrice || entry.cost_price || 0;

    totalPurchased += purchasedQty;
    totalFree += freeQty;

    // Only purchased items contribute to cost
    totalAmount += purchasedQty * costPrice;
  });

  return {
    totalItems: entries.length,
    totalPurchased,
    totalFree,
    totalQuantity: totalPurchased + totalFree,
    totalAmount,
  };
}
