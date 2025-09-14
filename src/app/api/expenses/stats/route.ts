import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import  connectDB  from '@/lib/mongoose';
import Expense from '@/models/Expense';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'free';

    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total spent (all time)
    const totalSpentResult = await Expense.aggregate([
      { $match: { userId, type } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSpent = totalSpentResult[0]?.total || 0;

    // Total expenses count
    const totalExpenses = await Expense.countDocuments({ userId, type });

    // Average expense
    const averageExpense = totalExpenses > 0 ? totalSpent / totalExpenses : 0;

    // This month total
    const thisMonthResult = await Expense.aggregate([
      { $match: { userId, type, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const thisMonth = thisMonthResult[0]?.total || 0;

    // Last month total for comparison
    const lastMonthResult = await Expense.aggregate([
      { $match: { userId, type, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const lastMonth = lastMonthResult[0]?.total || 0;

    // Calculate monthly change percentage
    const monthlyChange = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    return NextResponse.json({
      totalSpent,
      totalExpenses,
      averageExpense: Math.round(averageExpense),
      thisMonth,
      monthlyChange: Math.round(monthlyChange * 10) / 10
    });

  } catch (error) {
    console.error('Error fetching expense stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}