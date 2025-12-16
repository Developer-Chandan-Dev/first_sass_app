import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import UdharCustomer from '@/models/UdharCustomer';
import UdharTransaction from '@/models/UdharTransaction';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const totalCustomers = await UdharCustomer.countDocuments({ userId });
    const customers = await UdharCustomer.find({ userId });
    const totalOutstanding = customers.reduce((sum, c) => sum + c.totalOutstanding, 0);

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthTransactions = await UdharTransaction.find({
      userId,
      date: { $gte: startOfMonth },
    });

    const monthPurchases = monthTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthCollections = monthTransactions
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      totalCustomers,
      totalOutstanding,
      monthPurchases,
      monthCollections,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
