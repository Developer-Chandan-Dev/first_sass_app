'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

// Utility functions
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(
    locale,
    options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  ).format(dateObj);
}

export function formatNumber(number: number, locale = 'en-US') {
  return new Intl.NumberFormat(locale).format(number);
}

// Create a safe translator that handles missing keys
export function createSafeTranslator(t: (key: string) => string) {
  return (key: string, fallback: string = '') => {
    try {
      const result = t(key);
      if (result === key && fallback) {
        return fallback;
      }
      return result;
    } catch {
      if (fallback) {
        return fallback;
      }
      const keyParts = key.split('.');
      const lastPart = keyParts[keyParts.length - 1];
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }
  };
}

export function useBaseTranslations() {
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');
  const tSuccess = useTranslations('success');

  const safeTCommon = createSafeTranslator(tCommon);
  const safeTErrors = createSafeTranslator(tErrors);
  const safeTSuccess = createSafeTranslator(tSuccess);

  return useMemo(
    () => ({
      common: {
        dashboard: safeTCommon('dashboard', 'Dashboard'),
        expenses: safeTCommon('expenses', 'Expenses'),
        budgets: safeTCommon('budgets', 'Budgets'),
        income: safeTCommon('income', 'Income'),
        analytics: safeTCommon('analytics', 'Analytics'),
        settings: safeTCommon('settings', 'Settings'),
        categories: safeTCommon('categories', 'Categories'),
        notifications: safeTCommon('notifications', 'Notifications'),
        cards: safeTCommon('cards', 'Cards'),
        logout: safeTCommon('logout', 'Logout'),
        login: safeTCommon('login', 'Login'),
        register: safeTCommon('register', 'Register'),
        save: safeTCommon('save', 'Save'),
        cancel: safeTCommon('cancel', 'Cancel'),
        delete: safeTCommon('delete', 'Delete'),
        edit: safeTCommon('edit', 'Edit'),
        add: safeTCommon('add', 'Add'),
        create: safeTCommon('create', 'Create'),
        update: safeTCommon('update', 'Update'),
        view: safeTCommon('view', 'View'),
        search: safeTCommon('search', 'Search'),
        filter: safeTCommon('filter', 'Filter'),
        loading: safeTCommon('loading', 'Loading...'),
        noData: safeTCommon('noData', 'No data available'),
        total: safeTCommon('total', 'Total'),
        amount: safeTCommon('amount', 'Amount'),
        date: safeTCommon('date', 'Date'),
        category: safeTCommon('category', 'Category'),
        description: safeTCommon('description', 'Description'),
        actions: safeTCommon('actions', 'Actions'),
        getStarted: safeTCommon('getStarted', 'Get Started'),
        learnMore: safeTCommon('learnMore', 'Learn More'),
        viewAll: safeTCommon('viewAll', 'View All'),
        close: safeTCommon('close', 'Close'),
        submit: safeTCommon('submit', 'Submit'),
        reset: safeTCommon('reset', 'Reset'),
        confirm: safeTCommon('confirm', 'Confirm'),
        yes: safeTCommon('yes', 'Yes'),
        no: safeTCommon('no', 'No'),
        success: safeTCommon('success', 'Success'),
        error: safeTCommon('error', 'Error'),
        warning: safeTCommon('warning', 'Warning'),
        info: safeTCommon('info', 'Info'),
        export: safeTCommon('export', 'Export'),
        clear: safeTCommon('clear', 'Clear')
      },
      errors: {
        generic: safeTErrors(
          'generic',
          'Something went wrong. Please try again.'
        ),
        network: safeTErrors(
          'network',
          'Network error. Please check your connection.'
        ),
        unauthorized: safeTErrors(
          'unauthorized',
          'You are not authorized to perform this action.'
        ),
        forbidden: safeTErrors('forbidden', 'Access denied.'),
        notFound: safeTErrors(
          'notFound',
          'The requested resource was not found.'
        ),
        validation: safeTErrors(
          'validation',
          'Please check your input and try again.'
        ),
        server: safeTErrors('server', 'Server error. Please try again later.'),
        timeout: safeTErrors('timeout', 'Request timed out. Please try again.'),
      },
      success: {
        saved: safeTSuccess('saved', 'Saved successfully!'),
        updated: safeTSuccess('updated', 'Updated successfully!'),
        deleted: safeTSuccess('deleted', 'Deleted successfully!'),
        created: safeTSuccess('created', 'Created successfully!'),
        uploaded: safeTSuccess('uploaded', 'Uploaded successfully!'),
        sent: safeTSuccess('sent', 'Sent successfully!'),
      },
    }),
    [safeTCommon, safeTErrors, safeTSuccess]
  );
}
