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
      margin: { top: 2, right: 2, left: 2, bottom: 2 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} contentStyle={{ fontSize: '10px' }} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
            <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={1} strokeDasharray="3 3" name="Net" />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} contentStyle={{ fontSize: '10px' }} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Income" />
            <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expenses" />
          </AreaChart>
        );
      
      default: // bar
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} contentStyle={{ fontSize: '10px' }} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="income" fill="#10b981" name="Income" radius={[2, 2, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[2, 2, 0, 0]} />
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
      <CardHeader className="p-1 sm:p-6">
        <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-1 text-xs sm:text-lg">
            <Calendar className="h-3 w-3 sm:h-5 sm:w-5" />
            <span className="sm:hidden">Chart</span>
            <span className="hidden sm:inline">Income vs Expenses</span>
          </CardTitle>
          <div className="flex gap-0.5 sm:gap-2">
            <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
              <SelectTrigger className="flex-1 sm:w-32 h-5 sm:h-10 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value} className="text-xs">
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
              <SelectTrigger className="w-8 sm:w-36 h-5 sm:h-10 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value} className="text-xs">
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline ml-1">{type.label}</span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button onClick={refetch} variant="ghost" size="sm" disabled={loading} className="h-5 sm:h-10 w-5 sm:w-auto px-0 sm:px-3">
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="flex justify-between gap-px sm:grid sm:grid-cols-3 sm:gap-4 mt-1 sm:mt-4">
          <div className="flex-1 bg-green-50 dark:bg-green-950 px-1 py-0.5 sm:p-4 rounded-sm sm:rounded-lg">
            <TrendingUp className="h-2 w-2 sm:h-4 sm:w-4 text-green-600 mx-auto sm:mx-0 block sm:inline" />
            <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300 hidden sm:block">
              Total Income
            </span>
            <p className="text-xs sm:text-2xl font-bold text-green-800 dark:text-green-200 text-center sm:text-left leading-tight">
              ₹{summary.totalIncome > 999 ? `${(summary.totalIncome / 1000).toFixed(0)}k` : summary.totalIncome}
            </p>
          </div>
          
          <div className="flex-1 bg-red-50 dark:bg-red-950 px-1 py-0.5 sm:p-4 rounded-sm sm:rounded-lg">
            <TrendingDown className="h-2 w-2 sm:h-4 sm:w-4 text-red-600 mx-auto sm:mx-0 block sm:inline" />
            <span className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300 hidden sm:block">
              Total Expenses
            </span>
            <p className="text-xs sm:text-2xl font-bold text-red-800 dark:text-red-200 text-center sm:text-left leading-tight">
              ₹{summary.totalExpenses > 999 ? `${(summary.totalExpenses / 1000).toFixed(0)}k` : summary.totalExpenses}
            </p>
          </div>
          
          <div className={`flex-1 ${summary.netTotal >= 0 ? 'bg-blue-50 dark:bg-blue-950' : 'bg-orange-50 dark:bg-orange-950'} px-1 py-0.5 sm:p-4 rounded-sm sm:rounded-lg`}>
            {summary.netTotal >= 0 ? (
              <TrendingUp className="h-2 w-2 sm:h-4 sm:w-4 text-blue-600 mx-auto sm:mx-0 block sm:inline" />
            ) : (
              <TrendingDown className="h-2 w-2 sm:h-4 sm:w-4 text-orange-600 mx-auto sm:mx-0 block sm:inline" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${summary.netTotal >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'} hidden sm:block`}>
              Net {summary.netTotal >= 0 ? 'Savings' : 'Deficit'}
            </span>
            <p className={`text-xs sm:text-2xl font-bold ${summary.netTotal >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-orange-800 dark:text-orange-200'} text-center sm:text-left leading-tight`}>
              ₹{Math.abs(summary.netTotal) > 999 ? `${(Math.abs(summary.netTotal) / 1000).toFixed(0)}k` : Math.abs(summary.netTotal)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="h-24 sm:h-80 mx-1 sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        
        {/* Period Summary */}
        <div className="px-1 py-0.5 sm:mt-4 text-center text-xs sm:text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            Showing {timePeriod} data • {chartData.length} periods • 
          </span>
          <span className={summary.netTotal >= 0 ? 'text-green-600' : 'text-red-600'}>
            {summary.netTotal >= 0 ? '↗' : '↘'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}