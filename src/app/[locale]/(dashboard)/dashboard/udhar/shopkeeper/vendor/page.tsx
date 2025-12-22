'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { VendorList } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-list';
import { VendorFormModal } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-form-modal';
import { Plus, Store, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Vendor {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalOwed: number;
}

export default function VendorManagementPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/udhar/vendor/vendors');
      if (!res.ok) throw new Error('Failed to fetch vendors');
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vendor and all transactions?')) return;
    try {
      const res = await fetch(`/api/udhar/vendor/vendors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete vendor');
      toast.success('Vendor deleted');
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
    }
  };

  const totalOwed = vendors.reduce((sum, v) => sum + v.totalOwed, 0);
  const activeVendors = vendors.filter(v => v.totalOwed > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Vendor Management"
          description="Track purchases and payments to your suppliers"
        />
        <Button onClick={() => { setEditVendor(null); setModalOpen(true); }} className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{vendors.length}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
                <Store className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Owed</p>
                <p className="text-2xl font-bold text-destructive">₹{totalOwed.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-2xl font-bold">{activeVendors}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors List */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-950/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Store className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span>All Vendors</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between items-center pt-4 border-t">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <VendorList 
              vendors={vendors} 
              onEdit={(vendor) => { setEditVendor(vendor); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <VendorFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchVendors}
        vendor={editVendor}
      />
    </div>
  );
}
