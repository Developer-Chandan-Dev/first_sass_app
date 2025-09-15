'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target, DollarSign, Wallet, BarChart3 } from 'lucide-react';

interface BudgetStats {
  totalBudget: number;
  budgetSpent: number;
  remaining: number;
  totalBudgetExpenses: number;
  monthlyChange: number;
}

export function BudgetStats() {
  const [stats, setStats] = useState<BudgetStats>({
    totalBudget: 0,
    budgetSpent: 0,
    remaining: 0,
    totalBudgetExpenses: 0,
    monthlyChange: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/expenses/dashboard?type=budget');
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalBudget: data.stats.totalBudget,
            budgetSpent: data.stats.totalSpent,
            remaining: data.stats.totalBudget - data.stats.totalSpent,
            totalBudgetExpenses: data.stats.totalExpenses,
            monthlyChange: 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch budget stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: 'Total Budget',
      value: `₹${stats.totalBudget.toLocaleString()}`,
      change: '+5%',
      trend: 'up',
      icon: Target,
      description: 'active budgets'
    },
    {
      title: 'Budget Spent',
      value: `₹${stats.budgetSpent.toLocaleString()}`,
      change: `${stats.monthlyChange > 0 ? '+' : ''}${stats.monthlyChange}%`,
      trend: stats.monthlyChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'Remaining',
      value: `₹${stats.remaining.toLocaleString()}`,
      change: stats.remaining > 0 ? 'Available' : 'Exceeded',
      trend: stats.remaining > 0 ? 'up' : 'down',
      icon: Wallet,
      description: 'budget left'
    },
    {
      title: 'Budget Expenses',
      value: stats.totalBudgetExpenses.toString(),
      change: '+8',
      trend: 'up',
      icon: BarChart3,
      description: 'this month'
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