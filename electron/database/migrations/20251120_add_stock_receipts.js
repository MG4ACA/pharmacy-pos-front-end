import sequelize from '../connection.js';

/**
 * Migration: Add Stock Receipt Management System
 * Creates stock_receipts table and adds receipt_id to stock_entries
 * Date: November 20, 2025
 */

export async function up() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log('Starting migration: Add Stock Receipt Management System...');

    // Create stock_receipts table
    await queryInterface.createTable('stock_receipts', {
      id: {
        type: sequelize.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      receipt_number: {
        type: sequelize.Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      supplier_id: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'suppliers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      receipt_date: {
        type: sequelize.Sequelize.DATEONLY,
        allowNull: false,
      },
      supplier_invoice_number: {
        type: sequelize.Sequelize.STRING(100),
        allowNull: true,
      },
      supplier_invoice_date: {
        type: sequelize.Sequelize.DATEONLY,
        allowNull: true,
      },
      total_items: {
        type: sequelize.Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_amount: {
        type: sequelize.Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      notes: {
        type: sequelize.Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: sequelize.Sequelize.ENUM('draft', 'completed', 'cancelled'),
        defaultValue: 'draft',
      },
      created_by: {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: sequelize.Sequelize.DATE,
        defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: sequelize.Sequelize.DATE,
        defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    console.log('✓ Created stock_receipts table');

    // Add indexes to stock_receipts
    await queryInterface.addIndex('stock_receipts', ['receipt_number'], {
      name: 'idx_receipt_number',
      unique: true,
    });

    await queryInterface.addIndex('stock_receipts', ['supplier_id'], {
      name: 'idx_supplier_id',
    });

    await queryInterface.addIndex('stock_receipts', ['receipt_date'], {
      name: 'idx_receipt_date',
    });

    await queryInterface.addIndex('stock_receipts', ['status'], {
      name: 'idx_status',
    });

    console.log('✓ Created indexes on stock_receipts');

    // Add receipt_id column to stock_entries
    await queryInterface.addColumn('stock_entries', 'receipt_id', {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'stock_receipts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    console.log('✓ Added receipt_id column to stock_entries');

    // Add index to receipt_id
    await queryInterface.addIndex('stock_entries', ['receipt_id'], {
      name: 'idx_receipt_id',
    });

    console.log('✓ Created index on stock_entries.receipt_id');

    console.log('Migration completed successfully! ✨');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function down() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log('Rolling back migration: Add Stock Receipt Management System...');

    // Remove index from stock_entries
    await queryInterface.removeIndex('stock_entries', 'idx_receipt_id');

    // Remove receipt_id column from stock_entries
    await queryInterface.removeColumn('stock_entries', 'receipt_id');

    // Remove indexes from stock_receipts
    await queryInterface.removeIndex('stock_receipts', 'idx_status');
    await queryInterface.removeIndex('stock_receipts', 'idx_receipt_date');
    await queryInterface.removeIndex('stock_receipts', 'idx_supplier_id');
    await queryInterface.removeIndex('stock_receipts', 'idx_receipt_number');

    // Drop stock_receipts table
    await queryInterface.dropTable('stock_receipts');

    console.log('Rollback completed successfully!');
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
}
