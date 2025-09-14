import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    
    const expense = new Expense({
      ...body,
      userId,
    });
    
    await expense.save();
    return NextResponse.json(expense);
  } catch {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    const query: { userId: string; date?: { $gte?: Date; $lte?: Date } } = { userId };
    
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);

    return NextResponse.json(expenses);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}