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
    console.log('Received body:', body);
    
    const { amount, category, reason, date, type = 'free', budgetId } = body;
    console.log('Extracted data:', { amount, category, reason, type, budgetId });

    if (!amount || !category || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const expenseData = {
      userId,
      amount: parseFloat(amount),
      category,
      reason,
      type,
      date: date ? new Date(date) : new Date(),
      ...(budgetId && { budgetId })
    };
    
    console.log('Creating expense with data:', expenseData);
    const expense = new Expense(expenseData);
    
    await expense.save();
    const savedExpense = await Expense.findById(expense._id).lean();
    console.log('Saved expense:', savedExpense);
    
    // If this is a budget expense, log for debugging
    if (type === 'budget' && budgetId) {
      console.log(`Budget expense created: ${amount} for budget ${budgetId}`);
    }
    
    return NextResponse.json(savedExpense);
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'free';
    const category = searchParams.get('category') || '';
    const period = searchParams.get('period') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    await connectDB();

    // Build query
    const query: Record<string, unknown> = { userId, type };

    // Search filter
    if (search) {
      query.$or = [
        { reason: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Date filters
    const now = new Date();
    if (period !== 'all') {
      switch (period) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          query.date = { $gte: today };
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          query.date = { $gte: weekAgo };
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          query.date = { $gte: monthAgo };
          break;
      }
    }

    // Custom date range or chart date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (from || to) {
      const dateQuery: Record<string, Date> = {};
      if (from) dateQuery.$gte = new Date(from);
      if (to) dateQuery.$lte = new Date(to);
      query.date = dateQuery;
    }

    const skip = (page - 1) * limit;
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Expense.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      expenses,
      totalCount,
      totalPages,
      currentPage: page
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}