'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, Calendar } from 'lucide-react';
import { useAppTranslations, formatCurrency } from '@/hooks/useTranslation';
import { useLocale } from 'next-intl';

export function StatsCards() {
  const { dashboard, common } = useAppTranslations();
  const locale = useLocale();
  const { free, budget, loading } = useSelector((state: RootState) => state.overview);
  
  const totalExpenses = free.totalSpent + budget.totalSpent;
  const totalTransactions = free.totalExpenses + budget.totalExpenses;
  const budgetUsagePercent = budget.totalBudget > 0 ? ((budget.totalSpent / budget.totalBudget) * 100) : 0;
  
  const stats = [
    {
      title: dashboard.totalExpenses,
      value: formatCurrency(totalExpenses, 'INR', locale),
      change: free.monthlyChange > 0 ? `+${free.monthlyChange.toFixed(1)}%` : `${free.monthlyChange.toFixed(1)}%`,
      trend: free.monthlyChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      description: dashboard.lastMonth
    },
    {
      title: dashboard.budgetUsage,
      value: formatCurrency(budget.totalBudget, 'INR', locale),
      change: `${budgetUsagePercent.toFixed(1)}%`,
      trend: budgetUsagePercent > 80 ? 'down' : 'up',
      icon: Target,
      description: dashboard.thisMonth
    },
    {
      title: dashboard.categories,
      value: (free.categoryBreakdown.length + budget.categoryBreakdown.length).toString(),
      change: `${free.categoryBreakdown.length} ${common.total}`,
      trend: 'up',
      icon: CreditCard,
      description: `${budget.categoryBreakdown.length} ${dashboard.budgetUsage}`
    },
    {
      title: dashboard.transactions,
      value: totalTransactions.toString(),
      change: budget.expenseChange > 0 ? `+${budget.expenseChange}` : budget.expenseChange.toString(),
      trend: budget.expenseChange >= 0 ? 'up' : 'down',
      icon: Calendar,
      description: dashboard.thisMonth
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
        
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendIcon className={`mr-1 h-3 w-3 ${
                  stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-blue-500'
                }`} />
                <span className={stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-blue-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}