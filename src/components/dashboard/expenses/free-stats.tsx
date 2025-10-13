'use client';

import { useEffect } from 'react';
import { DollarSign, Wallet, BarChart3, Plus, Eye, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';
import { useDashboardTranslations, formatCurrency } from '@/hooks/i18n';
import { useLocale } from 'next-intl';
import { useLocale as useLocaleContext } from '@/contexts/locale-context';
import { UniversalStatCard } from '../shared/universal-stat-card';

export function FreeStats() {
  const dispatch = useAppDispatch();
  const { free, loading } = useAppSelector(state => state.overview);
  const { expenses, dashboard } = useDashboardTranslations();
  const locale = useLocale();
  const { getLocalizedPath } = useLocaleContext();

  useEffect(() => {
    dispatch(refreshStats('free'));
  }, [dispatch]);

  const avgExpenseAmount = free.totalExpenses > 0 ? free.totalSpent / free.totalExpenses : 0;

  const statsData = [
    {
      title: 'Total Free Spent',
      value: formatCurrency(free.totalSpent, 'INR', locale),
      change: `${free.monthlyChange > 0 ? '+' : ''}${free.monthlyChange}%`,
      trend: free.monthlyChange >= 0 ? 'up' as const : 'down' as const,
      icon: DollarSign,
      description: dashboard.vsLastMonth,
      href: '/dashboard/expenses/free',
      actions: [
        { icon: Plus, label: 'Add Expense', href: '/dashboard/expenses/free', variant: 'default' as const },
        { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics', variant: 'outline' as const }
      ],
      status: free.monthlyChange > 20 ? 'high' as const : free.monthlyChange > 0 ? 'medium' as const : 'low' as const
    },
    {
      title: 'Free Expenses',
      value: free.totalExpenses.toString(),
      change: `${free.expenseChange > 0 ? '+' : ''}${free.expenseChange}`,
      trend: free.expenseChange >= 0 ? 'up' as const : 'down' as const,
      icon: BarChart3,
      description: dashboard.vsLastMonth,
      href: '/dashboard/expenses/free',
      status: free.totalExpenses > 30 ? 'medium' as const : 'low' as const
    },
    {
      title: 'Average Amount',
      value: formatCurrency(avgExpenseAmount, 'INR', locale),
      change: `${free.totalExpenses} expenses`,
      trend: 'neutral' as const,
      icon: TrendingUp,
      description: 'Per expense average',
      status: 'low' as const,
      extraInfo: `${free.categoryBreakdown.length} categories`
    },
    {
      title: 'Monthly Spending',
      value: formatCurrency(free.totalSpent, 'INR', locale),
      change: free.monthlyChange > 0 ? 'Increased' : free.monthlyChange < 0 ? 'Decreased' : 'No change',
      trend: free.monthlyChange >= 0 ? 'up' as const : 'down' as const,
      icon: Wallet,
      description: 'Current month total',
      href: '/dashboard/expenses/free',
      status: free.monthlyChange > 15 ? 'high' as const : free.monthlyChange > 0 ? 'medium' as const : 'low' as const,
      actions: [
        { icon: Eye, label: 'View All', href: '/dashboard/expenses/free', variant: 'outline' as const }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <UniversalStatCard
            key={i}
            title="Loading..."
            value="..."
            icon={DollarSign}
            className="animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}