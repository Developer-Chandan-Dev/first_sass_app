'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateStatsOptimistic } from '@/lib/redux/expense/overviewSlice';
import { updateBudgetSpent } from '@/lib/redux/expense/budgetSlice';
import { useAppTranslations } from '@/hooks/useTranslation';
import { CategorySelect } from '@/components/ui/category-select';
import { getBackendCategoryKey } from '@/lib/categories';

const createExpenseSchema = (t: ReturnType<typeof useAppTranslations>) => z.object({
  amount: z.number().min(0.01, t.expenses.form.validation.amountGreaterThanZero),
  budgetId: z.string().min(1, t.expenses.form.validation.categoryRequired),
  category: z.string().min(1, t.expenses.form.validation.categoryRequired),
  reason: z.string().min(1, t.expenses.form.validation.reasonRequired),
  date: z.string().min(1, t.expenses.form.validation.dateRequired),
  incomeId: z.string().optional(),
  affectsBalance: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
});

type ExpenseFormData = z.infer<ReturnType<typeof createExpenseSchema>>;

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

interface ConnectedIncome {
  _id: string;
  source: string;
  description: string;
  amount: number;
}

interface AddBudgetExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded?: () => void;
}

export function AddBudgetExpenseModal({ open, onOpenChange, onExpenseAdded }: AddBudgetExpenseModalProps) {
  const dispatch = useAppDispatch();
  const t = useAppTranslations();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [connectedIncomes, setConnectedIncomes] = useState<ConnectedIncome[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseSchema = useMemo(() => createExpenseSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      affectsBalance: false,
      isRecurring: false,
    },
  });

  const watchedBudgetId = watch('budgetId');
  const watchedAmount = watch('amount');
  const watchedAffectsBalance = watch('affectsBalance');
  const watchedIsRecurring = watch('isRecurring');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetsRes, incomesRes] = await Promise.all([
          fetch('/api/expenses/budget?active=true'),
          fetch('/api/incomes/connected')
        ]);
        
        if (budgetsRes.ok) {
          const budgetsData = await budgetsRes.json();
          setBudgets(budgetsData);
        }
        
        if (incomesRes.ok) {
          const incomesData = await incomesRes.json();
          setConnectedIncomes(incomesData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (open) {
      fetchData();
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
      
      const loadingToast = toast.loading(t.expenses.adding);

      const requestData = {
        ...data,
        type: 'budget',
        amount: Number(data.amount),
        category: getBackendCategoryKey(data.category),
        incomeId: data.affectsBalance ? data.incomeId : undefined,
        affectsBalance: data.affectsBalance,
        isRecurring: data.isRecurring,
        frequency: data.isRecurring ? data.frequency : undefined,
      };

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        await response.json();
        
        // Update stats after successful API response
        dispatch(updateStatsOptimistic({
          type: 'budget',
          amount: Number(data.amount),
          category: data.category,
          operation: 'add',
          isExpense: true,
          reason: data.reason
        }));
        
        // Update budget spent amount after successful API response
        dispatch(updateBudgetSpent({
          budgetId: data.budgetId,
          amount: Number(data.amount),
          operation: 'add'
        }));
        
        toast.success(t.expenses.addSuccess);
        reset();
        onOpenChange(false);
        if (onExpenseAdded) {
          onExpenseAdded();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to add expense:', errorData);
        toast.error(t.errors.generic);
      }
    } catch (error) {
      toast.error(t.errors.generic);
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
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-3 flex-shrink-0">
          <DialogTitle className="text-lg">{t.expenses.addBudgetExpense}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="budgetId" className="text-sm">{t.expenses.budget}</Label>
            <select
              id="budgetId"
              {...register('budgetId')}
              className="w-full mt-1 p-2 text-sm border rounded-md bg-background text-foreground border-input"
            >
              <option value="">{t.expenses.selectIncomeSource.replace('Income', 'Budget')}</option>
              {budgets.map((budget) => (
                <option key={budget._id} value={budget._id}>
                  {budget.name} - ₹{budget.remaining.toLocaleString()} {t.expenses.remaining.toLowerCase()}
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
                  {selectedBudget.percentage.toFixed(1)}% {t.expenses.spent}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                ₹{selectedBudget.spent.toLocaleString()} {t.expenses.spent} • ₹{selectedBudget.remaining.toLocaleString()} {t.expenses.remaining.toLowerCase()}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="amount" className="text-sm">{t.expenses.form.amount}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder={t.expenses.form.amountPlaceholder}
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
            <Label htmlFor="category" className="text-sm">{t.expenses.form.category}</Label>
            <CategorySelect
              id="category"
              value={watch('category') || ''}
              onChange={(value) => setValue('category', value)}
              placeholder={t.expenses.selectCategory}
              className="mt-1"
            />
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm">{t.expenses.reason}</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder={t.expenses.reasonPlaceholder}
              className="mt-1 text-sm"
              rows={3}
            />
            {errors.reason && (
              <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date" className="text-sm">{t.expenses.form.date}</Label>
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

          <div className="flex items-center justify-between">
            <Label htmlFor="affectsBalance" className="text-sm">{t.expenses.reduceFromBalance}</Label>
            <Switch
              id="affectsBalance"
              checked={watchedAffectsBalance}
              onCheckedChange={(checked) => setValue('affectsBalance', checked)}
            />
          </div>

          {watchedAffectsBalance && (
            <div>
              <Label htmlFor="incomeId" className="text-sm">{t.expenses.selectIncomeSource}</Label>
              <select
                id="incomeId"
                {...register('incomeId')}
                className="w-full mt-1 p-2 text-sm border rounded-md bg-background text-foreground border-input"
              >
                <option value="">{t.expenses.chooseIncomeToReduceFrom}</option>
                {connectedIncomes.map((income) => (
                  <option key={income._id} value={income._id}>
                    {income.source} - {income.description} (₹{income.amount.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="isRecurring" className="text-sm">{t.expenses.recurringExpense}</Label>
            <Switch
              id="isRecurring"
              checked={watchedIsRecurring}
              onCheckedChange={(checked) => setValue('isRecurring', checked)}
            />
          </div>

          {watchedIsRecurring && (
            <div>
              <Label htmlFor="frequency" className="text-sm">{t.expenses.frequency}</Label>
              <select
                id="frequency"
                {...register('frequency')}
                className="w-full mt-1 p-2 text-sm border rounded-md bg-background text-foreground border-input"
              >
                <option value="">{t.expenses.selectFrequency}</option>
                <option value="daily">{t.expenses.frequencies.daily}</option>
                <option value="weekly">{t.expenses.frequencies.weekly}</option>
                <option value="monthly">{t.expenses.frequencies.monthly}</option>
                <option value="yearly">{t.expenses.frequencies.yearly}</option>
              </select>
            </div>
          )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting || !selectedBudget} className="w-full sm:w-auto">
                {isSubmitting ? t.expenses.adding : t.expenses.addExpense}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                {t.common.cancel}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}