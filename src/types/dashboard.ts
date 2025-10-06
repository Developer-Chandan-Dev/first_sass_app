export interface ExpenseItem {
  _id: string;
  amount: number;
  category: string;
  reason: string;
  date: string;
  createdAt: string;
  type: 'free' | 'budget';
  budgetId?: string;
  budgetName?: string;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  affectsBalance?: boolean;
  incomeId?: string;
}

export interface ExpenseFilters {
  period: 'all' | 'today' | 'week' | 'month';
  category: string;
  startDate: string;
  endDate: string;
  search: string;
  budgetId: string;
  isRecurring: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface ExpenseFormData {
  amount: number;
  category: string;
  reason: string;
  date: string;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  affectsBalance: boolean;
  incomeId?: string;
}

export interface ConnectedIncome {
  _id: string;
  source: string;
  description: string;
  amount: number;
}

export interface CategoryBreakdown {
  _id: string;
  total: number;
  count: number;
}

export interface StatsData {
  totalSpent: number;
  totalExpenses: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyChange: number;
  expenseChange: number;
}

export interface ApiError {
  error: string;
  code?: string;
  statusCode?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ComponentError {
  message: string;
  component: string;
  timestamp: Date;
}