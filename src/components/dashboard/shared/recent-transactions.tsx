'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppTranslations } from '@/hooks/useTranslation';

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
  const { free, budget, loading } = useSelector((state: RootState) => state.overview);
  const { expenses } = useAppTranslations();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return expenses.justNow;
    if (diffInHours < 24) return `${diffInHours} ${expenses.hoursAgo}`;
    if (diffInDays === 1) return expenses.dayAgo;
    return `${diffInDays} ${expenses.daysAgo}`;
  };

  // Combine and sort recent expenses from both free and budget
  const allExpenses = [...free.expenses, ...budget.expenses]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const transactions = allExpenses.map((expense) => ({
    id: expense._id,
    merchant: expense.reason || 'Expense',
    category: expense.category,
    amount: -expense.amount, // Negative for expenses
    date: formatTimeAgo(expense.createdAt),
    icon: getCategoryIcon(expense.category),
    type: expense.type,
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{expenses.recentTransactions}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                <div className="flex gap-1">
                  <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-10 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{expenses.recentTransactions}</CardTitle>
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
            {expenses.noRecentTransactions}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
