'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, TrendingDown, Users, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { StatsCardSkeleton, ContactCardSkeleton } from '@/components/dashboard/udhar/personal-udhar-skeletons';

export default function PersonalUdharPage() {
  const { user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalLent: 0,
    totalBorrowed: 0,
    netBalance: 0,
    totalContacts: 0,
  });
  const [lentContacts, setLentContacts] = useState([]);
  const [borrowedContacts, setBorrowedContacts] = useState([]);
  const [filteredLent, setFilteredLent] = useState([]);
  const [filteredBorrowed, setFilteredBorrowed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'lent',
    amount: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [searchQuery, lentContacts, borrowedContacts]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/udhar/personal/contacts');
      const data = await res.json();
      
      const lent = data.filter((c: any) => c.type === 'lent');
      const borrowed = data.filter((c: any) => c.type === 'borrowed');
      
      setLentContacts(lent);
      setBorrowedContacts(borrowed);
      
      const totalLent = lent.reduce((sum: number, c: any) => sum + c.remainingAmount, 0);
      const totalBorrowed = borrowed.reduce((sum: number, c: any) => sum + c.remainingAmount, 0);
      
      setStats({
        totalLent,
        totalBorrowed,
        netBalance: totalLent - totalBorrowed,
        totalContacts: data.length,
      });
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    const query = searchQuery.toLowerCase();
    setFilteredLent(lentContacts.filter((c: any) => 
      c.name.toLowerCase().includes(query) || c.phone?.includes(query)
    ));
    setFilteredBorrowed(borrowedContacts.filter((c: any) => 
      c.name.toLowerCase().includes(query) || c.phone?.includes(query)
    ));
  };

  const handleAddContact = async () => {
    if (!formData.name || !formData.amount) {
      toast.error('Name and amount are required');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > 10000000) {
      toast.error('Amount is too large');
      return;
    }

    try {
      const res = await fetch('/api/udhar/personal/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Contact added successfully');
        setIsDialogOpen(false);
        setFormData({ name: '', phone: '', email: '', type: 'lent', amount: '', notes: '' });
        fetchData();
      } else {
        toast.error(data.error || 'Failed to add contact');
      }
    } catch (error) {
      toast.error('Failed to add contact');
    }
  };

  const handleExportAll = async () => {
    try {
      const res = await fetch('/api/udhar/personal/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'personal_udhar_report.csv';
      a.click();
      toast.success('Exported successfully');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Personal Udhar</h2>
          <p className="text-muted-foreground">
            Track personal loans & debts efficiently
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>
                Add someone you lent money to or borrowed from
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Transaction Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lent">I Lent Money (They owe me)</SelectItem>
                    <SelectItem value="borrowed">I Borrowed Money (I owe them)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Add any notes (optional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddContact}>
                Add Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Money Lent</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">₹{stats.totalLent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">You will receive</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Money Borrowed</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">₹{stats.totalBorrowed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">You need to pay</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{Math.abs(stats.netBalance).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.netBalance >= 0 ? 'In your favor' : 'You owe'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalContacts}</div>
                <p className="text-xs text-muted-foreground mt-1">Active contacts</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Manage your personal loans and debts</CardDescription>
            </div>
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lent" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="lent" className="relative">
                  Money Lent
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {lentContacts.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="borrowed" className="relative">
                  Money Borrowed
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                    {borrowedContacts.length}
                  </span>
                </TabsTrigger>
              </TabsList>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <TabsContent value="lent" className="space-y-4">
              {loading ? (
                <>
                  <ContactCardSkeleton />
                  <ContactCardSkeleton />
                  <ContactCardSkeleton />
                </>
              ) : filteredLent.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <TrendingUp className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      {searchQuery ? 'No contacts found' : 'No money lent yet'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery ? 'Try a different search term' : 'Add someone you lent money to'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredLent.map((contact: any) => (
                  <Card 
                    key={contact._id} 
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/udhar/personal/contacts/${contact._id}`)}
                  >
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        {contact.phone && (
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xl font-bold text-green-500">
                          ₹{contact.remainingAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          of ₹{contact.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="borrowed" className="space-y-4">
              {loading ? (
                <>
                  <ContactCardSkeleton />
                  <ContactCardSkeleton />
                  <ContactCardSkeleton />
                </>
              ) : filteredBorrowed.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <TrendingDown className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      {searchQuery ? 'No contacts found' : 'No money borrowed yet'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {searchQuery ? 'Try a different search term' : 'Add someone you borrowed money from'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredBorrowed.map((contact: any) => (
                  <Card 
                    key={contact._id} 
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/udhar/personal/contacts/${contact._id}`)}
                  >
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        {contact.phone && (
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xl font-bold text-red-500">
                          ₹{contact.remainingAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          of ₹{contact.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
