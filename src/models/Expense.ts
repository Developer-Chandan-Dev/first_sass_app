import mongoose from 'mongoose';

export interface IExpense {
  _id?: string;
  userId: string;
  amount: number;
  category: 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Others';
  reason: string;
  date: Date;
  createdAt: Date;
}

const ExpenseSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Travel', 'Shopping', 'Bills', 'Others'],
  },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);