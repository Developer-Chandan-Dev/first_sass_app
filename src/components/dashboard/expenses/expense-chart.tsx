'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser } from '@clerk/nextjs';

interface ChartData {
  date: string;
  amount: number;
}

export function ExpenseChart() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!user) return;

    const fetchChartData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);

        // Fetch both free and budget expenses
        const [freeResponse, budgetResponse] = await Promise.all([
          fetch(`/api/expenses?type=free&from=${startDate.toISOString()}&to=${endDate.toISOString()}`),
          fetch(`/api/expenses?type=budget&from=${startDate.toISOString()}&to=${endDate.toISOString()}`)
        ]);
        
        if (freeResponse.ok && budgetResponse.ok) {
          const [freeData, budgetData] = await Promise.all([
            freeResponse.json(),
            budgetResponse.json()
          ]);
          
          // Combine both types of expenses
          const expenses = [...freeData.expenses, ...budgetData.expenses];
          
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

  const skeletonHeights = [45, 65, 35, 80, 55, 40, 70];

  if (loading) {
    return (
      <div className="h-48 md:h-64 flex flex-col justify-end space-y-2 p-4">
        <div className="flex items-end justify-between h-full space-x-2">
          {skeletonHeights.map((height, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 flex-1">
              <div 
                className="bg-muted animate-pulse rounded-t w-full"
                style={{ height: `${height}%` }}
              />
              <div className="h-3 w-8 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={180} className="md:!h-[220px]">
        <BarChart 
          data={data}
          margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
        >
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            className="text-xs md:text-sm"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={25}
            className="text-xs"
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
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
            radius={[2, 2, 0, 0]}
            maxBarSize={35}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}