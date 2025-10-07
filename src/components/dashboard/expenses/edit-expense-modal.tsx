'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CategorySelect } from '@/components/ui/category-select';
import { getBackendCategoryKey, getFrontendCategoryKey } from '@/lib/categories';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  reason: z.string().min(1, 'Reason is required'),
  date: z.string(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseItem {
  _id: string;
  amount: number;
  category: string;
  reason: string;
  date: string;
  type: 'free' | 'budget';
}

interface EditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseItem | null;
  onExpenseUpdated?: () => void;
}

export function EditExpenseModal({ open, onOpenChange, expense, onExpenseUpdated }: EditExpenseModalProps) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  useEffect(() => {
    if (expense && open) {
      setValue('amount', expense.amount);
      setValue('category', getFrontendCategoryKey(expense.category));
      setValue('reason', expense.reason);
      setValue('date', new Date(expense.date).toISOString().split('T')[0]);
    }
  }, [expense, open, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const loadingToast = toast.loading('Updating expense...');
      
      const response = await fetch(`/api/expenses/${expense?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amount: Number(data.amount),
          category: getBackendCategoryKey(data.category),
        }),
      });
      
      toast.dismiss(loadingToast);
      
      if (response.ok) {
        toast.success('Expense updated successfully!');
        reset();
        onOpenChange(false);
        if (onExpenseUpdated) {
          onExpenseUpdated();
        }
      } else {
        toast.error('Failed to update expense');
      }
    } catch (error) {
      toast.error('Failed to update expense');
      console.error('Failed to update expense:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">Edit Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <CategorySelect
              id="category"
              value={watch('category') || ''}
              onChange={(value) => setValue('category', value)}
              placeholder="Select category"
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="What was this expense for?"
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Updating...' : 'Update Expense'}
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