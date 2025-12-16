'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customerId: string;
  type: 'purchase' | 'payment';
}

export function TransactionModal({ open, onClose, onSuccess, customerId, type }: TransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paidAmount: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      const paidAmount = type === 'purchase' ? parseFloat(formData.paidAmount || '0') : 0;

      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (type === 'purchase' && paidAmount > amount) {
        throw new Error('Paid amount cannot be greater than total amount');
      }

      const res = await fetch('/api/udhar/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          type,
          amount,
          paidAmount,
          description: formData.description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save transaction');
      }

      toast.success(type === 'purchase' ? 'Purchase added' : 'Payment recorded');
      setFormData({ amount: '', paidAmount: '', description: '' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className={`p-2 rounded-lg ${
              type === 'purchase' 
                ? 'bg-red-100 dark:bg-red-900/20' 
                : 'bg-green-100 dark:bg-green-900/20'
            }`}>
              {type === 'purchase' ? (
                <span className="text-red-600 dark:text-red-400">🛒</span>
              ) : (
                <span className="text-green-600 dark:text-green-400">💰</span>
              )}
            </div>
            {type === 'purchase' ? 'New Purchase' : 'Record Payment'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {type === 'purchase' ? 'Total Amount' : 'Payment Amount'} *
            </Label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="text-lg font-semibold"
              placeholder="0.00"
            />
          </div>
          {type === 'purchase' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Paid Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.paidAmount}
                onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                className="text-lg font-semibold"
                placeholder="0.00"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description *</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={type === 'purchase' ? 'e.g., Biscuits, Oil' : 'Payment received'}
              required
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 shadow-sm"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
