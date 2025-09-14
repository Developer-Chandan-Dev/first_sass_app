'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
];

export function ExpenseCategoryChart() {
  const { theme } = useTheme();
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch('/api/expenses/categories?type=free');
        if (response.ok) {
          const categories = await response.json();
          const chartData = categories.map((cat: { category: string; total: number }, index: number) => ({
            name: cat.category,
            value: cat.total,
            color: COLORS[index % COLORS.length]
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading chart...</div>;
  }

  if (data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
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
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value) => <span className="text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}