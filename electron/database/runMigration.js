import { testConnection } from './connection.js';
import { up } from './migrations/20251120_add_stock_receipts.js';

const runMigration = async () => {
  try {
    console.log('Starting migration: Add Stock Receipt Management System...\n');

    // Test connection first
    const connectionResult = await testConnection();
    if (!connectionResult.success) {
      throw new Error(`Database connection failed: ${connectionResult.message}`);
    }
    console.log('✓ Database connected successfully\n');

    // Run migration
    await up();

    console.log('\n===================================');
    console.log('Migration completed successfully!');
    console.log('===================================\n');
    console.log('New table created: stock_receipts');
    console.log('Updated table: stock_entries (added receipt_id column)');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

runMigration();
