import { Op } from 'sequelize';
import sequelize from '../database/connection.js';
import { Category, Product, ProductType, StockEntry, Supplier } from '../database/models/index.js';

class StockController {
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
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'barcode'],
            include: [
              {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
              },
              {
                model: ProductType,
                as: 'productType',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name', 'contact_person', 'email', 'phone'],
          },
        ],
        order: [
          ['entry_date', 'ASC'], // FIFO: First In First Out
          ['id', 'ASC'],
        ],
      });

      const plainEntries = stockEntries.map((entry) => entry.toJSON());

      return {
        success: true,
        data: plainEntries,
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
            attributes: ['id', 'name', 'barcode'],
            include: [
              {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
              },
              {
                model: ProductType,
                as: 'productType',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name', 'contact_person', 'email', 'phone'],
          },
        ],
      });

      if (!stockEntry) {
        return {
          success: false,
          message: 'Batch not found',
        };
      }

      return {
        success: true,
        data: stockEntry.toJSON(),
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
    const transaction = await sequelize.transaction();

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
        transaction,
      });

      if (stockEntries.length === 0) {
        await transaction.rollback();
        return {
          success: false,
          message: 'No stock available for this product',
        };
      }

      // Calculate total available stock
      const totalAvailable = stockEntries.reduce((sum, entry) => sum + entry.quantity_remaining, 0);

      if (totalAvailable < quantity) {
        await transaction.rollback();
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
        await entry.update(
          {
            quantity_remaining: entry.quantity_remaining - deductFromThisBatch,
            updated_at: new Date(),
          },
          { transaction }
        );

        deductions.push({
          batch_id: entry.id,
          batch_number: entry.batch_number,
          quantity_deducted: deductFromThisBatch,
          cost_price: entry.cost_price,
          selling_price: entry.selling_price,
        });

        remainingToDeduct -= deductFromThisBatch;
      }

      await transaction.commit();

      return {
        success: true,
        message: 'Stock deducted successfully',
        data: {
          total_deducted: quantity,
          deductions,
        },
      };
    } catch (error) {
      await transaction.rollback();
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
            include: [
              {
                model: Category,
                as: 'category',
                attributes: ['id', 'name'],
              },
              {
                model: ProductType,
                as: 'productType',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: Supplier,
            as: 'supplier',
            attributes: ['id', 'name', 'contact_person', 'email', 'phone'],
          },
        ],
        order: [['expiry_date', 'ASC']],
      });

      const plainStock = expiringStock.map((entry) => entry.toJSON());

      return {
        success: true,
        data: plainStock,
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
