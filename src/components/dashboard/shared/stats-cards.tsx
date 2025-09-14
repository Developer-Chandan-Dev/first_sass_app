import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Target, Calendar } from 'lucide-react';

export function StatsCards() {
  const stats = [
    {
      title: 'Total Expenses',
      value: '₹12,426',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'Monthly Budget',
      value: '₹15,000',
      change: '82.8%',
      trend: 'neutral',
      icon: Target,
      description: 'used this month'
    },
    {
      title: 'Active Cards',
      value: '4',
      change: '+1',
      trend: 'up',
      icon: CreditCard,
      description: 'new card added'
    },
    {
      title: 'This Month',
      value: '156',
      change: '+23',
      trend: 'up',
      icon: Calendar,
      description: 'transactions'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
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