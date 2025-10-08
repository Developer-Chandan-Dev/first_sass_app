import { toast } from 'sonner';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
}

export class CustomError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;

  constructor(message: string, code?: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function handleApiError(error: unknown): AppError {

  if (error instanceof CustomError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack
    };
  }

  if (typeof error === 'string') {
    return {
      message: error
    };
  }

  return {
    message: 'An unexpected error occurred'
  };
}

export function showErrorToast(error: unknown, fallbackMessage = 'Something went wrong') {
  const appError = handleApiError(error);
  
  // Show user-friendly messages for common errors
  const userMessage = getUserFriendlyMessage(appError);
  toast.error(userMessage || fallbackMessage);
}

export function getUserFriendlyMessage(error: AppError): string {
  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return 'Network connection error. Please check your internet connection.';
  }

  // Authentication errors
  if (error.statusCode === 401 || error.message.includes('Unauthorized')) {
    return 'Please log in to continue.';
  }

  // Permission errors
  if (error.statusCode === 403 || error.message.includes('Forbidden')) {
    return 'You do not have permission to perform this action.';
  }

  // Not found errors
  if (error.statusCode === 404) {
    return 'The requested resource was not found.';
  }

  // Server errors
  if (error.statusCode && error.statusCode >= 500) {
    return 'Server error. Please try again later.';
  }

  // Validation errors
  if (error.statusCode === 400 || error.message.includes('validation')) {
    return error.message; // Show validation messages as-is
  }

  // Rate limiting
  if (error.statusCode === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  // Default to the original message if it's user-friendly
  if (error.message && error.message.length < 100 && !error.message.includes('Error:')) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    showErrorToast(error, errorMessage);
    return null;
  }
}

export function createErrorHandler(componentName: string) {
  return (error: unknown, errorInfo?: { componentStack: string }) => {

    if (errorInfo) {
      console.error('Component stack:', errorInfo.componentStack);
    }
    
    // In development, show more detailed errors
    if (process.env.NODE_ENV === 'development') {
      toast.error(`${componentName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } else {
      toast.error('Something went wrong. Please refresh the page.');
    }
  };
}

// Retry utility for failed operations
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
}

// Debounced error handler to prevent spam
let errorTimeout: NodeJS.Timeout | null = null;
const recentErrors = new Set<string>();

export function debouncedErrorHandler(error: unknown, key?: string) {
  const errorKey = key || (error instanceof Error ? error.message : String(error));
  
  if (recentErrors.has(errorKey)) {
    return; // Skip if we've seen this error recently
  }

  recentErrors.add(errorKey);
  showErrorToast(error);

  // Clear the error from recent list after 5 seconds
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }
  
  errorTimeout = setTimeout(() => {
    recentErrors.delete(errorKey);
  }, 5000);
}