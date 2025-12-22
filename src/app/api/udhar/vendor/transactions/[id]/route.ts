import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import VendorTransaction from '@/models/VendorTransaction';
import UdharVendor from '@/models/UdharVendor';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const transaction = await VendorTransaction.findOne({ _id: id, userId }).populate('vendorId');
    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    const transaction = await VendorTransaction.findOne({ _id: id, userId });
    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    const vendor = await UdharVendor.findById(transaction.vendorId);
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    if (transaction.type === 'purchase') {
      vendor.totalOwed -= (transaction.amount - transaction.paidAmount);
    } else {
      vendor.totalOwed += transaction.amount;
    }

    transaction.amount = body.amount;
    transaction.paidAmount = body.paidAmount || 0;
    transaction.description = body.description;
    if (body.items) transaction.items = body.items;
    if (body.paymentMethod) transaction.paymentMethod = body.paymentMethod;
    if (body.dueDate !== undefined) transaction.dueDate = body.dueDate || undefined;
    
    if (transaction.type === 'purchase') {
      const remaining = transaction.amount - transaction.paidAmount;
      transaction.remainingAmount = remaining;
      transaction.status = remaining === 0 ? 'completed' : 'pending';
    }
    
    await transaction.save();

    if (transaction.type === 'purchase') {
      vendor.totalOwed += (transaction.amount - transaction.paidAmount);
    } else {
      vendor.totalOwed -= transaction.amount;
    }
    await vendor.save();

    return NextResponse.json({ transaction });
  } catch {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const transaction = await VendorTransaction.findOne({ _id: id, userId });
    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    const vendor = await UdharVendor.findById(transaction.vendorId);
    if (vendor) {
      if (transaction.type === 'purchase') {
        vendor.totalOwed -= (transaction.amount - transaction.paidAmount);
      } else if (transaction.type === 'payment') {
        vendor.totalOwed += transaction.amount;
      }
      await vendor.save();
    }

    await transaction.deleteOne();
    return NextResponse.json({ message: 'Transaction deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
