import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid expense IDs' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Expense.deleteMany({
      _id: { $in: ids },
      userId,
    });

    return NextResponse.json({
      message: `${result.deletedCount} expenses deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error bulk deleting expenses:', error);
    return NextResponse.json(
      { error: 'Failed to delete expenses' },
      { status: 500 }
    );
  }
}
