'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/lib/redux/hooks';

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

interface RecentActivityProps {
  expenseType?: 'free' | 'budget';
}

export function RecentActivity({ expenseType = 'free' }: RecentActivityProps) {
  const { free, budget, loading } = useAppSelector((state) => state.overview);

  const expenses = expenseType === 'free' ? free.expenses : budget.expenses;

  // Removed unnecessary API call - data comes from parent component

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

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-2 sm:space-x-3 animate-pulse"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-1 sm:space-y-2">
              <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
              <div className="h-2 sm:h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-muted-foreground">
        <p className="text-sm">No recent expenses</p>
        <p className="text-xs sm:text-sm">
          Add your first expense to see activity here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full max-w-full overflow-hidden">
      {expenses.map((expense) => (
        <div
          key={expense._id}
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
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-medium text-red-600 whitespace-nowrap">
              -₹{expense?.amount?.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
