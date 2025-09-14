'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IExpense } from '@/models/Expense';

export function ExpensesTable() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchExpenses = async () => {
      try {
        const response = await fetch('/api/expenses?limit=20');
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        }
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading expenses...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-muted-foreground">No expenses found. Add your first expense!</p>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{expense.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-medium">{expense.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${expense.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}