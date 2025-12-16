'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart as LineChartIcon,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { useDashboardChart } from '@/hooks/dashboard/useDashboardChart';
import { useDashboardTranslations } from '@/hooks/i18n';

type ChartType = 'bar' | 'line' | 'area';
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function AdvancedDashboardChart() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  const { theme } = useTheme();
  const { chart } = useDashboardTranslations();

  const CHART_TYPES = [
    { value: 'bar' as ChartType, label: chart.barChart || "Bar Chart", icon: BarChart3 },
    { value: 'line' as ChartType, label: chart.lineChart || "Line Chart", icon: LineChartIcon },
    { value: 'area' as ChartType, label: chart.areaChart  || "Area Chart", icon: Activity },
  ];

  const TIME_PERIODS = [
    { value: 'daily' as TimePeriod, label: chart.daily || "Daily" },
    { value: 'weekly' as TimePeriod, label: chart.weekly || "Weekly" },
    { value: 'monthly' as TimePeriod, label: chart.monthly || "Monthly" },
    { value: 'yearly' as TimePeriod, label: chart.yearly || "Yearly" },
  ];

  const {
    data: chartData,
    summary,
    loading,
    error,
    refetch,
  } = useDashboardChart(timePeriod);

  const isDark = theme === 'dark';

  const tooltipStyle = {
    backgroundColor: isDark ? '#1f2937' : 'white',
    border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
    borderRadius: '6px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: isDark ? '#f9fafb' : '#111827',
    fontSize: '12px',
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{chart.failedToLoad}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              {chart.retry}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 20, bottom: 0 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              className="text-xs sm:text-sm"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={50}
              className="text-xs"
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              contentStyle={tooltipStyle}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              name={chart.totalIncome}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              name={chart.totalExpenses}
            />
            <Line
              type="monotone"
              dataKey="net"
              stroke="#6366f1"
              strokeWidth={1}
              strokeDasharray="3 3"
              name={summary.netTotal >= 0 ? chart.netSavings : chart.netDeficit}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              className="text-xs sm:text-sm"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={50}
              className="text-xs"
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              contentStyle={tooltipStyle}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name={chart.totalIncome}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="2"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
              name={chart.totalExpenses}
            />
          </AreaChart>
        );

      default: // bar
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              className="text-xs sm:text-sm"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={50}
              className="text-xs"
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              contentStyle={tooltipStyle}
            />
            <Legend />
            <Bar
              dataKey="income"
              fill="#10b981"
              name={chart.totalIncome}
              radius={[2, 2, 0, 0]}
              maxBarSize={35}
            />
            <Bar
              dataKey="expenses"
              fill="#ef4444"
              name={chart.totalExpenses}
              radius={[2, 2, 0, 0]}
              maxBarSize={35}
            />
          </BarChart>
        );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            {chart.incomeVsExpenses}
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Select
              value={timePeriod}
              onValueChange={(value: TimePeriod) => setTimePeriod(value)}
            >
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={chartType}
              onValueChange={(value: ChartType) => setChartType(value)}
            >
              <SelectTrigger className="w-36 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {chart.totalIncome || 'Total Income'}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-200 mt-1">
              ₹{summary.totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {chart.totalExpenses || 'Total Expenses'}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-red-800 dark:text-red-200 mt-1">
              ₹{summary.totalExpenses.toLocaleString()}
            </p>
          </div>

          <div
            className={`${summary.netTotal >= 0 ? 'bg-blue-50 dark:bg-blue-950' : 'bg-orange-50 dark:bg-orange-950'} p-3 rounded-lg`}
          >
            <div className="flex items-center gap-2">
              {summary.netTotal >= 0 ? (
                <TrendingUp className="h-4 w-4 text-blue-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-orange-600" />
              )}
              <span
                className={`text-sm font-medium ${summary.netTotal >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}
              >
                {summary.netTotal >= 0
                  ? chart.netSavings || 'Net Saving'
                  : chart.netDeficit || 'Net Deficit'}
              </span>
            </div>
            <p
              className={`text-xl sm:text-2xl font-bold ${summary.netTotal >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-orange-800 dark:text-orange-200'} mt-1`}
            >
              ₹{Math.abs(summary.netTotal).toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        <div className="w-full overflow-hidden">
          <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Period Summary */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {timePeriod} data • {chartData.length} periods •
          <span
            className={
              summary.netTotal >= 0 ? 'text-green-600' : 'text-red-600'
            }
          >
            {summary.netTotal >= 0
              ? chart.positive || 'Positive'
              : chart.negative || 'Negative'}{' '}
            {chart.cashFlow || 'cash flow'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
