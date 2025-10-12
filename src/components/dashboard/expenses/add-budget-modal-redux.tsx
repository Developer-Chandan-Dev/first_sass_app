'use client';

import { useEffect, useMemo } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  addBudget,
  addBudgetOptimistic,
  updateBudget,
  updateBudgetOptimistic,
  type Budget,
} from '@/lib/redux/expense/budgetSlice';
import { updateStatsOptimistic } from '@/lib/redux/expense/overviewSlice';
import { useDashboardTranslations } from '@/hooks/i18n';
import { useModalState } from '@/hooks/useModalState';
import { CategorySelect } from '@/components/ui/category-select';
import { getBackendCategoryKey } from '@/lib/categories';
import { sanitizeString } from '@/lib/input-sanitizer';

const createBudgetSchema = (t: ReturnType<typeof useDashboardTranslations>) => z.object({
  name: z.string().min(1, t.expenses?.form?.validation?.titleRequired || 'Title is required'),
  amount: z.number().min(0.01, t.expenses?.form?.validation?.amountGreaterThanZero || 'Amount must be greater than 0'),
  category: z.string().optional(),
  duration: z.enum(['monthly', 'weekly', 'custom']),
  startDate: z.string().min(1, t.expenses?.form?.validation?.dateRequired || 'Start date is required'),
  endDate: z.string().min(1, t.expenses?.form?.validation?.dateRequired || 'End date is required'),
});

type BudgetFormData = z.infer<ReturnType<typeof createBudgetSchema>>;

interface AddBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget | null;
  onBudgetSaved?: () => void;
}

export function AddBudgetModal({
  open,
  onOpenChange,
  budget,
  onBudgetSaved,
}: AddBudgetModalProps) {
  const dispatch = useAppDispatch();
  const t = useDashboardTranslations();
  const isEditing = !!budget;

  const modalState = useModalState({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onBudgetSaved?.();
    },
    successMessage: isEditing ? t.success.updated : t.success.created,
  });

  const budgetSchema = useMemo(() => createBudgetSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      duration: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    },
  });

  const duration = watch('duration');

  useEffect(() => {
    if (budget && open) {
      setValue('name', budget.name);
      setValue('amount', budget.amount);
      setValue('category', budget.category || '');
      setValue('duration', budget.duration);
      setValue('startDate', budget.startDate.split('T')[0]);
      setValue('endDate', budget.endDate.split('T')[0]);
    } else if (open && !budget) {
      reset();
    }
  }, [budget, open, setValue, reset]);

  useEffect(() => {
    const startDate = new Date();
    let endDate = new Date();

    if (duration === 'monthly') {
      endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (duration === 'weekly') {
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    if (duration !== 'custom') {
      setValue('startDate', startDate.toISOString().split('T')[0]);
      setValue('endDate', endDate.toISOString().split('T')[0]);
    }
  }, [duration, setValue]);

  const onSubmit = async (data: BudgetFormData) => {
    await modalState.executeAsync(async () => {
      if (isEditing && budget) {
        // Update existing budget
        const updates = {
          name: data.name,
          amount: Number(data.amount),
          category: data.category ? getBackendCategoryKey(data.category) : undefined,
          duration: data.duration,
          startDate: data.startDate,
          endDate: data.endDate,
        };

        // Optimistic update
        dispatch(updateBudgetOptimistic({ id: budget._id, updates }));

        // API call in background
        await dispatch(updateBudget({ id: budget._id, updates })).unwrap();
        return updates;
      } else {
        const budgetData = {
          ...data,
          category: data.category ? getBackendCategoryKey(data.category) : undefined,
          isActive: true
        };
        const res = await dispatch(addBudget(budgetData)).unwrap();

        // Update UI after successful API response
        dispatch(addBudgetOptimistic(res));
        
        // Update overview stats after successful API response
        dispatch(
          updateStatsOptimistic({
            type: 'budget',
            amount: Number(res.amount),
            category: res.category || 'Other',
            operation: 'add',
            isExpense: false,
          })
        );
        
        return res;
      }
    }, isEditing ? t.success.updated : t.success.created);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">
            {isEditing ? 'Edit Budget' : sanitizeString(t.dashboard?.addBudget || 'Add Budget')}
          </DialogTitle>
        </DialogHeader>

        {modalState.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{sanitizeString(modalState.error || '')}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm">
              {t.expenses.form.title}
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder={sanitizeString(t.expenses?.form?.titlePlaceholder || 'Enter title')}
              className="mt-1"
            />
            {formErrors.name && (
              <p className="text-xs text-red-500 mt-1">{formErrors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm">
              {t.expenses.form.amount}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder={sanitizeString(t.expenses?.form?.amountPlaceholder || 'Enter amount')}
              className="mt-1"
            />
            {formErrors.amount && (
              <p className="text-xs text-red-500 mt-1">
                {formErrors.amount.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category" className="text-sm">
              {t.expenses.form.category} (Optional)
            </Label>
            <CategorySelect
              id="category"
              value={watch('category') || ''}
              onChange={(value) => setValue('category', value)}
              placeholder={sanitizeString(t.expenses?.selectCategory || 'Select category')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="duration" className="text-sm">
              {t.expenses.frequency}
            </Label>
            <select
              id="duration"
              {...register('duration')}
              className="w-full mt-1 p-2 text-sm border rounded-md bg-background text-foreground border-input"
            >
              <option value="monthly">{t.expenses.frequencies.monthly}</option>
              <option value="weekly">{t.expenses.frequencies.weekly}</option>
              <option value="custom">{t.expenses.customRange}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm">
                {t.expenses.startDate}
              </Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="mt-1"
                disabled={duration !== 'custom'}
              />
              {formErrors.startDate && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm">
                {t.expenses.endDate}
              </Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="mt-1"
                disabled={duration !== 'custom'}
              />
              {formErrors.endDate && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="submit"
              disabled={modalState.isSubmitting || modalState.isLoading}
              className="w-full sm:w-auto"
            >
              {modalState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modalState.isSubmitting
                ? isEditing
                  ? 'Updating...'
                  : t.expenses.adding
                : isEditing
                  ? t.common.update
                  : t.common.create}
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
      </DialogContent>
    </Dialog>
  );
}