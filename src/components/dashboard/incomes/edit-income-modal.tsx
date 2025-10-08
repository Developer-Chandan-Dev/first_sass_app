'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { updateIncomeOptimistic, updateIncome } from '@/lib/redux/income/incomeSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAppTranslations } from '@/hooks/useTranslation';
import { useModalState } from '@/hooks/useModalState';

interface EditIncomeModalProps {
  incomeId: string;
  onClose: () => void;
}


const frequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'yearly', label: 'Yearly' }
];

export function EditIncomeModal({ incomeId, onClose }: EditIncomeModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { income: incomeTranslations, common, errors } = useAppTranslations();
  const income = useSelector((state: RootState) => 
    state.incomes.incomes.find(inc => inc._id === incomeId)
  );
  
  const modalState = useModalState({
    onSuccess: () => {
      onClose();
    },
    successMessage: incomeTranslations?.updateSuccess || 'Income updated successfully',
  });
  
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    category: '',
    description: '',
    date: '',
    isRecurring: false,
    frequency: 'monthly',
    isConnected: false
  });

  useEffect(() => {
    if (income) {
      setFormData({
        amount: income.amount.toString(),
        source: income.source,
        category: income.category || '',
        description: income.description || '',
        date: income.date.split('T')[0],
        isRecurring: income.isRecurring,
        frequency: income.frequency || 'monthly',
        isConnected: income.isConnected ?? false
      });
    }
  }, [income]);

  if (!income) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await modalState.executeAsync(async () => {
      if (!formData.amount || !formData.source || !formData.category || !formData.description) {
        throw new Error(errors?.validation || 'Please fill in all required fields');
      }

      const updates = {
        amount: parseFloat(formData.amount),
        source: formData.source,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        isRecurring: formData.isRecurring,
        frequency: formData.isRecurring ? formData.frequency as 'monthly' | 'weekly' | 'yearly' : undefined,
        isConnected: formData.isConnected
      };

      // Optimistic update
      dispatch(updateIncomeOptimistic({ id: incomeId, updates }));
      
      // API call
      await dispatch(updateIncome({ id: incomeId, updates })).unwrap();
      
      return updates;
    }, incomeTranslations?.updateSuccess || 'Income updated successfully');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{incomeTranslations?.editIncome || 'Edit Income'}</DialogTitle>
        </DialogHeader>

        {modalState.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{modalState.error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{common?.amount || 'Amount'} *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">{incomeTranslations?.source || 'Source'} *</Label>
              <Input
                id="source"
                placeholder="e.g., Company Name, Client Name"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">{common?.category || 'Category'} *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={incomeTranslations?.selectIncomeCategory || 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">{incomeTranslations?.sources?.salary || 'Salary'}</SelectItem>
                  <SelectItem value="Freelancing">{incomeTranslations?.sources?.freelancing || 'Freelancing'}</SelectItem>
                  <SelectItem value="Business">{incomeTranslations?.sources?.business || 'Business'}</SelectItem>
                  <SelectItem value="Investment">{incomeTranslations?.sources?.investment || 'Investment'}</SelectItem>
                  <SelectItem value="Rental">{incomeTranslations?.sources?.rental || 'Rental'}</SelectItem>
                  <SelectItem value="Commission">{incomeTranslations?.sources?.commission || 'Commission'}</SelectItem>
                  <SelectItem value="Bonus">{incomeTranslations?.sources?.bonus || 'Bonus'}</SelectItem>
                  <SelectItem value="Other">{incomeTranslations?.sources?.other || 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{common?.description || 'Description'} *</Label>
            <Textarea
              id="description"
              placeholder={incomeTranslations?.briefDescriptionOfIncomeSource || 'Brief description of income source'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{common?.date || 'Date'}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isConnected" className="text-sm font-medium">
                  {incomeTranslations?.connectToBalance || 'Connect to Balance'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {incomeTranslations?.expensesWillReduceFromThisIncome || 'Expenses will reduce from this income'}
                </p>
              </div>
              <Switch
                id="isConnected"
                checked={formData.isConnected}
                onCheckedChange={(checked) => setFormData({ ...formData, isConnected: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="recurring" className="text-sm font-medium">
                  {incomeTranslations?.recurringIncome || 'Recurring Income'}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {incomeTranslations?.regularIncomeSource || 'Regular income source'}
                </p>
              </div>
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
              />
            </div>
          </div>

          {formData.isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {common?.cancel || 'Cancel'}
            </Button>
            <Button type="submit" disabled={modalState.isSubmitting || modalState.isLoading} className="flex-1">
              {modalState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {modalState.isSubmitting ? 'Updating...' : (incomeTranslations?.editIncome || 'Update Income')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}