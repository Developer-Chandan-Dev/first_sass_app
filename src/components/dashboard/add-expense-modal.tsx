'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.enum(['Food', 'Travel', 'Shopping', 'Bills', 'Others']),
  reason: z.string().min(1, 'Reason is required'),
  date: z.string(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amount: Number(data.amount),
        }),
      });

      if (response.ok) {
        reset();
        onOpenChange(false);
        window.location.reload(); // Simple refresh for now
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <select
              id="category"
              {...register('category')}
              className="w-full p-2 border rounded-md"
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Others">Others</option>
            </select>
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}