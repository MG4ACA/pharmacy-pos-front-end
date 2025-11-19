/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email) return true; // Email is optional

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional

  // Allow digits, spaces, hyphens, parentheses, and plus sign
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 9;
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} is required`;
  }

  return true;
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value) return true; // Skip if empty (use validateRequired for required fields)

  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }

  return true;
};

/**
 * Validate maximum length
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (!value) return true;

  if (value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }

  return true;
};

/**
 * Validate number range
 */
export const validateRange = (value, min, max, fieldName = 'This field') => {
  const num = Number(value);

  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }

  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }

  return true;
};

/**
 * Validate positive number
 */
export const validatePositive = (value, fieldName = 'This field') => {
  const num = Number(value);

  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }

  if (num <= 0) {
    return `${fieldName} must be greater than 0`;
  }

  return true;
};

/**
 * Validate barcode (alphanumeric)
 */
export const validateBarcode = (barcode) => {
  if (!barcode) return true; // Barcode is optional

  const barcodeRegex = /^[a-zA-Z0-9\-]+$/;
  if (!barcodeRegex.test(barcode)) {
    return 'Barcode can only contain letters, numbers, and hyphens';
  }

  return true;
};

/**
 * Validate date (not in the past for expiry dates)
 */
export const validateFutureDate = (date, fieldName = 'Date') => {
  if (!date) return true; // Date is optional

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return `${fieldName} cannot be in the past`;
  }

  return true;
};
