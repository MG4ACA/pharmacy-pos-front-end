import { useToast } from 'primevue/usetoast';

/**
 * Global error handler utility
 */
export class ErrorHandler {
  static toast = null;

  static init() {
    if (!this.toast) {
      this.toast = useToast();
    }
  }

  /**
   * Handle API errors
   */
  static handleApiError(error, customMessage = null) {
    console.error('API Error:', error);

    const message = customMessage || error.message || 'An unexpected error occurred';

    if (this.toast) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    }
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(errors) {
    console.error('Validation Error:', errors);

    const errorMessages = Array.isArray(errors) ? errors.join(', ') : errors;

    if (this.toast) {
      this.toast.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: errorMessages,
        life: 5000,
      });
    }
  }

  /**
   * Handle success messages
   */
  static showSuccess(message, summary = 'Success') {
    if (this.toast) {
      this.toast.add({
        severity: 'success',
        summary: summary,
        detail: message,
        life: 3000,
      });
    }
  }

  /**
   * Handle info messages
   */
  static showInfo(message, summary = 'Info') {
    if (this.toast) {
      this.toast.add({
        severity: 'info',
        summary: summary,
        detail: message,
        life: 3000,
      });
    }
  }

  /**
   * Handle warning messages
   */
  static showWarning(message, summary = 'Warning') {
    if (this.toast) {
      this.toast.add({
        severity: 'warn',
        summary: summary,
        detail: message,
        life: 4000,
      });
    }
  }
}

/**
 * Composable for error handling in components
 */
export const useErrorHandler = () => {
  const toast = useToast();

  const handleError = (error, customMessage = null) => {
    console.error('Error:', error);

    const message = customMessage || error.message || 'An unexpected error occurred';

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000,
    });
  };

  const showSuccess = (message, summary = 'Success') => {
    toast.add({
      severity: 'success',
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  const showWarning = (message, summary = 'Warning') => {
    toast.add({
      severity: 'warn',
      summary: summary,
      detail: message,
      life: 4000,
    });
  };

  const showInfo = (message, summary = 'Info') => {
    toast.add({
      severity: 'info',
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  return {
    handleError,
    showSuccess,
    showWarning,
    showInfo,
  };
};
