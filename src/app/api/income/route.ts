import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Income from '@/models/Income';
import { sanitizeString } from '@/lib/input-sanitizer';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const income = new Income({
      userId,
      amount: body.amount,
      source: sanitizeString(body.source || ''),
      description: sanitizeString(body.description || ''),
      isConnected: body.isConnected || false,
      isRecurring: body.isRecurring || false,
      frequency: body.frequency,
      date: new Date(body.date),
    });

    await income.save();
    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json({ error: 'Failed to create income' }, { status: 500 });
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const isConnected = searchParams.get('isConnected');

    const query: Record<string, unknown> = { userId };
    if (isConnected !== null) {
      query.isConnected = isConnected === 'true';
    }

    const incomes = await Income.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalCount = await Income.countDocuments(query);

    const sanitizedIncomes = incomes.map((income) => ({
      _id: income._id,
      userId: income.userId,
      amount: income.amount,
      source: sanitizeString(income.source || ''),
      description: sanitizeString(income.description || ''),
      category: sanitizeString(income.category || ''),
      isConnected: income.isConnected,
      isRecurring: income.isRecurring,
      frequency: income.frequency,
      date: income.date,
      createdAt: income.createdAt,
      updatedAt: income.updatedAt
    }));

    return NextResponse.json({
      incomes: sanitizedIncomes,
      totalCount: Number(totalCount),
      totalPages: Number(Math.ceil(totalCount / limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json({ error: 'Failed to fetch incomes' }, { status: 500 });
  }
}