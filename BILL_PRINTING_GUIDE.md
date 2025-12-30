# Bill Printing Functionality

Pharmacy POS System now includes thermal receipt printer support for printing sales receipts automatically after completing sales.

## Features

### 1. **Automatic Receipt Printing**

- Checkbox in the Billing Summary to enable/disable receipt printing
- Print multiple copies (1-10) of the same receipt
- Automatic print dialog opens after sale completion
- Works with thermal printers (80mm and 58mm formats supported)

### 2. **Receipt Content**

Each receipt includes:

- Pharmacy name and address
- Registration number
- Sale receipt number
- Date and time of transaction
- Cashier/User name who made the sale
- Itemized list with:
  - Product name
  - Quantity
  - Unit price
  - Subtotal
  - Free item indicators (if applicable)
- Subtotal, Discount, and Tax
- Total amount
- Payment method
- Payment status

### 3. **Pharmacy Configuration**

Users can configure pharmacy information in **Settings > Receipt Configuration**:

- Pharmacy name (required)
- Address
- Phone number
- Registration number

Configuration is saved to browser localStorage and persists across sessions.

## Usage

### Printing a Receipt

1. **During Sale Completion:**

   - In the POS Billing Summary panel, check the "Print Receipt after completing sale" checkbox
   - Set the number of copies (1-10) using the increment/decrement buttons
   - Click "Complete Sale"
   - Receipt automatically prints after sale is confirmed

2. **Manual Printing:**
   - After completing a sale, if you didn't enable auto-print, you cannot reprint from POS
   - To reprint, go to **Sales > History**, find the sale, and use the print icon (if available)

### Testing Receipt Format

1. Go to **Settings > Receipt Configuration**
2. Click the "Test Print" button to print a sample receipt with your configured pharmacy info
3. This helps verify:
   - Printer connectivity
   - Thermal paper size compatibility
   - Information formatting

### Configuring Pharmacy Information

1. Go to **Settings > Receipt Configuration**
2. Enter:
   - **Pharmacy Name** (required)
   - **Address** (optional)
   - **Phone Number** (optional)
   - **Registration Number** (optional)
3. Click "Save Configuration"
4. The information is saved and will appear on all future receipts

## Technical Details

### PrintService (`src/services/PrintService.js`)

The PrintService handles all receipt printing operations:

#### Key Methods

- **`formatThermalReceipt(sale, copies)`**

  - Formats sale data for 80mm thermal printer
  - Returns formatted receipt string
  - Supports multiple copies

- **`printReceipt(sale, copies)`**

  - Opens print dialog with formatted receipt
  - Handles print job submission to physical printer
  - Returns Promise<boolean> indicating success/failure

- **`getPharmacyInfo()`**

  - Retrieves pharmacy configuration from localStorage
  - Returns default info if not configured

- **`savePharmacyInfo(info)`**

  - Saves pharmacy configuration to localStorage
  - Called from Settings component

- **`downloadReceipt(sale, copies)`**
  - Downloads receipt as .txt file
  - Useful for backup or manual printing

### Browser Integration

The print functionality uses:

- Browser's native print API (`window.print()`)
- localStorage for persisting pharmacy configuration
- CSS for receipt formatting (monospace font for alignment)

### Supported Printers

- **Thermal Receipt Printers:**

  - Epson TM series (TM-T88, TM-T20, etc.)
  - Star Micronics
  - NCR Fastpass
  - Any USB or Network thermal printer supported by the OS

- **Paper Sizes:**
  - 80mm thermal paper (standard)
  - 58mm thermal paper (compact)

### Print Flow

```
User checks "Print Receipt" → Complete Sale →
Sale created successfully → PrintService.printReceipt() called →
Print dialog opens → User confirms print →
Thermal printer receives receipt data
```

## Troubleshooting

### Print Dialog Doesn't Open

- Check browser popup blocker settings
- Allow popups for the application
- Try a different browser

### Receipt Formatting Issues

- Verify printer paper width matches receipt formatting
- Test print sample receipt first
- Check if printer driver is properly installed

### Printer Not Found

- Ensure printer is connected and powered on
- Check OS printer settings
- Add printer as default printer in OS settings
- Try "Test Print" from Settings

### Multiple Copies Not Printing

- Some printers may require manual feed between copies
- Adjust number of copies to 1-2 for testing
- Check printer queue in OS settings

## Future Enhancements

Potential improvements for future versions:

1. **Network Printer Support** - Direct network printing without OS dialog
2. **Receipt Templates** - Customizable receipt layouts
3. **Customer Receipts** - Optional customer info (name, email, phone)
4. **Email Receipts** - Send receipt to customer email
5. **Receipt History** - Track all printed receipts with reprint capability
6. **Barcode/QR Code** - Add QR code for digital receipt retrieval
7. **Multi-language Support** - Receipts in different languages
8. **Logo Support** - Add pharmacy logo to receipt header

## Related Features

- **Sale Tracking:** See [Sales History documentation](./USER_GUIDE.md#sales-history)
- **Receipt Configuration:** Settings > Receipt Configuration
- **Free Items:** See [Free Items Feature](./FREE_ITEMS_FEATURE.md)

## Support

For issues or questions about bill printing:

1. Check the Troubleshooting section above
2. Review browser console for error messages (F12 → Console)
3. Test with a sample receipt first
4. Verify printer configuration in OS settings
