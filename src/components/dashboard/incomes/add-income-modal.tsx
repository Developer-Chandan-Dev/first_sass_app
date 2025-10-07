'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAppTranslations } from '@/hooks/useTranslation';

const incomeSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  source: z.string().min(1, 'Source is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string(),
  isConnected: z.boolean().optional().default(false),
  isRecurring: z.boolean().optional().default(false),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface AddIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIncomeAdded?: () => void;
}

export function AddIncomeModal({ open, onOpenChange, onIncomeAdded }: AddIncomeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { income, common } = useAppTranslations();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      isConnected: false,
      isRecurring: false,
    },
  });

  const isRecurring = watch('isRecurring');
  const isConnected = watch('isConnected');

  const onSubmit = async (data: IncomeFormData) => {
    setIsSubmitting(true);
    try {

      const response = await fetch('/api/incomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(income?.addSuccess || 'Income added successfully!');
        reset();
        onOpenChange(false);
        onIncomeAdded?.();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Failed to add income');
      }
    } catch (error) {
      console.error('Error adding income:', error);
      toast.error('Failed to add income');
    } finally {
      setIsSubmitting(false);
    }
  };

  const incomeSources = [
    income?.sources?.salary || 'Salary',
    income?.sources?.freelancing || 'Freelancing',
    income?.sources?.business || 'Business',
    income?.sources?.investment || 'Investment',
    income?.sources?.rental || 'Rental',
    income?.sources?.commission || 'Commission',
    income?.sources?.bonus || 'Bonus',
    income?.sources?.other || 'Other'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{income?.addIncomeSource || 'Add Income Source'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="amount">{common?.amount || 'Amount'} *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="source">{income?.source || 'Source'} *</Label>
            <Input
              id="source"
              {...register('source')}
              placeholder="e.g., Company Name, Client Name"
            />
            {errors.source && (
              <p className="text-sm text-red-500 mt-1">{errors.source.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">{common?.category || 'Category'} *</Label>
            <Select onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder={income?.selectIncomeCategory || 'Select income category'} />
              </SelectTrigger>
              <SelectContent>
                {incomeSources.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">{common?.description || 'Description'} *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={income?.briefDescriptionOfIncomeSource || 'Brief description of income source'}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date">{common?.date || 'Date'}</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isConnected" className="text-sm font-medium">
                  {income?.connectToBalance || 'Connect to Balance'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {income?.expensesWillReduceFromThisIncome || 'Expenses will reduce from this income'}
                </p>
              </div>
              <Switch
                id="isConnected"
                checked={isConnected}
                onCheckedChange={(checked) => {

                  setValue('isConnected', checked, { shouldDirty: true });
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isRecurring" className="text-sm font-medium">
                  {income?.recurringIncome || 'Recurring Income'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {income?.regularIncomeSource || 'Regular income source'}
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
                <Label>Frequency</Label>
                <Select onValueChange={(value) => setValue('frequency', value as 'daily' | 'weekly' | 'monthly' | 'yearly')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (income?.addingIncome || 'Adding...') : (income?.addIncome || 'Add Income')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {common?.cancel || 'Cancel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}