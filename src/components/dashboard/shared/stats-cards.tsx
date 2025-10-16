'use client';

import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Target,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Plus,
  Eye,
  BarChart3,
} from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';
import { formatCurrency } from '@/hooks/i18n/useBaseTranslations';
import { useLocale } from 'next-intl';
import { StatsSkeleton } from '@/components/dashboard/shared/loading-wrapper';
import Link from 'next/link';
import { useLocale as useLocaleContext } from '@/contexts/locale-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from './progress-ring';

export function StatsCards() {
  const { dashboard, common } = useDashboardTranslations();
  const locale = useLocale();
  const { getLocalizedPath } = useLocaleContext();
  const { free, budget, loading, error } = useSelector(
    (state: RootState) => state.overview
  );

  // Memoized calculations with fallbacks (moved before early returns)
  const totalExpenses = useMemo(
    () => (free?.totalSpent || 0) + (budget?.totalSpent || 0),
    [free?.totalSpent, budget?.totalSpent]
  );
  const totalTransactions = useMemo(
    () => (free?.totalExpenses || 0) + (budget?.totalExpenses || 0),
    [free?.totalExpenses, budget?.totalExpenses]
  );
  const budgetUsagePercent = useMemo(
    () =>
      budget?.totalBudget > 0
        ? (budget.totalSpent / budget.totalBudget) * 100
        : 0,
    [budget?.totalBudget, budget?.totalSpent]
  );

  // Error handling
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load statistics. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  const stats = [
    {
      title: dashboard?.totalExpenses || 'Total Expenses',
      value: formatCurrency(totalExpenses, 'INR', locale),
      change: free?.monthlyChange
        ? free.monthlyChange > 0
          ? `+${free.monthlyChange.toFixed(1)}%`
          : `${free.monthlyChange.toFixed(1)}%`
        : '0%',
      trend: (free?.monthlyChange || 0) >= 0 ? 'up' : 'down',
      icon: DollarSign,
      description: dashboard?.lastMonth || 'Last Month',
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
        totalExpenses > 50000
          ? 'high'
          : totalExpenses > 20000
            ? 'medium'
            : 'low',
    },
    {
      title: dashboard?.budgetUsage || 'Budget Usage',
      value: formatCurrency(budget?.totalBudget || 0, 'INR', locale),
      change: `${budgetUsagePercent.toFixed(1)}%`,
      trend: budgetUsagePercent > 80 ? 'down' : 'up',
      icon: Target,
      description: dashboard?.thisMonth || 'This Month',
      href: '/dashboard/expenses/budget',
      actions: [
        {
          icon: Target,
          label: 'Add Budget',
          href: '/dashboard/budgets',
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
          ? 'high'
          : budgetUsagePercent > 60
            ? 'medium'
            : 'low',
    },
    {
      title: dashboard?.categories || 'Categories',
      value: (
        (free?.categoryBreakdown?.length || 0) +
        (budget?.categoryBreakdown?.length || 0)
      ).toString(),
      change: `${free?.categoryBreakdown?.length || 0} ${common?.total || 'total'}`,
      trend: 'up',
      icon: CreditCard,
      description: `${budget?.categoryBreakdown?.length || 0} ${dashboard?.budgetUsage || 'budget'}`,
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
      status: 'medium',
    },
    {
      title: dashboard?.transactions || 'Transactions',
      value: totalTransactions.toString(),
      change: budget?.expenseChange
        ? budget.expenseChange > 0
          ? `+${budget.expenseChange}`
          : budget.expenseChange.toString()
        : '0',
      trend: (budget?.expenseChange || 0) >= 0 ? 'up' : 'down',
      icon: Calendar,
      description: dashboard?.thisMonth || 'This Month',
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
          label: 'View Report',
          href: '/dashboard/analytics',
          variant: 'outline' as const,
        },
      ],
      status:
        totalTransactions > 50
          ? 'high'
          : totalTransactions > 20
            ? 'medium'
            : 'low',
    },
  ];

  if (loading) {
    return <StatsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon =
          stat.trend === 'up'
            ? TrendingUp
            : stat.trend === 'down'
              ? TrendingDown
              : TrendingUp;

        const trendColor =
          stat.trend === 'up'
            ? 'text-green-500'
            : stat.trend === 'down'
              ? 'text-red-500'
              : 'text-blue-500';

        const statusColors: Record<string, string> = {
          high: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20',
          medium:
            'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20',
          low: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20',
        };

        const statusBadgeColors: Record<string, string> = {
          high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          medium:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };

        return (
          <Card
            key={stat.title}
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${statusColors[stat.status]}`}
          >
            <Link href={getLocalizedPath(stat.href)} className="block">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground truncate">
                    {stat.title}
                  </CardTitle>
                  <Badge
                    className={`text-xs px-1.5 py-0.5 ${statusBadgeColors[stat.status]}`}
                  >
                    {stat.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {stat.title.includes('Budget') && (
                    <ProgressRing
                      progress={budgetUsagePercent}
                      size={24}
                      strokeWidth={2}
                    />
                  )}
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="text-2xl font-bold truncate"
                    title={stat.value}
                  >
                    {stat.value}
                  </div>
                  {stat.title.includes('Total Expenses') &&
                    totalExpenses > 0 && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          Daily Avg
                        </div>
                        <div className="text-sm font-medium">
                          ₹{(totalExpenses / 30).toFixed(0)}
                        </div>
                      </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendIcon className={`mr-1 h-3 w-3 ${trendColor}`} />
                    <span className={trendColor}>{stat.change}</span>
                    <span className="ml-1 truncate">{stat.description}</span>
                  </div>
                  {stat.title.includes('Budget') && budgetUsagePercent > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {budgetUsagePercent > 80
                        ? '⚠️ High Usage'
                        : budgetUsagePercent > 60
                          ? '⚡ Medium'
                          : '✅ On Track'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Link>

            {/* Quick Actions - Show on hover */}
            <div className="absolute inset-x-0 bottom-0 bg-background/95 backdrop-blur-sm border-t opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0">
              <div className="flex gap-1 p-2">
                {stat.actions.map((action, index) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={index}
                      asChild
                      size="sm"
                      variant={action.variant}
                      className="flex-1 h-8 text-xs"
                    >
                      <Link
                        href={getLocalizedPath(action.href)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionIcon className="h-3 w-3 mr-1" />
                        {action.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
