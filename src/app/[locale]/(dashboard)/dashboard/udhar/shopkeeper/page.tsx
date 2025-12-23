'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { CustomerList } from '@/components/dashboard/udhar/shopkeeper/customer-list';
import { CustomerFormModal } from '@/components/dashboard/udhar/shopkeeper/customer-form-modal';
import { AnalyticsDashboard } from '@/components/dashboard/udhar/analytics-dashboard';
import { TopDebtors } from '@/components/dashboard/udhar/top-debtors';
import { RecentTransactionsFeed } from '@/components/dashboard/udhar/recent-transactions-feed';
import { AnalyticsSkeleton, InsightsSkeleton, CustomerListSkeleton } from '@/components/dashboard/udhar/skeletons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, BarChart3, CreditCard, Store, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalOutstanding: number;
}

interface Stats {
  totalCustomers: number;
  totalOutstanding: number;
  highRiskCustomers: number;
  todayCollections: number;
  weekCollections: number;
  monthCollections: number;
  todayPurchases: number;
  weekPurchases: number;
  monthPurchases: number;
  topDebtors: { _id: string; name: string; phone: string; outstanding: number }[];
  recentTransactions: { _id: string; type: 'purchase' | 'payment'; amount: number; description: string; date: string }[];
  chartData: { date: string; purchases: number; payments: number }[];
  paymentMethods: Record<string, number>;
}

export default function ShopkeeperUdharPage() {
  const { udhar } = useDashboardTranslations();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalOutstanding: 0,
    highRiskCustomers: 0,
    todayCollections: 0,
    weekCollections: 0,
    monthCollections: 0,
    todayPurchases: 0,
    weekPurchases: 0,
    monthPurchases: 0,
    topDebtors: [],
    recentTransactions: [],
    chartData: [],
    paymentMethods: {},
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [customersRes, statsRes] = await Promise.all([
        fetch('/api/udhar/shopkeeper/customers'),
        fetch('/api/udhar/shopkeeper/stats')
      ]);
      
      if (!customersRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const customersData = await customersRes.json();
      const statsData = await statsRes.json();
      setCustomers(customersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer and all transactions?')) return;
    try {
      const res = await fetch(`/api/udhar/shopkeeper/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete customer');
      }
      toast.success(udhar.transaction.deleted);
      fetchData();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader
          title={udhar.shopkeeper.title}
          description={udhar.shopkeeper.description}
        />
        <div className="flex gap-2">
          <Button onClick={() => window.location.href = '/dashboard/udhar/shopkeeper/vendor'} variant="outline" className="shadow-sm">
            <Store className="h-4 w-4 mr-2" />
            {udhar.shopkeeper.vendors}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button onClick={() => { setEditCustomer(null); setModalOpen(true); }} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            {udhar.shopkeeper.addCustomer}
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
              <TabsTrigger value="customers" disabled>
                <Users className="h-4 w-4 mr-2" />
                {udhar.tabs.customers}
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
            <TabsTrigger value="customers">
              <Users className="h-4 w-4 mr-2" />
              {udhar.tabs.customers}
            </TabsTrigger>
            <TabsTrigger value="insights">
              <CreditCard className="h-4 w-4 mr-2" />
              {udhar.tabs.insights}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <AnalyticsDashboard stats={stats} />
          </TabsContent>

          <TabsContent value="customers">
            <Card className="border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span>{udhar.shopkeeper.customers}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-3 sm:p-6">
                {loading ? (
                  <CustomerListSkeleton />
                ) : (
                  <CustomerList 
                    customers={customers} 
                    onEdit={(customer) => { setEditCustomer(customer); setModalOpen(true); }}
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
                <TopDebtors debtors={stats.topDebtors} />
                <RecentTransactionsFeed transactions={stats.recentTransactions} />
              </div>
            )}
          </TabsContent>
          </>
        )}
      </Tabs>

      <CustomerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        customer={editCustomer}
      />
    </div>
  );
}