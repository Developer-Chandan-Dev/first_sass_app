import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StatsState {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  loading: boolean;
}

const initialState: StatsState = {
  totalUsers: 0,
  totalRevenue: 0,
  totalOrders: 0,
  loading: false,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<Partial<StatsState>>) => {
      Object.assign(state, action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setStats, setLoading } = statsSlice.actions;
export default statsSlice.reducer;