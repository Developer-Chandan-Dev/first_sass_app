'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  Pause,
  Play,
  Archive,
  Plus,
  Settings,
  Edit,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { type Budget } from '@/lib/redux/expense/budgetSlice';
import { useDashboardTranslations } from '@/hooks/i18n';

interface BudgetManagerProps {
  budgets: Budget[];
  onStatusChange: (budgetId: string, status: Budget['status']) => void;
  onEditBudget: (budget: Budget) => void;
  onCreateBudget: () => void;
}

export function BudgetManager({
  budgets,
  onStatusChange,
  onEditBudget,
  onCreateBudget,
}: BudgetManagerProps) {
  const { expenses } = useDashboardTranslations();

  const getBudgetsByStatus = (status: Budget['status']) => {
    return budgets.filter((b) => b.status === status);
  };

  const getStatusIcon = (status: Budget['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'paused':
        return <Pause className="h-4 w-4" />;
      case 'expired':
        return <Archive className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Budget['status']) => {
    switch (status) {
      case 'running':
        return 'default';
      case 'completed':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'expired':
        return 'destructive';
    }
  };

  const BudgetCard = ({ budget }: { budget: Budget }) => {
    const savings = Math.max(0, budget.remaining);
    const isOverBudget = budget.percentage > 100;

    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-medium">{budget.name}</h4>
            {budget.category && (
              <p className="text-sm text-muted-foreground">{budget.category}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(budget.status)} className="text-xs">
              {getStatusIcon(budget.status)}
              {budget.status === 'running'
                ? expenses.budgetManager.running
                : budget.status === 'completed'
                  ? expenses.budgetManager.completed
                  : budget.status === 'paused'
                    ? expenses.budgetManager.paused
                    : budget.status === 'expired'
                      ? expenses.budgetManager.expired
                      : budget.status}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEditBudget(budget)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {formatCurrency(budget.spent)} {expenses.spent || 'spent'}
            </span>
            <span>
              {formatCurrency(budget.amount)} {expenses.budget || 'budget'}
            </span>
          </div>
          <Progress value={Math.min(budget.percentage, 100)} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {budget.daysLeft || 0} {expenses.daysLeft || 'days left'}
            </span>
            <span>
              {budget.percentage.toFixed(0)}% {expenses.used || 'used'}
            </span>
          </div>
        </div>

        {budget.status === 'running' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(budget._id, 'paused')}
            >
              <Pause className="h-3 w-3 mr-1" />
              {expenses.pause || 'Pause'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(budget._id, 'completed')}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              {expenses.complete || 'Complete'}
            </Button>
          </div>
        )}

        {budget.status === 'paused' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusChange(budget._id, 'running')}
          >
            <Play className="h-3 w-3 mr-1" />
            {expenses.budgetManager.resume}
          </Button>
        )}

        {budget.status === 'completed' && savings > 0 && (
          <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded text-sm">
            <span className="text-green-600 font-medium">
              {expenses.budgetManager.saved}: {formatCurrency(savings)}
            </span>
          </div>
        )}

        {isOverBudget && (
          <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-sm">
            <span className="text-red-600 font-medium">
              {expenses.overBy || 'Over by'}:{' '}
              {formatCurrency(budget.spent - budget.amount)}
            </span>
          </div>
        )}
      </div>
    );
  };

  const EmptyState = ({ status }: { status: string }) => (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-4">
        {status === 'running'
          ? expenses.budgetManager.noRunningBudgets
          : status === 'completed'
            ? expenses.budgetManager.noCompletedBudgets
            : status === 'paused'
              ? expenses.budgetManager.noPausedBudgets
              : status === 'expired'
                ? expenses.budgetManager.noExpiredBudgets
                : expenses.budgetManager.noBudgetsFound}
      </div>
      <Button onClick={onCreateBudget} variant="outline">
        <Plus className="h-4 w-4 mr-2" />
        {expenses.createBudget || 'Create Budget'}
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {expenses.budgetManager.title}
          </CardTitle>
          <Button onClick={onCreateBudget}>
            <Plus className="h-4 w-4 mr-2" />
            {expenses.createBudget || 'Create Budget'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="running" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="running" className="text-xs">
              {expenses.budgetManager.running} (
              {getBudgetsByStatus('running').length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              {expenses.budgetManager.completed} (
              {getBudgetsByStatus('completed').length})
            </TabsTrigger>
            <TabsTrigger value="paused" className="text-xs">
              {expenses.budgetManager.paused} (
              {getBudgetsByStatus('paused').length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="text-xs">
              {expenses.budgetManager.expired} (
              {getBudgetsByStatus('expired').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="running" className="space-y-3">
            {getBudgetsByStatus('running').length > 0 ? (
              getBudgetsByStatus('running').map((budget) => (
                <BudgetCard key={budget._id} budget={budget} />
              ))
            ) : (
              <EmptyState status="running" />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {getBudgetsByStatus('completed').length > 0 ? (
              getBudgetsByStatus('completed').map((budget) => (
                <BudgetCard key={budget._id} budget={budget} />
              ))
            ) : (
              <EmptyState status="completed" />
            )}
          </TabsContent>

          <TabsContent value="paused" className="space-y-3">
            {getBudgetsByStatus('paused').length > 0 ? (
              getBudgetsByStatus('paused').map((budget) => (
                <BudgetCard key={budget._id} budget={budget} />
              ))
            ) : (
              <EmptyState status="paused" />
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-3">
            {getBudgetsByStatus('expired').length > 0 ? (
              getBudgetsByStatus('expired').map((budget) => (
                <BudgetCard key={budget._id} budget={budget} />
              ))
            ) : (
              <EmptyState status="expired" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
