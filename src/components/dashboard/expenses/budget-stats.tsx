'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, DollarSign, Wallet, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';

export function BudgetStats() {
  const dispatch = useAppDispatch();
  const { budget, loading } = useAppSelector(state => state.overview);
  console.log("Budget : ", budget, 12);
  useEffect(() => {
    dispatch(refreshStats('budget'));
  }, [dispatch]);

  const remaining = budget.totalBudget - budget.totalSpent;

  const statsData = [
    {
      title: 'Total Budget',
      value: `₹${budget.totalBudget.toLocaleString()}`,
      change: `₹${budget.totalSpent.toLocaleString()} spent`,
      trend: 'neutral',
      icon: Target,
      description: 'active budgets'
    },
    {
      title: 'Budget Spent',
      value: `₹${budget.totalSpent.toLocaleString()}`,
      change: `${budget.monthlyChange > 0 ? '+' : ''}${budget.monthlyChange}%`,
      trend: budget.monthlyChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'Remaining',
      value: `₹${remaining.toLocaleString()}`,
      change: remaining > 0 ? 'Available' : 'Exceeded',
      trend: remaining > 0 ? 'up' : 'down',
      icon: Wallet,
      description: 'budget left'
    },
    {
      title: 'Budget Expenses',
      value: budget.totalExpenses.toString(),
      change: `${budget.expenseChange > 0 ? '+' : ''}${budget.expenseChange}`,
      trend: budget.expenseChange >= 0 ? 'up' : 'down',
      icon: BarChart3,
      description: 'vs last month'
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