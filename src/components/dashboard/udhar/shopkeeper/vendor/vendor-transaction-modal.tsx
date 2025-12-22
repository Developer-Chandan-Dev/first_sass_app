'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Calculator } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface VendorTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendorId: string;
  type: 'purchase' | 'payment';
}

export function VendorTransactionModal({ open, onClose, onSuccess, vendorId, type }: VendorTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    paidAmount: '',
    description: '',
    paymentMethod: 'cash' as 'cash' | 'upi' | 'card' | 'other',
    dueDate: '',
  });
  const [items, setItems] = useState<{ name: string; quantity: string; price: string }[]>([]);
  const [showItems, setShowItems] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);

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

      const itemsData = items.filter(i => i.name && i.quantity && i.price).map(i => {
        const qty = parseFloat(i.quantity);
        const rate = parseFloat(i.price);
        return {
          name: i.name,
          quantity: qty,
          price: qty * rate
        };
      });

      const res = await fetch('/api/udhar/vendor/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          type,
          amount,
          paidAmount,
          description: formData.description,
          items: itemsData.length > 0 ? itemsData : undefined,
          paymentMethod: type === 'payment' ? formData.paymentMethod : undefined,
          dueDate: type === 'purchase' && formData.dueDate ? formData.dueDate : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save transaction');
      }

      toast.success(type === 'purchase' ? 'Purchase added' : 'Payment recorded');
      setFormData({ amount: '', paidAmount: '', description: '', paymentMethod: 'cash', dueDate: '' });
      setItems([]);
      setShowItems(false);
      setAutoCalculate(true);
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
                ? 'bg-orange-100 dark:bg-orange-900/20' 
                : 'bg-green-100 dark:bg-green-900/20'
            }`}>
              {type === 'purchase' ? (
                <span className="text-orange-600 dark:text-orange-400">🛒</span>
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
              placeholder={type === 'purchase' ? 'e.g., Stock purchase' : 'Payment made'}
              required
            />
          </div>
          {type === 'purchase' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Due Date (Optional)</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
          {type === 'payment' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(v: 'cash' | 'upi' | 'card' | 'other') => setFormData({ ...formData, paymentMethod: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">💵 Cash</SelectItem>
                  <SelectItem value="upi">📱 UPI</SelectItem>
                  <SelectItem value="card">💳 Card</SelectItem>
                  <SelectItem value="other">🔄 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {type === 'purchase' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Items (Optional)</Label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <Checkbox 
                      id="autoCalc" 
                      checked={autoCalculate} 
                      onCheckedChange={(checked) => setAutoCalculate(checked as boolean)}
                    />
                    <label htmlFor="autoCalc" className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1">
                      <Calculator className="h-3 w-3" />
                      Auto
                    </label>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowItems(!showItems)}>
                    {showItems ? 'Hide' : 'Add Items'}
                  </Button>
                </div>
              </div>
              {showItems && (
                <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input placeholder="Item" value={item.name} onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].name = e.target.value;
                        setItems(newItems);
                      }} className="flex-1" />
                      <Input placeholder="Qty" type="number" value={item.quantity} onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].quantity = e.target.value;
                        setItems(newItems);
                        if (autoCalculate) {
                          const total = newItems.reduce((sum, i) => {
                            const qty = parseFloat(i.quantity) || 0;
                            const price = parseFloat(i.price) || 0;
                            return sum + (qty * price);
                          }, 0);
                          setFormData({ ...formData, amount: total > 0 ? total.toString() : '' });
                        }
                      }} className="w-20" />
                      <Input placeholder="Rate" type="number" step="0.01" value={item.price} onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx].price = e.target.value;
                        setItems(newItems);
                        if (autoCalculate) {
                          const total = newItems.reduce((sum, i) => {
                            const qty = parseFloat(i.quantity) || 0;
                            const rate = parseFloat(i.price) || 0;
                            return sum + (qty * rate);
                          }, 0);
                          setFormData({ ...formData, amount: total > 0 ? total.toString() : '' });
                        }
                      }} className="w-24" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => setItems(items.filter((_, i) => i !== idx))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setItems([...items, { name: '', quantity: '', price: '' }])} className="w-full">
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>
              )}
            </div>
          )}
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
