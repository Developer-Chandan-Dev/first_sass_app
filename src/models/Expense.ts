import mongoose from 'mongoose';

export interface IExpense {
  _id?: string;
  userId: string;
  amount: number;
  category: string;
  reason: string;
  type: 'free' | 'budget';
  budgetId?: string;
  date: Date;
  createdAt: Date;
  updatedAt?: Date;
}

const ExpenseSchema = new mongoose.Schema({
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
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Clear existing model to ensure schema updates
if (mongoose.models.Expense) {
  delete mongoose.models.Expense;
}

export default mongoose.model('Expense', ExpenseSchema);