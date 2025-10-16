'use client';

import {
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Plus,
  Eye,
} from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';
import { useAppSelector } from '@/lib/redux/hooks';
import { useLocale as useLocaleContext } from '@/contexts/locale-context';
import { UniversalStatCard } from '../shared/universal-stat-card';

export function ExpenseOverviewStats() {
  const { expenses } = useDashboardTranslations();
  const { free, budget, loading } = useAppSelector((state) => state.overview);
  const { getLocalizedPath } = useLocaleContext();

  // Calculate combined stats from Redux state
  const totalAmount = free.totalSpent + budget.totalSpent;
  const thisMonthTotal = free.totalSpent + budget.totalSpent; // Using total for now
  const categoriesCount = new Set([
    ...free.categoryBreakdown.map((c) => c._id),
    ...budget.categoryBreakdown.map((c) => c._id),
  ]).size;
  const avgPerDay = Math.round(thisMonthTotal / 30);

  const statsData = [
    {
      title: expenses?.expenseCards?.[0]?.totalExpenses || 'Total Expenses',
      value: `₹${totalAmount.toLocaleString()}`,
      change: '+12%',
      trend: 'up' as const,
      icon: DollarSign,
      description: expenses?.expenseCards?.[0]?.vsLastMonth || 'vs last month',
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
        totalAmount > 50000
          ? ('high' as const)
          : totalAmount > 20000
            ? ('medium' as const)
            : ('low' as const),
      extraInfo: `₹${avgPerDay}/day`,
    },
    {
      title: expenses?.expenseCards?.[1]?.thisMonth || 'This Month',
      value: `₹${thisMonthTotal.toLocaleString()}`,
      change: '+8%',
      trend: 'up' as const,
      icon: Calendar,
      description: expenses?.expenseCards?.[1]?.currentMonth || 'Current Month',
      href: '/dashboard/expenses',
      status: 'medium' as const,
    },
    {
      title: expenses?.expenseCards?.[2]?.categories || 'Categories',
      value: categoriesCount.toString(),
      change: '+2',
      trend: 'up' as const,
      icon: PieChart,
      description:
        expenses?.expenseCards?.[2]?.activeCategories || 'active categories',
      href: '/dashboard/categories',
      actions: [
        {
          icon: Plus,
          label: 'Add Category',
          href: '/dashboard/categories',
          variant: 'default' as const,
        },
        {
          icon: Eye,
          label: 'Manage',
          href: '/dashboard/categories',
          variant: 'outline' as const,
        },
      ],
      status: 'low' as const,
    },
    {
      title: expenses?.expenseCards?.[3]?.aveDay || 'Avg/Day',
      value: `₹${avgPerDay.toLocaleString()}`,
      change: '-5%',
      trend: 'down' as const,
      icon: BarChart3,
      description: expenses?.expenseCards?.[3]?.last30days || 'last 30 days',
      href: '/dashboard/analytics',
      status:
        avgPerDay > 2000
          ? ('high' as const)
          : avgPerDay > 1000
            ? ('medium' as const)
            : ('low' as const),
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
            icon={DollarSign}
            className="animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <UniversalStatCard
          key={stat.title}
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
