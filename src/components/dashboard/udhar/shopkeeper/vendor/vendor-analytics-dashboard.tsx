'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Store, AlertTriangle, Calendar, Wallet } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VendorAnalyticsDashboardProps {
  stats: {
    totalVendors: number;
    totalOwed: number;
    activeVendors: number;
    todayPayments: number;
    weekPayments: number;
    monthPayments: number;
    todayPurchases: number;
    weekPurchases: number;
    monthPurchases: number;
    chartData: { date: string; purchases: number; payments: number }[];
    paymentMethods: Record<string, number>;
  };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export function VendorAnalyticsDashboard({ stats }: VendorAnalyticsDashboardProps) {
  const paymentMethodData = Object.entries(stats.paymentMethods).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  }));

  const periodStats = [
    { period: 'Today', payments: stats.todayPayments, purchases: stats.todayPurchases, icon: Calendar, color: 'text-blue-600' },
    { period: 'This Week', payments: stats.weekPayments, purchases: stats.weekPurchases, icon: TrendingUp, color: 'text-green-600' },
    { period: 'This Month', payments: stats.monthPayments, purchases: stats.monthPurchases, icon: Wallet, color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <Store className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vendors</p>
                <p className="text-xl font-bold">{stats.totalVendors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Owed</p>
                <p className="text-xl font-bold">₹{stats.totalOwed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Week Payments</p>
                <p className="text-xl font-bold">₹{stats.weekPayments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{stats.activeVendors}</p>
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
                  <span className="text-xs text-muted-foreground">Purchases</span>
                  <Badge variant="destructive">₹{stat.purchases.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Payments</span>
                  <Badge variant="default" className="bg-green-600">₹{stat.payments.toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs font-semibold">Net Owed</span>
                  <span className={`text-sm font-bold ${stat.purchases - stat.payments >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{(stat.purchases - stat.payments).toLocaleString()}
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
                <Line type="monotone" dataKey="purchases" stroke="#f97316" name="Purchases" />
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
