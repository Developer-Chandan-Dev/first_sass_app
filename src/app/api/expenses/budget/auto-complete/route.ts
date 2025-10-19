import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Budget from '@/models/Budget';
import Expense from '@/models/Expense';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const now = new Date();

    // Find all running budgets that have passed their end date
    const expiredBudgets = await Budget.find({
      userId,
      status: 'running',
      endDate: { $lte: now },
      isActive: true,
    });

    const completedBudgets = [];

    for (const budget of expiredBudgets) {
      // Calculate spent amount for this budget
      const expenseStats = await Expense.aggregate([
        {
          $match: {
            userId,
            type: 'budget',
            budgetId: budget._id.toString(),
          },
        },
        {
          $group: {
            _id: null,
            spent: { $sum: '$amount' },
          },
        },
      ]);

      const spentAmount = expenseStats[0]?.spent || 0;
      const remaining = Math.max(0, budget.amount - spentAmount);

      // Update budget status to completed
      await Budget.findByIdAndUpdate(budget._id, {
        status: 'completed',
        updatedAt: now,
      });

      completedBudgets.push({
        _id: budget._id,
        name: budget.name,
        amount: budget.amount,
        spent: spentAmount,
        remaining,
        savings: remaining,
        endDate: budget.endDate,
        category: budget.category,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${completedBudgets.length} budgets auto-completed`,
      completedBudgets,
    });
  } catch (error) {
    console.error('Error auto-completing budgets:', error);
    return NextResponse.json(
      { error: 'Failed to auto-complete budgets' },
      { status: 500 }
    );
  }
}
