/**
 * Print Service
 * Handles thermal receipt printing for POS
 */
class PrintService {
  /**
   * Get pharmacy info from config or localStorage
   * @returns {Object} Pharmacy details
   */
  static getPharmacyInfo() {
    try {
      const savedInfo = localStorage.getItem('pharmacyInfo');
      if (savedInfo) {
        return JSON.parse(savedInfo);
      }
    } catch (error) {
      console.error('Error reading pharmacy info:', error);
    }

    // Default pharmacy info
    return {
      name: 'New Yasara Pharmacy',
      address: '102A Hirimbura Cross Rd, Galle 80000',
      phone: '+94 77 272 6992',
      registrationNumber: 'REG-001',
    };
  }

  /**
   * Format receipt for 80mm thermal printer
   * @param {Object} sale - Sale object with complete details
   * @param {number} copies - Number of copies to print
   * @returns {string} Formatted receipt content
   */
  static formatThermalReceipt(sale, copies = 1) {
    const pharmacyInfo = this.getPharmacyInfo();
    const receiptWidth = 80; // 80mm thermal receipt width in characters (approx 40-50 chars per line)
    const charPerLine = 42; // Average characters per line for 80mm receipt

    let receipt = '';

    for (let copy = 1; copy <= copies; copy++) {
      // Header
      receipt += this.centerText(pharmacyInfo.name, charPerLine);
      receipt += '\n';
      receipt += this.centerText('='.repeat(charPerLine), charPerLine);
      receipt += '\n';
      receipt += this.centerText('SALES RECEIPT', charPerLine);
      receipt += '\n';
      receipt += this.centerText('='.repeat(charPerLine), charPerLine);
      receipt += '\n\n';

      // Receipt number and date/time
      receipt += `Receipt #: ${sale.id}\n`;
      receipt += `Date: ${this.formatDate(sale.sale_date)}\n`;
      receipt += `Time: ${this.formatTime(sale.sale_date)}\n`;
      receipt += `Cashier: ${sale.user?.full_name || 'N/A'}\n`;
      receipt += '\n';

      // Pharmacy info
      receipt += `${pharmacyInfo.address}\n`;
      receipt += `Phone: ${pharmacyInfo.phone}\n`;
      receipt += `Reg: ${pharmacyInfo.registrationNumber}\n`;
      receipt += '\n';

      // Customer details (if any)
      if (sale.customer_name) {
        receipt += this.centerText('-'.repeat(charPerLine), charPerLine);
        receipt += '\n';
        receipt += `Customer: ${sale.customer_name}\n`;
        if (sale.customer_phone) {
          receipt += `Phone: ${sale.customer_phone}\n`;
        }
        receipt += '\n';
      }

      // Items header
      receipt += this.centerText('-'.repeat(charPerLine), charPerLine);
      receipt += '\n';
      receipt += this.formatItemsHeader(charPerLine);
      receipt += this.centerText('-'.repeat(charPerLine), charPerLine);
      receipt += '\n';

      // Items
      let totalQty = 0;
      sale.saleItems?.forEach((item) => {
        receipt += this.formatItemLine(item, charPerLine);
        totalQty += item.quantity;
      });

      receipt += this.centerText('-'.repeat(charPerLine), charPerLine);
      receipt += '\n';

      // Summary
      receipt += this.formatSummaryLine('Subtotal:', sale.subtotal, charPerLine);
      if (sale.discount && parseFloat(sale.discount) > 0) {
        receipt += this.formatSummaryLine(
          'Discount:',
          `-${sale.discount}`,
          charPerLine,
          'discount'
        );
      }
      if (sale.tax && parseFloat(sale.tax) > 0) {
        receipt += this.formatSummaryLine('Tax:', `+${sale.tax}`, charPerLine);
      }
      receipt += '\n';

      // Total
      receipt += this.formatTotalLine('TOTAL:', sale.total_amount, charPerLine);
      receipt += '\n';

      // Payment method
      receipt += `Payment Method: ${sale.payment_method?.toUpperCase() || 'CASH'}\n`;
      receipt += `Status: ${sale.payment_status?.toUpperCase() || 'COMPLETED'}\n`;
      receipt += '\n';

      // Footer
      receipt += this.centerText('Thank you for your purchase!', charPerLine);
      receipt += '\n';
      receipt += this.centerText('Please visit again', charPerLine);
      receipt += '\n';
      receipt += this.centerText('='.repeat(charPerLine), charPerLine);
      receipt += '\n';
      receipt += this.centerText(new Date().toLocaleString(), charPerLine);
      receipt += '\n';

      // Page break for multiple copies
      if (copy < copies) {
        receipt += '\n\n\n'; // Feed paper for next receipt
      }
    }

    return receipt;
  }

  /**
   * Center text for receipt
   * @param {string} text - Text to center
   * @param {number} width - Line width
   * @returns {string} Centered text
   */
  static centerText(text, width) {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  /**
   * Format items header for receipt
   * @param {number} width - Line width
   * @returns {string} Formatted header
   */
  static formatItemsHeader(width) {
    // Format: Item Name | QTY | Price | Subtotal
    const itemCol = 18; // Item name column
    const qtyCol = 5; // Quantity column
    const priceCol = 8; // Price per unit column
    const subtotalCol = 8; // Subtotal column

    const header =
      'Item'.padEnd(itemCol) +
      'Qty'.padEnd(qtyCol) +
      'Price'.padEnd(priceCol) +
      'Subtotal'.padEnd(subtotalCol);

    return header + '\n';
  }

  /**
   * Format individual item line
   * @param {Object} item - Sale item
   * @param {number} width - Line width
   * @returns {string} Formatted item line
   */
  static formatItemLine(item, width) {
    const itemCol = 18;
    const qtyCol = 5;
    const priceCol = 8;
    const subtotalCol = 8;

    const itemName = (item.product?.name || 'Unknown').substring(0, itemCol - 1);
    const qty = item.quantity.toString().padEnd(qtyCol);
    const price = `Rs.${parseFloat(item.unit_price).toFixed(2)}`.padEnd(priceCol);
    const subtotal = `Rs.${parseFloat(item.subtotal).toFixed(2)}`.padEnd(subtotalCol);

    let line = itemName.padEnd(itemCol) + qty + price + subtotal + '\n';

    // Free items are tracked internally but not shown on customer receipt

    return line;
  }

  /**
   * Format summary line (subtotal, discount, tax)
   * @param {string} label - Line label
   * @param {number} amount - Amount
   * @param {number} width - Line width
   * @param {string} type - Line type (default or discount)
   * @returns {string} Formatted line
   */
  static formatSummaryLine(label, amount, width, type = 'default') {
    const spacing = width - label.length - 20;
    const amountStr =
      type === 'discount'
        ? `${amount}`.padStart(10)
        : `Rs.${parseFloat(amount).toFixed(2)}`.padStart(10);

    return label.padEnd(label.length) + ' '.repeat(Math.max(1, spacing)) + amountStr + '\n';
  }

  /**
   * Format total line
   * @param {string} label - Line label
   * @param {number} amount - Total amount
   * @param {number} width - Line width
   * @returns {string} Formatted line
   */
  static formatTotalLine(label, amount, width) {
    const spacing = width - label.length - 20;
    const amountStr = `Rs.${parseFloat(amount).toFixed(2)}`.padStart(10);

    return label.padEnd(label.length) + ' '.repeat(Math.max(1, spacing)) + amountStr + '\n';
  }

  /**
   * Format date
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  static formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-LK');
  }

  /**
   * Format time
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted time
   */
  static formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-LK');
  }

  /**
   * Print receipt to thermal printer
   * @param {Object} sale - Sale object with complete details
   * @param {number} copies - Number of copies to print
   * @returns {Promise<boolean>} Success status
   */
  static async printReceipt(sale, copies = 1) {
    try {
      const receiptContent = this.formatThermalReceipt(sale, copies);

      // Open print window
      const printWindow = window.open('', '_blank', 'width=400,height=600');

      if (!printWindow) {
        console.error('Failed to open print window - popup may be blocked');
        return false;
      }

      // Write content to print window with thermal receipt styling
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              margin: 0;
              padding: 10px;
              font-family: 'Courier New', monospace;
              font-size: 13px;
              width: 80mm;
              line-height: 1.4;
            }
            pre {
              margin: 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            @media print {
              body {
                margin: 0;
                padding: 5px;
              }
            }
          </style>
        </head>
        <body>
          <pre>${this.escapeHtml(receiptContent)}</pre>
        </body>
        </html>
      `);

      printWindow.document.close();

      // Trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 250);

      return true;
    } catch (error) {
      console.error('Print error:', error);
      return false;
    }
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Save pharmacy info to localStorage
   * @param {Object} info - Pharmacy info (name, address, phone, registrationNumber)
   */
  static savePharmacyInfo(info) {
    try {
      localStorage.setItem('pharmacyInfo', JSON.stringify(info));
    } catch (error) {
      console.error('Error saving pharmacy info:', error);
    }
  }

  /**
   * Download receipt as text file
   * @param {Object} sale - Sale object
   * @param {number} copies - Number of copies
   */
  static downloadReceipt(sale, copies = 1) {
    try {
      const receiptContent = this.formatThermalReceipt(sale, copies);
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `Receipt_${sale.id}_${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  }
}

export default PrintService;
