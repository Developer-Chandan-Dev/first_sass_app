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
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateExpense, updateExpenseOptimistic, type ExpenseItem } from '@/lib/redux/expense/expenseSlice';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  reason: z.string().min(1, 'Reason is required'),
  date: z.string(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface EditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseItem | null;
  onExpenseUpdated?: () => void;
}

export function EditExpenseModal({ open, onOpenChange, expense, onExpenseUpdated }: EditExpenseModalProps) {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
  });

  useEffect(() => {
    if (expense && open) {
      setValue('amount', expense.amount);
      setValue('category', expense.category);
      setValue('reason', expense.reason);
      setValue('date', expense.date.split('T')[0]);
    }
  }, [expense, open, setValue]);

  const onSubmit = async (data: ExpenseFormData) => {
    if (!expense) return;

    try {
      const updates = {
        amount: Number(data.amount),
        category: data.category,
        reason: data.reason,
        date: data.date,
      };

      // Optimistic update - update UI immediately
      dispatch(updateExpenseOptimistic({ id: expense._id, updates }));
      toast.success('Expense updated successfully!');
      
      // Close modal
      onOpenChange(false);
      reset();
      
      // API call in background
      try {
        await dispatch(updateExpense({ id: expense._id, updates })).unwrap();
        // Success - optimistic update is already applied
      } catch (error) {
        toast.error('Failed to update expense');
        console.error('Failed to update expense:', error);
        // Optimistic update will be reverted automatically by Redux
      }
      
      if (onExpenseUpdated) {
        onExpenseUpdated();
      }
    } catch (error) {
      toast.error('Failed to update expense');
      console.error('Failed to update expense:', error);
    }
  };

  const categories = ['Food & Dining', 'Transportation', 'Entertainment', 'Groceries', 'Shopping', 'Healthcare', 'Utilities', 'Education' ,'Travel', 'Others'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">Edit Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
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
              <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.amount.message}</p>
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
              <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.category.message}</p>
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
              <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.reason.message}</p>
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
              <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.date.message}</p>
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