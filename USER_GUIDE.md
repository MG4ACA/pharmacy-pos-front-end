# Pharmacy POS System - User Quick Start Guide

## 📦 Installation

### Method 1: Using Installer (Recommended)

1. **Download** the installer file:

   - `Pharmacy POS System-1.0.0-x64.exe`

2. **Run the Installer**:

   - Double-click the downloaded file
   - Windows may show a security warning - click "More info" then "Run anyway"
   - Follow the installation wizard

3. **Choose Installation Location**:

   - Default: `C:\Program Files\Pharmacy POS System`
   - Or choose custom location

4. **Complete Installation**:
   - Application will create desktop and start menu shortcuts
   - Click "Finish" to launch the application

### Method 2: Portable Version (No Installation)

1. **Download** the portable file:

   - `Pharmacy POS System-1.0.0-Portable.exe`

2. **Place in Desired Folder**:

   - Copy to any folder (e.g., Desktop, USB drive)
   - No installation required

3. **Run Directly**:
   - Double-click the executable
   - All data stored in same folder

## 🔧 Prerequisites

Before running the application, ensure you have:

### ✅ MySQL Server Installed and Running

The application requires MySQL database. If not installed:

1. **Download MySQL:**

   - Visit: https://dev.mysql.com/downloads/mysql/
   - Choose "MySQL Installer for Windows"
   - Download and install

2. **Configure MySQL:**

   - During installation, set a root password
   - Remember this password - you'll need it
   - Default port: 3306

3. **Verify MySQL is Running:**
   - Open Services (Windows + R → type "services.msc")
   - Find "MySQL80" or similar
   - Status should be "Running"

## 🚀 First Time Setup

### Step 1: Launch Application

- Double-click the Pharmacy POS icon
- Wait for the application window to open

### Step 2: Database Configuration

If this is the first launch, the application will guide you through database setup.

**You'll need:**

- MySQL Host: `localhost` (if MySQL is on same computer)
- MySQL Port: `3306` (default)
- MySQL Username: `root` (default)
- MySQL Password: (your MySQL password)

### Step 3: Create Admin User

On first run, create an administrator account:

```
Username: admin (or your choice)
Password: (minimum 6 characters)
Full Name: Your Name
Email: your.email@example.com (optional)
Phone: +1234567890 (optional)
```

**Important:** Remember these credentials - you'll use them to log in!

### Step 4: Initial Login

1. Enter your username and password
2. Click "Login"
3. You're ready to use the system!

## 📖 Basic Usage

### Dashboard

After login, you'll see the Dashboard with:

- Today's sales summary
- Total products
- Low stock alerts
- Expiring products warnings
- Quick action buttons

### Quick Actions

From the Dashboard:

**🧮 Open POS** - Start making sales
**📦 Add Stock Entry** - Add new inventory
**➕ Add New Product** - Register new products
**📊 View Reports** - Access sales and inventory reports

### Navigation Menu

Left sidebar provides access to:

1. **Dashboard** - Overview and statistics
2. **Inventory** - Manage products and stock
   - Products - View all products
   - Stock Entry - Add new stock
   - Stock History - View stock movements
3. **Sales** - Process transactions
   - POS - Point of Sale system
   - Sales History - View past sales
4. **Reports** - Analytics and insights
   - Daily Sales Report
   - Stock Level Report
   - Expiring Products
   - Top Selling Products
5. **Suppliers** - Manage supplier information
6. **Settings** - Change password and preferences

## 🛒 Making Your First Sale

### Step 1: Add Products

Before making sales, add some products:

1. Go to **Inventory → Products**
2. Click **"Add Product"**
3. Fill in product details:
   - Name \*
   - Generic Name
   - Category \*
   - Barcode
   - Unit \*
   - Purchase Price \*
   - Selling Price \*
   - Reorder Level
   - Description
4. Click **"Save"**

### Step 2: Add Stock

Add inventory for your products:

1. Go to **Inventory → Stock Entry**
2. Select Product
3. Choose Supplier
4. Enter:
   - Batch Number
   - Quantity
   - Purchase Price
   - Expiry Date
   - Manufacturing Date (optional)
5. Click **"Add Stock"**

### Step 3: Process Sale

Make a sale at POS:

1. Go to **Sales → POS**
2. Search and add products to cart
3. Adjust quantities if needed
4. Apply discount (optional)
5. Select payment method (Cash/Card/Other)
6. Enter amount received
7. Click **"Complete Sale"**
8. Print or save receipt

## 📊 Generating Reports

### Daily Sales Report

1. Go to **Reports → Daily Sales**
2. Select date range
3. Click **"Generate Report"**
4. View summary and details
5. Click **"Export to CSV"** to download

### Stock Level Report

1. Go to **Reports → Stock Report**
2. Click **"Generate Stock Report"**
3. View categorized inventory:
   - In Stock
   - Low Stock
   - Out of Stock
4. Export to CSV if needed

### Expiring Products

1. Go to **Reports → Expiring Products**
2. Select time period (7, 14, 30, 60, or 90 days)
3. Click **"Generate Report"**
4. View urgent and warning items
5. Export to CSV

### Top Selling Products

1. Go to **Reports → Top Selling**
2. Select date range
3. Choose number of products (5, 10, 20, 50, or 100)
4. Click **"Generate Report"**
5. View performance rankings
6. Export to CSV

## 🔒 Security

### Change Password

1. Go to **Settings**
2. Enter current password
3. Enter new password (minimum 6 characters)
4. Confirm new password
5. Click **"Change Password"**

### Logout

- Click your username in top right
- Select **"Logout"**

## ⚙️ Tips & Best Practices

### Daily Operations

✅ **Start of Day:**

- Check low stock alerts
- Review expiring products
- Verify MySQL is running

✅ **During Sales:**

- Always verify product details
- Check expiry dates
- Issue receipts

✅ **End of Day:**

- Generate daily sales report
- Review inventory levels
- Plan restocking

### Inventory Management

- Set realistic reorder levels
- Monitor expiry dates regularly
- Update prices when needed
- Keep supplier information current

### Data Backup

**Important:** Regularly backup your database!

**Manual Backup (MySQL):**

```sql
mysqldump -u root -p pharmacy_pos > backup_YYYY-MM-DD.sql
```

Store backups in a safe location (external drive, cloud storage).

## 🆘 Troubleshooting

### Application Won't Start

**Problem:** Double-clicking does nothing

**Solutions:**

1. Right-click → Run as Administrator
2. Check if MySQL server is running
3. Check Windows Event Viewer for errors
4. Verify antivirus isn't blocking

### Can't Login

**Problem:** "Invalid username or password"

**Solutions:**

1. Verify credentials are correct
2. Check Caps Lock is off
3. If forgotten, contact system administrator to reset in database

### Database Connection Error

**Problem:** "Cannot connect to database"

**Solutions:**

1. Verify MySQL is running (Services → MySQL80)
2. Check database credentials
3. Ensure port 3306 is not blocked
4. Try restarting MySQL service

### Product Not Found

**Problem:** "Product not found in stock"

**Solutions:**

1. Go to Inventory → Products
2. Verify product exists
3. Check stock quantity > 0
4. Add stock if needed (Inventory → Stock Entry)

### Report Not Generating

**Problem:** Report shows no data

**Solutions:**

1. Verify date range is correct
2. Check if data exists for selected period
3. Try different date range
4. Ensure sales/products exist in database

## 📞 Support

### Getting Help

For technical support:

1. Check this guide first
2. Review BUILD_INSTRUCTIONS.md for technical details
3. Contact your system administrator
4. Check application logs for error messages

### Updates

To update to a new version:

1. Backup your database first
2. Uninstall old version (if using installer)
3. Install new version
4. Database will be preserved

## 📝 Keyboard Shortcuts

Coming in future update:

- `Ctrl + P` - Open POS
- `Ctrl + N` - New Product
- `Ctrl + S` - Save
- `Ctrl + F` - Search
- `F1` - Help

## ✅ System Requirements

- Windows 10 (64-bit) or higher
- 4 GB RAM (8 GB recommended)
- 500 MB free disk space
- 1024x768 screen resolution (1920x1080 recommended)
- MySQL 8.0 or higher
- Active internet connection (for initial setup)

---

**Version:** 1.0.0  
**Last Updated:** December 31, 2025  
**Support:** Contact your system administrator

---

## 🆕 Recent Feature Updates

### Stock Receipt Management (December 2025)

**Editing Stock Receipts:**

- You can now edit **both draft and completed** stock receipts
- Only **cancelled** receipts cannot be edited
- Free items are fully supported in edit mode
- Receipt numbers are automatically generated for drafts

**How to Edit:**

1. Go to **Inventory → Stock Receipts**
2. Find the receipt you want to edit
3. Click the **Edit** (pencil) icon
4. Make your changes
5. Click **Save as Draft** or **Complete Receipt**

**Free Items Tracking:**

- Add free quantities when receiving stock from suppliers
- System tracks purchased vs free items separately
- View free items with 🎁 badge throughout the system
- Dedicated **Free Items Report** in Reports section

**Important Notes:**

- Editing a completed receipt will update inventory immediately
- Product line edits target the correct item (fixed reversed order bug)
- All changes are tracked with timestamps

### Sales Management

**Percentage-Based Discounts:**

- Discounts now use percentages (0-100%)
- Display shows both percentage and Rs. value
- Example: "10.5% (Rs. 105.00)"

**Cashier Tracking:**

- Every sale records which cashier processed it
- Visible in Sales History for accountability

---

## Quick Reference Card

| Action          | Location                   | Shortcut |
| --------------- | -------------------------- | -------- |
| Make Sale       | Sales → POS                | -        |
| Add Product     | Inventory → Products → Add | -        |
| Add Stock       | Inventory → Stock Entry    | -        |
| View Sales      | Sales → Sales History      | -        |
| Daily Report    | Reports → Daily Sales      | -        |
| Change Password | Settings                   | -        |
| Logout          | Top Right Menu             | -        |

**Remember:** Always ensure MySQL is running before launching the application!

---

For detailed technical information, see **BUILD_INSTRUCTIONS.md**
