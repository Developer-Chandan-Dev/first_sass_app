import { toast } from 'sonner';

export interface PopupMessages {
  success?: {
    add?: string;
    update?: string;
    delete?: string;
  };
  error?: {
    add?: string;
    update?: string;
    delete?: string;
    validation?: string;
    network?: string;
  };
  loading?: {
    adding?: string;
    updating?: string;
    deleting?: string;
  };
  confirmation?: {
    delete?: string;
    bulkDelete?: string;
  };
}

export class PopupManager {
  private messages: PopupMessages;

  constructor(messages: PopupMessages) {
    this.messages = messages;
  }

  // Success messages
  showAddSuccess(customMessage?: string) {
    toast.success(customMessage || this.messages.success?.add || 'Added successfully!');
  }

  showUpdateSuccess(customMessage?: string) {
    toast.success(customMessage || this.messages.success?.update || 'Updated successfully!');
  }

  showDeleteSuccess(customMessage?: string) {
    toast.success(customMessage || this.messages.success?.delete || 'Deleted successfully!');
  }

  // Error messages
  showAddError(error?: unknown, customMessage?: string) {
    const message = customMessage || this.messages.error?.add || 'Failed to add item';
    toast.error(this.getErrorMessage(error, message));
  }

  showUpdateError(error?: unknown, customMessage?: string) {
    const message = customMessage || this.messages.error?.update || 'Failed to update item';
    toast.error(this.getErrorMessage(error, message));
  }

  showDeleteError(error?: unknown, customMessage?: string) {
    const message = customMessage || this.messages.error?.delete || 'Failed to delete item';
    toast.error(this.getErrorMessage(error, message));
  }

  showValidationError(message?: string) {
    toast.error(message || this.messages.error?.validation || 'Please check your input');
  }

  showNetworkError(message?: string) {
    toast.error(message || this.messages.error?.network || 'Network error. Please try again.');
  }

  // Confirmation dialogs
  async confirmDelete(customMessage?: string): Promise<boolean> {
    const message = customMessage || this.messages.confirmation?.delete || 'Are you sure you want to delete this item?';
    // Replace with a custom modal implementation for confirmation
    return await this.showCustomConfirmationModal(message);
  }
  async confirmBulkDelete(count: number, customMessage?: string): Promise<boolean> {
    const message = customMessage || 
      this.messages.confirmation?.bulkDelete?.replace('{count}', count.toString()) || 
      `Are you sure you want to delete ${count} items?`;
    // Replace with a custom modal implementation for confirmation
    return await this.showCustomConfirmationModal(message);
  }
  // Private helper methods
  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return this.messages.error?.network || 'Network error. Please try again.';
      }
      if (error.message.includes('validation')) {
        return this.messages.error?.validation || 'Please check your input';
      }
      return error.message.length < 100 ? error.message : fallback;
    }
    return fallback;
  }

  // Custom confirmation modal (replace with your own implementation)
  private async showCustomConfirmationModal(message: string): Promise<boolean> {
    // Implement your own modal logic here, e.g., using a UI library
    // For demonstration, we'll log the message and resolve false (not confirmed)
    // Replace this with actual modal logic in your app
    console.log('Confirmation message:', message);
    return Promise.resolve(false);
  }
}

// Factory function to create popup manager with translations
export function createPopupManager(translations: ReturnType<typeof import('@/hooks/i18n').useDashboardTranslations>, type: 'expense' | 'income'): PopupManager {
  const typeTranslations = type === 'expense' ? translations.expenses : translations.income;
  
  const messages: PopupMessages = {
    success: {
      add: typeTranslations?.addSuccess,
      update: typeTranslations?.updateSuccess,
      delete: typeTranslations?.deleteSuccess,
    },
    error: {
      add: 'Failed to add',
      update: 'Failed to update',
      delete: 'Failed to delete',
      validation: translations?.errors?.validation,
      network: translations?.errors?.network,
    },
    loading: {
      adding: 'Adding...',
      updating: 'Updating...',
      deleting: 'Deleting...',
    },
    confirmation: {
      delete: 'Are you sure you want to delete this item?',
      bulkDelete: 'Are you sure you want to delete {count} items?',
    },
  };

  return new PopupManager(messages);
}