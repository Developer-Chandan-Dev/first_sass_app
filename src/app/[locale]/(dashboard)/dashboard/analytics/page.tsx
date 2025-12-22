'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { useDashboardTranslations } from '@/hooks/i18n';
import { ChartAreaInteractive } from '@/components/common/chart-area-interactive'
import { ChartPieInteractive } from '@/components/common/chart-pie-interactive'
import { ChartBarInteractive } from '@/components/common/chart-bar-interactive'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

interface ExpenseData {
  category: string;
  amount: number;
  count: number;
}

interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
  udharPurchases?: number;
  udharPayments?: number;
}

export default function AnalyticsPage() {
  const { pages } = useDashboardTranslations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<ExpenseData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    avgExpense: 0,
    topCategory: '',
    monthlyGrowth: 0
  });

  const safeParseDate = useCallback((dateString: string | undefined): string => {
    try {
      if (!dateString) return new Date().toISOString().split('T')[0];
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString().split('T')[0] : date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setCategoryData(data.expenseCategoryData || []);
        setMonthlyData(data.monthlyData || []);
        setStats({
          totalExpenses: data.expenseStats?.total || 0,
          avgExpense: data.expenseStats?.average || 0,
          topCategory: data.expenseStats?.topCategory || '',
          monthlyGrowth: data.expenseStats?.monthlyGrowth || 0
        });
      } else {
        setError('Failed to load analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('An error occurred while loading analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);



  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Loading analytics data..." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={`skeleton-${i}`} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Error loading analytics" />
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">{error}</p>
            <button onClick={fetchAnalytics} className="mt-4 text-primary hover:underline">
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={pages?.analytics?.title || 'Analytics'}
        description="Comprehensive insights into your spending patterns and financial trends"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">${stats.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Expense</p>
                <p className="text-2xl font-bold">${stats.avgExpense.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Category</p>
                <p className="text-2xl font-bold truncate">{stats.topCategory || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <PieChartIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Growth</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{Math.abs(stats.monthlyGrowth).toFixed(1)}%</p>
                  {stats.monthlyGrowth >= 0 ? (
                    <ArrowUpRight className="h-5 w-5 text-red-600" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-full ${stats.monthlyGrowth >= 0 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
                {stats.monthlyGrowth >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Distribution */}
        <ChartPieInteractive
          title="Spending by Category"
          description="Distribution of expenses across categories"
          data={categoryData.map((item, idx) => ({
            name: item.category,
            value: item.amount,
            fill: COLORS[idx % COLORS.length]
          }))}
          totalLabel="Total Spent"
          height={300}
        />

        {/* Category Comparison */}
        <ChartBarInteractive
          title="Category Comparison"
          description="Compare spending across different categories"
          data={categoryData.map(item => ({
            name: item.category,
            value: item.amount
          }))}
          color="#3b82f6"
          height={300}
          showYAxis={true}
        />
      </div>

      {/* Income vs Expenses Trend */}
      <ChartAreaInteractive
        title="Income vs Expenses"
        description="Track your income and expenses over time"
        data={monthlyData.map(item => ({
          date: safeParseDate(item.month),
          expenses: item.expenses,
          income: item.income || 0
        }))}
        dataKeys={[
          { key: 'income', label: 'Income', color: '#10b981' },
          { key: 'expenses', label: 'Expenses', color: '#ef4444' }
        ]}
        timeRangeOptions={[
          { value: '180d', label: 'Last 6 months', days: 180 },
          { value: '90d', label: 'Last 3 months', days: 90 },
          { value: '30d', label: 'Last 30 days', days: 30 }
        ]}
        defaultTimeRange="180d"
        height={350}
        showYAxis={true}
      />

      {/* Udhar Trend */}
      <ChartAreaInteractive
        title="Udhar Management"
        description="Track udhar purchases and payments over time"
        data={monthlyData.map(item => ({
          date: safeParseDate(item.month),
          purchases: item.udharPurchases || 0,
          payments: item.udharPayments || 0
        }))}
        dataKeys={[
          { key: 'purchases', label: 'Purchases', color: '#f59e0b' },
          { key: 'payments', label: 'Payments', color: '#10b981' }
        ]}
        timeRangeOptions={[
          { value: '180d', label: 'Last 6 months', days: 180 },
          { value: '90d', label: 'Last 3 months', days: 90 },
          { value: '30d', label: 'Last 30 days', days: 30 }
        ]}
        defaultTimeRange="180d"
        height={350}
        showYAxis={true}
      />

      {/* Category Details */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="space-y-3">
              {categoryData.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[categoryData.indexOf(cat) % COLORS.length] }}
                    />
                    <div>
                      <p className="font-semibold">{cat.category}</p>
                      <p className="text-sm text-muted-foreground">{cat.count} transactions</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-base font-bold">
                    ${cat.amount.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No expense data available. Start adding expenses to see analytics.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
