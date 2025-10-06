'use client';

import { useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchExpenses } from '@/lib/redux/expense/expenseSlice';


const categoryIcons: { [key: string]: string } = {
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

export function RecentActivityOverview() {
  const dispatch = useAppDispatch();
  const { freeExpenses, budgetExpenses, lastUpdated } = useAppSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    // Fetch recent expenses from both types
    dispatch(
      fetchExpenses({
        expenseType: 'free',
        filters: {
          period: 'all',
          category: '',
          startDate: '',
          endDate: '',
          search: '',
          budgetId: '',
          isRecurring: '',
          sortBy: 'date',
          sortOrder: 'desc',
        },
        page: 1,
        pageSize: 50,
      })
    );
    dispatch(
      fetchExpenses({
        expenseType: 'budget',
        filters: {
          period: 'all',
          category: '',
          startDate: '',
          endDate: '',
          search: '',
          budgetId: '',
          isRecurring: '',
          sortBy: 'date',
          sortOrder: 'desc',
        },
        page: 1,
        pageSize: 50,
      })
    );
  }, [dispatch]);

  // Re-render when expenses change (triggered by lastUpdated)
  useEffect(() => {
    // This effect runs when lastUpdated changes, forcing component re-render
  }, [lastUpdated]);

  // Combine and sort by creation date (most recent first)
  const allExpenses = [...freeExpenses, ...budgetExpenses]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6); // Show only 6 most recent

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const getExpenseTypeColor = (type: string) => {
    return type === 'budget' ? 'bg-green-500' : 'bg-blue-500';
  };

  if (allExpenses.length === 0) {
    return (
      <div className="space-y-4">
        {[
          {
            category: 'Food & Dining',
            amount: 450,
            time: '2 hours ago',
            color: 'bg-orange-500',
            type: 'free',
          },
          {
            category: 'Transport',
            amount: 120,
            time: '5 hours ago',
            color: 'bg-blue-500',
            type: 'budget',
          },
          {
            category: 'Shopping',
            amount: 2300,
            time: '1 day ago',
            color: 'bg-purple-500',
            type: 'free',
          },
        ].map((activity, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
              <div>
                <p className="font-medium">{activity.category}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-600">
                -₹{activity.amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full max-w-full overflow-hidden">
      {allExpenses.map((expense, index) => (
        <div
          key={`${expense._id}-${index}-${expense.createdAt}`}
          className="flex items-center gap-2 w-full min-w-0"
        >
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
            <AvatarFallback className="text-xs">
              {categoryIcons[expense.category] || '💰'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-xs sm:text-sm font-medium truncate max-w-full">
              {expense.reason}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex-shrink-0">
                {getTimeAgo(expense.createdAt)}
              </span>
              <Badge
                variant="secondary"
                className="text-xs px-1 py-0 h-4 truncate max-w-[60px]"
              >
                {expense.category}
              </Badge>
              <div
                className={`w-2 h-2 rounded-full ${getExpenseTypeColor(expense.type)}`}
                title={
                  expense.type === 'budget' ? 'Budget Expense' : 'Free Expense'
                }
              ></div>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-medium text-red-600 whitespace-nowrap">
              -₹{expense.amount.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
