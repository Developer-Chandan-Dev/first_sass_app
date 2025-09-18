import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ExpenseItem {
  _id: string;
  amount: number;
  category: string;
  reason: string;
  date: string;
  createdAt: string;
  type: 'free' | 'budget';
  budgetId?: string;
}

export interface ExpenseFilters {
  period: 'all' | 'today' | 'week' | 'month';
  category: string;
  startDate: string;
  endDate: string;
  search: string;
}

interface ExpenseState {
  freeExpenses: ExpenseItem[];
  budgetExpenses: ExpenseItem[];
  expenses: ExpenseItem[]; // Current view expenses
  loading: boolean;
  filters: ExpenseFilters;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  expenseType: 'free' | 'budget';
  lastUpdated: number; // Timestamp for triggering re-calculations
}

const initialState: ExpenseState = {
  freeExpenses: [],
  budgetExpenses: [],
  expenses: [],
  loading: false,
  filters: {
    period: 'all',
    category: '',
    startDate: '',
    endDate: '',
    search: ''
  },
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 10,
  expenseType: 'free',
  lastUpdated: 0
};

// Async thunk for fetching expenses (only when needed)
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params: { expenseType: 'free' | 'budget'; filters: ExpenseFilters; page: number; pageSize: number }) => {
    const { expenseType, filters, page, pageSize } = params;
    
    const searchParams = new URLSearchParams({
      type: expenseType,
      page: page.toString(),
      limit: pageSize.toString(),
      search: filters.search,
      period: filters.period,
      category: filters.category,
      startDate: filters.startDate,
      endDate: filters.endDate
    });

    const response = await fetch(`/api/expenses?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    
    return await response.json();
  }
);

// Async thunk for adding expense (optimistic update)
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData: Omit<ExpenseItem, '_id' | 'createdAt'>) => {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    
    if (!response.ok) throw new Error('Failed to add expense');
    return await response.json();
  }
);

// Async thunk for updating expense (optimistic update)
export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, updates }: { id: string; updates: Partial<ExpenseItem> }) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) throw new Error('Failed to update expense');
    return await response.json();
  }
);

// Async thunk for deleting expense (optimistic update)
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: string) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete expense');
    return id;
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    // Set expense type (free or budget)
    setExpenseType: (state, action: PayloadAction<'free' | 'budget'>) => {
      state.expenseType = action.payload;
      // Switch to the appropriate expense array
      state.expenses = action.payload === 'free' ? state.freeExpenses : state.budgetExpenses;
    },
    
    // Update filters (will trigger fetch)
    setFilters: (state, action: PayloadAction<Partial<ExpenseFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },
    
    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    // Set page size
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
    },
    
    // Optimistic add (immediate UI update)
    addExpenseOptimistic: (state, action: PayloadAction<ExpenseItem>) => {
      state.expenses.unshift(action.payload);
      // Also add to appropriate array
      if (action.payload.type === 'free') {
        state.freeExpenses.unshift(action.payload);
      } else {
        state.budgetExpenses.unshift(action.payload);
      }
      state.totalCount += 1;
    },
    
    // Force refresh of stats components
    refreshStats: (state) => {
      // This will trigger re-calculation in components that depend on expense data
      state.lastUpdated = Date.now();
    },
    
    // Optimistic update (immediate UI update)
    updateExpenseOptimistic: (state, action: PayloadAction<{ id: string; updates: Partial<ExpenseItem> }>) => {
      const { id, updates } = action.payload;
      console.log("Table data: ", id, updates, 172);
      // Update in current view
      const index = state.expenses.findIndex(expense => expense._id === id);
      if (index !== -1) {
        state.expenses[index] = { ...state.expenses[index], ...updates };
      }
      
      // Update in appropriate array
      const freeIndex = state.freeExpenses.findIndex(expense => expense._id === id);
      if (freeIndex !== -1) {
        state.freeExpenses[freeIndex] = { ...state.freeExpenses[freeIndex], ...updates };
      }
      
      const budgetIndex = state.budgetExpenses.findIndex(expense => expense._id === id);
      if (budgetIndex !== -1) {
        state.budgetExpenses[budgetIndex] = { ...state.budgetExpenses[budgetIndex], ...updates };
      }
      
      // Trigger stats refresh
      state.lastUpdated = Date.now();
    },
    
    // Optimistic delete (immediate UI update)
    deleteExpenseOptimistic: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.expenses = state.expenses.filter(expense => expense._id !== id);
      state.freeExpenses = state.freeExpenses.filter(expense => expense._id !== id);
      state.budgetExpenses = state.budgetExpenses.filter(expense => expense._id !== id);
      state.totalCount -= 1;
      // Trigger stats refresh
      state.lastUpdated = Date.now();
    },
  },
  extraReducers: (builder) => {
    // Fetch expenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        // Store in appropriate array
        if (state.expenseType === 'free') {
          state.freeExpenses = action.payload.expenses;
        } else {
          state.budgetExpenses = action.payload.expenses;
        }
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchExpenses.rejected, (state) => {
        state.loading = false;
      })
      
    // Add expense - replace temp expense with real data
    builder
      .addCase(addExpense.fulfilled, (state, action) => {
        // Find and replace the temporary expense with real data from server
        const tempIndex = state.expenses.findIndex(expense => expense._id && expense._id.startsWith('temp_'));
        if (tempIndex !== -1) {
          state.expenses[tempIndex] = action.payload;
        }
        
        // Also update in appropriate array
        if (action.payload.type === 'free') {
          const freeTempIndex = state.freeExpenses.findIndex(expense => expense._id && expense._id.startsWith('temp_'));
          if (freeTempIndex !== -1) {
            state.freeExpenses[freeTempIndex] = action.payload;
          }
        } else {
          const budgetTempIndex = state.budgetExpenses.findIndex(expense => expense._id && expense._id.startsWith('temp_'));
          if (budgetTempIndex !== -1) {
            state.budgetExpenses[budgetTempIndex] = action.payload;
          }
        }
      })
      .addCase(addExpense.rejected, (state, action) => {
        // Revert optimistic update on failure
        state.expenses = state.expenses.filter(expense => expense._id && !expense._id.startsWith('temp_'));
        state.freeExpenses = state.freeExpenses.filter(expense => expense._id && !expense._id.startsWith('temp_'));
        state.budgetExpenses = state.budgetExpenses.filter(expense => expense._id && !expense._id.startsWith('temp_'));
        state.totalCount -= 1;
      })
      
    // Update expense - already updated optimistically
    builder
      .addCase(updateExpense.rejected, (state, action) => {
        // Could revert optimistic update here if needed
        console.error('Failed to update expense:', action.error);
      })
      
    // Delete expense - already deleted optimistically
    builder
      .addCase(deleteExpense.rejected, (state, action) => {
        // Could revert optimistic delete here if needed
        console.error('Failed to delete expense:', action.error);
      });
  },
});

export const {
  setExpenseType,
  setFilters,
  setCurrentPage,
  setPageSize,
  addExpenseOptimistic,
  updateExpenseOptimistic,
  deleteExpenseOptimistic,
  refreshStats,
} = expenseSlice.actions;

export default expenseSlice.reducer;