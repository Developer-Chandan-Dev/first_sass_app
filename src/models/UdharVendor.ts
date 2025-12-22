import mongoose, { Schema, Document } from 'mongoose';

export interface IUdharVendor extends Document {
  userId: string;
  name: string;
  phone: string;
  address?: string;
  totalOwed: number;
  createdAt: Date;
}

const UdharVendorSchema = new Schema<IUdharVendor>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    totalOwed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UdharVendorSchema.index({ userId: 1, phone: 1 }, { unique: true });

export default mongoose.models.UdharVendor || mongoose.model<IUdharVendor>('UdharVendor', UdharVendorSchema);
