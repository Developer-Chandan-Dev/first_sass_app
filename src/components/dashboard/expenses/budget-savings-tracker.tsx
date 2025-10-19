'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { type Budget } from '@/lib/redux/expense/budgetSlice';

interface BudgetSavingsTrackerProps {
  budgets: Budget[];
}

export function BudgetSavingsTracker({ budgets }: BudgetSavingsTrackerProps) {
  const calculateSavings = () => {
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalSavings = Math.max(0, totalBudgeted - totalSpent);
    const savingsRate =
      totalBudgeted > 0 ? (totalSavings / totalBudgeted) * 100 : 0;

    const completedBudgets = budgets.filter((b) => b.status === 'completed');
    const completedSavings = completedBudgets.reduce(
      (sum, b) => sum + Math.max(0, b.remaining),
      0
    );

    const runningBudgets = budgets.filter((b) => b.status === 'running');
    const potentialSavings = runningBudgets.reduce(
      (sum, b) => sum + Math.max(0, b.remaining),
      0
    );

    return {
      totalBudgeted,
      totalSpent,
      totalSavings,
      savingsRate,
      completedSavings,
      potentialSavings,
      completedBudgetsCount: completedBudgets.length,
      runningBudgetsCount: runningBudgets.length,
    };
  };

  const savings = calculateSavings();

  const getSavingsInsight = () => {
    if (savings.savingsRate >= 20)
      return { type: 'excellent', message: 'Excellent savings!' };
    if (savings.savingsRate >= 10)
      return { type: 'good', message: 'Good savings rate' };
    if (savings.savingsRate >= 5)
      return { type: 'average', message: 'Average savings' };
    return { type: 'poor', message: 'Consider reducing expenses' };
  };

  const insight = getSavingsInsight();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Total Savings Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Budgeted</p>
              <p className="text-xl font-bold">
                {formatCurrency(savings.totalBudgeted)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-xl font-bold">
                {formatCurrency(savings.totalSpent)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Savings Rate</span>
              <span className="font-medium">
                {savings.savingsRate.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={Math.min(savings.savingsRate, 100)}
              className="h-2"
            />
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">Total Savings</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(savings.totalSavings)}
            </p>
            <p className="text-xs text-green-600/80">{insight.message}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Savings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div>
                <p className="font-medium text-blue-600">Completed Budgets</p>
                <p className="text-xs text-blue-600/80">
                  {savings.completedBudgetsCount} budgets
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">
                  {formatCurrency(savings.completedSavings)}
                </p>
                <p className="text-xs text-blue-600/80">Actual Savings</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div>
                <p className="font-medium text-orange-600">Running Budgets</p>
                <p className="text-xs text-orange-600/80">
                  {savings.runningBudgetsCount} budgets
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-600">
                  {formatCurrency(savings.potentialSavings)}
                </p>
                <p className="text-xs text-orange-600/80">Potential Savings</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={
                  insight.type === 'excellent'
                    ? 'default'
                    : insight.type === 'good'
                      ? 'secondary'
                      : insight.type === 'average'
                        ? 'outline'
                        : 'destructive'
                }
              >
                {insight.type === 'excellent' && (
                  <TrendingUp className="h-3 w-3 mr-1" />
                )}
                {insight.type === 'poor' && (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {insight.message}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {savings.savingsRate >= 15
                ? "You're doing great! Keep up the good work."
                : savings.savingsRate >= 5
                  ? 'Consider setting stricter budget limits to increase savings.'
                  : 'Review your spending patterns and look for areas to cut back.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
