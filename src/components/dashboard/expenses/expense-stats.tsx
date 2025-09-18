'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Target } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';

export function ExpenseStats() {
  const dispatch = useAppDispatch();
  const { free, loading } = useAppSelector(state => state.overview);

  useEffect(() => {
    dispatch(refreshStats('free'));
  }, [dispatch]);

  const averageExpense = free.totalExpenses > 0 ? free.totalSpent / free.totalExpenses : 0;

  const statsData = [
    {
      title: 'Total Spent',
      value: `₹${free.totalSpent.toLocaleString()}`,
      change: `${free.monthlyChange > 0 ? '+' : ''}${free.monthlyChange}%`,
      trend: free.monthlyChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'Total Expenses',
      value: free.totalExpenses.toString(),
      change: `${free.expenseChange > 0 ? '+' : ''}${free.expenseChange}`,
      trend: free.expenseChange >= 0 ? 'up' : 'down',
      icon: BarChart3,
      description: 'vs last month'
    },
    {
      title: 'Average Expense',
      value: `₹${Math.round(averageExpense).toLocaleString()}`,
      change: free.totalExpenses > 0 ? `₹${Math.round(averageExpense)}` : '₹0',
      trend: 'neutral',
      icon: Target,
      description: 'per transaction'
    },
    {
      title: 'Previous Month',
      value: `₹${free.previousMonthSpent.toLocaleString()}`,
      change: `${free.previousMonthExpenses} expenses`,
      trend: 'neutral',
      icon: Calendar,
      description: 'last month'
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        
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
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
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