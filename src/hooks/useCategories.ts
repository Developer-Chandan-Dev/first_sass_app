'use client';

import { useState, useEffect, useCallback } from 'react';
import { createCategoryOptions } from '@/lib/categories';
import { useDashboardTranslations } from './i18n';

export function useCategories() {
  const t = useDashboardTranslations();
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch custom categories from API
  const fetchCustomCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCustomCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch custom categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new custom category
  const addCustomCategory = useCallback(async (categoryName: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        const data = await response.json();
        setCustomCategories(prev => [...prev, data.category]);
        return { success: true, category: data.category };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Failed to add custom category:', error);
      return { success: false, error: 'Failed to add category' };
    }
  }, []);

  // Get all category options (default + custom)
  const categoryOptions = createCategoryOptions(t, customCategories);

  useEffect(() => {
    fetchCustomCategories();
  }, [fetchCustomCategories]);

  return {
    categoryOptions,
    customCategories,
    addCustomCategory,
    loading,
    refetch: fetchCustomCategories,
  };
}