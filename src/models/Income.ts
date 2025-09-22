import mongoose from 'mongoose';

export interface IIncome {
  _id: string;
  userId: string;
  amount: number;
  source: string;
  category: string;
  description?: string;
  date: Date;
  isRecurring: boolean;
  frequency?: 'monthly' | 'weekly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

const incomeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  source: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Other'],
    default: 'Other',
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  frequency: {
    type: String,
    enum: ['monthly', 'weekly', 'yearly'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Income || mongoose.model('Income', incomeSchema);