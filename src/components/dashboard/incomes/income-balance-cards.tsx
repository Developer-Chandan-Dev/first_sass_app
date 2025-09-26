'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Wallet, PiggyBank } from 'lucide-react';

interface DashboardStats {
  income: {
    total: number;
    connected: number;
    unconnected: number;
    count: number;
    connectedCount: number;
  };
  expenses: {
    total: number;
    balanceAffecting: number;
    count: number;
  };
  balance: number | null;
  hasConnectedIncome: boolean;
}

export function IncomeBalanceCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/incomes/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!stats) return null;

  const cards = [
    {
      title: 'Total Income',
      value: `₹${stats.income.total.toLocaleString()}`,
      description: `${stats.income.count} sources`,
      icon: DollarSign,
      trend: 'up' as const,
      color: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: `₹${stats.expenses.total.toLocaleString()}`,
      description: `${stats.expenses.count} transactions`,
      icon: TrendingDown,
      trend: 'down' as const,
      color: 'text-red-600'
    }
  ];

  // Add balance card only if there's connected income
  if (stats.hasConnectedIncome) {
    cards.push({
      title: 'Balance',
      value: `₹${stats.balance?.toLocaleString() || '0'}`,
      description: 'Connected income - expenses',
      icon: Wallet,
      trend: (stats.balance || 0) >= 0 ? 'up' as const : 'down' as const,
      color: (stats.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
    });
  }

  // Add connected income breakdown
  if (stats.income.connected > 0) {
    cards.push({
      title: 'Connected Income',
      value: `₹${stats.income.connected.toLocaleString()}`,
      description: `${stats.income.connectedCount} connected sources`,
      icon: PiggyBank,
      trend: 'up' as const,
      color: 'text-blue-600'
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendIcon className={`mr-1 h-3 w-3 ${card.color}`} />
                <span className={card.color}>{card.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Connection Status Badge */}
      {stats.hasConnectedIncome && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="default" className="bg-green-500">
                Balance Tracking Active
              </Badge>
              <span className="text-sm text-muted-foreground">
                {stats.income.connectedCount} income source(s) connected to expenses
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}