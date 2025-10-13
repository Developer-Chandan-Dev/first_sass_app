'use client';

import { usePathname } from 'next/navigation';
import { useDashboardTranslations } from '@/hooks/i18n';

export function DynamicPageTitle() {
  const pathname = usePathname();
  const { sidebar, dashboard } = useDashboardTranslations();

  const getPageTitle = () => {
    if (pathname === '/dashboard' || pathname.endsWith('/dashboard')) {
      return dashboard?.overview || 'Dashboard';
    }
    if (pathname.includes('/expenses')) {
      return sidebar?.expenses || 'Expenses';
    }
    if (pathname.includes('/income')) {
      return sidebar?.income || 'Income';
    }
    if (pathname.includes('/analytics')) {
      return sidebar?.analytics || 'Analytics';
    }
    if (pathname.includes('/categories')) {
      return sidebar?.categories || 'Categories';
    }
    if (pathname.includes('/budgets')) {
      return sidebar?.budgets || 'Budgets';
    }
    if (pathname.includes('/cards')) {
      return sidebar?.cards || 'Cards';
    }
    if (pathname.includes('/notifications')) {
      return sidebar?.notifications || 'Notifications';
    }
    if (pathname.includes('/settings')) {
      return sidebar?.settings || 'Settings';
    }
    return 'Dashboard';
  };

  return (
    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
      {getPageTitle()}
    </h1>
  );
}