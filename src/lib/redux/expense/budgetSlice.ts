import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Budget {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  category?: string;
  duration: 'monthly' | 'weekly' | 'custom';
  startDate: string;
  endDate: string;
  isActive: boolean;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'running' | 'completed' | 'expired' | 'paused';
  savings: number;
  daysLeft: number;
  createdAt: string;
  updatedAt?: string;
}

interface BudgetState {
  budgets: Budget[];
  activeBudgets: Budget[];
  loading: boolean;
}

const initialState: BudgetState = {
  budgets: [],
  activeBudgets: [],
  loading: false,
};

// Async thunk for fetching budgets
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (activeOnly?: boolean) => {
    const params = activeOnly ? '?active=true' : '';
    const response = await fetch(`/api/expenses/budget${params}`);
    if (!response.ok) throw new Error('Failed to fetch budgets');
    return await response.json();
  }
);

// Async thunk for adding budget (optimistic update)
export const addBudget = createAsyncThunk(
  'budgets/addBudget',
  async (
    budgetData: Omit<
      Budget,
      | '_id'
      | 'userId'
      | 'spent'
      | 'remaining'
      | 'percentage'
      | 'createdAt'
      | 'updatedAt'
    >
  ) => {
    const response = await fetch('/api/expenses/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    });

    if (!response.ok) throw new Error('Failed to add budget');
    return await response.json();
  }
);

// Async thunk for updating budget (optimistic update)
export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, updates }: { id: string; updates: Partial<Budget> }) => {
    const response = await fetch(`/api/expenses/budget/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update budget');
    return await response.json();
  }
);

// Async thunk for deleting budget (optimistic update)
export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id: string) => {
    const response = await fetch(`/api/expenses/budget/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to delete budget (${response.status})`
      );
    }
    return id;
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    // Optimistic add budget (immediate UI update)
    addBudgetOptimistic: (state, action: PayloadAction<Budget>) => {
      state.budgets.unshift(action.payload);
      if (action.payload.isActive) {
        state.activeBudgets.unshift(action.payload);
      }
    },

    // Optimistic update budget (immediate UI update)
    updateBudgetOptimistic: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Budget> }>
    ) => {
      const { id, updates } = action.payload;

      // Update in budgets array
      const budgetIndex = state.budgets.findIndex(
        (budget) => budget._id === id
      );
      if (budgetIndex !== -1) {
        state.budgets[budgetIndex] = {
          ...state.budgets[budgetIndex],
          ...updates,
        };
      }

      // Update in activeBudgets array
      const activeBudgetIndex = state.activeBudgets.findIndex(
        (budget) => budget._id === id
      );
      if (activeBudgetIndex !== -1) {
        if (updates.isActive === false) {
          // Remove from active budgets if deactivated
          state.activeBudgets.splice(activeBudgetIndex, 1);
        } else {
          // Update in active budgets
          state.activeBudgets[activeBudgetIndex] = {
            ...state.activeBudgets[activeBudgetIndex],
            ...updates,
          };
        }
      } else if (updates.isActive === true && budgetIndex !== -1) {
        // Add to active budgets if activated
        state.activeBudgets.push(state.budgets[budgetIndex]);
      }
    },

    // Optimistic delete budget (immediate UI update)
    deleteBudgetOptimistic: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.budgets = state.budgets.filter((budget) => budget._id !== id);
      state.activeBudgets = state.activeBudgets.filter(
        (budget) => budget._id !== id
      );
    },

    // Update budget spent amount (when expense is added/deleted)
    updateBudgetSpent: (
      state,
      action: PayloadAction<{
        budgetId: string;
        amount: number;
        operation: 'add' | 'subtract';
      }>
    ) => {
      const { budgetId, amount, operation } = action.payload;

      const updateBudgetSpent = (budget: Budget) => {
        const newSpent =
          operation === 'add'
            ? budget.spent + amount
            : Math.max(0, budget.spent - amount);

        budget.spent = newSpent;
        budget.remaining = Math.max(0, budget.amount - newSpent);
        budget.percentage =
          budget.amount > 0 ? (newSpent / budget.amount) * 100 : 0;
      };

      // Update in budgets array
      const budgetIndex = state.budgets.findIndex(
        (budget) => budget._id === budgetId
      );
      if (budgetIndex !== -1) {
        updateBudgetSpent(state.budgets[budgetIndex]);
      }

      // Update in activeBudgets array
      const activeBudgetIndex = state.activeBudgets.findIndex(
        (budget) => budget._id === budgetId
      );
      if (activeBudgetIndex !== -1) {
        updateBudgetSpent(state.activeBudgets[activeBudgetIndex]);
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch budgets
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
        state.activeBudgets = action.payload.filter(
          (budget: Budget) => budget.isActive
        );
      })
      .addCase(fetchBudgets.rejected, (state) => {
        state.loading = false;
      });

    // Add budget - replace temp budget with real data
    builder
      .addCase(addBudget.fulfilled, (state, action) => {
        // Find and replace the temporary budget with real data from server
        const tempIndex = state.budgets.findIndex(
          (budget) => budget._id && budget._id.startsWith('temp_')
        );
        if (tempIndex !== -1) {
          state.budgets[tempIndex] = action.payload;
          if (action.payload.isActive) {
            const activeTempIndex = state.activeBudgets.findIndex(
              (budget) => budget._id && budget._id.startsWith('temp_')
            );
            if (activeTempIndex !== -1) {
              state.activeBudgets[activeTempIndex] = action.payload;
            }
          }
        } else {
          // If temp not found, just add to beginning
          state.budgets.unshift(action.payload);
          if (action.payload.isActive) {
            state.activeBudgets.unshift(action.payload);
          }
        }
      })
      .addCase(addBudget.rejected, (state) => {
        // Revert optimistic update on failure
        state.budgets = state.budgets.filter(
          (budget) => budget._id && !budget._id.startsWith('temp_')
        );
        state.activeBudgets = state.activeBudgets.filter(
          (budget) => budget._id && !budget._id.startsWith('temp_')
        );
      });

    // Update budget - already updated optimistically
    builder.addCase(updateBudget.rejected, (state, action) => {
      console.error('Failed to update budget:', action.error);
    });

    // Delete budget - already deleted optimistically
    builder.addCase(deleteBudget.rejected, (state, action) => {
      console.error('Failed to delete budget:', action.error);
    });
  },
});

export const {
  addBudgetOptimistic,
  updateBudgetOptimistic,
  deleteBudgetOptimistic,
  updateBudgetSpent,
} = budgetSlice.actions;

export default budgetSlice.reducer;
