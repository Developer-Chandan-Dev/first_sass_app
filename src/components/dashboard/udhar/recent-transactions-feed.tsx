'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ShoppingCart, Wallet } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDashboardTranslations } from '@/hooks/i18n/useDashboardTranslations';

interface Transaction {
  _id: string;
  type: 'purchase' | 'payment';
  amount: number;
  description: string;
  date: string;
}

interface RecentTransactionsFeedProps {
  transactions: Transaction[];
}

export function RecentTransactionsFeed({ transactions }: RecentTransactionsFeedProps) {
  const { udhar } = useDashboardTranslations();

  if (transactions.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            {udhar.shopkeeper.recentActivity}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">{udhar.shopkeeper.noRecentTransactions}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          {udhar.shopkeeper.recentActivity}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className={`p-2 rounded-lg ${
              transaction.type === 'purchase' 
                ? 'bg-red-100 dark:bg-red-900/20' 
                : 'bg-green-100 dark:bg-green-900/20'
            }`}>
              {transaction.type === 'purchase' ? (
                <ShoppingCart className="h-4 w-4 text-red-600 dark:text-red-400" />
              ) : (
                <Wallet className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
              </p>
            </div>
            <Badge variant={transaction.type === 'purchase' ? 'destructive' : 'default'} className="font-bold">
              {transaction.type === 'purchase' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
