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
  lastFetch?: number;
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
  lastFetch?: number;
}

interface StatsState {
  free: FreeStats;
  budget: BudgetStats;
  loading: boolean;
  error: string | null;
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
  error: null,
};

// Request deduplication cache
const pendingRequests = new Map<
  string,
  Promise<{
    type: 'free' | 'budget';
    stats: Partial<FreeStats | BudgetStats>;
    expenses: ExpenseDocument[];
  }>
>();

export const refreshStats = createAsyncThunk(
  'stats/refreshStats',
  async (expenseType: 'free' | 'budget', { rejectWithValue, getState }) => {
    const state = getState() as { overview: StatsState };
    const requestKey = `stats-${expenseType}`;

    // Check if request is already pending
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    // Check if data is fresh (less than 30 seconds old)
    const lastFetch = state.overview[expenseType].lastFetch;
    if (lastFetch && Date.now() - lastFetch < 30000) {
      return {
        type: expenseType,
        stats: state.overview[expenseType],
        expenses: state.overview[expenseType].expenses,
        cached: true,
      };
    }

    try {
      const requestPromise = fetch(
        `/api/expenses/dashboard?type=${expenseType}`
      )
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.error ||
                `HTTP ${response.status}: Failed to fetch stats`
            );
          }
          return response.json();
        })
        .then((data) => ({
          type: expenseType,
          stats: { ...data.stats, lastFetch: Date.now() },
          expenses: data.expenses || [],
        }))
        .finally(() => {
          pendingRequests.delete(requestKey);
        });

      pendingRequests.set(requestKey, requestPromise);
      return await requestPromise;
    } catch (error) {
      pendingRequests.delete(requestKey);
      const message =
        error instanceof Error ? error.message : 'Failed to fetch stats';
      return rejectWithValue(message);
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateStatsOptimistic: (
      state,
      action: PayloadAction<{
        type: 'free' | 'budget';
        amount: number;
        category: string;
        operation: 'add' | 'subtract';
        isExpense?: boolean;
        reason?: string;
      }>
    ) => {
      const {
        type,
        amount,
        category,
        operation,
        isExpense = true,
        reason = '',
      } = action.payload;

      // Add to recent expenses for both types when adding
      if (operation === 'add' && isExpense) {
        const newExpense: ExpenseDocument = {
          _id: `temp_${Date.now()}`,
          amount,
          category,
          reason,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          type,
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

          const categoryIndex = freeStats.categoryBreakdown.findIndex(
            (c) => c._id === category
          );
          if (categoryIndex !== -1) {
            freeStats.categoryBreakdown[categoryIndex].total += amount;
            freeStats.categoryBreakdown[categoryIndex].count += 1;
          } else {
            freeStats.categoryBreakdown.push({
              _id: category,
              total: amount,
              count: 1,
            });
          }
        } else {
          freeStats.totalExpenses = Math.max(0, freeStats.totalExpenses - 1);
          freeStats.totalSpent = Math.max(0, freeStats.totalSpent - amount);

          const categoryIndex = freeStats.categoryBreakdown.findIndex(
            (c) => c._id === category
          );
          if (categoryIndex !== -1) {
            freeStats.categoryBreakdown[categoryIndex].total = Math.max(
              0,
              freeStats.categoryBreakdown[categoryIndex].total - amount
            );
            freeStats.categoryBreakdown[categoryIndex].count = Math.max(
              0,
              freeStats.categoryBreakdown[categoryIndex].count - 1
            );
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

            const categoryIndex = budgetStats.categoryBreakdown.findIndex(
              (c) => c._id === category
            );
            if (categoryIndex !== -1) {
              budgetStats.categoryBreakdown[categoryIndex].total += amount;
              budgetStats.categoryBreakdown[categoryIndex].count += 1;
            } else {
              budgetStats.categoryBreakdown.push({
                _id: category,
                total: amount,
                count: 1,
              });
            }
          } else {
            budgetStats.totalExpenses = Math.max(
              0,
              budgetStats.totalExpenses - 1
            );
            budgetStats.totalSpent = Math.max(
              0,
              budgetStats.totalSpent - amount
            );

            const categoryIndex = budgetStats.categoryBreakdown.findIndex(
              (c) => c._id === category
            );
            if (categoryIndex !== -1) {
              budgetStats.categoryBreakdown[categoryIndex].total = Math.max(
                0,
                budgetStats.categoryBreakdown[categoryIndex].total - amount
              );
              budgetStats.categoryBreakdown[categoryIndex].count = Math.max(
                0,
                budgetStats.categoryBreakdown[categoryIndex].count - 1
              );
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
            budgetStats.totalBudget = Math.max(
              0,
              budgetStats.totalBudget - amount
            );
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshStats.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          const { type, stats, expenses } = action.payload;
          if (type === 'free') {
            state.free = { ...state.free, ...stats, expenses };
          } else {
            state.budget = { ...state.budget, ...stats, expenses };
          }
        }
      })
      .addCase(refreshStats.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to refresh stats';
      });
  },
});

export const { updateStatsOptimistic, clearError } = statsSlice.actions;
export default statsSlice.reducer;
