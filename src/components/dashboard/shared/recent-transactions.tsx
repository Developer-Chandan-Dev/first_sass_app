'use client';

import { useSelector } from 'react-redux';
import { useMemo, useCallback } from 'react';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle, Plus, Eye } from 'lucide-react';
import { useDashboardTranslations } from '@/hooks/i18n';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLocale } from '@/contexts/locale-context';

// Transactions skeleton component
function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-muted rounded-full" />
            <div className="space-y-1">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="flex gap-1">
              <div className="h-5 w-12 bg-muted rounded" />
              <div className="h-5 w-10 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'Food & Dining': '🍽️',
    Transportation: '🚗',
    Entertainment: '🎬',
    Groceries: '🛒',
    Shopping: '🛍️',
    Healthcare: '🏥',
    Utilities: '⚡',
    Education: '📚',
    Travel: '✈️',
    Other: '💳',
  };
  return icons[category] || '💳';
};

export function RecentTransactions() {
  const { free, budget, loading, error } = useSelector(
    (state: RootState) => state.overview
  );
  const { expenses, dashboard } = useDashboardTranslations();
  const { getLocalizedPath } = useLocale();

  const formatTimeAgo = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInHours < 1) return expenses?.justNow || 'Just now';
      if (diffInHours < 24)
        return `${diffInHours} ${expenses?.hoursAgo || 'hours ago'}`;
      if (diffInDays === 1) return expenses?.dayAgo || '1 day ago';
      return `${diffInDays} ${expenses?.daysAgo || 'days ago'}`;
    },
    [expenses?.justNow, expenses?.hoursAgo, expenses?.dayAgo, expenses?.daysAgo]
  );

  // Memoized expense processing
  const allExpenses = useMemo(() => {
    return [...(free?.expenses || []), ...(budget?.expenses || [])]
      .filter((expense) => expense && expense.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [free?.expenses, budget?.expenses]);

  const transactions = useMemo(
    () =>
      allExpenses.map((expense) => ({
        id: expense._id,
        merchant: expense.reason || 'Expense',
        category: expense.category || 'Other',
        amount: -Math.abs(expense.amount || 0),
        date: formatTimeAgo(expense.createdAt),
        icon: getCategoryIcon(expense.category || 'Other'),
        type: expense.type || 'free',
      })),
    [allExpenses, formatTimeAgo]
  );

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {expenses?.recentTransactions || 'Recent Transactions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load recent transactions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {expenses?.recentTransactions || 'Recent Transactions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>
          {expenses?.recentTransactions || 'Recent Transactions'}
        </CardTitle>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={getLocalizedPath('/dashboard/expenses')}>
              <Eye className="h-4 w-4 mr-1" />
              View All
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={getLocalizedPath('/dashboard/expenses/free')}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{transaction.icon}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{transaction.merchant}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">
                  -₹{Math.abs(transaction.amount).toFixed(2)}
                </p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {transaction.category}
                  </Badge>
                  <Badge
                    variant={
                      transaction.type === 'free' ? 'outline' : 'default'
                    }
                    className="text-xs"
                  >
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {expenses?.noRecentTransactions || 'No recent transactions'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
