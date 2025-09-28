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

        const response = await fetch(
          `/api/expenses?from=${startOfMonth.toISOString()}&to=${endOfMonth.toISOString()}`
        );
        
        if (response.ok) {
          const expenses = await response.json();
          const total = expenses.reduce((sum: number, expense: { amount: number }) => sum + expense.amount, 0);
          setMonthlyTotal(total);
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