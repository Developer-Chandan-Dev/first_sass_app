'use client';

import { toast } from 'sonner';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  dismissible?: boolean;
}

export const toastUtils = {
  // Success toast with icon
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible ?? true,
    });
  },

  // Error toast with icon
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible ?? true,
    });
  },

  // Warning toast with icon
  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible ?? true,
    });
  },

  // Info toast with icon
  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible ?? true,
    });
  },

  // Loading toast with spinner
  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      duration: options?.duration || Infinity,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible ?? false,
    });
  },

  // Promise toast for async operations
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
    });
  },

  // Dismiss specific toast
  dismiss: (toastId?: string | number) => {
    return toast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    return toast.dismiss();
  },

  // Custom toast with action button
  custom: (
    message: string,
    action?: {
      label: string;
      onClick: () => void;
    },
    options?: ToastOptions
  ) => {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible ?? true,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    });
  },
};

// Specialized toast functions for common operations
export const operationToasts = {
  // CRUD operations
  created: (itemName: string, options?: ToastOptions) => 
    toastUtils.success(`${itemName} created successfully`, options),
  
  updated: (itemName: string, options?: ToastOptions) => 
    toastUtils.success(`${itemName} updated successfully`, options),
  
  deleted: (itemName: string, options?: ToastOptions) => 
    toastUtils.success(`${itemName} deleted successfully`, options),
  
  // Bulk operations
  bulkDeleted: (count: number, itemName: string, options?: ToastOptions) => 
    toastUtils.success(`${count} ${itemName}${count > 1 ? 's' : ''} deleted successfully`, options),
  
  // Export operations
  exported: (format: string, count?: number, options?: ToastOptions) => 
    toastUtils.success(
      count ? `${count} items exported to ${format.toUpperCase()}` : `Data exported to ${format.toUpperCase()}`,
      options
    ),
  
  // Import operations
  imported: (count: number, itemName: string, options?: ToastOptions) => 
    toastUtils.success(`${count} ${itemName}${count > 1 ? 's' : ''} imported successfully`, options),
  
  // Network errors
  networkError: (options?: ToastOptions) => 
    toastUtils.error('Network error. Please check your connection and try again.', options),
  
  // Validation errors
  validationError: (message?: string, options?: ToastOptions) => 
    toastUtils.error(message || 'Please check your input and try again.', options),
  
  // Permission errors
  permissionError: (options?: ToastOptions) => 
    toastUtils.error('You do not have permission to perform this action.', options),
  
  // Generic errors
  genericError: (options?: ToastOptions) => 
    toastUtils.error('Something went wrong. Please try again.', options),
};

// Async operation wrapper with toast notifications
export const withToast = {
  async: async <T>(
    operation: () => Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error?: string | ((error: unknown) => string);
    },
    options?: ToastOptions
  ): Promise<T> => {
    const loadingToast = toastUtils.loading(messages.loading, options);
    
    try {
      const result = await operation();
      toastUtils.dismiss(loadingToast);
      
      const successMessage = typeof messages.success === 'function' 
        ? messages.success(result) 
        : messages.success;
      toastUtils.success(successMessage, options);
      
      return result;
    } catch (error) {
      toastUtils.dismiss(loadingToast);
      
      const errorMessage = messages.error 
        ? (typeof messages.error === 'function' ? messages.error(error) : messages.error)
        : 'Operation failed';
      toastUtils.error(errorMessage, options);
      
      throw error;
    }
  },
};