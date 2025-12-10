import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    maxExpenses: number;
    maxBudgets: number;
  };
  stripePriceId?: string;
  razorpayPlanId?: string;
  isActive: boolean;
}

const PlanSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  interval: {
    type: String,
    enum: ['month', 'year'],
    required: true,
  },
  features: [{
    type: String,
  }],
  limits: {
    maxExpenses: {
      type: Number,
      required: true,
    },
    maxBudgets: {
      type: Number,
      required: true,
    },
  },
  stripePriceId: {
    type: String,
  },
  razorpayPlanId: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);
