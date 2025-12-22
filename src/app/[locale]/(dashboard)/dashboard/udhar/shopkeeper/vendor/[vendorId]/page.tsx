'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VendorTransactionModal } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-transaction-modal';
import { TransactionList } from '@/components/dashboard/udhar/shopkeeper/transaction-list';
import { ArrowLeft, Plus, Wallet, Phone, MapPin, CreditCard, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Vendor {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalOwed: number;
}

interface Transaction {
  _id: string;
  type: 'purchase' | 'payment';
  amount: number;
  paidAmount: number;
  description: string;
  vendorId: string;
  items?: { name: string; quantity: number; price: number }[];
  paymentMethod?: 'cash' | 'upi' | 'card' | 'other';
  date: string;
  dueDate?: string;
  status?: 'completed' | 'pending';
  remainingAmount?: number;
}

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.vendorId as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'purchase' | 'payment'>('purchase');

  const fetchData = async () => {
    try {
      const [vendorRes, transactionsRes] = await Promise.all([
        fetch(`/api/udhar/vendor/vendors/${vendorId}`),
        fetch(`/api/udhar/vendor/transactions?vendorId=${vendorId}`)
      ]);
      
      if (!vendorRes.ok || !transactionsRes.ok) throw new Error('Failed to fetch data');
      
      const vendorData = await vendorRes.json();
      const transactionsData = await transactionsRes.json();
      
      setVendor(vendorData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/udhar/vendor/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete transaction');
      toast.success('Transaction deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return <div className="p-8 text-center">Vendor not found</div>;
  }

  // Calculate totals:
  // Purchases: Sum of all purchase amounts
  // Payments: Sum of all payment transactions (now includes auto-created payments)
  const totalPurchases = transactions
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalPayments = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  // Map vendor transactions to match TransactionList interface
  const mappedTransactions = transactions.map(t => ({
    ...t,
    customerId: t.vendorId
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="shadow-sm">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{vendor.name}</h1>
          <p className="text-sm text-muted-foreground truncate">Vendor details</p>
        </div>
      </div>

      {/* Vendor Info Card */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-400" />
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-950/10 flex items-center justify-center ring-4 ring-orange-100 dark:ring-orange-900/20">
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {vendor.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold truncate">{vendor.name}</h2>
              <div className="flex flex-col gap-1 text-muted-foreground">
                <span className="flex items-center gap-1 text-sm truncate">
                  <Phone className="h-3 w-3" />
                  {vendor.phone}
                </span>
                {vendor.address && (
                  <span className="text-sm flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3" />
                    {vendor.address}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Owed</p>
              <Badge 
                variant={vendor.totalOwed > 0 ? 'destructive' : 'secondary'} 
                className="text-xl px-4 py-2 shadow-sm"
              >
                ₹{vendor.totalOwed.toLocaleString()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">Purchases</p>
                <p className="text-base font-bold truncate">₹{totalPurchases.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20">
                <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">Payments</p>
                <p className="text-base font-bold truncate">₹{totalPayments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">Total</p>
                <p className="text-base font-bold truncate">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => { setModalType('purchase'); setModalOpen(true); }} 
          className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-primary to-primary/90 text-xs sm:text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Purchase
        </Button>
        <Button 
          onClick={() => { setModalType('payment'); setModalOpen(true); }} 
          variant="outline" 
          className="shadow-sm"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </div>

      {/* Transactions */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <span>Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <TransactionList 
            transactions={mappedTransactions} 
            onDelete={handleDeleteTransaction}
          />
        </CardContent>
      </Card>

      <VendorTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        vendorId={vendorId}
        type={modalType}
      />
    </div>
  );
}
