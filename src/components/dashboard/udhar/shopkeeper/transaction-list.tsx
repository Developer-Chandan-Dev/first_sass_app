'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Trash2, ShoppingCart, Wallet, Edit, Eye, Package, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

interface Transaction {
  _id: string;
  type: 'purchase' | 'payment';
  amount: number;
  description: string;
  customerId?: string;
  items?: { name: string; quantity: number; price: number }[];
  paymentMethod?: 'cash' | 'upi' | 'card' | 'other';
  date: string;
  dueDate?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const { udhar, common } = useDashboardTranslations();
  const [viewItems, setViewItems] = useState<{ name: string; quantity: number; price: number }[] | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; transactionId: string | null }>({ open: false, transactionId: null });

  const purchases = transactions.filter(t => t.type === 'purchase');
  const payments = transactions.filter(t => t.type === 'payment');

  const renderTransaction = (transaction: Transaction) => (
    <Card key={transaction._id} className="border-0 shadow-sm hover:shadow-md transition-all py-0">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className={`p-2 md:p-2.5 rounded-xl shadow-sm ${
              transaction.type === 'purchase' 
                ? 'bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-950/10' 
                : 'bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-950/10'
            }`}>
              {transaction.type === 'purchase' ? (
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-red-600 dark:text-red-400" />
              ) : (
                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm md:text-base truncate">{transaction.description}</p>
                {transaction.items && transaction.items.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewItems(transaction.items!)}
                    className="hidden sm:flex h-6 px-2 text-xs hover:bg-primary/10"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Items
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                {transaction.dueDate && transaction.type === 'purchase' && (
                  <Badge variant="outline" className="text-xs">
                    📅 Due: {format(new Date(transaction.dueDate), 'MMM dd')}
                  </Badge>
                )}
                {transaction.paymentMethod && (
                  <Badge variant="outline" className="text-xs">
                    {transaction.paymentMethod === 'cash' && '💵'}
                    {transaction.paymentMethod === 'upi' && '📱'}
                    {transaction.paymentMethod === 'card' && '💳'}
                    {transaction.paymentMethod === 'other' && '🔄'}
                    {' '}{transaction.paymentMethod.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="text-right">
              <Badge 
                variant={transaction.type === 'purchase' ? 'destructive' : 'default'}
                className="shadow-sm font-semibold"
              >
                {transaction.type === 'purchase' ? '-' : '+'}₹{transaction.amount}
              </Badge>
            </div>
            {/* Desktop Actions */}
            <div className="hidden sm:flex gap-1">
              {onEdit && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onEdit(transaction)}
                  className="hover:bg-primary/10 h-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setDeleteDialog({ open: true, transactionId: transaction._id })}
                className="hover:bg-destructive/10 text-destructive h-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {/* Mobile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="sm:hidden">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {transaction.items && transaction.items.length > 0 && (
                  <DropdownMenuItem onClick={() => setViewItems(transaction.items!)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Items
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(transaction)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setDeleteDialog({ open: true, transactionId: transaction._id })} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchases" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            {udhar.transaction.purchases}
            <Badge variant="secondary" className="ml-1">{purchases.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <Wallet className="h-4 w-4" />
            {udhar.transaction.payments}
            <Badge variant="secondary" className="ml-1">{payments.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="mt-4">
          {purchases.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{udhar.transaction.noPurchases}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {purchases.map(renderTransaction)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
              <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{udhar.transaction.noPayments}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {payments.map(renderTransaction)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Items Dialog */}
      <Dialog open={!!viewItems} onOpenChange={() => setViewItems(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {udhar.transaction.purchase} Items
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {viewItems?.map((item, idx) => (
              <Card key={idx} className="border shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × ₹{(item.price / item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{item.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{udhar.transaction.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {viewItems && (
              <div className="pt-2 border-t mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{udhar.transaction.total}:</span>
                  <span className="font-bold text-lg">₹{viewItems.reduce((sum, item) => sum + item.price, 0)}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, transactionId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{udhar.transaction.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {udhar.transaction.deleteMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{common.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteDialog.transactionId) {
                  onDelete(deleteDialog.transactionId);
                  setDeleteDialog({ open: false, transactionId: null });
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
