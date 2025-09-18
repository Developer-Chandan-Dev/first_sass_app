'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateStatsOptimistic } from '@/lib/redux/expense/overviewSlice';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  budgetId: z.string().min(1, 'Please select a budget'),
  category: z.string().min(1, 'Category is required'),
  reason: z.string().min(1, 'Reason is required'),
  date: z.string().min(1, 'Date is required'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface Budget {
  _id: string;
  name: string;
  amount: number;
  category?: string;
  spent: number;
  remaining: number;
  percentage: number;
  isActive: boolean;
}

interface AddBudgetExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded?: () => void;
}

export function AddBudgetExpenseModal({ open, onOpenChange, onExpenseAdded }: AddBudgetExpenseModalProps) {
  const dispatch = useAppDispatch();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories] = useState<string[]>(['Food', 'Transport', 'Shopping', 'Bills', 'Others']);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const watchedBudgetId = watch('budgetId');
  const watchedAmount = watch('amount');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch('/api/expenses/budget?active=true');
        if (response.ok) {
          const data = await response.json();
          setBudgets(data);
        }
      } catch (error) {
        console.error('Failed to fetch budgets:', error);
      }
    };

    if (open) {
      fetchBudgets();
    }
  }, [open]);

  useEffect(() => {
    const budget = budgets.find(b => b._id === watchedBudgetId);
    setSelectedBudget(budget || null);
    
    if (budget?.category) {
      setValue('category', budget.category);
    }
  }, [watchedBudgetId, budgets, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    if (!selectedBudget) return;

    // Check if expense exceeds remaining budget
    if (data.amount > selectedBudget.remaining) {
      const exceed = data.amount - selectedBudget.remaining;
      if (!confirm(`This expense exceeds your budget by ₹${exceed.toLocaleString()}. Continue anyway?`)) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      // Update budget stats optimistically BEFORE API call
      dispatch(updateStatsOptimistic({
        type: 'budget',
        amount: Number(data.amount),
        category: data.category,
        operation: 'add',
        isExpense: true,
        reason: data.reason
      }));
      
      const loadingToast = toast.loading('Adding expense...');

      const requestData = {
        ...data,
        type: 'budget',
        amount: Number(data.amount),
      };

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        const savedExpense = await response.json();
        toast.success('Budget expense added successfully!');
        reset();
        onOpenChange(false);
        if (onExpenseAdded) {
          onExpenseAdded();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to add expense:', errorData);
        toast.error(`Failed to add expense: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Failed to add expense');
      console.error('Failed to add expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBudgetWarning = () => {
    if (!selectedBudget || !watchedAmount) return null;

    const newSpent = selectedBudget.spent + watchedAmount;
    const newPercentage = (newSpent / selectedBudget.amount) * 100;

    if (watchedAmount > selectedBudget.remaining) {
      return {
        type: 'error',
        message: `Exceeds budget by ₹${(watchedAmount - selectedBudget.remaining).toLocaleString()}`
      };
    } else if (newPercentage >= 90) {
      return {
        type: 'warning',
        message: `Will use ${newPercentage.toFixed(1)}% of budget`
      };
    }
    return null;
  };

  const warning = getBudgetWarning();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">Add Budget Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="budgetId" className="text-sm">Select Budget</Label>
            <select
              id="budgetId"
              {...register('budgetId')}
              className="w-full mt-1 p-2 text-sm border rounded-md bg-background text-foreground border-input"
            >
              <option value="">Choose a budget</option>
              {budgets.map((budget) => (
                <option key={budget._id} value={budget._id}>
                  {budget.name} - ₹{budget.remaining.toLocaleString()} remaining
                </option>
              ))}
            </select>
            {errors.budgetId && (
              <p className="text-xs text-red-500 mt-1">{errors.budgetId.message}</p>
            )}
          </div>

          {selectedBudget && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{selectedBudget.name}</span>
                <Badge variant={selectedBudget.percentage >= 75 ? "destructive" : "default"}>
                  {selectedBudget.percentage.toFixed(1)}% used
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                ₹{selectedBudget.spent.toLocaleString()} spent • ₹{selectedBudget.remaining.toLocaleString()} remaining
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="amount" className="text-sm">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
              className="mt-1"
            />
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
            )}
            {warning && (
              <div className={`flex items-center gap-2 mt-1 text-xs ${
                warning.type === 'error' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                <AlertTriangle className="h-3 w-3" />
                {warning.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="category" className="text-sm">Category</Label>
            <select
              id="category"
              {...register('category')}
              className="w-full mt-1 p-2 text-sm border rounded-md bg-background text-foreground border-input"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm">Reason</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="What was this expense for?"
              className="mt-1 text-sm"
              rows={3}
            />
            {errors.reason && (
              <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date" className="text-sm">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className="mt-1"
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting || !selectedBudget} className="w-full sm:w-auto">
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}