import mongoose, { Document } from 'mongoose';

export interface IExpense extends Document {
  userId: string;
  amount: number;
  category: string;
  reason: string;
  type: 'free' | 'budget';
  budgetId?: string;
  incomeId?: string;
  affectsBalance: boolean;
  date: Date;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new mongoose.Schema<IExpense>({
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: true,
  },
  reason: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['free', 'budget'],
    default: 'free'
  },
  budgetId: { type: String, index: true }, // Reference to budget for budget expenses
  incomeId: { type: String, index: true }, // Reference to income source
  affectsBalance: { type: Boolean, default: false }, // whether it reduces from connected income
  date: { type: Date, default: Date.now },
  isRecurring: { type: Boolean, default: false },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Clear existing model to ensure schema updates
if (mongoose.models.Expense) {
  delete mongoose.models.Expense;
}

export default mongoose.model<IExpense>('Expense', ExpenseSchema);