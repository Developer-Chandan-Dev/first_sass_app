'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

interface Vendor {
  _id: string;
  name: string;
  phone: string;
  address?: string;
}

interface VendorFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vendor?: Vendor | null;
}

export function VendorFormModal({ open, onClose, onSuccess, vendor }: VendorFormModalProps) {
  const { udhar, common } = useDashboardTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
      });
    } else {
      setFormData({ name: '', phone: '', address: '' });
    }
  }, [vendor, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = vendor ? `/api/udhar/vendor/vendors/${vendor._id}` : '/api/udhar/vendor/vendors';
      const method = vendor ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save vendor');
      }

      toast.success(vendor ? udhar.transaction.updated : udhar.vendor.addVendor);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast.error(error instanceof Error ? error.message : udhar.vendorDetails.notFound);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <span className="text-orange-600 dark:text-orange-400">🏪</span>
            </div>
            {vendor ? udhar.actions.edit : udhar.vendor.addVendor}
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
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {common.cancel}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 shadow-sm"
            >
              {loading ? udhar.form.saving : vendor ? common.update : common.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
