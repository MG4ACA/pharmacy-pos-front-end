import { Op } from 'sequelize';
import { Product, Sale, StockEntry } from '../database/models/index.js';

class DashboardController {
  /**
   * Get dashboard summary statistics
   * @returns {Object} Result with dashboard data
   */
  async getDashboardSummary() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Today's sales total
      const todaySales = await Sale.sum('total_amount', {
        where: {
          sale_date: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
          payment_status: 'completed',
        },
      });

      // Total products count
      const totalProducts = await Product.count();

      // Low stock items (products with total_stock <= reorder_level)
      const lowStockItems = await Product.count({
        where: {
          total_stock: {
            [Op.lte]: Product.sequelize.col('reorder_level'),
          },
        },
      });

      // Expiring soon (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringSoon = await StockEntry.count({
        where: {
          expiry_date: {
            [Op.lte]: thirtyDaysFromNow,
            [Op.gte]: today,
          },
          quantity_remaining: {
            [Op.gt]: 0,
          },
        },
      });

      // This month's sales
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthSales = await Sale.sum('total_amount', {
        where: {
          sale_date: {
            [Op.gte]: firstDayOfMonth,
          },
          payment_status: 'completed',
        },
      });

      // Total sales count (all time)
      const totalSalesCount = await Sale.count({
        where: {
          payment_status: 'completed',
        },
      });

      // Recent sales (last 10)
      const recentSales = await Sale.findAll({
        where: {
          payment_status: 'completed',
        },
        order: [['sale_date', 'DESC']],
        limit: 10,
        attributes: ['id', 'sale_date', 'total_amount', 'payment_method'],
      });

      return {
        success: true,
        data: {
          todaySales: parseFloat(todaySales) || 0,
          totalProducts,
          lowStockItems,
          expiringSoon,
          monthSales: parseFloat(monthSales) || 0,
          totalSalesCount,
          recentSales,
        },
      };
    } catch (error) {
      console.error('DashboardController.getDashboardSummary error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch dashboard summary',
        data: {
          todaySales: 0,
          totalProducts: 0,
          lowStockItems: 0,
          expiringSoon: 0,
          monthSales: 0,
          totalSalesCount: 0,
          recentSales: [],
        },
      };
    }
  }

  /**
   * Get low stock products
   * @returns {Object} Result with low stock products
   */
  async getLowStockProducts() {
    try {
      const products = await Product.findAll({
        where: {
          total_stock: {
            [Op.lte]: Product.sequelize.col('reorder_level'),
          },
        },
        order: [['total_stock', 'ASC']],
        limit: 20,
      });

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      console.error('DashboardController.getLowStockProducts error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch low stock products',
        data: [],
      };
    }
  }

  /**
   * Get expiring products
   * @param {number} days - Number of days to check
   * @returns {Object} Result with expiring products
   */
  async getExpiringProducts(days = 30) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const expiringStock = await StockEntry.findAll({
        where: {
          expiry_date: {
            [Op.lte]: futureDate,
            [Op.gte]: today,
          },
          quantity_remaining: {
            [Op.gt]: 0,
          },
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'generic_name', 'category'],
          },
        ],
        order: [['expiry_date', 'ASC']],
      });

      return {
        success: true,
        data: expiringStock,
      };
    } catch (error) {
      console.error('DashboardController.getExpiringProducts error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch expiring products',
        data: [],
      };
    }
  }
}

export default new DashboardController();
