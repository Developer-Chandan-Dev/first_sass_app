'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RecentExpense {
  _id: string;
  amount: number;
  category: string;
  reason: string;
  date: string;
  createdAt: string;
}

const categoryIcons: { [key: string]: string } = {
  'Food': '🍽️',
  'Travel': '✈️',
  'Shopping': '🛒',
  'Bills': '💡',
  'Others': '📝',
  'Entertainment': '🎬',
  'Transportation': '🚗',
  'Health': '🏥',
  'Education': '📚',
  'Groceries': '🥬'
};

export function RecentActivity() {
  const [expenses, setExpenses] = useState<RecentExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      try {
        const response = await fetch('/api/expenses?type=free&limit=5&page=1');
        if (response.ok) {
          const data = await response.json();
          setExpenses(data.expenses || []);
        }
      } catch (error) {
        console.error('Failed to fetch recent expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentExpenses();
  }, []);

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-3 animate-pulse">
            <div className="w-9 h-9 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No recent expenses</p>
        <p className="text-sm">Add your first expense to see activity here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div key={expense._id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {categoryIcons[expense.category] || '💰'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{expense.reason}</p>
              <p className="text-xs text-muted-foreground">
                {getTimeAgo(expense.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-red-600">
              -₹{expense.amount.toLocaleString()}
            </p>
            <Badge variant="secondary" className="text-xs">
              {expense.category}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}