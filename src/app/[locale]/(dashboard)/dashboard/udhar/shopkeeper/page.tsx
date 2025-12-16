'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { CustomerList } from '@/components/dashboard/udhar/customer-list';
import { CustomerFormModal } from '@/components/dashboard/udhar/customer-form-modal';
import { 
  Users, 
  Plus,
  BarChart3,
  Calendar,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalOutstanding: number;
}

export default function ShopkeeperUdharPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState({ totalCustomers: 0, totalOutstanding: 0, monthPurchases: 0, monthCollections: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [customersRes, statsRes] = await Promise.all([
        fetch('/api/udhar/customers'),
        fetch('/api/udhar/stats')
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
      const res = await fetch(`/api/udhar/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete customer');
      }
      toast.success('Customer deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const statsData = [
    { 
      title: 'Total Customers', 
      value: stats.totalCustomers.toString(), 
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      bgDark: 'dark:bg-blue-950/20'
    },
    { 
      title: 'Outstanding Amount', 
      value: `₹${stats.totalOutstanding}`, 
      icon: CreditCard,
      gradient: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      bgDark: 'dark:bg-red-950/20'
    },
    { 
      title: 'This Month Sales', 
      value: `₹${stats.monthPurchases}`, 
      icon: Calendar,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      bgDark: 'dark:bg-emerald-950/20'
    },
    { 
      title: 'Collections', 
      value: `₹${stats.monthCollections}`, 
      icon: BarChart3,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      bgDark: 'dark:bg-purple-950/20'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shopkeeper Udhar Management"
        description="Manage your shop's udhar records, customers, and payments efficiently"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className={`h-2 bg-gradient-to-r ${stat.gradient}`} />
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                      <p className="text-lg md:text-2xl font-bold">{loading ? '...' : stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgLight} ${stat.bgDark}`}>
                      <Icon className={`h-6 w-6 md:h-7 md:w-7 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Customers Section */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span>Customers</span>
            </CardTitle>
            <Button onClick={() => { setEditCustomer(null); setModalOpen(true); }} className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : (
            <CustomerList 
              customers={customers} 
              onEdit={(customer) => { setEditCustomer(customer); setModalOpen(true); }}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <CustomerFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        customer={editCustomer}
      />
    </div>
  );
}