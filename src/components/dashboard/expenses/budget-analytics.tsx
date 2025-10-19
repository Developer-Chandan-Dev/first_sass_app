'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { TrendingUp, Target } from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';

interface CategoryData {
  category: string;
  totalBudgeted: number;
  count: number;
}

interface MonthlyData {
  month: string;
  totalBudgeted: number;
  count: number;
}

export function BudgetAnalytics() {
  const { expenses } = useDashboardTranslations();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/expenses/budget?active=true');
        const budgets = await response.json();

        // Process category data
        const categoryStats = budgets.reduce(
          (
            acc: Record<string, { totalBudgeted: number; count: number }>,
            budget: { category?: string; amount: number }
          ) => {
            const category =
              budget.category || expenses.uncategorized || 'Uncategorized';
            if (!acc[category]) {
              acc[category] = { totalBudgeted: 0, count: 0 };
            }
            acc[category].totalBudgeted += budget.amount;
            acc[category].count += 1;
            return acc;
          },
          {}
        );

        const categoryArray = Object.entries(categoryStats).map(
          ([category, data]) => ({
            category,
            totalBudgeted: (data as { totalBudgeted: number; count: number })
              .totalBudgeted,
            count: (data as { totalBudgeted: number; count: number }).count,
          })
        );

        // Process monthly data (mock for now)
        const monthlyArray = [
          { month: 'Jan', totalBudgeted: 45000, count: 5 },
          { month: 'Feb', totalBudgeted: 42000, count: 4 },
          { month: 'Mar', totalBudgeted: 48000, count: 6 },
          { month: 'Apr', totalBudgeted: 50000, count: 5 },
        ];

        setCategoryData(categoryArray);
        setMonthlyData(monthlyArray);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [expenses.uncategorized]);

  const pieData = categoryData.map((item, index) => ({
    name: item.category,
    value: item.totalBudgeted,
    color: `hsl(${index * 45}, 70%, 50%)`,
  }));

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            {expenses.monthlyBudgetTrends || 'Monthly Budget Trends'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="month"
                fontSize={12}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis fontSize={12} tick={{ fill: 'hsl(var(--foreground))' }} />
              <Tooltip
                formatter={(value: number) => [
                  `₹${value.toLocaleString()}`,
                  expenses.budgetAmount || 'Budget Amount',
                ]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Bar
                dataKey="totalBudgeted"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Target className="h-4 w-4 sm:h-5 sm:w-5" />
            {expenses.budgetByCategory || 'Budget by Category'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <p>
                  {expenses.noBudgetCategoriesFound ||
                    'No budget categories found'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `₹${value.toLocaleString()}`,
                      expenses.budgetAmount || 'Budget Amount',
                    ]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Category Legend */}
              <div className="grid grid-cols-2 gap-2">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-muted-foreground truncate">
                      {entry.name}: ₹{entry.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
