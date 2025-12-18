import mongoose, { Schema, Document } from 'mongoose';

export interface IUdharPaymentRecord extends Document {
  userId: string;
  purchaseId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: 'cash' | 'upi' | 'card' | 'other';
  date: Date;
  createdAt: Date;
}

const UdharPaymentRecordSchema = new Schema<IUdharPaymentRecord>(
  {
    userId: { type: String, required: true, index: true },
    purchaseId: { type: Schema.Types.ObjectId, ref: 'UdharTransaction', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'UdharCustomer', required: true, index: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'upi', 'card', 'other'], required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UdharPaymentRecordSchema.index({ userId: 1, purchaseId: 1, date: -1 });

export default mongoose.models.UdharPaymentRecord || mongoose.model<IUdharPaymentRecord>('UdharPaymentRecord', UdharPaymentRecordSchema);
