'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { useDashboardTranslations, formatCurrency } from '@/hooks/i18n';
import { useLocale } from 'next-intl';

interface StatsData {
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  growthRate: number;
}

export function OverviewStats() {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    growthRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { admin, dashboard } = useDashboardTranslations();
  const locale = useLocale();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/analytics/overview');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: admin.users,
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: admin.revenue,
      value: formatCurrency(stats.totalRevenue, 'USD', locale),
      icon: DollarSign,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: admin.plans,
      value: stats.activeSubscriptions.toLocaleString(),
      icon: CreditCard,
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate}%`,
      icon: TrendingUp,
      change: '+3%',
      changeType: 'positive' as const,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-green-600">
                {stat.change} {dashboard.lastMonth}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}