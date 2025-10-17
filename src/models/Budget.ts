import mongoose from 'mongoose';

export interface IBudget {
  _id?: string;
  userId: string;
  name: string;
  amount: number;
  category?: string;
  duration: 'monthly' | 'weekly' | 'custom';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  spent?: number;
  remaining?: number;
  createdAt: Date;
  updatedAt?: Date;
}

const BudgetSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String },
  duration: {
    type: String,
    required: true,
    enum: ['monthly', 'weekly', 'custom'],
    default: 'monthly',
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['running', 'completed', 'expired', 'paused'],
    default: 'running',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Clear existing model to ensure schema updates
if (mongoose.models.Budget) {
  delete mongoose.models.Budget;
}

export default mongoose.model('Budget', BudgetSchema);
