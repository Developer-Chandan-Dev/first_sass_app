'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/dashboard/layout/page-header';
import { TransactionList } from '@/components/dashboard/udhar/transaction-list';
import { TransactionModal } from '@/components/dashboard/udhar/transaction-modal';
import { ArrowLeft, Plus, Wallet, Phone, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalOutstanding: number;
}

interface Transaction {
  _id: string;
  type: 'purchase' | 'payment';
  amount: number;
  paidAmount: number;
  description: string;
  date: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.customerId as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'purchase' | 'payment'>('purchase');

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/udhar/customers/${customerId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch customer');
      }
      const data = await res.json();
      setCustomer(data.customer);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast.error('Failed to load customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      const res = await fetch(`/api/udhar/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Failed to delete transaction');
      }
      toast.success('Transaction deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center">Customer not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="shadow-sm">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={customer.name}
          description="Customer details and transaction history"
        />
      </div>

      {/* Customer Info Card */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-4 ring-primary/10">
                <span className="text-2xl font-bold text-primary">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold">{customer.name}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </span>
                  {customer.address && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {customer.address}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between md:block md:text-right">
              <p className="text-sm text-muted-foreground mb-2">Outstanding Balance</p>
              <Badge 
                variant={customer.totalOutstanding > 0 ? 'destructive' : 'secondary'} 
                className="text-xl px-4 py-2 shadow-sm"
              >
                ₹{customer.totalOutstanding}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          onClick={() => { setModalType('purchase'); setModalOpen(true); }} 
          className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-primary to-primary/90"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Purchase
        </Button>
        <Button 
          onClick={() => { setModalType('payment'); setModalOpen(true); }} 
          variant="outline" 
          className="shadow-sm hover:shadow-md transition-shadow"
          size="lg"
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
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
        </CardContent>
      </Card>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        customerId={customerId}
        type={modalType}
      />
    </div>
  );
}
