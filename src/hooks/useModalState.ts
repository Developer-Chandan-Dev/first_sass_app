'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppTranslations } from './useTranslation';

interface ModalState {
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

interface UseModalStateOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useModalState(options: UseModalStateOptions = {}) {
  const { common, errors } = useAppTranslations();
  const [state, setState] = useState<ModalState>({
    isLoading: false,
    error: null,
    isSubmitting: false,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: null }));
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting: submitting, error: null }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false, isSubmitting: false }));
  }, []);

  const handleSuccess = useCallback((message?: string) => {
    setState({ isLoading: false, error: null, isSubmitting: false });
    toast.success(message || options.successMessage || common.success);
    options.onSuccess?.();
  }, [options, common.success]);

  const handleError = useCallback((error: unknown, customMessage?: string) => {
    const errorMessage = error instanceof Error 
      ? error.message 
      : customMessage || options.errorMessage || errors.generic;
    
    setError(errorMessage);
    toast.error(errorMessage);
    options.onError?.(errorMessage);
  }, [options, errors.generic, setError]);

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      setSubmitting(true);
      const result = await asyncFn();
      handleSuccess(successMessage);
      return result;
    } catch (error) {
      handleError(error, errorMessage);
      return null;
    }
  }, [setSubmitting, handleSuccess, handleError]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, isSubmitting: false });
  }, []);

  return {
    ...state,
    setLoading,
    setSubmitting,
    setError,
    handleSuccess,
    handleError,
    executeAsync,
    reset,
  };
}