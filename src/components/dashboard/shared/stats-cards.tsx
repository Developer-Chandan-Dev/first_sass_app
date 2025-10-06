'use client';

import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, Calendar, AlertTriangle } from 'lucide-react';
import { useAppTranslations, formatCurrency } from '@/hooks/useTranslation';
import { useLocale } from 'next-intl';

export function StatsCards() {
  const { dashboard, common } = useAppTranslations();
  const locale = useLocale();
  const { free, budget, loading, error } = useSelector((state: RootState) => state.overview);
  
  // Memoized calculations with fallbacks (moved before early returns)
  const totalExpenses = useMemo(() => (free?.totalSpent || 0) + (budget?.totalSpent || 0), [free?.totalSpent, budget?.totalSpent]);
  const totalTransactions = useMemo(() => (free?.totalExpenses || 0) + (budget?.totalExpenses || 0), [free?.totalExpenses, budget?.totalExpenses]);
  const budgetUsagePercent = useMemo(() => budget?.totalBudget > 0 ? ((budget.totalSpent / budget.totalBudget) * 100) : 0, [budget?.totalBudget, budget?.totalSpent]);
  
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
      change: free?.monthlyChange ? (free.monthlyChange > 0 ? `+${free.monthlyChange.toFixed(1)}%` : `${free.monthlyChange.toFixed(1)}%`) : '0%',
      trend: (free?.monthlyChange || 0) >= 0 ? 'up' : 'down',
      icon: DollarSign,
      description: dashboard?.lastMonth || 'Last Month'
    },
    {
      title: dashboard?.budgetUsage || 'Budget Usage',
      value: formatCurrency(budget?.totalBudget || 0, 'INR', locale),
      change: `${budgetUsagePercent.toFixed(1)}%`,
      trend: budgetUsagePercent > 80 ? 'down' : 'up',
      icon: Target,
      description: dashboard?.thisMonth || 'This Month'
    },
    {
      title: dashboard?.categories || 'Categories',
      value: ((free?.categoryBreakdown?.length || 0) + (budget?.categoryBreakdown?.length || 0)).toString(),
      change: `${free?.categoryBreakdown?.length || 0} ${common?.total || 'total'}`,
      trend: 'up',
      icon: CreditCard,
      description: `${budget?.categoryBreakdown?.length || 0} ${dashboard?.budgetUsage || 'budget'}`
    },
    {
      title: dashboard?.transactions || 'Transactions',
      value: totalTransactions.toString(),
      change: budget?.expenseChange ? (budget.expenseChange > 0 ? `+${budget.expenseChange}` : budget.expenseChange.toString()) : '0',
      trend: (budget?.expenseChange || 0) >= 0 ? 'up' : 'down',
      icon: Calendar,
      description: dashboard?.thisMonth || 'This Month'
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : TrendingUp;
        
        const trendColor = stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-blue-500';
        
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground truncate">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate" title={stat.value}>{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendIcon className={`mr-1 h-3 w-3 ${trendColor}`} />
                <span className={trendColor}>
                  {stat.change}
                </span>
                <span className="ml-1 truncate">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}