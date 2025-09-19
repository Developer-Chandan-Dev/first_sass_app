import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Expense from '@/models/Expense';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [totalUsers, totalExpenses, activeSubscriptions] = await Promise.all([
      User.countDocuments(),
      Expense.countDocuments(),
      User.countDocuments({ plan: { $ne: 'free' } }),
    ]);

    const totalRevenue = activeSubscriptions * 10;
    const growthRate = 12.5;

    return NextResponse.json({
      totalUsers,
      totalRevenue,
      activeSubscriptions,
      growthRate,
      totalExpenses,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}