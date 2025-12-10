import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium', 'enterprise'],
      default: 'free',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
    },
    limits: {
      maxExpenses: {
        type: Number,
        default: 10000, // Unlimited for all users
      },
      maxBudgets: {
        type: Number,
        default: 100, // Unlimited for all users
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
