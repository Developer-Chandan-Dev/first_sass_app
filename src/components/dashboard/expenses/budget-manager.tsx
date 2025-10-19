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
  Trash2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { type Budget } from '@/lib/redux/expense/budgetSlice';
import { useDashboardTranslations } from '@/hooks/i18n';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchBudgets, deleteBudget, updateBudget } from '@/lib/redux/expense/budgetSlice';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface BudgetManagerProps {
  onEditBudget: (budget: Budget) => void;
  onCreateBudget: () => void;
}

export function BudgetManager({
  onEditBudget,
  onCreateBudget,
}: BudgetManagerProps) {
  const { expenses } = useDashboardTranslations();
  const dispatch = useAppDispatch();
  const { budgets, loading } = useAppSelector((state) => state.budgets);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (budgets.length === 0 && !loading) {
      dispatch(fetchBudgets());
    }
  }, [dispatch, budgets.length, loading]);

  const handleStatusChange = async (budgetId: string, status: Budget['status']) => {
    setProcessingIds(prev => new Set(prev).add(budgetId));
    try {
      await dispatch(updateBudget({ id: budgetId, updates: { status } })).unwrap();
      await dispatch(fetchBudgets());
      toast.success('Budget status updated');
    } catch {
      toast.error('Failed to update budget status');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(budgetId);
        return newSet;
      });
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;
    
    setProcessingIds(prev => new Set(prev).add(budgetId));
    try {
      await dispatch(deleteBudget(budgetId)).unwrap();
      await dispatch(fetchBudgets());
      toast.success('Budget deleted successfully');
    } catch {
      toast.error('Failed to delete budget');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(budgetId);
        return newSet;
      });
    }
  };

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
    const isProcessing = processingIds.has(budget._id);

    return (
      <div className={`border rounded-lg p-4 space-y-3 ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
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
              title="Edit Budget"
              disabled={isProcessing}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDelete(budget._id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Delete Budget"
              disabled={isProcessing}
            >
              <Trash2 className="h-3 w-3" />
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
              onClick={() => handleStatusChange(budget._id, 'paused')}
              disabled={isProcessing}
            >
              <Pause className="h-3 w-3 mr-1" />
              {expenses.pause || 'Pause'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(budget._id, 'completed')}
              disabled={isProcessing}
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
            onClick={() => handleStatusChange(budget._id, 'running')}
            disabled={isProcessing}
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
