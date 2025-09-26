import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Income from '@/models/Income';

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
    await connectDB();

    const body = await request.json();

    const { amount, source, category, description, date, isRecurring, isConnected, frequency } = body;
    console.log("Updation data: ", body, 22);
    const income = await Income.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(source && { source }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(date && { date: new Date(date) }),
        ...(isRecurring !== undefined && { isRecurring: Boolean(isRecurring) }),
        ...(isConnected !== undefined && { isConnected: Boolean(isConnected) }),
        ...(frequency !== undefined && { frequency: isRecurring ? frequency : undefined }),
        updatedAt: new Date()
      },
      { new: true }
    );
    console.log("Updated Income: ", income, 38);

    if (!income) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }

    return NextResponse.json(income);
  } catch (error) {
    console.error('Error updating income:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    await connectDB();

    const income = await Income.findOneAndDelete({ _id: id, userId });

    if (!income) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}