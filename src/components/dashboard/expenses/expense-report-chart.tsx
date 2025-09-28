'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportData {
  period: string;
  amount: number;
}

type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ExpenseReportChartProps {
  expenseType?: 'free' | 'budget';
}

export function ExpenseReportChart({
  expenseType = 'free',
}: ExpenseReportChartProps) {
  const { theme } = useTheme();
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<ReportPeriod>('daily');

  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/expenses/report?period=${period}&type=${expenseType}`
        );
        if (response.ok) {
          const reportData = await response.json();
          setData(reportData);
        }
      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [period, expenseType]);

  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base sm:text-lg">Expense Report</CardTitle>
          <Select value={period} onValueChange={(value) => setPeriod(value as ReportPeriod)} >
            <SelectTrigger className="w-32 sm:w-40 text-sm">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent className=" text-sm">
              {periods.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="h-48 sm:h-80 flex items-center justify-center text-sm">
            Loading report...
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={window.innerWidth < 640 ? 200 : 320}
          >
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="period"
                tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                axisLine={false}
                tickLine={false}
                interval={window.innerWidth < 400 ? 1 : 0}
              />
              <YAxis
                tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  window.innerWidth < 400 ? `₹${value / 1000}k` : `₹${value}`
                }
                width={window.innerWidth < 400 ? 40 : 60}
              />
              <Tooltip
                formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  'Amount',
                ]}
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: isDark ? '#f9fafb' : '#111827',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}