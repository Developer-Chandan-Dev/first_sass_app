'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { VendorList } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-list';
import { VendorFormModal } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-form-modal';
import { VendorAnalyticsDashboard } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-analytics-dashboard';
import { VendorTopCreditors } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-top-creditors';
import { VendorRecentTransactions } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-recent-transactions';
import { AnalyticsSkeleton, InsightsSkeleton, CustomerListSkeleton } from '@/components/dashboard/udhar/skeletons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Plus, BarChart3, CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

interface Vendor {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalOwed: number;
}

interface Stats {
  totalVendors: number;
  totalOwed: number;
  activeVendors: number;
  todayPayments: number;
  weekPayments: number;
  monthPayments: number;
  todayPurchases: number;
  weekPurchases: number;
  monthPurchases: number;
  topCreditors: { _id: string; name: string; phone: string; owed: number }[];
  recentTransactions: { _id: string; type: 'purchase' | 'payment'; amount: number; description: string; date: string }[];
  chartData: { date: string; purchases: number; payments: number }[];
  paymentMethods: Record<string, number>;
}

export default function VendorManagementPage() {
  const { udhar } = useDashboardTranslations();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalVendors: 0,
    totalOwed: 0,
    activeVendors: 0,
    todayPayments: 0,
    weekPayments: 0,
    monthPayments: 0,
    todayPurchases: 0,
    weekPurchases: 0,
    monthPurchases: 0,
    topCreditors: [],
    recentTransactions: [],
    chartData: [],
    paymentMethods: {},
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [vendorsRes, statsRes] = await Promise.all([
        fetch('/api/udhar/vendor/vendors'),
        fetch('/api/udhar/vendor/stats')
      ]);
      
      if (!vendorsRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const vendorsData = await vendorsRes.json();
      const statsData = await statsRes.json();
      setVendors(vendorsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(udhar.vendor.noVendors);
    } finally {
      setLoading(false);
    }
  }, [udhar.vendor.noVendors]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vendor and all transactions?')) return;
    try {
      const res = await fetch(`/api/udhar/vendor/vendors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete vendor');
      toast.success(udhar.transaction.deleted);
      fetchData();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error(udhar.vendorDetails.notFound);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader
          title={udhar.vendor.title}
          description={udhar.vendor.description}
        />
        <div className="flex gap-2">
          <Button onClick={() => window.location.href = '/dashboard/udhar/shopkeeper'} variant="outline" className="shadow-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {udhar.shopkeeper.customers}
          </Button>
          <Button onClick={() => { setEditVendor(null); setModalOpen(true); }} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            {udhar.vendor.addVendor}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        {loading ? (
          <>
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="dashboard" disabled>
                <BarChart3 className="h-4 w-4 mr-2" />
                {udhar.tabs.dashboard}
              </TabsTrigger>
              <TabsTrigger value="vendors" disabled>
                <Store className="h-4 w-4 mr-2" />
                {udhar.tabs.vendors}
              </TabsTrigger>
              <TabsTrigger value="insights" disabled>
                <CreditCard className="h-4 w-4 mr-2" />
                {udhar.tabs.insights}
              </TabsTrigger>
            </TabsList>
            <AnalyticsSkeleton />
          </>
        ) : (
          <>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              {udhar.tabs.dashboard}
            </TabsTrigger>
            <TabsTrigger value="vendors">
              <Store className="h-4 w-4 mr-2" />
              {udhar.tabs.vendors}
            </TabsTrigger>
            <TabsTrigger value="insights">
              <CreditCard className="h-4 w-4 mr-2" />
              {udhar.tabs.insights}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <VendorAnalyticsDashboard stats={stats} />
          </TabsContent>

          <TabsContent value="vendors">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-950/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <Store className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span>{udhar.shopkeeper.vendors}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-3 sm:p-6">
                {loading ? (
                  <CustomerListSkeleton />
                ) : (
                  <VendorList 
                    vendors={vendors} 
                    onEdit={(vendor) => { setEditVendor(vendor); setModalOpen(true); }}
                    onDelete={handleDelete}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {loading ? (
              <InsightsSkeleton />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <VendorTopCreditors creditors={stats.topCreditors} />
                <VendorRecentTransactions transactions={stats.recentTransactions} />
              </div>
            )}
          </TabsContent>
          </>
        )}
      </Tabs>

      <VendorFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        vendor={editVendor}
      />
    </div>
  );
}
