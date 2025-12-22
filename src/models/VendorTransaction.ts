import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorTransaction extends Document {
  userId: string;
  vendorId: mongoose.Types.ObjectId;
  type: 'purchase' | 'payment';
  amount: number;
  paidAmount: number;
  description: string;
  items?: { name: string; quantity: number; price: number }[];
  paymentMethod?: 'cash' | 'upi' | 'card' | 'other';
  status?: 'completed' | 'pending';
  remainingAmount?: number;
  dueDate?: Date;
  date: Date;
  createdAt: Date;
}

const VendorTransactionSchema = new Schema<IVendorTransaction>(
  {
    userId: { type: String, required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'UdharVendor', required: true, index: true },
    type: { type: String, enum: ['purchase', 'payment'], required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    description: { type: String, required: true },
    items: [{ name: String, quantity: Number, price: Number }],
    paymentMethod: { type: String, enum: ['cash', 'upi', 'card', 'other'] },
    status: { type: String, enum: ['completed', 'pending'], default: 'pending' },
    remainingAmount: { type: Number, default: 0 },
    dueDate: { type: Date },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VendorTransactionSchema.index({ userId: 1, vendorId: 1, date: -1 });

export default mongoose.models.VendorTransaction || mongoose.model<IVendorTransaction>('VendorTransaction', VendorTransactionSchema);
