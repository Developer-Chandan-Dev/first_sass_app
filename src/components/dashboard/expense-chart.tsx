'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useUser } from '@clerk/nextjs';

interface ChartData {
  date: string;
  amount: number;
}

export function ExpenseChart() {
  const { user } = useUser();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChartData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);

        const response = await fetch(
          `/api/expenses?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
        );
        
        if (response.ok) {
          const expenses = await response.json();
          
          // Group expenses by date
          const dailyTotals: { [key: string]: number } = {};
          
          // Initialize all 7 days with 0
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyTotals[dateStr] = 0;
          }
          
          // Sum expenses by date
          expenses.forEach((expense: { date: string; amount: number }) => {
            const dateStr = new Date(expense.date).toISOString().split('T')[0];
            if (dailyTotals.hasOwnProperty(dateStr)) {
              dailyTotals[dateStr] += expense.amount;
            }
          });
          
          // Convert to chart format
          const chartData = Object.entries(dailyTotals).map(([date, amount]) => ({
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            amount,
          }));
          
          setData(chartData);
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [user]);

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading chart...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Bar dataKey="amount" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  );
}