import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface IncomeItem {
  _id: string;
  userId: string;
  amount: number;
  source: string;
  category: string;
  description?: string;
  date: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'weekly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

export interface IncomeFilters {
  period: 'all' | 'today' | 'week' | 'month';
  category: string;
  startDate: string;
  endDate: string;
  search: string;
}

interface IncomeState {
  incomes: IncomeItem[];
  loading: boolean;
  filters: IncomeFilters;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  totalIncome: number;
  monthlyIncome: number;
}

const initialState: IncomeState = {
  incomes: [],
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
  totalIncome: 0,
  monthlyIncome: 0
};

export const fetchIncomes = createAsyncThunk(
  'incomes/fetchIncomes',
  async (params: { filters: IncomeFilters; page: number; pageSize: number }) => {
    const { filters, page, pageSize } = params;
    
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      search: filters.search,
      period: filters.period,
      category: filters.category,
      startDate: filters.startDate,
      endDate: filters.endDate
    });

    const response = await fetch(`/api/incomes?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch incomes');
    
    return await response.json();
  }
);

export const addIncome = createAsyncThunk(
  'incomes/addIncome',
  async (incomeData: Omit<IncomeItem, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/incomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incomeData),
    });
    
    if (!response.ok) throw new Error('Failed to add income');
    return await response.json();
  }
);

export const updateIncome = createAsyncThunk(
  'incomes/updateIncome',
  async ({ id, updates }: { id: string; updates: Partial<IncomeItem> }) => {
    const response = await fetch(`/api/incomes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) throw new Error('Failed to update income');
    return await response.json();
  }
);

export const deleteIncome = createAsyncThunk(
  'incomes/deleteIncome',
  async (id: string) => {
    const response = await fetch(`/api/incomes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete income');
    return id;
  }
);

const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<IncomeFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    
    addIncomeOptimistic: (state, action: PayloadAction<IncomeItem>) => {
      state.incomes.unshift(action.payload);
      state.totalCount += 1;
      state.totalIncome += action.payload.amount;
    },
    
    updateIncomeOptimistic: (state, action: PayloadAction<{ id: string; updates: Partial<IncomeItem> }>) => {
      const { id, updates } = action.payload;
      const index = state.incomes.findIndex(income => income._id === id);
      if (index !== -1) {
        const oldAmount = state.incomes[index].amount;
        state.incomes[index] = { ...state.incomes[index], ...updates };
        if (updates.amount !== undefined) {
          state.totalIncome = state.totalIncome - oldAmount + updates.amount;
        }
      }
    },
    
    deleteIncomeOptimistic: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const income = state.incomes.find(income => income._id === id);
      if (income) {
        state.totalIncome -= income.amount;
      }
      state.incomes = state.incomes.filter(income => income._id !== id);
      state.totalCount -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.incomes = action.payload.incomes;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.totalIncome = action.payload.totalIncome;
        state.monthlyIncome = action.payload.monthlyIncome;
      })
      .addCase(fetchIncomes.rejected, (state) => {
        state.loading = false;
      })
      
      .addCase(addIncome.fulfilled, (state, action) => {
        const tempIndex = state.incomes.findIndex(income => income._id && income._id.startsWith('temp_'));
        if (tempIndex !== -1) {
          state.incomes[tempIndex] = action.payload;
        }
      })
      .addCase(addIncome.rejected, (state) => {
        state.incomes = state.incomes.filter(income => income._id && !income._id.startsWith('temp_'));
        state.totalCount -= 1;
      })
      
      .addCase(updateIncome.rejected, (state, action) => {
        console.error('Failed to update income:', action.error);
      })
      
      .addCase(deleteIncome.rejected, (state, action) => {
        console.error('Failed to delete income:', action.error);
      });
  },
});

export const {
  setFilters,
  setCurrentPage,
  setPageSize,
  addIncomeOptimistic,
  updateIncomeOptimistic,
  deleteIncomeOptimistic,
} = incomeSlice.actions;

export default incomeSlice.reducer;