import { configureStore } from '@reduxjs/toolkit';
import overviewReducer from './expense/overviewSlice';
import expenseReducer from './expense/expenseSlice';
import budgetReducer from './expense/budgetSlice';
import incomeReducer from './income/incomeSlice';

export const store = configureStore({
  reducer: {
    overview: overviewReducer,
    expenses: expenseReducer,
    budgets: budgetReducer,
    incomes: incomeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
