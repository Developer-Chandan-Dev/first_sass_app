'use client';

import { useEffect } from 'react';
import { Target, DollarSign, Wallet, BarChart3, Plus, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';
import { useDashboardTranslations, formatCurrency } from '@/hooks/i18n';
import { useLocale } from 'next-intl';
import { useLocale as useLocaleContext } from '@/contexts/locale-context';
import { UniversalStatCard } from '../shared/universal-stat-card';

export function BudgetStats() {
  const dispatch = useAppDispatch();
  const { budget, loading } = useAppSelector((state) => state.overview);
  const { expenses, dashboard } = useDashboardTranslations();
  const locale = useLocale();
  const { getLocalizedPath } = useLocaleContext();

  useEffect(() => {
    dispatch(refreshStats('budget'));
  }, [dispatch]);

  const remaining = budget.totalBudget - budget.totalSpent;
  const budgetUsagePercent =
    budget.totalBudget > 0 ? (budget.totalSpent / budget.totalBudget) * 100 : 0;

  const statsData = [
    {
      title: expenses.totalBudget,
      value: formatCurrency(budget.totalBudget, 'INR', locale),
      change: `${formatCurrency(budget.totalSpent, 'INR', locale)} ${expenses.spent}`,
      trend: 'neutral' as const,
      icon: Target,
      description: expenses.activeBudgets,
      href: '/dashboard/budgets',
      actions: [
        {
          icon: Plus,
          label: 'Add Budget',
          href: '/dashboard/budgets',
          variant: 'default' as const,
        },
        {
          icon: Eye,
          label: 'Manage',
          href: '/dashboard/budgets',
          variant: 'outline' as const,
        },
      ],
      status: 'medium' as const,
      progress: budgetUsagePercent,
    },
    {
      title: expenses.budgetSpent,
      value: formatCurrency(budget.totalSpent, 'INR', locale),
      change: `${budget.monthlyChange > 0 ? '+' : ''}${budget.monthlyChange}%`,
      trend: budget.monthlyChange >= 0 ? ('up' as const) : ('down' as const),
      icon: DollarSign,
      description: dashboard.vsLastMonth,
      href: '/dashboard/expenses/budget',
      actions: [
        {
          icon: Plus,
          label: 'Add Expense',
          href: '/dashboard/expenses/budget',
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
        budgetUsagePercent > 80
          ? ('high' as const)
          : budgetUsagePercent > 60
            ? ('medium' as const)
            : ('low' as const),
    },
    {
      title: expenses.remaining,
      value: formatCurrency(remaining, 'INR', locale),
      change: remaining > 0 ? expenses.available : expenses.exceeded,
      trend: remaining > 0 ? ('up' as const) : ('down' as const),
      icon: Wallet,
      description: expenses.budgetLeft,
      status: remaining > 0 ? ('low' as const) : ('high' as const),
      extraInfo: `${budgetUsagePercent.toFixed(1)}% used`,
    },
    {
      title: expenses.budgetExpensesCount,
      value: budget.totalExpenses.toString(),
      change: `${budget.expenseChange > 0 ? '+' : ''}${budget.expenseChange}`,
      trend: budget.expenseChange >= 0 ? ('up' as const) : ('down' as const),
      icon: BarChart3,
      description: dashboard.vsLastMonth,
      href: '/dashboard/expenses/budget',
      status:
        budget.totalExpenses > 20 ? ('medium' as const) : ('low' as const),
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <UniversalStatCard
            key={i}
            title="Loading..."
            value="..."
            icon={Target}
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
          progress={stat.progress}
          extraInfo={stat.extraInfo}
          getLocalizedPath={getLocalizedPath}
        />
      ))}
    </div>
  );
}
