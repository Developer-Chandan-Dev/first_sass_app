import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Income from '@/models/Income';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const connectedIncomes = await Income.find(
      { userId, isConnected: true },
      { _id: 1, source: 1, description: 1, amount: 1 }
    ).sort({ createdAt: -1 });

    return NextResponse.json(connectedIncomes);
  } catch (error) {
    console.error('Error fetching connected incomes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}