'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Download, Calendar, CreditCard, Receipt, Percent, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { PersonalContact, PersonalTransaction } from '@/types/personal-udhar';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.contactId as string;
  
  const [contact, setContact] = useState<PersonalContact | null>(null);
  const [transactions, setTransactions] = useState<PersonalTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUdharDialogOpen, setIsUdharDialogOpen] = useState(false);
  const [isInterestDialogOpen, setIsInterestDialogOpen] = useState(false);
  const [udharAmount, setUdharAmount] = useState('');
  const [udharDescription, setUdharDescription] = useState('');
  const [interestAmount, setInterestAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [interestDescription, setInterestDescription] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId]);

  const fetchData = async () => {
    try {
      const [contactRes, transactionsRes] = await Promise.all([
        fetch(`/api/udhar/personal/contacts/${contactId}`),
        fetch(`/api/udhar/personal/contacts/${contactId}/transactions`),
      ]);

      const contactData: PersonalContact = await contactRes.json();
      const transactionsData: PersonalTransaction[] = await transactionsRes.json();

      setContact(contactData);
      setTransactions(transactionsData);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!contact) return;
    
    const amount = parseFloat(paymentAmount);
    
    if (!paymentAmount || isNaN(amount) || amount <= 0) {
      toast.error('Enter valid amount');
      return;
    }

    if (amount > contact.remainingAmount) {
      toast.error(`Payment cannot exceed remaining amount of ₹${contact.remainingAmount}`);
      return;
    }

    try {
      const res = await fetch(`/api/udhar/personal/contacts/${contactId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'payment',
          amount,
          description: paymentDescription,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Payment recorded');
        setPaymentAmount('');
        setPaymentDescription('');
        setIsDialogOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to record payment');
      }
    } catch {
      toast.error('Failed to record payment');
    }
  };

  const handleAddUdhar = async () => {
    if (!contact) return;
    
    const amount = parseFloat(udharAmount);
    
    if (!udharAmount || isNaN(amount) || amount <= 0) {
      toast.error('Enter valid amount');
      return;
    }

    try {
      const res = await fetch(`/api/udhar/personal/contacts/${contactId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contact.type,
          amount,
          description: udharDescription,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Udhar added successfully');
        setUdharAmount('');
        setUdharDescription('');
        setIsUdharDialogOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to add udhar');
      }
    } catch {
      toast.error('Failed to add udhar');
    }
  };

  const handleAddInterest = async () => {
    if (!contact) return;
    
    const amount = parseFloat(interestAmount);
    
    if (!interestAmount || isNaN(amount) || amount <= 0) {
      toast.error('Enter valid interest amount');
      return;
    }

    try {
      const res = await fetch(`/api/udhar/personal/contacts/${contactId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'interest',
          amount,
          description: interestDescription || `Interest ${interestRate ? `@ ${interestRate}%` : ''}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Interest added successfully');
        setInterestAmount('');
        setInterestRate('');
        setInterestDescription('');
        setIsInterestDialogOpen(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to add interest');
      }
    } catch {
      toast.error('Failed to add interest');
    }
  };

  const handleExport = async () => {
    if (!contact) return;
    
    try {
      const res = await fetch(`/api/udhar/personal/contacts/${contactId}/export`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contact.name}_transactions.csv`;
      a.click();
      toast.success('Exported successfully');
    } catch {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex-1 p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-medium text-muted-foreground">Contact not found</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{contact.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              {contact.phone && (
                <p className="text-sm text-muted-foreground">{contact.phone}</p>
              )}
              {contact.email && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{contact.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Original amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">₹{contact.paidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((contact.paidAmount / contact.totalAmount) * 100).toFixed(1)}% paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${contact.type === 'lent' ? 'text-green-500' : 'text-red-500'}`}>
              ₹{contact.remainingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {contact.type === 'lent' ? 'You will receive' : 'You need to pay'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All payments and transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isUdharDialogOpen} onOpenChange={setIsUdharDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Add Udhar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Udhar</DialogTitle>
                    <DialogDescription>
                      Add additional {contact.type === 'lent' ? 'money lent to' : 'money borrowed from'} {contact.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="udhar-amount">Amount *</Label>
                      <Input
                        id="udhar-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={udharAmount}
                        onChange={(e) => setUdharAmount(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="udhar-description">Description (Optional)</Label>
                      <Textarea
                        id="udhar-description"
                        placeholder="Add a note about this udhar"
                        value={udharDescription}
                        onChange={(e) => setUdharDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsUdharDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUdhar}>
                      Add Udhar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isInterestDialogOpen} onOpenChange={setIsInterestDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Percent className="h-4 w-4 mr-2" />
                    Add Interest
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Interest</DialogTitle>
                    <DialogDescription>
                      Add interest charges to {contact.name}&apos;s account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="interest-rate">Interest Rate % (Optional)</Label>
                      <Input
                        id="interest-rate"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 2.5"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="interest-amount">Interest Amount *</Label>
                      <Input
                        id="interest-amount"
                        type="number"
                        placeholder="Enter interest amount"
                        value={interestAmount}
                        onChange={(e) => setInterestAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Current Total: ₹{contact.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="interest-description">Description (Optional)</Label>
                      <Textarea
                        id="interest-description"
                        placeholder="Add a note about this interest"
                        value={interestDescription}
                        onChange={(e) => setInterestDescription(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsInterestDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddInterest}>
                      Add Interest
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                      Record a payment received from {contact.name}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Remaining: ₹{contact.remainingAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Add a note about this payment"
                        value={paymentDescription}
                        onChange={(e) => setPaymentDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPayment}>
                      Record Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Record a payment to start tracking
                </p>
              </div>
            ) : (
              transactions.map((txn) => (
                <div key={txn._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {txn.type === 'payment' ? 'Payment Received' : txn.type === 'lent' ? 'Money Lent' : 'Money Borrowed'}
                      </p>
                      {txn.type === 'payment' && (
                        <Badge variant="secondary" className="text-xs">Payment</Badge>
                      )}
                    </div>
                    {txn.description && (
                      <p className="text-sm text-muted-foreground">{txn.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(txn.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${txn.type === 'payment' ? 'text-green-500' : ''}`}>
                      {txn.type === 'payment' ? '+' : ''}₹{txn.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

