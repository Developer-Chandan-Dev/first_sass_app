'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
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

import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  addExpense,
  addExpenseOptimistic,
} from '@/lib/redux/expense/expenseSlice';
import { updateStatsOptimistic } from '@/lib/redux/expense/overviewSlice';
import { useAppTranslations } from '@/hooks/useTranslation';
import { CategorySelect } from '@/components/ui/category-select';
import { getBackendCategoryKey } from '@/lib/categories';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  reason: z.string().min(1, 'Reason is required'),
  date: z.string(),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  affectsBalance: z.boolean().default(false),
  incomeId: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseType?: 'free' | 'budget';
  onExpenseAdded?: () => void;
}

export function AddExpenseModal({
  open,
  onOpenChange,
  expenseType = 'free',
  onExpenseAdded,
}: AddExpenseModalProps) {
  const dispatch = useAppDispatch();
  const { expenses, common } = useAppTranslations();
  const [connectedIncomes, setConnectedIncomes] = useState<Array<{_id: string, source: string, description: string, amount: number}>>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      affectsBalance: false,
      incomeId: '',
    },
  });

  const isRecurring = watch('isRecurring');
  const affectsBalance = watch('affectsBalance');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomesRes = await fetch('/api/incomes/connected');
        
        if (incomesRes.ok) {
          const incomes = await incomesRes.json();
          setConnectedIncomes(Array.isArray(incomes) ? incomes : []);
        } else {
          console.warn('Incomes API failed');
          setConnectedIncomes([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, expenseType]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Validate required fields
      if (!data.amount || data.amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      if (!data.category?.trim()) {
        toast.error('Please select a category');
        return;
      }
      
      if (!data.reason?.trim()) {
        toast.error('Please enter a description');
        return;
      }
      
      // API call in background
      const requestData = {
        ...data,
        amount: Number(data.amount),
        category: getBackendCategoryKey(data.category),
        type: expenseType,
        incomeId: data.affectsBalance ? data.incomeId : undefined,
      };

      const res = await dispatch(addExpense(requestData)).unwrap();

      // Update UI after successful API response
      dispatch(addExpenseOptimistic(res));
      
      // Update stats after successful API response
      dispatch(
        updateStatsOptimistic({
          type: expenseType,
          amount: res.amount,
          category: res.category || 'Other',
          operation: 'add',
          reason: res.reason,
        })
      );

      toast.success(expenses?.addSuccess || 'Expense added successfully');

      // Close modal and reset form
      reset();
      setValue('incomeId', '');
      onOpenChange(false);
      
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add expense';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">{expenses?.addNewExpense || 'Add New Expense'}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <div>
            <Label htmlFor="amount" className="text-sm">
              {common?.amount || 'Amount'}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
              className="mt-1"
            />
            {errors.amount && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category" className="text-sm">
              {common?.category || 'Category'}
            </Label>
            <CategorySelect
              id="category"
              value={watch('category') || ''}
              onChange={(value) => setValue('category', value)}
              placeholder={expenses?.selectCategory || 'Select category'}
              className="mt-1"
            />
            {errors.category && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm">
              {expenses?.reason || 'Description'}
            </Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder={expenses?.reasonPlaceholder || 'Enter expense description'}
              className="mt-1 text-sm"
              rows={3}
            />
            {errors.reason && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="date" className="text-sm">
              {common?.date || 'Date'}
            </Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className="mt-1"
            />
            {errors.date && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.date.message}
              </p>
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
                <Select onValueChange={(value) => setValue('incomeId', value)}>
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
                  {expenses?.regularExpense || 'This is a regular expense'}
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (expenses?.adding || 'Adding...') : (expenses?.addExpense || 'Add Expense')}
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
