'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Target } from 'lucide-react';

interface ExpenseStats {
  totalSpent: number;
  totalExpenses: number;
  averageExpense: number;
  thisMonth: number;
  monthlyChange: number;
}

export function ExpenseStats() {
  const [stats, setStats] = useState<ExpenseStats>({
    totalSpent: 0,
    totalExpenses: 0,
    averageExpense: 0,
    thisMonth: 0,
    monthlyChange: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/expenses/stats?type=free');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch expense stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: 'Total Spent',
      value: `₹${stats.totalSpent.toLocaleString()}`,
      change: `${stats.monthlyChange > 0 ? '+' : ''}${stats.monthlyChange}%`,
      trend: stats.monthlyChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpenses.toString(),
      change: '+12',
      trend: 'up',
      icon: BarChart3,
      description: 'this month'
    },
    {
      title: 'Average Expense',
      value: `₹${stats.averageExpense.toLocaleString()}`,
      change: '-5%',
      trend: 'down',
      icon: Target,
      description: 'per transaction'
    },
    {
      title: 'This Month',
      value: `₹${stats.thisMonth.toLocaleString()}`,
      change: '+18%',
      trend: 'up',
      icon: Calendar,
      description: 'current month'
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