'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2, Phone, MapPin, Search, ArrowUpDown, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalOutstanding: number;
}

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerList({ customers, onEdit, onDelete }: CustomerListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');

  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.includes(search)
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'amount-high':
          return b.totalOutstanding - a.totalOutstanding;
        case 'amount-low':
          return a.totalOutstanding - b.totalOutstanding;
        default:
          return 0;
      }
    });

    return filtered;
  }, [customers, search, sortBy]);

  if (customers.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No customers yet. Add your first customer to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="amount-high">Amount (High-Low)</SelectItem>
            <SelectItem value="amount-low">Amount (Low-High)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customer List */}
      {filteredAndSortedCustomers.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No customers found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedCustomers.map((customer) => (
            <Card 
              key={customer._id} 
              className="border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-card to-card/50"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/10">
                        <span className="text-lg font-bold text-primary">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {customer.totalOutstanding > 0 && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate mb-1">{customer.name}</h3>
                      {/* Hide phone/address on mobile, show on md+ */}
                      <div className="hidden md:flex md:flex-col lg:flex-row lg:items-center gap-1 lg:gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          {customer.phone}
                        </span>
                        {customer.address && (
                          <span className="flex items-center gap-1.5 truncate">
                            <MapPin className="h-3.5 w-3.5" />
                            {customer.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badge + Actions */}
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={customer.totalOutstanding > 0 ? 'destructive' : 'secondary'}
                      className="text-sm px-3 py-1.5 font-semibold shadow-sm"
                    >
                      ₹{customer.totalOutstanding}
                    </Badge>
                    <div className="flex items-center gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/dashboard/udhar/shopkeeper/${customer._id}`)}
                        title="View Details"
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(customer)}
                        title="Edit Customer"
                        className="hover:bg-blue-500/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onDelete(customer._id)}
                        title="Delete Customer"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground text-center">
        Showing {filteredAndSortedCustomers.length} of {customers.length} customers
      </p>
    </div>
  );
}
