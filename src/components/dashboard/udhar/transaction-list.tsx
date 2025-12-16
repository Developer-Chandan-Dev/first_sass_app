'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart, Wallet, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  _id: string;
  type: 'purchase' | 'payment';
  amount: number;
  paidAmount: number;
  description: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction._id} className="border-0 shadow-sm hover:shadow-md transition-all">
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
                  <p className="font-semibold text-sm md:text-base truncate">{transaction.description}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </p>
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
                  {transaction.type === 'purchase' && transaction.paidAmount > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Paid: ₹{transaction.paidAmount}
                    </p>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onDelete(transaction._id)}
                  className="hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
