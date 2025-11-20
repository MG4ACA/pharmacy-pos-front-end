/**
 * Database Seed Script
 * Run this to clear and populate the database with sample data
 * Usage: node electron/seed-database.js
 */

import bcrypt from 'bcrypt';
import sequelize from './database/connection.js';
import Category from './database/models/Category.js';
import Product from './database/models/Product.js';
import ProductType from './database/models/ProductType.js';
import StockEntry from './database/models/StockEntry.js';
import StockReceipt from './database/models/StockReceipt.js';
import Supplier from './database/models/Supplier.js';
import User from './database/models/User.js';
import { categories } from './database/seeders/categories.js';
import { productTypes } from './database/seeders/productTypes.js';

async function seedDatabase() {
  try {
    console.log('🔄 Starting database seeding...\n');

    // Sync database (create tables)
    console.log('📋 Creating tables...');
    await sequelize.sync({ force: true }); // This will drop and recreate all tables
    console.log('✅ Tables created successfully\n');

    // 1. Create Categories
    console.log('📂 Creating categories...');
    const createdCategories = await Category.bulkCreate(categories);
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // 2. Create Product Types
    console.log('🏷️  Creating product types...');
    const createdProductTypes = await ProductType.bulkCreate(productTypes);
    console.log(`✅ Created ${createdProductTypes.length} product types\n`);

    // 3. Create Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      full_name: 'System Administrator',
      status: 'active',
    });
    console.log('✅ Admin user created (username: admin, password: admin123)\n');

    // 4. Create Suppliers
    console.log('🏢 Creating suppliers...');
    const suppliers = await Supplier.bulkCreate([
      {
        name: 'MediPharm Distributors (Pvt) Ltd',
        contact_person: 'Kasun Perera',
        email: 'kasun@medipharm.lk',
        phone: '+94 11 234 5678',
        address: 'No. 123, Galle Road, Colombo 03',
        status: 'active',
      },
      {
        name: 'HealthCare Suppliers',
        contact_person: 'Nimal Silva',
        email: 'nimal@healthcare.lk',
        phone: '+94 11 876 5432',
        address: 'No. 456, Kandy Road, Colombo 10',
        status: 'active',
      },
      {
        name: 'ABC Pharmaceuticals',
        contact_person: 'Samantha Fernando',
        email: 'samantha@abcpharma.lk',
        phone: '+94 77 123 4567',
        address: 'No. 789, Negombo Road, Wattala',
        status: 'active',
      },
      {
        name: 'Global Medical Supplies',
        contact_person: 'Rajitha Kumara',
        email: 'rajitha@globalmed.lk',
        phone: '+94 71 234 5678',
        address: 'No. 321, Main Street, Nugegoda',
        status: 'active',
      },
      {
        name: 'Quality Health Products',
        contact_person: 'Dilini Jayasinghe',
        email: 'dilini@qualityhealth.lk',
        phone: '+94 76 987 6543',
        address: 'No. 654, Hospital Road, Kalubowila',
        status: 'active',
      },
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers\n`);

    // 5. Create Products
    console.log('💊 Creating products...');

    // Get category and product type IDs
    const medicineCategory = createdCategories.find((c) => c.name === 'Medicine');
    const otherCategory = createdCategories.find((c) => c.name === 'Other');
    const personalCareCategory = createdCategories.find((c) => c.name === 'Personal Care');

    const tabletType = createdProductTypes.find((t) => t.name === 'Tablet');
    const capsuleType = createdProductTypes.find((t) => t.name === 'Capsule');
    const syrupType = createdProductTypes.find((t) => t.name === 'Syrup');
    const injectionType = createdProductTypes.find((t) => t.name === 'Injection');
    const creamType = createdProductTypes.find((t) => t.name === 'Cream/Ointment');
    const unitType = createdProductTypes.find((t) => t.name === 'Unit');
    const bottleType = createdProductTypes.find((t) => t.name === 'Bottle');

    const products = await Product.bulkCreate([
      {
        name: 'Paracetamol 500mg',
        barcode: '8901234567890',
        product_type_id: tabletType.id,
        category_id: medicineCategory.id,
        description: 'Pain reliever and fever reducer',
        reorder_level: 100,
        status: 'active',
      },
      {
        name: 'Aspirin 100mg',
        barcode: '8901234567891',
        product_type_id: tabletType.id,
        category_id: medicineCategory.id,
        description: 'Blood thinner and pain reliever',
        reorder_level: 50,
        status: 'active',
      },
      {
        name: 'Amoxicillin 500mg',
        barcode: '8901234567892',
        product_type_id: capsuleType.id,
        category_id: medicineCategory.id,
        description: 'Antibiotic for bacterial infections',
        reorder_level: 75,
        status: 'active',
      },
      {
        name: 'Cough Syrup',
        barcode: '8901234567893',
        product_type_id: syrupType.id,
        category_id: medicineCategory.id,
        description: 'Relief from cough and cold symptoms',
        reorder_level: 30,
        status: 'active',
      },
      {
        name: 'Insulin Injection',
        barcode: '8901234567894',
        product_type_id: injectionType.id,
        category_id: medicineCategory.id,
        description: 'For diabetes management',
        reorder_level: 20,
        status: 'active',
      },
      {
        name: 'Antiseptic Cream',
        barcode: '8901234567895',
        product_type_id: creamType.id,
        category_id: medicineCategory.id,
        description: 'Topical antiseptic for wounds',
        reorder_level: 40,
        status: 'active',
      },
      {
        name: 'Digital Thermometer',
        barcode: '8901234567896',
        product_type_id: unitType.id,
        category_id: personalCareCategory.id,
        description: 'Digital body temperature thermometer',
        reorder_level: 15,
        status: 'active',
      },
      {
        name: 'Blood Pressure Monitor',
        barcode: '8901234567897',
        product_type_id: unitType.id,
        category_id: personalCareCategory.id,
        description: 'Automatic digital BP monitor',
        reorder_level: 10,
        status: 'active',
      },
      {
        name: 'Vitamin C 1000mg',
        barcode: '8901234567898',
        product_type_id: tabletType.id,
        category_id: otherCategory.id,
        description: 'Immune system support supplement',
        reorder_level: 60,
        status: 'active',
      },
      {
        name: 'Hand Sanitizer 500ml',
        barcode: '8901234567899',
        product_type_id: bottleType.id,
        category_id: personalCareCategory.id,
        description: 'Alcohol-based hand sanitizer',
        reorder_level: 50,
        status: 'active',
      },
    ]);
    console.log(`✅ Created ${products.length} products\n`);

    // 6. Create Stock Receipts with Stock Entries
    console.log('📦 Creating stock receipts...');

    // Receipt 1: From MediPharm
    const receipt1 = await StockReceipt.create({
      receipt_number: 'SR-2025-001',
      supplier_id: suppliers[0].id,
      supplier_invoice_number: 'MP-INV-2025-001',
      receipt_date: new Date('2025-01-15'),
      total_amount: 45000.0,
      notes: 'Monthly stock replenishment',
      status: 'completed',
      created_by: 1,
    });

    await StockEntry.bulkCreate([
      {
        receipt_id: receipt1.id,
        product_id: products[0].id, // Paracetamol
        supplier_id: suppliers[0].id,
        batch_number: 'BATCH-001',
        quantity_received: 500,
        quantity_remaining: 500,
        cost_price: 15.0,
        selling_price: 25.0,
        expiry_date: new Date('2026-12-31'),
        entry_date: new Date('2025-01-15'),
      },
      {
        receipt_id: receipt1.id,
        product_id: products[1].id, // Aspirin
        supplier_id: suppliers[0].id,
        batch_number: 'BATCH-002',
        quantity_received: 300,
        quantity_remaining: 300,
        cost_price: 20.0,
        selling_price: 35.0,
        expiry_date: new Date('2026-11-30'),
        entry_date: new Date('2025-01-15'),
      },
      {
        receipt_id: receipt1.id,
        product_id: products[2].id, // Amoxicillin
        supplier_id: suppliers[0].id,
        batch_number: 'BATCH-003',
        quantity_received: 200,
        quantity_remaining: 200,
        cost_price: 50.0,
        selling_price: 80.0,
        expiry_date: new Date('2026-10-31'),
        entry_date: new Date('2025-01-15'),
      },
    ]);

    // Receipt 2: From HealthCare Suppliers
    const receipt2 = await StockReceipt.create({
      receipt_number: 'SR-2025-002',
      supplier_id: suppliers[1].id,
      supplier_invoice_number: 'HC-INV-2025-045',
      receipt_date: new Date('2025-01-20'),
      total_amount: 32500.0,
      notes: 'Special order for medical equipment',
      status: 'completed',
      created_by: 1,
    });

    await StockEntry.bulkCreate([
      {
        receipt_id: receipt2.id,
        product_id: products[6].id, // Digital Thermometer
        supplier_id: suppliers[1].id,
        batch_number: 'BATCH-004',
        quantity_received: 50,
        quantity_remaining: 50,
        cost_price: 250.0,
        selling_price: 400.0,
        expiry_date: new Date('2027-12-31'),
        entry_date: new Date('2025-01-20'),
      },
      {
        receipt_id: receipt2.id,
        product_id: products[7].id, // BP Monitor
        supplier_id: suppliers[1].id,
        batch_number: 'BATCH-005',
        quantity_received: 25,
        quantity_remaining: 25,
        cost_price: 1500.0,
        selling_price: 2500.0,
        expiry_date: new Date('2027-12-31'),
        entry_date: new Date('2025-01-20'),
      },
    ]);

    // Receipt 3: From ABC Pharmaceuticals
    const receipt3 = await StockReceipt.create({
      receipt_number: 'SR-2025-003',
      supplier_id: suppliers[2].id,
      supplier_invoice_number: 'ABC-2025-123',
      receipt_date: new Date('2025-02-01'),
      total_amount: 28750.0,
      notes: 'Regular inventory stock',
      status: 'completed',
      created_by: 1,
    });

    await StockEntry.bulkCreate([
      {
        receipt_id: receipt3.id,
        product_id: products[3].id, // Cough Syrup
        supplier_id: suppliers[2].id,
        batch_number: 'BATCH-006',
        quantity_received: 100,
        quantity_remaining: 100,
        cost_price: 75.0,
        selling_price: 120.0,
        expiry_date: new Date('2026-08-31'),
        entry_date: new Date('2025-02-01'),
      },
      {
        receipt_id: receipt3.id,
        product_id: products[5].id, // Antiseptic Cream
        supplier_id: suppliers[2].id,
        batch_number: 'BATCH-007',
        quantity_received: 150,
        quantity_remaining: 150,
        cost_price: 45.0,
        selling_price: 75.0,
        expiry_date: new Date('2027-06-30'),
        entry_date: new Date('2025-02-01'),
      },
      {
        receipt_id: receipt3.id,
        product_id: products[8].id, // Vitamin C
        supplier_id: suppliers[2].id,
        batch_number: 'BATCH-008',
        quantity_received: 200,
        quantity_remaining: 200,
        cost_price: 30.0,
        selling_price: 50.0,
        expiry_date: new Date('2027-03-31'),
        entry_date: new Date('2025-02-01'),
      },
      {
        receipt_id: receipt3.id,
        product_id: products[9].id, // Hand Sanitizer
        supplier_id: suppliers[2].id,
        batch_number: 'BATCH-009',
        quantity_received: 100,
        quantity_remaining: 100,
        cost_price: 80.0,
        selling_price: 130.0,
        expiry_date: new Date('2027-12-31'),
        entry_date: new Date('2025-02-01'),
      },
    ]);

    console.log('✅ Created 3 stock receipts with stock entries\n');

    console.log('✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - ${createdCategories.length} Categories`);
    console.log(`  - ${createdProductTypes.length} Product Types`);
    console.log('  - 1 Admin User');
    console.log('  - 5 Suppliers');
    console.log('  - 10 Products');
    console.log('  - 3 Stock Receipts');
    console.log('  - 11 Stock Entries\n');
    console.log('🔐 Login Credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
