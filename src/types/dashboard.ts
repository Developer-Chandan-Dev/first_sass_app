export interface ExpenseItem {
  _id: string;
  userId?: string;
  amount: number;
  category: string;
  reason: string;
  type: 'free' | 'budget';
  date: string;
  isRecurring: boolean;
  affectsBalance?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  incomeId?: string;
  budgetId?: string;
  budgetName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeType {
  _id?: string;
  userId: string;
  amount: number;
  source: string;
  category: string;
  description: string;
  date: Date;
  isRecurring?: boolean;
  frequency?: string;
  isConnected?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
// 8756210473 = Shiya Ram
export interface TranslationType {
  expenses?: {
    form?: {
      validation?: {
        amountGreaterThanZero?: string;
        categoryRequired?: string;
        reasonRequired?: string;
      };
    };
    updateSuccess?: string;
    editExpense?: string;
    selectCategory?: string;
    reason?: string;
    reasonPlaceholder?: string;
    reduceFromBalance?: string;
    deductFromConnectedIncome?: string;
    selectIncomeSource?: string;
    chooseIncomeToReduceFrom?: string;
    recurringExpense?: string;
    regularExpense?: string;
    frequency?: string;
    selectFrequency?: string;
    frequencies?: {
      daily?: string;
      weekly?: string;
      monthly?: string;
      yearly?: string;
    };
    updating?: string;
  };
  common?: {
    amount?: string;
    category?: string;
    date?: string;
    loading?: string;
    cancel?: string;
  };
  errors?: {
    network?: string;
  };
}