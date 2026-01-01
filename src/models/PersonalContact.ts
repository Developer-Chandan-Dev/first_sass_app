import mongoose from 'mongoose';

const PersonalContactSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  type: { type: String, enum: ['lent', 'borrowed'], required: true }, // I lent money OR I borrowed money
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PersonalContactSchema.index({ userId: 1, type: 1 });

export default mongoose.models.PersonalContact ||
  mongoose.model('PersonalContact', PersonalContactSchema);
