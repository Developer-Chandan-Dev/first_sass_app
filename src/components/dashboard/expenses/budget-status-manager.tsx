'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Pause, Play, Archive } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { type Budget } from '@/lib/redux/expense/budgetSlice';

interface BudgetStatusManagerProps {
  budgets: Budget[];
  onStatusChange: (budgetId: string, status: Budget['status']) => void;
}

export function BudgetStatusManager({
  budgets,
  onStatusChange,
}: BudgetStatusManagerProps) {
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
      <div className="border rounded-lg p-3 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-sm">{budget.name}</h4>
            {budget.category && (
              <p className="text-xs text-muted-foreground">{budget.category}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(budget.status)} className="text-xs">
              {getStatusIcon(budget.status)}
              {budget.status}
            </Badge>
            {budget.status === 'running' && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onStatusChange(budget._id, 'paused')}
                  className="h-6 w-6 p-0"
                >
                  <Pause className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onStatusChange(budget._id, 'completed')}
                  className="h-6 w-6 p-0"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              </div>
            )}
            {budget.status === 'paused' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onStatusChange(budget._id, 'running')}
                className="h-6 w-6 p-0"
              >
                <Play className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>{formatCurrency(budget.spent)} spent</span>
            <span>{formatCurrency(budget.amount)} budget</span>
          </div>
          <Progress
            value={Math.min(budget.percentage, 100)}
            className="h-1.5"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{budget.daysLeft || 0} days left</span>
            <span>{budget.percentage.toFixed(0)}% used</span>
          </div>
        </div>

        {budget.status === 'completed' && savings > 0 && (
          <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded text-xs">
            <span className="text-green-600 font-medium">
              Saved: {formatCurrency(savings)}
            </span>
          </div>
        )}

        {isOverBudget && (
          <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-xs">
            <span className="text-red-600 font-medium">
              Over by: {formatCurrency(budget.spent - budget.amount)}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Status Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="running" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="running" className="text-xs">
              Running ({getBudgetsByStatus('running').length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Completed ({getBudgetsByStatus('completed').length})
            </TabsTrigger>
            <TabsTrigger value="paused" className="text-xs">
              Paused ({getBudgetsByStatus('paused').length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="text-xs">
              Expired ({getBudgetsByStatus('expired').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="running" className="space-y-3">
            {getBudgetsByStatus('running').map((budget) => (
              <BudgetCard key={budget._id} budget={budget} />
            ))}
            {getBudgetsByStatus('running').length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No running budgets
              </p>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {getBudgetsByStatus('completed').map((budget) => (
              <BudgetCard key={budget._id} budget={budget} />
            ))}
            {getBudgetsByStatus('completed').length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No completed budgets
              </p>
            )}
          </TabsContent>

          <TabsContent value="paused" className="space-y-3">
            {getBudgetsByStatus('paused').map((budget) => (
              <BudgetCard key={budget._id} budget={budget} />
            ))}
            {getBudgetsByStatus('paused').length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No paused budgets
              </p>
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-3">
            {getBudgetsByStatus('expired').map((budget) => (
              <BudgetCard key={budget._id} budget={budget} />
            ))}
            {getBudgetsByStatus('expired').length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No expired budgets
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
