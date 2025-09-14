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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const expenseSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  reason: z.string().min(1, 'Reason is required'),
  date: z.string(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseType?: 'free' | 'budget';
  onExpenseAdded?: () => void;
}

export function AddExpenseModal({ open, onOpenChange, expenseType = 'free', onExpenseAdded }: AddExpenseModalProps) {
  const [categories, setCategories] = useState<string[]>(['Food', 'Travel', 'Shopping', 'Bills', 'Others']);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/expenses/categories/list?type=${expenseType}`);
        if (response.ok) {
          const data = await response.json();
          const defaultCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];
          const allCategories = [...new Set([...defaultCategories, ...data])];
          setCategories(allCategories);
        } else {
          console.error('API response not ok:', response.status);
          // Keep default categories if API fails
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Keep default categories on error
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open, expenseType]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      toast.loading('Adding expense...');
      
      const requestData = {
        ...data,
        amount: Number(data.amount),
        type: expenseType,
      };
      
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      if (response.ok) {
        toast.success('Expense added successfully!');
        reset();
        setShowCustomCategory(false);
        setCustomCategory('');
        onOpenChange(false);
        if (onExpenseAdded) {
          onExpenseAdded();
        }
      } else {
        toast.error('Failed to add expense');
      }
    } catch (error) {
      toast.error('Failed to add expense');
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
            {showCustomCategory ? (
              <div className="flex gap-2">
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customCategory.trim()) {
                        setValue('category', customCategory.trim());
                        setCategories(prev => [...prev, customCategory.trim()]);
                        setShowCustomCategory(false);
                        setCustomCategory('');
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomCategory(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  id="category"
                  {...register('category')}
                  className="flex-1 p-2 border rounded-md bg-background text-foreground border-input"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomCategory(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
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