import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique category names per user
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category =
  mongoose.models.Category || mongoose.model('Category', CategorySchema);
