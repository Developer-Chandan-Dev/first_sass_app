'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2} from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateExpense, updateExpenseOptimistic, type ExpenseItem } from '@/lib/redux/expense/expenseSlice';
import { useDashboardTranslations } from '@/hooks/i18n';
import { useModalState } from '@/hooks/useModalState';
import { CategorySelect } from '@/components/ui/category-select';
import { getBackendCategoryKey, getFrontendCategoryKey } from '@/lib/categories';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TranslationType } from '@/types/dashboard';


const createExpenseSchema = (t: TranslationType) => z.object({
  amount: z.number().min(0.01, t.expenses?.form?.validation?.amountGreaterThanZero || 'Amount must be greater than 0'),
  category: z.string().min(1, t.expenses?.form?.validation?.categoryRequired || 'Category is required'),
  reason: z.string().min(1, t.expenses?.form?.validation?.reasonRequired || 'Reason is required'),
  date: z.string(),
  isRecurring: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  affectsBalance: z.boolean(),
  incomeId: z.string().optional(),
});

type ExpenseFormData = z.infer<ReturnType<typeof createExpenseSchema>>;

interface EditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseItem | null;
  onExpenseUpdated?: () => void;
}

export function EditExpenseModal({ open, onOpenChange, expense, onExpenseUpdated }: EditExpenseModalProps) {
  const dispatch = useAppDispatch();
  const translations = useDashboardTranslations();
  const { expenses, common } = translations;
  const [connectedIncomes, setConnectedIncomes] = useState<Array<{_id: string, source: string, description: string, amount: number}>>([]);
  
  const modalState = useModalState({
    onSuccess: () => {
      onOpenChange(false);
      reset();
      onExpenseUpdated?.();
    },
    successMessage: expenses?.updateSuccess || 'Expense updated successfully',
  });

  const expenseSchema = createExpenseSchema(translations);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  const isRecurring = watch('isRecurring');
  const affectsBalance = watch('affectsBalance');

  useEffect(() => {
    if (!open) return;
    
    const fetchConnectedIncomes = async () => {
      try {
        const response = await fetch('/api/incomes/connected');
        if (response.ok) {
          const incomes = await response.json();
          setConnectedIncomes(incomes);
        }
      } catch (error) {
        console.error('Failed to fetch incomes:', error);
        setConnectedIncomes([]);
      }
    };

    fetchConnectedIncomes();
  }, [open]);

  useEffect(() => {
    if (expense && open) {
      setValue('amount', expense.amount);
      setValue('category', getFrontendCategoryKey(expense.category));
      setValue('reason', expense.reason);
      setValue('date', expense.date.split('T')[0]);
      setValue('isRecurring', expense.isRecurring || false);
      setValue('affectsBalance', expense.affectsBalance ?? false);
      setValue('incomeId', expense.incomeId || '');
      if (expense.frequency) {
        setValue('frequency', expense.frequency);
      }
    }
  }, [expense, open, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    if (!expense) return;

    await modalState.executeAsync(async () => {
      // Sanitize and validate all user inputs before using them
      const sanitizedAmount = typeof data.amount === 'number' && isFinite(data.amount) ? data.amount : 0;
      const sanitizedCategory = typeof data.category === 'string' ? data.category.replace(/[^a-zA-Z0-9-_]/g, '') : '';
      const sanitizedReason = typeof data.reason === 'string' ? data.reason.replace(/[<>]/g, '') : '';
      const sanitizedDate = typeof data.date === 'string' ? data.date.replace(/[^0-9\-]/g, '') : '';
      const sanitizedIncomeId = typeof data.incomeId === 'string' ? data.incomeId.replace(/[^a-zA-Z0-9-_]/g, '') : undefined;
      const sanitizedFrequency = data.frequency && ['daily', 'weekly', 'monthly', 'yearly'].includes(data.frequency) ? data.frequency : undefined;

      const updates = {
        amount: Number(sanitizedAmount),
        category: getBackendCategoryKey(sanitizedCategory),
        reason: sanitizedReason,
        date: sanitizedDate,
        isRecurring: !!data.isRecurring,
        affectsBalance: !!data.affectsBalance,
        incomeId: data.affectsBalance ? sanitizedIncomeId : undefined,
        ...(sanitizedFrequency && { frequency: sanitizedFrequency }),
      };

      // Optimistic update - update UI immediately
      dispatch(updateExpenseOptimistic({ id: expense._id, updates }));
      
      // API call in background
      try {
        await dispatch(updateExpense({ id: expense._id, updates })).unwrap();
        return updates;
      } catch (error) {
        // Optimistic update will be reverted automatically by Redux
        throw error;
      }
    }, expenses?.updateSuccess || 'Expense updated successfully');
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">{expenses?.editExpense || 'Edit Expense'}</DialogTitle>
        </DialogHeader>

        {modalState.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{modalState.error}</AlertDescription>
          </Alert>
        )}

        {modalState.isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">{common?.loading || 'Loading...'}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="amount" className="text-sm">{common?.amount || 'Amount'}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
              className="mt-1"
            />
            {formErrors.amount && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">{formErrors.amount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category" className="text-sm">{common?.category || 'Category'}</Label>
            <CategorySelect
              id="category"
              value={watch('category') || ''}
              onChange={(value) => setValue('category', value)}
              placeholder={expenses?.selectCategory || 'Select category'}
              className="mt-1"
            />
            {formErrors.category && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">{formErrors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm">{expenses?.reason || 'Description'}</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder={expenses?.reasonPlaceholder || 'What was this expense for?'}
              className="mt-1 text-sm"
              rows={3}
            />
            {formErrors.reason && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">{formErrors.reason.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date" className="text-sm">{common?.date || 'Date'}</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className="mt-1"
            />
            {formErrors.date && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">{formErrors.date.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="affectsBalance" className="text-sm font-medium">
                  {expenses?.reduceFromBalance || 'Reduce from Balance'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {expenses?.deductFromConnectedIncome || 'Deduct from connected income'}
                </p>
              </div>
              <Switch
                id="affectsBalance"
                checked={affectsBalance}
                onCheckedChange={(checked) => setValue('affectsBalance', checked)}
              />
            </div>
            
            {affectsBalance && (
              <div>
                <Label className="text-sm">{expenses?.selectIncomeSource || 'Select Income Source'}</Label>
                <Select value={watch('incomeId')} onValueChange={(value) => setValue('incomeId', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={expenses?.chooseIncomeToReduceFrom || 'Choose income to reduce from'} />
                  </SelectTrigger>
                  <SelectContent>
                    {connectedIncomes.map((income) => (
                      <SelectItem key={income._id} value={income._id}>
                        {income.source} - ₹{income.amount.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isRecurring" className="text-sm font-medium">
                  {expenses?.recurringExpense || 'Recurring Expense'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {expenses?.regularExpense || 'Regular expense'}
                </p>
              </div>
              <Switch
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setValue('isRecurring', checked)}
              />
            </div>
            
            {isRecurring && (
              <div>
                <Label className="text-sm">{expenses?.frequency || 'Frequency'}</Label>
                <Select onValueChange={(value) => setValue('frequency', value as 'daily' | 'weekly' | 'monthly' | 'yearly')}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={expenses?.selectFrequency || 'Select frequency'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{expenses?.frequencies?.daily || 'Daily'}</SelectItem>
                    <SelectItem value="weekly">{expenses?.frequencies?.weekly || 'Weekly'}</SelectItem>
                    <SelectItem value="monthly">{expenses?.frequencies?.monthly || 'Monthly'}</SelectItem>
                    <SelectItem value="yearly">{expenses?.frequencies?.yearly || 'Yearly'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
            <Button type="submit" disabled={modalState.isSubmitting || modalState.isLoading} className="w-full sm:w-auto">
              {modalState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modalState.isSubmitting ? 'Updating...' : (expenses?.editExpense || 'Update Expense')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              {common?.cancel || 'Cancel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}