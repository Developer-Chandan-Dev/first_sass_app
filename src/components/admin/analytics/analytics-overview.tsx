'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';

export function AnalyticsOverview() {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
      icon: TrendingUp,
    },
    {
      title: 'Churn Rate',
      value: '2.1%',
      change: '-1.2%',
      trend: 'up',
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.trend === 'up' && metric.change.startsWith('+');
        
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {metric.value}
              </div>
              <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}