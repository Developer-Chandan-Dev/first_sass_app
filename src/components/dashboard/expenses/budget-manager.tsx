'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import { AddBudgetModal } from './add-budget-modal';
import { toast } from 'sonner';

interface Budget {
  _id: string;
  name: string;
  amount: number;
  category?: string;
  duration: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  spent: number;
  remaining: number;
  percentage: number;
}

interface BudgetManagerProps {
  refreshTrigger?: number;
}

export function BudgetManager({ refreshTrigger }: BudgetManagerProps = {}) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/expenses/budget');
      if (response.ok) {
        const data = await response.json();
        setBudgets(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch budgets:', response.statusText);
        setBudgets([]);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [refreshTrigger]);

  const handleToggleActive = async (budgetId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/expenses/budget/${budgetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        toast.success(`Budget ${isActive ? 'activated' : 'deactivated'}`);
        fetchBudgets();
      } else {
        toast.error('Failed to update budget');
      }
    } catch {
      toast.error('Failed to update budget');
    }
  };

  const handleDelete = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      const response = await fetch(`/api/expenses/budget/${budgetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Budget deleted successfully');
        fetchBudgets();
      } else {
        toast.error('Failed to delete budget');
      }
    } catch {
      toast.error('Failed to delete budget');
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const getStatusBadge = (budget: Budget) => {
    if (!budget.isActive) return <Badge variant="secondary">Inactive</Badge>;
    if (budget.percentage >= 100) return <Badge variant="destructive">Exceeded</Badge>;
    if (budget.percentage >= 75) return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Warning</Badge>;
    return <Badge variant="default" className="bg-green-500">Active</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Budget Manager
            </CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="max-sm:mr-2 h-4 w-4" />
              <span className="max-sm:hidden">
                Add Budget
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No budgets created</h3>
              <p className="text-muted-foreground mb-4">Create your first budget to start tracking expenses</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Budget
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget) => (
                <div key={budget._id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-sm sm:text-base">{budget.name}</h3>
                      {getStatusBadge(budget)}
                      {budget.category && (
                        <Badge variant="outline" className="text-xs">{budget.category}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Switch
                        checked={budget.isActive}
                        onCheckedChange={(checked) => handleToggleActive(budget._id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(budget)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(budget._id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>₹{budget.spent.toLocaleString()} spent</span>
                      <span>₹{budget.amount.toLocaleString()} budget</span>
                    </div>
                    <Progress 
                      value={Math.min(budget.percentage, 100)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{budget.percentage.toFixed(1)}% used</span>
                      <span>₹{budget.remaining.toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddBudgetModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingBudget(null);
        }}
        budget={editingBudget}
        onBudgetSaved={fetchBudgets}
      />
    </>
  );
}