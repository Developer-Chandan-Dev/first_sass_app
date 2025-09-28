import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ incomeId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { incomeId } = await params;

    const expenses = await Expense.find({
      userId,
      incomeId,
      affectsBalance: true
    }).sort({ date: -1 });

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return NextResponse.json({
      expenses,
      totalSpent,
      count: expenses.length
    });
  } catch (error) {
    console.error('Error fetching income expenses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}