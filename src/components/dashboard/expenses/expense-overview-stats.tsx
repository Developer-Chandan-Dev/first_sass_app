'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Calendar, PieChart, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';

export function ExpenseOverviewStats() {
  const dispatch = useAppDispatch();
  const { free, budget } = useAppSelector(state => state.overview);

  useEffect(() => {
    // Fetch stats for both expense types
    dispatch(refreshStats('free'));
    dispatch(refreshStats('budget'));
  }, [dispatch]);

  // Calculate combined stats from Redux state
  const totalAmount = free.totalSpent + budget.totalSpent;
  const thisMonthTotal = free.totalSpent + budget.totalSpent; // Using total for now
  const categoriesCount = new Set([...free.categoryBreakdown.map(c => c._id), ...budget.categoryBreakdown.map(c => c._id)]).size;
  const avgPerDay = Math.round(thisMonthTotal / 30);

  const statsData = [
    {
      title: 'Total Expenses',
      value: `₹${totalAmount.toLocaleString()}`,
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'This Month',
      value: `₹${thisMonthTotal.toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      description: 'current month'
    },
    {
      title: 'Categories',
      value: categoriesCount.toString(),
      change: '+2',
      trend: 'up',
      icon: PieChart,
      description: 'active categories'
    },
    {
      title: 'Avg/Day',
      value: `₹${avgPerDay.toLocaleString()}`,
      change: '-5%',
      trend: 'down',
      icon: BarChart3,
      description: 'last 30 days'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        
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
              <p className="text-xs text-green-600">
                {stat.change} {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}