import mongoose, { Schema, Document } from 'mongoose';

export interface IIncome extends Document {
  userId: string;
  amount: number;
  source: string; // salary, freelancing, business, etc.
  category: string;
  description: string;
  isConnected: boolean; // whether it affects balance calculation
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IncomeSchema = new Schema<IIncome>({
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  source: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  isConnected: { type: Boolean, default: false },
  isRecurring: { type: Boolean, default: false },
  frequency: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: function(this: IIncome) { return this.isRecurring; }
  },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

// Indexes for performance
IncomeSchema.index({ userId: 1, date: -1 });
IncomeSchema.index({ userId: 1, isConnected: 1 });

// Clear existing model to ensure schema updates
if (mongoose.models.Income) {
  delete mongoose.models.Income;
}

export default mongoose.model<IIncome>('Income', IncomeSchema);