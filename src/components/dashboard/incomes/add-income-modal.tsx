'use client';


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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

import { useDashboardTranslations } from '@/hooks/i18n';
import { useModalState } from '@/hooks/useModalState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createIncomeSchema = (t: any) => z.object({
  amount: z.number().min(0.01, t.income?.form?.validation?.amountPositive || 'Amount must be greater than 0'),
  source: z.string().min(1, t.income?.form?.validation?.sourceRequired || 'Source is required'),
  category: z.string().min(1, t.income?.form?.validation?.categoryRequired || 'Category is required'),
  description: z.string().min(1, t.income?.form?.validation?.descriptionRequired || 'Description is required'),
  date: z.string(),
  isConnected: z.boolean().optional().default(false),
  isRecurring: z.boolean().optional().default(false),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
});

type IncomeFormData = z.infer<ReturnType<typeof createIncomeSchema>>;

interface AddIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIncomeAdded?: () => void;
}

export function AddIncomeModal({ open, onOpenChange, onIncomeAdded }: AddIncomeModalProps) {
  const translations = useDashboardTranslations();
  const { income, common, errors } = translations;
  
  const modalState = useModalState({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onIncomeAdded?.();
    },
    successMessage: income?.addSuccess || 'Income added successfully',
  });

  const incomeSchema = createIncomeSchema(translations);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: formErrors },
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
    await modalState.executeAsync(async () => {
      const response = await fetch('/api/incomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errors?.generic || 'Failed to add income');
      }

      return await response.json();
    }, income?.addSuccess || 'Income added successfully');
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

        {modalState.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{modalState.error}</AlertDescription>
          </Alert>
        )}

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
            {formErrors.amount && (
              <p className="text-sm text-red-500 mt-1">{formErrors.amount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="source">{income?.source || 'Source'} *</Label>
            <Input
              id="source"
              {...register('source')}
              placeholder="e.g., Company Name, Client Name"
            />
            {formErrors.source && (
              <p className="text-sm text-red-500 mt-1">{formErrors.source.message}</p>
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
            {formErrors.category && (
              <p className="text-sm text-red-500 mt-1">{formErrors.category.message}</p>
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
            {formErrors.description && (
              <p className="text-sm text-red-500 mt-1">{formErrors.description.message}</p>
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
              disabled={modalState.isSubmitting || modalState.isLoading}
              className="flex-1"
            >
              {modalState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modalState.isSubmitting ? (income?.addingIncome || 'Adding...') : (income?.addIncome || 'Add Income')}
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