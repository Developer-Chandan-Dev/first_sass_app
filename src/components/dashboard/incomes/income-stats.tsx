'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Calendar,
  Repeat,
  Target,
  Plus,
  Eye,
  BarChart3,
} from 'lucide-react';
import { useMemo } from 'react';
import { useLocale as useLocaleContext } from '@/contexts/locale-context';
import { UniversalStatCard } from '../shared/universal-stat-card';
import { useDashboardTranslations } from '@/hooks/i18n';


function InsightCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="h-5 w-32 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-2 w-full bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export function IncomeStats() {
  const { incomes, totalIncome, monthlyIncome, loading } = useSelector(
    (state: RootState) => state.incomes
  );
  const { getLocalizedPath } = useLocaleContext();
  const { income, dashboard, expenses } = useDashboardTranslations();

  const stats = useMemo(() => {
    if (loading) {
      return {
        totalIncome: 0,
        monthlyIncome: 0,
        monthlyChange: 0,
        recurringAmount: 0,
        recurringCount: 0,
        avgIncome: 0,
        weeklyIncome: 0,
        totalEntries: 0,
        topCategory: null,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate last month's income
    const lastMonthIncome = incomes
      .filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getMonth() === lastMonth &&
          incomeDate.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, income) => sum + income.amount, 0);

    // Calculate monthly change
    const monthlyChange =
      lastMonthIncome > 0
        ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100
        : monthlyIncome > 0
          ? 100
          : 0;

    // Calculate recurring income
    const recurringIncomes = incomes.filter((income) => income.isRecurring);
    const recurringAmount = recurringIncomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );

    // Calculate average income per entry
    const avgIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;

    // Calculate this week's income
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weeklyIncome = incomes
      .filter((income) => new Date(income.date) >= weekStart)
      .reduce((sum, income) => sum + income.amount, 0);

    // Calculate category distribution
    const categoryStats = incomes.reduce(
      (acc, income) => {
        acc[income.category] = (acc[income.category] || 0) + income.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const topCategory = Object.entries(categoryStats).sort(
      ([, a], [, b]) => b - a
    )[0];

    return {
      totalIncome,
      monthlyIncome,
      monthlyChange,
      recurringAmount,
      recurringCount: recurringIncomes.length,
      avgIncome,
      weeklyIncome,
      totalEntries: incomes.length,
      topCategory: topCategory
        ? { name: topCategory[0], amount: topCategory[1] }
        : null,
    };
  }, [incomes, totalIncome, monthlyIncome, loading]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Main Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

        {/* Additional Insights Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InsightCardSkeleton />
          <InsightCardSkeleton />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: income.totalIncome,
      value: `₹${stats.totalIncome.toLocaleString()}`,
      change: `${stats.totalEntries} ${income.entries || 'entries'}`,
      trend: 'neutral' as const,
      icon: DollarSign,
      description: income.allTimeEarnings || 'All time earnings',
      href: '/dashboard/income',
      actions: [
        {
          icon: Plus,
          label: income.addIncome,
          href: '/dashboard/income',
          variant: 'default' as const,
        },
        {
          icon: Eye,
          label: income.viewAll || 'View All',
          href: '/dashboard/income',
          variant: 'outline' as const,
        },
      ],
      status:
        stats.totalIncome > 100000
          ? ('high' as const)
          : stats.totalIncome > 50000
            ? ('medium' as const)
            : ('low' as const),
      extraInfo: `₹${stats.avgIncome.toLocaleString()}/${income.avg || 'avg'}`,
    },
    {
      title: income.monthlyIncome,
      value: `₹${stats.monthlyIncome.toLocaleString()}`,
      change: `${stats.monthlyChange >= 0 ? '+' : ''}${stats.monthlyChange.toFixed(1)}%`,
      trend: stats.monthlyChange >= 0 ? ('up' as const) : ('down' as const),
      icon: Calendar,
      description: dashboard.vsLastMonth,
      href: '/dashboard/income',
      status:
        stats.monthlyChange >= 10
          ? ('high' as const)
          : stats.monthlyChange >= 0
            ? ('medium' as const)
            : ('low' as const),
    },
    {
      title: income.recurringIncome,
      value: `₹${stats.recurringAmount.toLocaleString()}`,
      change: `${stats.recurringCount} ${income.sources || 'sources'}`,
      trend: 'up' as const,
      icon: Repeat,
      description: income.automatedIncome || 'automated income',
      href: '/dashboard/income',
      actions: [
        {
          icon: Plus,
          label: income.addRecurring || 'Add Recurring',
          href: '/dashboard/income',
          variant: 'default' as const,
        },
        {
          icon: BarChart3,
          label: expenses.analytics || 'Analytics',
          href: '/dashboard/analytics',
          variant: 'outline' as const,
        },
      ],
      status:
        stats.recurringCount > 3
          ? ('high' as const)
          : stats.recurringCount > 1
            ? ('medium' as const)
            : ('low' as const),
    },
    {
      title: income.weeklyIncome || 'Weekly Income',
      value: `₹${stats.weeklyIncome.toLocaleString()}`,
      change: `${income.avg || 'Avg'} ₹${stats.avgIncome.toLocaleString()}`,
      trend: 'neutral' as const,
      icon: Target,
      description: income.thisWeek || 'this week',
      status: 'medium' as const,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
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

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Category */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {income.topIncomeCategory || 'Top Income Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topCategory ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{stats.topCategory.name}</span>
                  <Badge variant="secondary">
                    ₹{stats.topCategory.amount.toLocaleString()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {(
                    (stats.topCategory.amount / stats.totalIncome) *
                    100
                  ).toFixed(1)}
                  % {income.ofTotalIncome || 'of total income'}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(stats.topCategory.amount / stats.totalIncome) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {income.noIncomeData || 'No income data available'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {income.quickInsights || 'Quick Insights'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {income.averagePerEntry || 'Average per entry'}
                </span>
                <span className="font-medium">
                  ₹{stats.avgIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {income.recurringSources || 'Recurring sources'}
                </span>
                <span className="font-medium">{stats.recurringCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {income.totalEntries || 'Total entries'}
                </span>
                <span className="font-medium">{stats.totalEntries}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {income.thisWeek || 'This week'}
                </span>
                <span className="font-medium text-green-600">
                  ₹{stats.weeklyIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
