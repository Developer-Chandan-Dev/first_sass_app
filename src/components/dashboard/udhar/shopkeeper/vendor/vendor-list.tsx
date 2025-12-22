'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Eye, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Vendor {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalOwed: number;
}

interface VendorListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorList({ vendors, onEdit, onDelete }: VendorListProps) {
  const router = useRouter();

  if (vendors.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Store className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No vendors yet</p>
        <p className="text-sm text-muted-foreground">Add your first vendor to start tracking</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vendors.map((vendor) => (
        <Card key={vendor._id} className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => router.push(`/dashboard/udhar/shopkeeper/vendor/${vendor._id}`)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-950/10 flex items-center justify-center ring-2 ring-orange-100 dark:ring-orange-900/20 flex-shrink-0">
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {vendor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{vendor.phone}</p>
                  {vendor.address && <p className="text-xs text-muted-foreground truncate">{vendor.address}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <Badge variant={vendor.totalOwed > 0 ? 'destructive' : 'secondary'} className="shadow-sm">
                    ₹{vendor.totalOwed.toLocaleString()}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">You Owe</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/udhar/shopkeeper/vendor/${vendor._id}`); }}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(vendor); }}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(vendor._id); }} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
