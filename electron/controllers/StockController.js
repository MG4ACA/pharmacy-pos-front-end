import { Op } from 'sequelize';
import { Product, StockEntry, Supplier } from '../database/models/index.js';

class StockController {
  /**
   * Add new stock entry
   * @param {Object} data - Stock entry data
   * @returns {Object} Result with success status and data
   */
  async addStockEntry(data) {
    try {
      const {
        product_id,
        supplier_id,
        batch_number,
        quantity_received,
        cost_price,
        selling_price,
        expiry_date,
        notes,
      } = data;

      // Validate required fields
      if (!product_id || !supplier_id || !quantity_received || !cost_price || !selling_price) {
        return {
          success: false,
          message: 'Product, supplier, quantity, cost price, and selling price are required',
        };
      }

      // Check if product exists
      const product = await Product.findByPk(product_id);
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      // Check if supplier exists
      const supplier = await Supplier.findByPk(supplier_id);
      if (!supplier) {
        return {
          success: false,
          message: 'Supplier not found',
        };
      }

      // Create stock entry
      const stockEntry = await StockEntry.create({
        product_id,
        supplier_id,
        batch_number: batch_number || null,
        quantity_received,
        quantity_remaining: quantity_received, // Initially, remaining equals received
        cost_price,
        selling_price,
        expiry_date: expiry_date || null,
        entry_date: new Date(),
        notes: notes || null,
      });

      // Fetch the created entry with associations
      const createdEntry = await StockEntry.findByPk(stockEntry.id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'barcode'],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name', 'contact_person'],
          },
        ],
        raw: false,
      });

      return {
        success: true,
        message: 'Stock entry added successfully',
        data: createdEntry.toJSON(),
      };
    } catch (error) {
      console.error('Add stock entry error:', error);
      return {
        success: false,
        message: error.message || 'Failed to add stock entry',
      };
    }
  }

  /**
   * Get stock entries by product ID
   * @param {Number} productId - Product ID
   * @returns {Object} Result with success status and data
   */
  async getStockByProduct(productId) {
    try {
      const stockEntries = await StockEntry.findAll({
        where: {
          product_id: productId,
          quantity_remaining: { [Op.gt]: 0 }, // Only entries with remaining stock
        },
        include: [
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name'],
          },
        ],
        order: [
          ['entry_date', 'ASC'], // FIFO: First In First Out
          ['id', 'ASC'],
        ],
        raw: true,
      });

      return {
        success: true,
        data: stockEntries,
      };
    } catch (error) {
      console.error('Get stock by product error:', error);
      return {
        success: false,
        message: 'Failed to fetch stock entries',
        data: [],
      };
    }
  }

  /**
   * Get stock entry history with pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Object} Result with success status and paginated data
   */
  async getStockHistory(params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        product_id,
        supplier_id,
        from_date,
        to_date,
        has_stock, // Filter by entries with remaining stock
      } = params;

      const offset = (page - 1) * limit;
      const where = {};

      // Apply filters
      if (product_id) {
        where.product_id = product_id;
      }

      if (supplier_id) {
        where.supplier_id = supplier_id;
      }

      if (from_date && to_date) {
        where.entry_date = {
          [Op.between]: [new Date(from_date), new Date(to_date)],
        };
      } else if (from_date) {
        where.entry_date = {
          [Op.gte]: new Date(from_date),
        };
      } else if (to_date) {
        where.entry_date = {
          [Op.lte]: new Date(to_date),
        };
      }

      if (has_stock === 'true' || has_stock === true) {
        where.quantity_remaining = {
          [Op.gt]: 0,
        };
      }

      // Get total count
      const total = await StockEntry.count({ where });

      // Get paginated entries
      const entries = await StockEntry.findAll({
        where,
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'barcode'],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name'],
          },
        ],
        order: [
          ['entry_date', 'DESC'],
          ['id', 'DESC'],
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        raw: true,
      });

      return {
        success: true,
        data: entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Get stock history error:', error);
      return {
        success: false,
        message: 'Failed to fetch stock history',
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  }

  /**
   * Get batch details by batch ID
   * @param {Number} batchId - Stock entry (batch) ID
   * @returns {Object} Result with success status and data
   */
  async getBatchDetails(batchId) {
    try {
      const stockEntry = await StockEntry.findByPk(batchId, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'barcode', 'product_type_id', 'category_id'],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name', 'contact_person', 'email', 'phone'],
          },
        ],
        raw: true,
      });

      if (!stockEntry) {
        return {
          success: false,
          message: 'Batch not found',
        };
      }

      return {
        success: true,
        data: stockEntry,
      };
    } catch (error) {
      console.error('Get batch details error:', error);
      return {
        success: false,
        message: 'Failed to fetch batch details',
      };
    }
  }

  /**
   * Deduct stock using FIFO method
   * This method is used when making a sale
   * @param {Number} productId - Product ID
   * @param {Number} quantity - Quantity to deduct
   * @returns {Object} Result with success status and deduction details
   */
  async deductStock(productId, quantity) {
    try {
      let remainingToDeduct = quantity;
      const deductions = [];

      // Get available stock entries ordered by FIFO (oldest first)
      const stockEntries = await StockEntry.findAll({
        where: {
          product_id: productId,
          quantity_remaining: { [Op.gt]: 0 },
        },
        order: [
          ['entry_date', 'ASC'],
          ['id', 'ASC'],
        ],
      });

      if (stockEntries.length === 0) {
        return {
          success: false,
          message: 'No stock available for this product',
        };
      }

      // Calculate total available stock
      const totalAvailable = stockEntries.reduce((sum, entry) => sum + entry.quantity_remaining, 0);

      if (totalAvailable < quantity) {
        return {
          success: false,
          message: `Insufficient stock. Available: ${totalAvailable}, Requested: ${quantity}`,
        };
      }

      // Deduct stock from batches using FIFO
      for (const entry of stockEntries) {
        if (remainingToDeduct <= 0) break;

        const deductFromThisBatch = Math.min(entry.quantity_remaining, remainingToDeduct);

        // Update the stock entry
        await entry.update({
          quantity_remaining: entry.quantity_remaining - deductFromThisBatch,
        });

        deductions.push({
          batch_id: entry.id,
          batch_number: entry.batch_number,
          quantity_deducted: deductFromThisBatch,
          cost_price: entry.cost_price,
          selling_price: entry.selling_price,
        });

        remainingToDeduct -= deductFromThisBatch;
      }

      return {
        success: true,
        message: 'Stock deducted successfully',
        data: {
          total_deducted: quantity,
          deductions,
        },
      };
    } catch (error) {
      console.error('Deduct stock error:', error);
      return {
        success: false,
        message: error.message || 'Failed to deduct stock',
      };
    }
  }

  /**
   * Get expiring stock (within specified days)
   * @param {Number} days - Number of days to check (default: 30)
   * @returns {Object} Result with success status and data
   */
  async getExpiringStock(days = 30) {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const expiringStock = await StockEntry.findAll({
        where: {
          expiry_date: {
            [Op.lte]: futureDate,
            [Op.gte]: new Date(),
          },
          quantity_remaining: {
            [Op.gt]: 0,
          },
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'barcode'],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name'],
          },
        ],
        order: [['expiry_date', 'ASC']],
        raw: true,
      });

      return {
        success: true,
        data: expiringStock,
      };
    } catch (error) {
      console.error('Get expiring stock error:', error);
      return {
        success: false,
        message: 'Failed to fetch expiring stock',
        data: [],
      };
    }
  }
}

export default new StockController();
