'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { type Budget } from '@/lib/redux/expense/budgetSlice';

interface AutoCompletedBudgetsProps {
  budgets: Budget[];
}

export function AutoCompletedBudgets({ budgets }: AutoCompletedBudgetsProps) {
  // Get budgets that were auto-completed (end date reached)
  const autoCompletedBudgets = budgets.filter(budget => {
    const now = new Date();
    const endDate = new Date(budget.endDate);
    return budget.status === 'completed' && endDate <= now;
  });

  if (autoCompletedBudgets.length === 0) {
    return null;
  }

  const totalSavings = autoCompletedBudgets.reduce((sum, budget) => sum + Math.max(0, budget.remaining), 0);

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          Recently Completed Budgets
          <Badge variant="default" className="ml-auto bg-green-500">
            {autoCompletedBudgets.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {totalSavings > 0 && (
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">Total Savings from Completed Budgets</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalSavings)}
            </p>
          </div>
        )}

        {autoCompletedBudgets.map((budget) => {
          const savings = Math.max(0, budget.remaining);
          const endDate = new Date(budget.endDate);
          const completedDaysAgo = Math.floor((new Date().getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={budget._id} className="border rounded-lg p-3 bg-green-50/50 dark:bg-green-950/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-sm">{budget.name}</h4>
                  {budget.category && (
                    <p className="text-xs text-muted-foreground">{budget.category}</p>
                  )}
                </div>
                <Badge variant="default" className="bg-green-500 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Auto-Completed
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Budget Amount</p>
                  <p className="font-medium">{formatCurrency(budget.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount Spent</p>
                  <p className="font-medium">{formatCurrency(budget.spent)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Completed {completedDaysAgo} days ago</span>
                </div>
                {savings > 0 ? (
                  <div className="text-xs">
                    <span className="text-green-600 font-medium">
                      Saved: {formatCurrency(savings)}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs">
                    <span className="text-orange-600 font-medium">
                      Fully Used
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}