'use client';

import { useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  BarChart3,
  Target,
  Plus,
  Eye,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';
import { formatCurrency } from '@/hooks/i18n/useBaseTranslations';
import { useLocale } from 'next-intl';
import { useLocale as useLocaleContext } from '@/contexts/locale-context';
import { UniversalStatCard } from '../shared/universal-stat-card';
import { MobileStatsGrid } from '../shared/mobile-stats-grid';

export function ExpenseStats() {
  const dispatch = useAppDispatch();
  const { free, loading } = useAppSelector((state) => state.overview);
  const { dashboard, expenses } = useDashboardTranslations();
  const locale = useLocale();
  const { getLocalizedPath } = useLocaleContext();

  useEffect(() => {
    dispatch(refreshStats('free'));
  }, [dispatch]);

  const averageExpense =
    free.totalExpenses > 0 ? free.totalSpent / free.totalExpenses : 0;

  const statsData = [
    {
      title: dashboard.totalSpent,
      value: formatCurrency(free.totalSpent, 'INR', locale),
      change: `${free.monthlyChange > 0 ? '+' : ''}${free.monthlyChange}%`,
      trend: free.monthlyChange >= 0 ? ('up' as const) : ('down' as const),
      icon: DollarSign,
      description: dashboard.vsLastMonth,
      href: '/dashboard/expenses',
      actions: [
        {
          icon: Plus,
          label: 'Add Expense',
          href: '/dashboard/expenses/free',
          variant: 'default' as const,
        },
        {
          icon: Eye,
          label: 'View All',
          href: '/dashboard/expenses',
          variant: 'outline' as const,
        },
      ],
      status:
        free.totalSpent > 50000
          ? ('high' as const)
          : free.totalSpent > 20000
            ? ('medium' as const)
            : ('low' as const),
      extraInfo: `₹${(free.totalSpent / 30).toFixed(0)}/day`,
    },
    {
      title: expenses.totalExpenses,
      value: free.totalExpenses.toString(),
      change: `${free.expenseChange > 0 ? '+' : ''}${free.expenseChange}`,
      trend: free.expenseChange >= 0 ? ('up' as const) : ('down' as const),
      icon: BarChart3,
      description: dashboard.vsLastMonth,
      href: '/dashboard/expenses',
      actions: [
        {
          icon: Plus,
          label: 'Add Transaction',
          href: '/dashboard/expenses/free',
          variant: 'default' as const,
        },
        {
          icon: BarChart3,
          label: 'Analytics',
          href: '/dashboard/analytics',
          variant: 'outline' as const,
        },
      ],
      status:
        free.totalExpenses > 50
          ? ('high' as const)
          : free.totalExpenses > 20
            ? ('medium' as const)
            : ('low' as const),
    },
    {
      title: expenses?.averageExpense,
      value: formatCurrency(Math.round(averageExpense), 'INR', locale),
      change:
        free.totalExpenses > 0
          ? formatCurrency(Math.round(averageExpense), 'INR', locale)
          : formatCurrency(0, 'INR', locale),
      trend: 'neutral' as const,
      icon: Target,
      description: dashboard.perTransaction,
      status: 'medium' as const,
    },
    {
      title: dashboard?.previousMonth,
      value: formatCurrency(free.previousMonthSpent, 'INR', locale),
      change: `${free.previousMonthExpenses} ${expenses.title.toLowerCase()}`,
      trend: 'neutral' as const,
      icon: Calendar,
      description: expenses?.lastMonth || dashboard.lastMonth,
      status: 'low' as const,
    },
  ];

  if (loading) {
    return (
      <MobileStatsGrid>
        {[1, 2, 3, 4].map((i) => (
          <UniversalStatCard
            key={i}
            title="Loading..."
            value="..."
            icon={DollarSign}
            className="animate-pulse"
          />
        ))}
      </MobileStatsGrid>
    );
  }

  return (
    <MobileStatsGrid>
      {statsData.map((stat, index) => (
        <UniversalStatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          description={stat.description}
          href={stat.href}
          actions={stat.actions}
          status={stat.status}
          extraInfo={stat.extraInfo}
          getLocalizedPath={getLocalizedPath}
        />
      ))}
    </MobileStatsGrid>
  );
}
