'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  creditLimit?: number;
}

interface CustomerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
}

export function CustomerFormModal({ open, onClose, onSuccess, customer }: CustomerFormModalProps) {
  const { udhar, common } = useDashboardTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    creditLimit: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        address: customer.address || '',
        creditLimit: customer.creditLimit?.toString() || '',
      });
    } else {
      setFormData({ name: '', phone: '', address: '', creditLimit: '' });
    }
  }, [customer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = customer ? `/api/udhar/shopkeeper/customers/${customer._id}` : '/api/udhar/shopkeeper/customers';
      const method = customer ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save customer');
      }

      toast.success(customer ? udhar.transaction.updated : udhar.shopkeeper.addCustomer);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(error instanceof Error ? error.message : udhar.customer.notFound);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <span className="text-primary">👤</span>
            </div>
            {customer ? udhar.actions.edit : udhar.shopkeeper.addCustomer}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{udhar.customer.name} *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder={udhar.customer.name}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{udhar.customer.phone} *</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder={udhar.customer.phone}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{udhar.customer.address}</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={`${udhar.customer.address} (optional)`}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">{udhar.customer.creditLimit} (₹)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              placeholder={`${udhar.customer.creditLimit} (optional)`}
              className="text-base"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {common.cancel}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 shadow-sm"
            >
              {loading ? udhar.form.saving : customer ? common.update : common.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
