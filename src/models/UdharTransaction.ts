import mongoose, { Schema, Document } from 'mongoose';

export interface IUdharTransaction extends Document {
  userId: string;
  customerId: mongoose.Types.ObjectId;
  type: 'purchase' | 'payment';
  amount: number;
  paidAmount: number;
  description: string;
  date: Date;
  createdAt: Date;
}

const UdharTransactionSchema = new Schema<IUdharTransaction>(
  {
    userId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'UdharCustomer', required: true, index: true },
    type: { type: String, enum: ['purchase', 'payment'], required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UdharTransactionSchema.index({ userId: 1, customerId: 1, date: -1 });

export default mongoose.models.UdharTransaction || mongoose.model<IUdharTransaction>('UdharTransaction', UdharTransactionSchema);
