import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Income from '@/models/Income';
import { sanitizeString, isValidObjectId } from '@/lib/input-sanitizer';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { incomes } = await request.json();

    if (!Array.isArray(incomes) || incomes.length === 0) {
      return NextResponse.json({ error: 'Invalid incomes data' }, { status: 400 });
    }

    // Validate and sanitize incomes
    const validIncomes = incomes
      .filter(inc => inc.amount && inc.source && inc.category && inc.description)
      .map(inc => ({
        userId,
        amount: Math.abs(parseFloat(inc.amount)),
        source: sanitizeString(inc.source),
        category: sanitizeString(inc.category),
        description: sanitizeString(inc.description),
        date: inc.date ? new Date(inc.date) : new Date(),
        isConnected: Boolean(inc.isConnected),
        isRecurring: Boolean(inc.isRecurring),
        frequency: inc.isRecurring ? inc.frequency : undefined
      }));

    if (validIncomes.length === 0) {
      return NextResponse.json({ error: 'No valid incomes to add' }, { status: 400 });
    }

    // Bulk insert
    const result = await Income.insertMany(validIncomes);

    return NextResponse.json({
      success: true,
      added: result.length,
      incomes: result
    });

  } catch (error) {
    console.error('Bulk income creation error:', error);
    return NextResponse.json({ error: 'Failed to create incomes' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { incomeIds } = await request.json();

    if (!Array.isArray(incomeIds) || incomeIds.length === 0) {
      return NextResponse.json({ error: 'Invalid income IDs' }, { status: 400 });
    }

    // Validate all income IDs
    const validIds = incomeIds.filter(id => isValidObjectId(id));
    if (validIds.length === 0) {
      return NextResponse.json({ error: 'No valid income IDs provided' }, { status: 400 });
    }

    // Delete incomes (only user's own incomes)
    const result = await Income.deleteMany({
      _id: { $in: validIds },
      userId
    });

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount
    });

  } catch (error) {
    console.error('Bulk income deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete incomes' }, { status: 500 });
  }
}