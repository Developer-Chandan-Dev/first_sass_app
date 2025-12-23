'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VendorTransactionModal } from '@/components/dashboard/udhar/shopkeeper/vendor/vendor-transaction-modal';
import { EditVendorTransactionModal } from '@/components/dashboard/udhar/shopkeeper/vendor/edit-vendor-transaction-modal';
import { TransactionList } from '@/components/dashboard/udhar/shopkeeper/transaction-list';
import { VendorDetailSkeleton } from '@/components/dashboard/udhar/skeletons';
import { ArrowLeft, Plus, Wallet, Phone, MapPin, CreditCard, MessageCircle, PhoneCall, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { toast } from 'sonner';

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
  paidAmount?: number;
  description: string;
  vendorId?: string;
  customerId?: string;
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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
    return <VendorDetailSkeleton />;
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
    <div className="space-y-3 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="shadow-sm h-8 w-8 sm:h-10 sm:w-10">
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">{vendor.name}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">Vendor details</p>
        </div>
      </div>

      {/* Vendor Info Card */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="h-1 sm:h-2 bg-gradient-to-r from-orange-500 to-orange-400" />
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-950/10 flex items-center justify-center ring-2 sm:ring-4 ring-orange-100 dark:ring-orange-900/20 flex-shrink-0">
                <span className="text-base sm:text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {vendor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                <h2 className="text-sm sm:text-lg md:text-2xl font-bold truncate">{vendor.name}</h2>
                <div className="flex flex-col gap-0.5 sm:gap-1 text-muted-foreground">
                  <span className="flex items-center gap-1 text-xs sm:text-sm truncate">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{vendor.phone}</span>
                  </span>
                  {vendor.address && (
                    <span className="text-xs sm:text-sm flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{vendor.address}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-muted-foreground">Total Owed</p>
                <Badge 
                  variant={vendor.totalOwed > 0 ? 'destructive' : 'secondary'} 
                  className="text-sm sm:text-lg md:text-xl px-2 py-1 sm:px-4 sm:py-2 shadow-sm"
                >
                  ₹{vendor.totalOwed.toLocaleString()}
                </Badge>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`tel:${vendor.phone}`)}>
                  <PhoneCall className="h-3 w-3 mr-1" /> Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`https://wa.me/${vendor.phone.replace(/\D/g, '')}?text=Hello ${vendor.name}, regarding our pending payment of ₹${vendor.totalOwed}`)}>
                  <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">Purchases</p>
                <p className="text-sm sm:text-base font-bold truncate">₹{totalPurchases.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/20">
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">Payments</p>
                <p className="text-sm sm:text-base font-bold truncate">₹{totalPayments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">Total</p>
                <p className="text-sm sm:text-base font-bold truncate">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Button 
          onClick={() => { setModalType('purchase'); setModalOpen(true); }} 
          className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-primary to-primary/90 h-9 sm:h-11 text-xs sm:text-sm"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="">New Purchase</span>
        </Button>
        <Button 
          onClick={() => { setModalType('payment'); setModalOpen(true); }} 
          variant="outline" 
          className="shadow-sm hover:shadow-md transition-shadow h-9 sm:h-11 text-xs sm:text-sm"
        >
          <Wallet className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Record </span>Payment
        </Button>
      </div>

      {/* Transactions */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base md:text-lg">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <span className="truncate">Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-3 md:p-6">
          <TransactionList 
            transactions={mappedTransactions} 
            onDelete={handleDeleteTransaction}
            onEdit={(t) => { setEditingTransaction(t); setEditModalOpen(true); }}
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
      <EditVendorTransactionModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditingTransaction(null); }}
        onSuccess={fetchData}
        transaction={editingTransaction}
      />
    </div>
  );
}
