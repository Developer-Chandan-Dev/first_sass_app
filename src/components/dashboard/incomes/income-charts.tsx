'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useState, useMemo } from 'react';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
} from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-5 w-32 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

type ChartPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

export function IncomeCharts() {
  const { incomes, loading } = useSelector((state: RootState) => state.incomes);
  const [period, setPeriod] = useState<ChartPeriod>('monthly');
  const { income } = useDashboardTranslations();

  const chartData = useMemo(() => {
    if (loading) return [];
    const now = new Date();
    const data: { [key: string]: number } = {};

    incomes.forEach((income) => {
      const date = new Date(income.date);
      let key: string;

      switch (period) {
        case 'daily':
          // Last 30 days
          const daysDiff = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff <= 30) {
            key = date.toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            });
          } else return;
          break;
        case 'weekly':
          // Last 12 weeks
          const weeksDiff = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 7)
          );
          if (weeksDiff <= 12) {
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = `Week ${weekStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
          } else return;
          break;
        case 'monthly':
          // Last 12 months
          const monthsDiff =
            (now.getFullYear() - date.getFullYear()) * 12 +
            (now.getMonth() - date.getMonth());
          if (monthsDiff <= 12) {
            key = date.toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
            });
          } else return;
          break;
        case 'yearly':
          // Last 5 years
          const yearsDiff = now.getFullYear() - date.getFullYear();
          if (yearsDiff <= 5) {
            key = date.getFullYear().toString();
          } else return;
          break;
      }

      data[key] = (data[key] || 0) + income.amount;
    });

    return Object.entries(data)
      .map(([period, amount]) => ({ period, amount }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }, [incomes, period, loading]);

  const categoryData = useMemo(() => {
    if (loading) return [];
    const categories: { [key: string]: number } = {};

    incomes.forEach((income) => {
      categories[income.category] =
        (categories[income.category] || 0) + income.amount;
    });

    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [incomes, loading]);

  const trendData = useMemo(() => {
    if (loading) return [];
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        amount: 0,
      };
    }).reverse();

    incomes.forEach((income) => {
      const incomeDate = new Date(income.date);
      const monthIndex = last6Months.findIndex((month) => {
        const monthDate = new Date();
        monthDate.setMonth(
          monthDate.getMonth() - (5 - last6Months.indexOf(month))
        );
        return (
          incomeDate.getMonth() === monthDate.getMonth() &&
          incomeDate.getFullYear() === monthDate.getFullYear()
        );
      });

      if (monthIndex !== -1) {
        last6Months[monthIndex].amount += income.amount;
      }
    });

    return last6Months;
  }, [incomes, loading]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Chart Controls Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-9 w-full sm:w-[180px] bg-muted animate-pulse rounded" />
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const avgIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-semibold">
          {income.incomeAnalytics || 'Income Analytics'}
        </h3>
        <Select
          value={period}
          onValueChange={(value: ChartPeriod) => setPeriod(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">
              {income.daily || 'Daily'} (30 {income.days || 'days'})
            </SelectItem>
            <SelectItem value="weekly">
              {income.weekly || 'Weekly'} (12 {income.weeks || 'weeks'})
            </SelectItem>
            <SelectItem value="monthly">
              {income.monthly || 'Monthly'} (12 {income.months || 'months'})
            </SelectItem>
            <SelectItem value="yearly">
              {income.yearly || 'Yearly'} (5 {income.years || 'years'})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
        {/* Income Trend Chart */}
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">
                {income.incomeBy || 'Income by'}{' '}
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pb-3 sm:pb-6">
            <div className="h-[180px] sm:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="period"
                    fontSize={10}
                    tick={{ fontSize: 8 }}
                    interval="preserveStartEnd"
                    height={40}
                  />
                  <YAxis
                    fontSize={10}
                    tick={{ fontSize: 8 }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `₹${value.toLocaleString()}`,
                      income.title,
                    ]}
                    labelStyle={{ fontSize: '12px' }}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
              <PieChartIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">
                {income.incomeByCategory || 'Income by Category'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pb-3 sm:pb-6">
            <div className="h-[180px] sm:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `₹${value.toLocaleString()}`,
                      income.amount || 'Amount',
                    ]}
                    contentStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2 mt-2 sm:mt-4">
              {categoryData.slice(0, 4).map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center gap-1 sm:gap-2 text-xs"
                >
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate text-xs">{item.category}</span>
                  <span className="font-medium text-xs whitespace-nowrap">
                    ₹{(item.amount / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Income Trend Line */}
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">
                {income.sixMonthTrend || '6-Month Trend'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pb-3 sm:pb-6">
            <div className="h-[180px] sm:h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    fontSize={10}
                    tick={{ fontSize: 8 }}
                    height={40}
                  />
                  <YAxis
                    fontSize={10}
                    tick={{ fontSize: 8 }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `₹${value.toLocaleString()}`,
                      income.title,
                    ]}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-base flex items-center gap-1 sm:gap-2">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">
                {income.incomeSummary || 'Income Summary'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    ₹{(totalIncome / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {income.totalIncome}
                  </div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">
                    ₹{(avgIncome / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {income.avgPerEntry || 'Avg per Entry'}
                  </div>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <div className="text-xs sm:text-sm font-medium">
                  {income.topCategories || 'Top Categories'}
                </div>
                {categoryData.slice(0, 3).map((item, index) => (
                  <div
                    key={item.category}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="flex items-center gap-1 sm:gap-2 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="truncate">{item.category}</span>
                    </span>
                    <span className="font-medium whitespace-nowrap ml-2">
                      {((item.amount / totalIncome) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
