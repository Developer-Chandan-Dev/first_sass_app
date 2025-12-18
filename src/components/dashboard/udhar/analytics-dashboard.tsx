'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, AlertTriangle, Calendar, Wallet } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsDashboardProps {
  stats: {
    totalCustomers: number;
    totalOutstanding: number;
    highRiskCustomers: number;
    todayCollections: number;
    weekCollections: number;
    monthCollections: number;
    todayPurchases: number;
    weekPurchases: number;
    monthPurchases: number;
    chartData: { date: string; purchases: number; payments: number }[];
    paymentMethods: Record<string, number>;
  };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
  const paymentMethodData = Object.entries(stats.paymentMethods).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  }));

  const periodStats = [
    { period: 'Today', collections: stats.todayCollections, purchases: stats.todayPurchases, icon: Calendar, color: 'text-blue-600' },
    { period: 'This Week', collections: stats.weekCollections, purchases: stats.weekPurchases, icon: TrendingUp, color: 'text-green-600' },
    { period: 'This Month', collections: stats.monthCollections, purchases: stats.monthPurchases, icon: Wallet, color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Customers</p>
                <p className="text-xl font-bold">{stats.totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="text-xl font-bold">₹{stats.totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Week Collection</p>
                <p className="text-xl font-bold">₹{stats.weekCollections.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">High Risk</p>
                <p className="text-xl font-bold">{stats.highRiskCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {periodStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  {stat.period}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Collections</span>
                  <Badge variant="default" className="bg-green-600">₹{stat.collections.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Purchases</span>
                  <Badge variant="destructive">₹{stat.purchases.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs font-semibold">Net</span>
                  <span className={`text-sm font-bold ${stat.collections - stat.purchases >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{(stat.collections - stat.purchases).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">7-Day Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="purchases" stroke="#ef4444" name="Purchases" />
                <Line type="monotone" dataKey="payments" stroke="#10b981" name="Payments" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={paymentMethodData} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ₹${entry.value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No payment data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
