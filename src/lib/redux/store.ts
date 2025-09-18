import { configureStore } from '@reduxjs/toolkit';
import overviewReducer from './expense/overviewSlice';
import expenseReducer from './expense/expenseSlice';
import budgetReducer from './expense/budgetSlice';

export const store = configureStore({
  reducer: {
    overview: overviewReducer,
    expenses: expenseReducer,
    budgets: budgetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;