import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongoose';
import Income from '@/models/Income';
import { sanitizeString, sanitizeNumber } from '@/lib/input-sanitizer';

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
    const search = searchParams.get('search') || '';
    const period = searchParams.get('period') || 'all';
    const category = searchParams.get('category') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = { userId };

    // Search filter
    if (search) {
      query.$or = [
        { source: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
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
          query.date = {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          };
          break;
        case 'week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          query.date = { $gte: weekStart };
          break;
        case 'month':
          query.date = {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
            $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
          };
          break;
      }
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const [incomes, totalCount, totalIncome, monthlyIncome] = await Promise.all(
      [
        Income.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Income.countDocuments(query),
        Income.aggregate([
          { $match: { userId } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Income.aggregate([
          {
            $match: {
              userId,
              date: {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
              },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ]
    );

    // Sanitize user-generated content before sending response

    const sanitizedIncomes = incomes.map((income) => ({
      ...income,
      source: sanitizeString(income.source),
      description: sanitizeString(income.description),
      category: sanitizeString(income.category),
    }));

    return NextResponse.json({
      incomes: sanitizedIncomes,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalIncome: totalIncome[0]?.total || 0,
      monthlyIncome: monthlyIncome[0]?.total || 0,
    });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    const {
      amount,
      source,
      category,
      description,
      date,
      isRecurring,
      frequency,
      isConnected,
    } = body;

    // Sanitize inputs
    const sanitizedAmount = sanitizeNumber(amount);
    const sanitizedSource = sanitizeString(source);
    const sanitizedCategory = sanitizeString(category);
    const sanitizedDescription = sanitizeString(description);

    if (
      !sanitizedAmount ||
      !sanitizedSource ||
      !sanitizedCategory ||
      !sanitizedDescription
    ) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const incomeData = {
      userId,
      amount: sanitizedAmount,
      source: sanitizedSource,
      category: sanitizedCategory,
      description: sanitizedDescription,
      date: date ? new Date(date) : new Date(),
      isRecurring: Boolean(isRecurring),
      frequency: isRecurring ? frequency : undefined,
      isConnected: Boolean(isConnected),
    };

    const income = new Income(incomeData);
    const savedIncome = await income.save();

    return NextResponse.json(savedIncome, { status: 201 });
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
