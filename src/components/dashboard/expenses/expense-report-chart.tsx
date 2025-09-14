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
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Expense Report</CardTitle>
          <div className="flex gap-2 flex-wrap">
            {periods.map((p) => (
              <Button
                key={p.key}
                variant={period === p.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p.key as ReportPeriod)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">Loading report...</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: isDark ? '#1f2937' : 'white', 
                  border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: isDark ? '#f9fafb' : '#111827'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}