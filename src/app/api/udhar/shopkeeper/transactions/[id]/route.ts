import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import UdharTransaction from '@/models/UdharTransaction';
import UdharCustomer from '@/models/UdharCustomer';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const transaction = await UdharTransaction.findOne({ _id: id, userId }).populate('customerId');
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

    const transaction = await UdharTransaction.findOne({ _id: id, userId });
    if (!transaction) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

    const customer = await UdharCustomer.findById(transaction.customerId);
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    // Reverse old transaction
    if (transaction.type === 'purchase') {
      customer.totalOutstanding -= (transaction.amount - transaction.paidAmount);
    } else {
      customer.totalOutstanding += transaction.amount;
    }

    // Update transaction fields
    transaction.amount = body.amount;
    transaction.paidAmount = body.paidAmount || 0;
    transaction.description = body.description;
    if (body.items) transaction.items = body.items;
    if (body.paymentMethod) transaction.paymentMethod = body.paymentMethod;
    if (body.dueDate !== undefined) transaction.dueDate = body.dueDate || undefined;
    
    // Recalculate status and remaining amount
    if (transaction.type === 'purchase') {
      const remaining = transaction.amount - transaction.paidAmount;
      transaction.remainingAmount = remaining;
      transaction.status = remaining === 0 ? 'completed' : 'pending';
    }
    
    await transaction.save();

    // Apply new transaction
    if (transaction.type === 'purchase') {
      customer.totalOutstanding += (transaction.amount - transaction.paidAmount);
    } else {
      customer.totalOutstanding -= transaction.amount;
    }
    await customer.save();

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
