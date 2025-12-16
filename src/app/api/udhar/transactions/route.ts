import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import UdharTransaction from '@/models/UdharTransaction';
import UdharCustomer from '@/models/UdharCustomer';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { customerId, type, amount, paidAmount, description } = await req.json();
    
    if (!customerId || !type || !amount || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const transaction = await UdharTransaction.create({
      userId,
      customerId,
      type,
      amount,
      paidAmount: paidAmount || 0,
      description,
    });

    // Update customer's total outstanding
    const customer = await UdharCustomer.findById(customerId);
    if (customer) {
      if (type === 'purchase') {
        customer.totalOutstanding += (amount - (paidAmount || 0));
      } else if (type === 'payment') {
        customer.totalOutstanding -= amount;
      }
      await customer.save();
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');

    await connectDB();
    const query: { userId: string; customerId?: string } = { userId };
    if (customerId) query.customerId = customerId;

    const transactions = await UdharTransaction.find(query).sort({ date: -1 }).populate('customerId');
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
