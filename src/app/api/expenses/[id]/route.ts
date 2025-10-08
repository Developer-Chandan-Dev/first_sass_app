import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';
import { sanitizeString, sanitizeNumber, isValidObjectId, sanitizeForLog } from '@/lib/input-sanitizer';
import Income from '@/models/Income'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Validate ObjectId format to prevent path traversal
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid expense ID format' }, { status: 400 });
    }
    
    const body = await request.json();
    const { amount, category, reason, date, affectsBalance, incomeId, isRecurring, frequency } = body;
    
    // Sanitize inputs
    const sanitizedAmount = sanitizeNumber(amount);
    const sanitizedCategory = sanitizeString(category);
    const sanitizedReason = sanitizeString(reason);
    
    // Validate ObjectId if provided
    if (incomeId && !isValidObjectId(incomeId)) {
      return NextResponse.json({ error: 'Invalid income ID' }, { status: 400 });
    }

    await connectDB();

    // Get the original expense to handle income adjustments
    const originalExpense = await Expense.findOne({ _id: id, userId });
    if (!originalExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // const Income = (await import('@/models/Income')).default;

    // Restore original income amount if it was affected
    if (originalExpense.affectsBalance && originalExpense.incomeId) {
      await Income.findByIdAndUpdate(
        originalExpense.incomeId,
        { $inc: { amount: originalExpense.amount } }
      );
    }

    // Update the expense
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      {
        amount: sanitizedAmount,
        category: sanitizedCategory,
        reason: sanitizedReason,
        date: date ? new Date(date) : undefined,
        affectsBalance: Boolean(affectsBalance),
        incomeId: (affectsBalance && incomeId) ? incomeId : null,
        isRecurring: Boolean(isRecurring),
        frequency: isRecurring ? frequency : undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Apply new income reduction if needed
    if (affectsBalance && incomeId) {
      await Income.findByIdAndUpdate(
        incomeId,
        { $inc: { amount: -sanitizedAmount } }
      );
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error updating expense', {
      message: sanitizeForLog(error instanceof Error ? error.message : 'Unknown error')
    });
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Validate ObjectId format to prevent path traversal
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid expense ID format' }, { status: 400 });
    }
    
    await connectDB();

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId
    });

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // Restore income amount if expense was affecting balance
    if (expense.affectsBalance && expense.incomeId) {
      const Income = (await import('@/models/Income')).default;
      await Income.findByIdAndUpdate(
        expense.incomeId,
        { $inc: { amount: expense.amount } }
      );

    }

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense', {
      message: sanitizeForLog(error instanceof Error ? error.message : 'Unknown error')
    });
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}