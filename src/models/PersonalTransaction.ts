import mongoose from 'mongoose';

const PersonalTransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  contactId: { type: String, required: true, index: true },
  type: { type: String, enum: ['lent', 'borrowed', 'payment'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

PersonalTransactionSchema.index({ userId: 1, contactId: 1, date: -1 });

export default mongoose.models.PersonalTransaction ||
  mongoose.model('PersonalTransaction', PersonalTransactionSchema);
