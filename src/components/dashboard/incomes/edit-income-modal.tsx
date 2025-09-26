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
import { toast } from 'sonner';

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
  const income = useSelector((state: RootState) => 
    state.incomes.incomes.find(inc => inc._id === incomeId)
  );
  
  const [loading, setLoading] = useState(false);
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
    
    if (!formData.amount || !formData.source || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
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

      toast.success('Income updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Income</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
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
              <Label htmlFor="source">Source *</Label>
              <Input
                id="source"
                placeholder="e.g., Company Name, Client Name"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Freelancing">Freelancing</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Rental">Rental</SelectItem>
                  <SelectItem value="Commission">Commission</SelectItem>
                  <SelectItem value="Bonus">Bonus</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Brief description of income source"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
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
                  Connect to Balance
                </Label>
                <p className="text-xs text-muted-foreground">
                  Expenses will reduce from this income
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
                  Recurring Income
                </Label>
                <p className="text-xs text-muted-foreground">
                  Regular income source
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
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Income'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}