import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    interval: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    features: {
      maxExpenses: { type: Number, default: 500 },
      maxBudgets: { type: Number, default: 5 },
      analytics: { type: Boolean, default: false },
      export: { type: Boolean, default: false },
      priority: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stripePriceId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Plan || mongoose.model('Plan', planSchema);
