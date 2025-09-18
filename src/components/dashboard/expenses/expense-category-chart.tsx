'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { refreshStats } from '@/lib/redux/expense/overviewSlice';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
];

interface ExpenseCategoryChartProps {
  expenseType?: 'free' | 'budget';
}

export function ExpenseCategoryChart({ expenseType = 'free' }: ExpenseCategoryChartProps) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { free, budget, loading } = useAppSelector(state => state.overview);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    dispatch(refreshStats(expenseType));
  }, [dispatch, expenseType]);

  const categoryBreakdown = expenseType === 'free' ? free.categoryBreakdown : budget.categoryBreakdown;
  const data: CategoryData[] = categoryBreakdown.map((cat, index) => ({
    name: cat._id,
    value: cat.total,
    color: COLORS[index % COLORS.length]
  }));

  if (loading) {
    return <div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>;
  }

  if (data.length === 0) {
    return <div className="h-48 sm:h-64 flex items-center justify-center text-muted-foreground text-sm">No data available</div>;
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={250} className="!max-w-full">
        <PieChart width={300} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={1}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
            contentStyle={{ 
              backgroundColor: isDark ? '#f9fafb' : 'white', 
              border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: isDark ? '#f9fafb' : '#111827',
              fontSize: '11px'
            }}
            labelStyle={{
              color: isDark ? '#f9fafb' : '#111827'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={30}
            iconSize={8}
            wrapperStyle={{ 
              fontSize: '10px',
              paddingTop: '10px',
              maxWidth: '100%'
            }}
            formatter={(value) => (
              <span className="text-xs truncate inline-block max-w-[60px]" title={value}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}