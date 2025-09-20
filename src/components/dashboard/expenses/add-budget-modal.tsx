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
import { toast } from 'sonner';

const budgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  category: z.string().optional(),
  duration: z.enum(['monthly', 'weekly', 'custom']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface Budget {
  _id: string;
  name: string;
  amount: number;
  category?: string;
  duration: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface AddBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget | null;
  onBudgetSaved: () => void;
}

export function AddBudgetModal({ open, onOpenChange, budget, onBudgetSaved }: AddBudgetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!budget;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      duration: 'monthly',
    },
  });

  const duration = watch('duration');

  useEffect(() => {
    if (budget) {
      setValue('name', budget.name);
      setValue('amount', budget.amount);
      setValue('category', budget.category || '');
      setValue('duration', budget.duration as 'monthly' | 'weekly' | 'custom');
      setValue('startDate', new Date(budget.startDate).toISOString().split('T')[0]);
      setValue('endDate', new Date(budget.endDate).toISOString().split('T')[0]);
    } else {
      reset();
      // Set default dates based on duration
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setValue('startDate', startDate.toISOString().split('T')[0]);
      setValue('endDate', endDate.toISOString().split('T')[0]);
    }
  }, [budget, setValue, reset]);

  useEffect(() => {
    if (!isEditing) {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (duration) {
        case 'weekly':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        default:
          return;
      }

      setValue('startDate', startDate.toISOString().split('T')[0]);
      setValue('endDate', endDate.toISOString().split('T')[0]);
    }
  }, [duration, setValue, isEditing]);

  const onSubmit = async (data: BudgetFormData) => {
    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading(isEditing ? 'Updating budget...' : 'Creating budget...');

      const url = isEditing ? `/api/expenses/budget/${budget._id}` : '/api/expenses/budget';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success(isEditing ? 'Budget updated successfully!' : 'Budget created successfully!');
        reset();
        onOpenChange(false);
        onBudgetSaved();
      } else {
        toast.error(isEditing ? 'Failed to update budget' : 'Failed to create budget');
      }
    } catch (error) {
      toast.error(isEditing ? 'Failed to update budget' : 'Failed to create budget');
      console.error('Failed to save budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">
            {isEditing ? 'Edit Budget' : 'Create New Budget'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm">Budget Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Monthly Food & Dining Budget"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm">Budget Amount</Label>
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
          </div>

          <div>
            <Label htmlFor="category" className="text-sm">Category (Optional)</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="e.g., Food & Dining, Transportation"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="duration" className="text-sm">Duration</Label>
            <select
              id="duration"
              {...register('duration')}
              className="w-full mt-1 p-2 text-sm border rounded-md bg-background text-foreground border-input"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="mt-1"
              />
              {errors.startDate && (
                <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="mt-1"
              />
              {errors.endDate && (
                <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Budget' : 'Create Budget')}
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