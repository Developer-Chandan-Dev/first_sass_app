import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Income from '@/models/Income';
import Expense from '@/models/Expense';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Aggregate income data
    const incomeStats = await Income.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
          connectedIncome: {
            $sum: { $cond: [{ $eq: ['$isConnected', true] }, '$amount', 0] },
          },
          unconnectedIncome: {
            $sum: { $cond: [{ $eq: ['$isConnected', false] }, '$amount', 0] },
          },
          totalIncomes: { $sum: 1 },
          connectedIncomes: {
            $sum: { $cond: [{ $eq: ['$isConnected', true] }, 1, 0] },
          },
        },
      },
    ]);

    // Aggregate expense data
    const expenseStats = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          balanceAffectingExpenses: {
            $sum: { $cond: [{ $eq: ['$affectsBalance', true] }, '$amount', 0] },
          },
          totalExpenseCount: { $sum: 1 },
        },
      },
    ]);

    const income = incomeStats[0] || {
      totalIncome: 0,
      connectedIncome: 0,
      unconnectedIncome: 0,
      totalIncomes: 0,
      connectedIncomes: 0,
    };

    const expense = expenseStats[0] || {
      totalExpenses: 0,
      balanceAffectingExpenses: 0,
      totalExpenseCount: 0,
    };

    // Calculate balance (only if there's connected income)
    const balance =
      income.connectedIncomes > 0
        ? income.connectedIncome - expense.balanceAffectingExpenses
        : null;

    return NextResponse.json({
      income: {
        total: income.totalIncome,
        connected: income.connectedIncome,
        unconnected: income.unconnectedIncome,
        count: income.totalIncomes,
        connectedCount: income.connectedIncomes,
      },
      expenses: {
        total: expense.totalExpenses,
        balanceAffecting: expense.balanceAffectingExpenses,
        count: expense.totalExpenseCount,
      },
      balance,
      hasConnectedIncome: income.connectedIncomes > 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
