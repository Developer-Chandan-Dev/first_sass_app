import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';
import User from '@/models/User';
import { sanitizeString, sanitizeCategoryName, isValidObjectId } from '@/lib/input-sanitizer';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { expenses } = await request.json();

    if (!Array.isArray(expenses) || expenses.length === 0) {
      return NextResponse.json({ error: 'Invalid expenses data' }, { status: 400 });
    }

    // Check user limits
    const [user, currentCount] = await Promise.all([
      User.findOne({ clerkId: userId }),
      Expense.countDocuments({ userId })
    ]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (currentCount + expenses.length > user.limits.maxExpenses) {
      return NextResponse.json({
        error: `Bulk operation would exceed limit. Current: ${currentCount}, Adding: ${expenses.length}, Limit: ${user.limits.maxExpenses}`
      }, { status: 403 });
    }

    // Validate and sanitize expenses
    const validExpenses = expenses
      .filter(exp => exp.amount && exp.category && exp.reason)
      .map(exp => ({
        userId,
        amount: Math.abs(parseFloat(exp.amount)),
        category: sanitizeCategoryName(exp.category),
        reason: sanitizeString(exp.reason),
        type: exp.type || 'free',
        date: exp.date ? new Date(exp.date) : new Date(),
        isRecurring: Boolean(exp.isRecurring),
        affectsBalance: Boolean(exp.affectsBalance),
        ...(exp.budgetId && { budgetId: exp.budgetId })
      }));

    if (validExpenses.length === 0) {
      return NextResponse.json({ error: 'No valid expenses to add' }, { status: 400 });
    }

    // Bulk insert
    const result = await Expense.insertMany(validExpenses);

    return NextResponse.json({
      success: true,
      added: result.length,
      expenses: result
    });

  } catch (error) {
    console.error('Bulk expense creation error:', error);
    return NextResponse.json({ error: 'Failed to create expenses' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { expenseIds } = await request.json();

    if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
      return NextResponse.json({ error: 'Invalid expense IDs' }, { status: 400 });
    }

    // Validate all expense IDs
    const validIds = expenseIds.filter(id => isValidObjectId(id));
    if (validIds.length === 0) {
      return NextResponse.json({ error: 'No valid expense IDs provided' }, { status: 400 });
    }

    // Delete expenses (only user's own expenses)
    const result = await Expense.deleteMany({
      _id: { $in: validIds },
      userId
    });

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount
    });

  } catch (error) {
    console.error('Bulk expense deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete expenses' }, { status: 500 });
  }
}