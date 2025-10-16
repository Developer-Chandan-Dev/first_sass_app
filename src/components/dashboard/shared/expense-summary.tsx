'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';

export function ExpenseSummary() {
  const { user } = useUser();
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMonthlyTotal = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Fetch both free and budget expenses
        const [freeResponse, budgetResponse] = await Promise.all([
          fetch(
            `/api/expenses?type=free&from=${startOfMonth.toISOString()}&to=${endOfMonth.toISOString()}`
          ),
          fetch(
            `/api/expenses?type=budget&from=${startOfMonth.toISOString()}&to=${endOfMonth.toISOString()}`
          ),
        ]);

        if (freeResponse.ok && budgetResponse.ok) {
          const [freeData, budgetData] = await Promise.all([
            freeResponse.json(),
            budgetResponse.json(),
          ]);

          const freeTotal = freeData.expenses.reduce(
            (sum: number, expense: { amount: number }) => sum + expense.amount,
            0
          );
          const budgetTotal = budgetData.expenses.reduce(
            (sum: number, expense: { amount: number }) => sum + expense.amount,
            0
          );

          setMonthlyTotal(freeTotal + budgetTotal);
        }
      } catch (error) {
        console.error('Failed to fetch monthly total:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyTotal();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Expenses This Month</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">${monthlyTotal.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
