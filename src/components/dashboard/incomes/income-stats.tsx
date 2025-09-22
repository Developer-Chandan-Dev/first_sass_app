'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Repeat, Target } from 'lucide-react';
import { useMemo } from 'react';

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
        <div className="h-3 w-16 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

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
  const { incomes, totalIncome, monthlyIncome, loading } = useSelector((state: RootState) => state.incomes);

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
        topCategory: null
      };
    }
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Calculate last month's income
    const lastMonthIncome = incomes
      .filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === lastMonth && incomeDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, income) => sum + income.amount, 0);

    // Calculate monthly change
    const monthlyChange = lastMonthIncome > 0 
      ? ((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100 
      : monthlyIncome > 0 ? 100 : 0;

    // Calculate recurring income
    const recurringIncomes = incomes.filter(income => income.isRecurring);
    const recurringAmount = recurringIncomes.reduce((sum, income) => sum + income.amount, 0);

    // Calculate average income per entry
    const avgIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;

    // Calculate this week's income
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weeklyIncome = incomes
      .filter(income => new Date(income.date) >= weekStart)
      .reduce((sum, income) => sum + income.amount, 0);

    // Calculate category distribution
    const categoryStats = incomes.reduce((acc, income) => {
      acc[income.category] = (acc[income.category] || 0) + income.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalIncome,
      monthlyIncome,
      monthlyChange,
      recurringAmount,
      recurringCount: recurringIncomes.length,
      avgIncome,
      weeklyIncome,
      totalEntries: incomes.length,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null
    };
  }, [incomes, totalIncome, monthlyIncome, loading]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Main Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
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
      title: 'Total Income',
      value: `₹${stats.totalIncome.toLocaleString()}`,
      change: `${stats.totalEntries} entries`,
      trend: 'neutral' as const,
      icon: DollarSign,
      description: 'All time earnings'
    },
    {
      title: 'Monthly Income',
      value: `₹${stats.monthlyIncome.toLocaleString()}`,
      change: `${stats.monthlyChange >= 0 ? '+' : ''}${stats.monthlyChange.toFixed(1)}%`,
      trend: stats.monthlyChange >= 0 ? 'up' : 'down' as const,
      icon: Calendar,
      description: 'vs last month'
    },
    {
      title: 'Recurring Income',
      value: `₹${stats.recurringAmount.toLocaleString()}`,
      change: `${stats.recurringCount} sources`,
      trend: 'up' as const,
      icon: Repeat,
      description: 'automated income'
    },
    {
      title: 'Weekly Income',
      value: `₹${stats.weeklyIncome.toLocaleString()}`,
      change: `Avg ₹${stats.avgIncome.toLocaleString()}`,
      trend: 'neutral' as const,
      icon: TrendingUp,
      description: 'this week'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Target;
          
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendIcon className={`mr-1 h-3 w-3 ${
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'down' ? 'text-red-500' : 'text-blue-500'
                  }`} />
                  <span className={
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'down' ? 'text-red-500' : 'text-blue-500'
                  }>
                    {stat.change}
                  </span>
                  <span className="ml-1">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Category */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Income Category</CardTitle>
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
                  {((stats.topCategory.amount / stats.totalIncome) * 100).toFixed(1)}% of total income
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(stats.topCategory.amount / stats.totalIncome) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No income data available</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Average per entry</span>
                <span className="font-medium">₹{stats.avgIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Recurring sources</span>
                <span className="font-medium">{stats.recurringCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total entries</span>
                <span className="font-medium">{stats.totalEntries}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">This week</span>
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