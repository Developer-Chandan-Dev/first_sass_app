'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

interface Transaction {
  _id: string;
  type: 'purchase' | 'payment';
  amount: number;
  description: string;
  paymentMethod?: 'cash' | 'upi' | 'card' | 'other';
}

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction: Transaction | null;
}

export function EditTransactionModal({ open, onClose, onSuccess, transaction }: EditTransactionModalProps) {
  const { udhar, common } = useDashboardTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    paymentMethod: 'cash' as 'cash' | 'upi' | 'card' | 'other',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        description: transaction.description,
        paymentMethod: transaction.paymentMethod || 'cash',
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);

      if (isNaN(amount) || amount <= 0) {
        throw new Error(udhar.form.enterValidAmount);
      }

      const res = await fetch(`/api/udhar/shopkeeper/transactions/${transaction._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description: formData.description,
          paymentMethod: transaction.type === 'payment' ? formData.paymentMethod : undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to update transaction');

      toast.success(udhar.transaction.updated);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : udhar.transaction.updated);
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{udhar.transaction.edit}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{udhar.form.amount} *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{udhar.form.description} *</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          {transaction.type === 'payment' && (
            <div className="space-y-2">
              <Label>{udhar.form.paymentMethod}</Label>
              <Select value={formData.paymentMethod} onValueChange={(v: 'cash' | 'upi' | 'card' | 'other') => setFormData({ ...formData, paymentMethod: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">💵 {udhar.form.cash}</SelectItem>
                  <SelectItem value="upi">📱 {udhar.form.upi}</SelectItem>
                  <SelectItem value="card">💳 {udhar.form.card}</SelectItem>
                  <SelectItem value="other">🔄 {udhar.form.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>{common.cancel}</Button>
            <Button type="submit" disabled={loading}>{loading ? udhar.form.saving : common.save}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
