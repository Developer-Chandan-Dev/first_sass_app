import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import UdharTransaction from '@/models/UdharTransaction';
import UdharCustomer from '@/models/UdharCustomer';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const transaction = await UdharTransaction.findOne({ _id: id, userId });
    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    // Reverse the outstanding amount
    const customer = await UdharCustomer.findById(transaction.customerId);
    if (customer) {
      if (transaction.type === 'purchase') {
        customer.totalOutstanding -= (transaction.amount - transaction.paidAmount);
      } else if (transaction.type === 'payment') {
        customer.totalOutstanding += transaction.amount;
      }
      await customer.save();
    }

    await transaction.deleteOne();
    return NextResponse.json({ message: 'Transaction deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
