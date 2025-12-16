import mongoose, { Schema, Document } from 'mongoose';

export interface IUdharCustomer extends Document {
  userId: string;
  name: string;
  phone: string;
  address?: string;
  totalOutstanding: number;
  createdAt: Date;
  updatedAt: Date;
}

const UdharCustomerSchema = new Schema<IUdharCustomer>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    totalOutstanding: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UdharCustomerSchema.index({ userId: 1, phone: 1 });

export default mongoose.models.UdharCustomer || mongoose.model<IUdharCustomer>('UdharCustomer', UdharCustomerSchema);
