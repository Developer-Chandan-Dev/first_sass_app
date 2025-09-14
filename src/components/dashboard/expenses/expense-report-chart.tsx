'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportData {
  period: string;
  amount: number;
}

type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function ExpenseReportChart() {
  const { theme } = useTheme();
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/expenses/report?period=${period}&type=free`);
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
  }, [period]);

  const periods = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' }
  ];

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <CardTitle className="text-base sm:text-lg">Expense Report</CardTitle>
          <div className="grid grid-cols-2 sm:flex gap-1 sm:gap-2">
            {periods.map((p) => (
              <Button
                key={p.key}
                variant={period === p.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p.key as ReportPeriod)}
                className="text-xs px-2 py-1 h-8"
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="h-48 sm:h-80 flex items-center justify-center text-sm">Loading report...</div>
        ) : (
          <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 320}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
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
                tickFormatter={(value) => window.innerWidth < 400 ? `₹${value/1000}k` : `₹${value}`}
                width={window.innerWidth < 400 ? 40 : 60}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : 'white', 
                  border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: isDark ? '#f9fafb' : '#111827',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#3b82f6" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}