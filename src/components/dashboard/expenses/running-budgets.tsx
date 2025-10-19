'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  Pause,
  Edit,
  Trash2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { type Budget } from '@/lib/redux/expense/budgetSlice';

interface RunningBudgetsProps {
  budgets: Budget[];
  onToggleBudget: (
    budgetId: string,
    action: 'pause' | 'resume' | 'complete'
  ) => void;
  onEditBudget: (budget: Budget) => void;
  onDeleteBudget: (budgetId: string) => void;
}

export function RunningBudgets({
  budgets,
  onToggleBudget,
  onEditBudget,
  onDeleteBudget,
}: RunningBudgetsProps) {
  const runningBudgets = budgets.filter((b) => b.status === 'running');

  const getBudgetStatus = (budget: Budget) => {
    const now = new Date();
    const endDate = new Date(budget.endDate);
    const daysLeft = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) return { status: 'expired', daysLeft: 0 };
    if (budget.percentage >= 100) return { status: 'exceeded', daysLeft };
    if (budget.percentage >= 80) return { status: 'warning', daysLeft };
    return { status: 'good', daysLeft };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'destructive';
      case 'exceeded':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (runningBudgets.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Running Budgets</h3>
          <p className="text-muted-foreground">
            Create a budget to start tracking your expenses
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Running Budgets ({runningBudgets.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {runningBudgets.map((budget) => {
          const { status, daysLeft } = getBudgetStatus(budget);
          const savings = Math.max(0, budget.remaining);

          return (
            <div key={budget._id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{budget.name}</h4>
                  {budget.category && (
                    <p className="text-sm text-muted-foreground">
                      {budget.category}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(status)}>
                    {status === 'expired'
                      ? 'Expired'
                      : status === 'exceeded'
                        ? 'Over Budget'
                        : status === 'warning'
                          ? 'Near Limit'
                          : 'On Track'}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditBudget(budget)}
                      className="h-6 w-6 p-0"
                      title="Edit Budget"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggleBudget(budget._id, 'pause')}
                      className="h-6 w-6 p-0"
                      title="Pause Budget"
                    >
                      <Pause className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggleBudget(budget._id, 'complete')}
                      className="h-6 w-6 p-0"
                      title="Complete Budget"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteBudget(budget._id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      title="Delete Budget"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(budget.spent)} spent</span>
                  <span>{formatCurrency(budget.amount)} budget</span>
                </div>
                <Progress
                  value={Math.min(budget.percentage, 100)}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{daysLeft} days left</span>
                  <span>{budget.percentage.toFixed(0)}% used</span>
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="font-medium">
                      Potential Savings: {formatCurrency(savings)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
