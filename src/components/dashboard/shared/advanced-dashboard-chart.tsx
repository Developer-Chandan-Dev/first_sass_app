'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, BarChart3, LineChart as LineChartIcon, Activity, RefreshCw } from 'lucide-react';

import { useDashboardChart } from '@/hooks/dashboard/useDashboardChart';



type ChartType = 'bar' | 'line' | 'area';
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

const CHART_TYPES = [
  { value: 'bar' as ChartType, label: 'Bar Chart', icon: BarChart3 },
  { value: 'line' as ChartType, label: 'Line Chart', icon: LineChartIcon },
  { value: 'area' as ChartType, label: 'Area Chart', icon: Activity }
];

const TIME_PERIODS = [
  { value: 'daily' as TimePeriod, label: 'Daily' },
  { value: 'weekly' as TimePeriod, label: 'Weekly' },
  { value: 'monthly' as TimePeriod, label: 'Monthly' },
  { value: 'yearly' as TimePeriod, label: 'Yearly' }
];

export function AdvancedDashboardChart() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');

  const { data: chartData, summary, loading, error, refetch } = useDashboardChart(timePeriod);

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Failed to load chart data</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 5, left: 5, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" />
            <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Net" />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
            <Legend />
            <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Income" />
            <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expenses" />
          </AreaChart>
        );
      
      default: // bar
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
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
      <CardHeader className="pb-2 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:hidden">Income vs Expenses</span>
            <span className="hidden sm:inline">Income vs Expenses Analysis</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
              <SelectTrigger className="w-full sm:w-32 h-8 sm:h-10 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value} className="text-xs sm:text-sm">
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
              <SelectTrigger className="w-full sm:w-36 h-8 sm:h-10 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value} className="text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">{type.label}</span>
                        <span className="sm:hidden">{type.value}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button onClick={refetch} variant="outline" size="sm" disabled={loading} className="h-8 sm:h-10 px-2 sm:px-3">
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-1 sm:gap-4 mt-2 sm:mt-4">
          <div className="bg-green-50 dark:bg-green-950 p-1 sm:p-4 rounded sm:rounded-lg">
            <div className="flex items-center gap-1 sm:gap-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
                <span className="sm:hidden">Income</span>
                <span className="hidden sm:inline">Total Income</span>
              </span>
            </div>
            <p className="text-xs sm:text-2xl font-bold text-green-800 dark:text-green-200">
              ₹{summary.totalIncome.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">Total Expenses</span>
            </div>
            <p className="text-2xl font-bold text-red-800 dark:text-red-200">
              ₹{summary.totalExpenses.toLocaleString()}
            </p>
          </div>
          
          <div className={`${summary.netTotal >= 0 ? 'bg-blue-50 dark:bg-blue-950' : 'bg-orange-50 dark:bg-orange-950'} p-4 rounded-lg`}>
            <div className="flex items-center gap-2">
              {summary.netTotal >= 0 ? (
                <TrendingUp className="h-4 w-4 text-blue-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-orange-600" />
              )}
              <span className={`text-sm font-medium ${summary.netTotal >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>
                Net {summary.netTotal >= 0 ? 'Savings' : 'Deficit'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${summary.netTotal >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-orange-800 dark:text-orange-200'}`}>
              ₹{Math.abs(summary.netTotal).toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 sm:pt-6">
        <div className="h-48 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        
        {/* Period Summary */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {timePeriod} data • {chartData.length} periods • 
          <span className={summary.netTotal >= 0 ? 'text-green-600' : 'text-red-600'}>
            {summary.netTotal >= 0 ? 'Positive' : 'Negative'} cash flow
          </span>
        </div>
      </CardContent>
    </Card>
  );
}