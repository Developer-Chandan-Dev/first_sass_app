'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const planSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  interval: z.enum(['monthly', 'yearly']),
  maxExpenses: z.number().min(1, 'Must allow at least 1 expense'),
  maxBudgets: z.number().min(1, 'Must allow at least 1 budget'),
  analytics: z.boolean(),
  export: z.boolean(),
  priority: z.boolean(),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PlanFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PlanFormModal({ open, onOpenChange, onSuccess }: PlanFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      interval: 'monthly',
      maxExpenses: 50,
      maxBudgets: 3,
      analytics: false,
      export: false,
      priority: false,
    },
  });

  const onSubmit = async (data: PlanFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          price: data.price,
          interval: data.interval,
          features: {
            maxExpenses: data.maxExpenses,
            maxBudgets: data.maxBudgets,
            analytics: data.analytics,
            export: data.export,
            priority: data.priority,
          },
        }),
      });

      if (response.ok) {
        toast.success('Plan created successfully');
        reset();
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error('Failed to create plan');
      }
    } catch (error) {
      console.error('Plan creation error:', error);
      toast.error('Failed to create plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Pro Plan"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="9.99"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="interval">Billing</Label>
              <Select onValueChange={(value) => setValue('interval', value as 'monthly' | 'yearly')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxExpenses">Max Expenses</Label>
              <Input
                id="maxExpenses"
                type="number"
                {...register('maxExpenses', { valueAsNumber: true })}
              />
              {errors.maxExpenses && (
                <p className="text-sm text-red-500 mt-1">{errors.maxExpenses.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="maxBudgets">Max Budgets</Label>
              <Input
                id="maxBudgets"
                type="number"
                {...register('maxBudgets', { valueAsNumber: true })}
              />
              {errors.maxBudgets && (
                <p className="text-sm text-red-500 mt-1">{errors.maxBudgets.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Features</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics" className="text-sm">Analytics Dashboard</Label>
              <Switch
                id="analytics"
                checked={watch('analytics')}
                onCheckedChange={(checked) => setValue('analytics', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="export" className="text-sm">Data Export</Label>
              <Switch
                id="export"
                checked={watch('export')}
                onCheckedChange={(checked) => setValue('export', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="priority" className="text-sm">Priority Support</Label>
              <Switch
                id="priority"
                checked={watch('priority')}
                onCheckedChange={(checked) => setValue('priority', checked)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : 'Create Plan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}