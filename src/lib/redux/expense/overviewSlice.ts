import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ExpenseDocument {
  _id: string;
  amount: number;
  category: string;
  reason: string;
  date: string;
  createdAt: string;
  type: 'free' | 'budget';
}

interface FreeStats {
  totalSpent: number;
  totalExpenses: number;
  categoryBreakdown: { _id: string; total: number; count: number }[];
  recentTrend: { _id: string; total: number }[];
  previousMonthSpent: number;
  previousMonthExpenses: number;
  monthlyChange: number;
  expenseChange: number;
  expenses: ExpenseDocument[];
}

interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  totalExpenses: number;
  categoryBreakdown: { _id: string; total: number; count: number }[];
  previousMonthSpent: number;
  previousMonthExpenses: number;
  monthlyChange: number;
  expenseChange: number;
  expenses: ExpenseDocument[];
}

interface StatsState {
  free: FreeStats;
  budget: BudgetStats;
  loading: boolean;
}

const initialState: StatsState = {
  free: {
    totalSpent: 0,
    totalExpenses: 0,
    categoryBreakdown: [],
    recentTrend: [],
    previousMonthSpent: 0,
    previousMonthExpenses: 0,
    monthlyChange: 0,
    expenseChange: 0,
    expenses: [],
  },
  budget: {
    totalBudget: 0,
    totalSpent: 0,
    totalExpenses: 0,
    categoryBreakdown: [],
    previousMonthSpent: 0,
    previousMonthExpenses: 0,
    monthlyChange: 0,
    expenseChange: 0,
    expenses: [],
  },
  loading: false,
};

export const refreshStats = createAsyncThunk(
  'stats/refreshStats',
  async (expenseType: 'free' | 'budget') => {
    const response = await fetch(`/api/expenses/dashboard?type=${expenseType}`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return { type: expenseType, stats: data.stats, expenses: data.expenses };
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateStatsOptimistic: (state, action: PayloadAction<{ type: 'free' | 'budget'; amount: number; category: string; operation: 'add' | 'subtract'; isExpense?: boolean; reason?: string }>) => {
      const { type, amount, category, operation, isExpense = true, reason = '' } = action.payload;
      
      // Add to recent expenses for both types when adding
      if (operation === 'add' && isExpense) {
        const newExpense: ExpenseDocument = {
          _id: `temp_${Date.now()}`,
          amount,
          category,
          reason,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          type
        };
        
        if (type === 'free') {
          state.free.expenses.unshift(newExpense);
          if (state.free.expenses.length > 7) state.free.expenses.pop();
        } else {
          state.budget.expenses.unshift(newExpense);
          if (state.budget.expenses.length > 5) state.budget.expenses.pop();
        }
      }
      
      if (type === 'free') {
        // Handle free expenses only
        const freeStats = state.free;
        if (operation === 'add') {
          freeStats.totalExpenses += 1;
          freeStats.totalSpent += amount;
          
          const categoryIndex = freeStats.categoryBreakdown.findIndex(c => c._id === category);
          if (categoryIndex !== -1) {
            freeStats.categoryBreakdown[categoryIndex].total += amount;
            freeStats.categoryBreakdown[categoryIndex].count += 1;
          } else {
            freeStats.categoryBreakdown.push({ _id: category, total: amount, count: 1 });
          }
        } else {
          freeStats.totalExpenses = Math.max(0, freeStats.totalExpenses - 1);
          freeStats.totalSpent = Math.max(0, freeStats.totalSpent - amount);
          
          const categoryIndex = freeStats.categoryBreakdown.findIndex(c => c._id === category);
          if (categoryIndex !== -1) {
            freeStats.categoryBreakdown[categoryIndex].total = Math.max(0, freeStats.categoryBreakdown[categoryIndex].total - amount);
            freeStats.categoryBreakdown[categoryIndex].count = Math.max(0, freeStats.categoryBreakdown[categoryIndex].count - 1);
            if (freeStats.categoryBreakdown[categoryIndex].count === 0) {
              freeStats.categoryBreakdown.splice(categoryIndex, 1);
            }
          }
        }
      } else if (type === 'budget') {
        const budgetStats = state.budget;
        
        if (isExpense) {
          // Budget expense (spending from budget)
          if (operation === 'add') {
            budgetStats.totalExpenses += 1;
            budgetStats.totalSpent += amount;
            
            const categoryIndex = budgetStats.categoryBreakdown.findIndex(c => c._id === category);
            if (categoryIndex !== -1) {
              budgetStats.categoryBreakdown[categoryIndex].total += amount;
              budgetStats.categoryBreakdown[categoryIndex].count += 1;
            } else {
              budgetStats.categoryBreakdown.push({ _id: category, total: amount, count: 1 });
            }
          } else {
            budgetStats.totalExpenses = Math.max(0, budgetStats.totalExpenses - 1);
            budgetStats.totalSpent = Math.max(0, budgetStats.totalSpent - amount);
            
            const categoryIndex = budgetStats.categoryBreakdown.findIndex(c => c._id === category);
            if (categoryIndex !== -1) {
              budgetStats.categoryBreakdown[categoryIndex].total = Math.max(0, budgetStats.categoryBreakdown[categoryIndex].total - amount);
              budgetStats.categoryBreakdown[categoryIndex].count = Math.max(0, budgetStats.categoryBreakdown[categoryIndex].count - 1);
              if (budgetStats.categoryBreakdown[categoryIndex].count === 0) {
                budgetStats.categoryBreakdown.splice(categoryIndex, 1);
              }
            }
          }
        } else {
          // Budget creation/deletion (affects totalBudget only)
          if (operation === 'add') {
            budgetStats.totalBudget += amount;
          } else {
            budgetStats.totalBudget = Math.max(0, budgetStats.totalBudget - amount);
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshStats.fulfilled, (state, action) => {
        const { type, stats, expenses } = action.payload;
        state[type] = { ...state[type], ...stats, expenses };
      });
  },
});

export const { updateStatsOptimistic } = statsSlice.actions;
export default statsSlice.reducer;