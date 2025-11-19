// Application Configuration

// Status Options
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  OTHER: 'other',
};

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
];

// Payment Status
export const PAYMENT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
];

// Pagination
export const PAGINATION = {
  DEFAULT_ROWS: 10,
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'short',
  LONG: 'long',
  TIME: 'time',
};

// Alert Thresholds
export const ALERTS = {
  LOW_STOCK_THRESHOLD: 10,
  EXPIRY_WARNING_DAYS: 30,
};
