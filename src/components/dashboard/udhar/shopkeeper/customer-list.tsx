'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Trash2, Phone, MapPin, Search, ArrowUpDown, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

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
  const { udhar } = useDashboardTranslations();
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
        {udhar.shopkeeper.noOutstanding}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search by ${udhar.customer.name.toLowerCase()} or ${udhar.customer.phone.toLowerCase()}...`}
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
          <p className="text-muted-foreground">{udhar.customer.notFound}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedCustomers.map((customer) => (
            <Card 
              key={customer._id} 
              className="border-0 py-2 sm:py-3 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-card to-card/50"
            >
              <CardContent className="px-2 py-1">
                <div className="flex items-center justify-between gap-2">
                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/10">
                        <span className="text-sm font-bold text-primary">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {customer.totalOutstanding > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base truncate mb-0.5">{customer.name}</h3>
                      {/* Hide phone/address on mobile, show on md+ */}
                      <div className="hidden md:flex md:flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </span>
                        {customer.address && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3" />
                            {customer.address}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badge + Actions */}
                  <div className="flex items-center gap-1.5">
                    <Badge 
                      variant={customer.totalOutstanding > 0 ? 'destructive' : 'secondary'}
                      className="text-xs sm:text-sm px-2 py-0.5 font-semibold shadow-sm"
                    >
                      ₹{customer.totalOutstanding}
                    </Badge>
                    <div className="flex items-center gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/dashboard/udhar/shopkeeper/${customer._id}`)}
                        title={udhar.actions.viewDetails}
                        className="hover:bg-primary/10 h-7 w-7 p-0"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(customer)}
                        title={udhar.actions.edit}
                        className="hover:bg-blue-500/10 h-7 w-7 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onDelete(customer._id)}
                        title={udhar.actions.delete}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
