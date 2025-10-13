'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useDashboardTranslations } from '@/hooks/i18n';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface UseBreadcrumbsOptions {
  showHome?: boolean;
  maxItems?: number;
  customLabels?: Record<string, string>;
}

export function useBreadcrumbs(options: UseBreadcrumbsOptions = {}) {
  const { showHome = true, maxItems = 4, customLabels = {} } = options;
  const pathname = usePathname();
  const { dashboard, expenses } = useDashboardTranslations();

  const breadcrumbs = useMemo(() => {
    // Remove locale prefix and split path
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';
    const segments = pathWithoutLocale.split('/').filter(Boolean);
    
    const items: BreadcrumbItem[] = [];

    // Add home if requested
    if (showHome) {
      items.push({
        label: dashboard.home || 'Home',
        href: '/',
        isActive: segments.length === 0
      });
    }

    // Build breadcrumb items from path segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Get localized label for segment
      const label = getSegmentLabel(segment, segments, index, customLabels);
      
      items.push({
        label,
        href: currentPath,
        isActive: isLast
      });
    });

    // Limit items if maxItems is specified
    if (maxItems && items.length > maxItems) {
      const firstItem = items[0];
      const lastItems = items.slice(-maxItems + 1);
      return [
        firstItem, 
        { label: '...', href: '', isActive: false }, 
        ...lastItems
      ];
    }

    return items;
  }, [pathname, dashboard, expenses, showHome, maxItems, customLabels]);

  function getSegmentLabel(
    segment: string, 
    segments: string[], 
    index: number, 
    customLabels: Record<string, string>
  ): string {
    // Check custom labels first
    if (customLabels[segment]) {
      return customLabels[segment];
    }

    // Handle dynamic segments and provide localized labels
    const segmentMap: Record<string, string> = {
      'dashboard': dashboard.title || 'Dashboard',
      'expenses': expenses.title || 'Expenses',
      'income': 'Income',
      'budgets': 'Budgets',
      'categories': 'Categories',
      'analytics': 'Analytics',
      'settings': 'Settings',
      'profile': 'Profile',
      'free': expenses.freeExpenses || 'Free Expenses',
      'budget': expenses.budgetExpenses || 'Budget Expenses',
      'reports': 'Reports',
      'export': 'Export',
      'import': 'Import',
      'add': 'Add',
      'edit': 'Edit',
      'view': 'View',
      'new': 'New'
    };

    // Check if it's a dynamic ID (UUID pattern or number)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) || 
        /^\d+$/.test(segment)) {
      // Get context from previous segment
      const prevSegment = segments[index - 1];
      if (prevSegment === 'expenses') {
        return 'Edit Expense';
      }
      if (prevSegment === 'income') {
        return 'Edit Income';
      }
      if (prevSegment === 'budgets') {
        return 'Edit Budget';
      }
      if (prevSegment === 'categories') {
        return 'Edit Category';
      }
      return 'Edit';
    }

    return segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  return {
    breadcrumbs,
    currentPage: breadcrumbs[breadcrumbs.length - 1]?.label || '',
    isHomePage: breadcrumbs.length <= 1
  };
}