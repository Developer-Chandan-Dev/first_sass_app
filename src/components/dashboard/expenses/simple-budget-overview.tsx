'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Target,
  CheckCircle,
  Clock,
  Pause,
  Play,
  Edit,
  PiggyBank,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { type Budget } from '@/lib/redux/expense/budgetSlice';

interface SimpleBudgetOverviewProps {
  budgets: Budget[];
  onCreateBudget: () => void;
  onEditBudget: (budget: Budget) => void;
  onStatusChange: (budgetId: string, status: Budget['status']) => void;
}

export function SimpleBudgetOverview({
  budgets,
  onCreateBudget,
  onEditBudget,
  onStatusChange,
}: SimpleBudgetOverviewProps) {
  const runningBudgets = budgets.filter((b) => b.status === 'running');
  const completedBudgets = budgets.filter((b) => b.status === 'completed');
  const totalSavings = completedBudgets.reduce(
    (sum, b) => sum + Math.max(0, b.remaining),
    0
  );
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  const BudgetCard = ({ budget }: { budget: Budget }) => {
    const isOverBudget = budget.percentage > 100;
    const savings = Math.max(0, budget.remaining);

    return (
      <Card className="relative">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">{budget.name}</CardTitle>
              {budget.category && (
                <p className="text-sm text-muted-foreground">
                  {budget.category}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  budget.status === 'completed' ? 'default' : 'secondary'
                }
              >
                {budget.status === 'running' && (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                {budget.status === 'completed' && (
                  <CheckCircle className="h-3 w-3 mr-1" />
                )}
                {budget.status === 'paused' && (
                  <Pause className="h-3 w-3 mr-1" />
                )}
                {budget.status}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEditBudget(budget)}
                className="h-6 w-6 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent: {formatCurrency(budget.spent)}</span>
              <span>Budget: {formatCurrency(budget.amount)}</span>
            </div>
            <Progress
              value={Math.min(budget.percentage, 100)}
              className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{budget.daysLeft || 0} days left</span>
              <span>{budget.percentage.toFixed(0)}% used</span>
            </div>
          </div>

          {budget.status === 'completed' && savings > 0 && (
            <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium text-sm">
                You saved {formatCurrency(savings)}!
              </span>
            </div>
          )}

          {isOverBudget && (
            <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-sm text-red-600">
              Over budget by {formatCurrency(budget.spent - budget.amount)}
            </div>
          )}

          {budget.status === 'running' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(budget._id, 'paused')}
                className="flex-1 text-xs"
              >
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onStatusChange(budget._id, 'completed')}
                className="flex-1 text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Button>
            </div>
          )}

          {budget.status === 'paused' && (
            <Button
              size="sm"
              onClick={() => onStatusChange(budget._id, 'running')}
              className="w-full text-xs"
            >
              <Play className="h-3 w-3 mr-1" />
              Resume Budget
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{budgets.length}</div>
            <p className="text-sm text-muted-foreground">Total Budgets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{runningBudgets.length}</div>
            <p className="text-sm text-muted-foreground">Active Now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalSavings)}
            </div>
            <p className="text-sm text-muted-foreground">Total Saved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(totalBudgeted - totalSpent)}
            </div>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Budgets */}
      {runningBudgets.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Active Budgets</h2>
            <Button onClick={onCreateBudget}>
              <Plus className="h-4 w-4 mr-2" />
              New Budget
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {runningBudgets.map((budget) => (
              <BudgetCard key={budget._id} budget={budget} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Budgets */}
      {completedBudgets.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Budgets</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedBudgets.map((budget) => (
              <BudgetCard key={budget._id} budget={budget} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {budgets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Start Your First Budget
            </h3>
            <p className="text-muted-foreground mb-6">
              Create a budget to track your spending and save money
            </p>
            <Button onClick={onCreateBudget} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
