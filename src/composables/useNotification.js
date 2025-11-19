import { useToast } from 'primevue/usetoast';

/**
 * Composable for toast notifications
 */
export const useNotification = () => {
  const toast = useToast();

  const success = (message, summary = 'Success', life = 3000) => {
    toast.add({
      severity: 'success',
      summary,
      detail: message,
      life,
    });
  };

  const error = (message, summary = 'Error', life = 5000) => {
    toast.add({
      severity: 'error',
      summary,
      detail: message,
      life,
    });
  };

  const warning = (message, summary = 'Warning', life = 4000) => {
    toast.add({
      severity: 'warn',
      summary,
      detail: message,
      life,
    });
  };

  const info = (message, summary = 'Info', life = 3000) => {
    toast.add({
      severity: 'info',
      summary,
      detail: message,
      life,
    });
  };

  return {
    success,
    error,
    warning,
    info,
  };
};
