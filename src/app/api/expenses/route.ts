import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';
import User from '@/models/User';
import { sanitizeString, sanitizeNumber, isValidObjectId } from '@/lib/input-sanitizer';


export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const { amount, category, reason, date, type = 'free', budgetId, incomeId, isRecurring = false, frequency, affectsBalance = false } = body;
    
    // Sanitize inputs
    const sanitizedCategory = sanitizeString(category);
    const sanitizedReason = sanitizeString(reason);
    const sanitizedAmount = sanitizeNumber(amount);
    
    // Validate required fields
    if (!sanitizedAmount || !sanitizedCategory || !sanitizedReason) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    
    // Validate ObjectIds if provided
    if (budgetId && !isValidObjectId(budgetId)) {
      return NextResponse.json({ error: 'Invalid budget ID' }, { status: 400 });
    }
    if (incomeId && !isValidObjectId(incomeId)) {
      return NextResponse.json({ error: 'Invalid income ID' }, { status: 400 });
    }



    // Get user and check limits in parallel
    const [user, expenseCount] = await Promise.all([
      User.findOne({ clerkId: userId }),
      Expense.countDocuments({ userId })
    ]);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (expenseCount >= user.limits.maxExpenses) {
      return NextResponse.json({ 
        error: `Expense limit reached. Upgrade to add more than ${user.limits.maxExpenses} expenses.` 
      }, { status: 403 });
    }
    
    const expenseData = {
      userId,
      amount: sanitizedAmount,
      category: sanitizedCategory,
      reason: sanitizedReason,
      type,
      date: date ? new Date(date) : new Date(),
      isRecurring,
      affectsBalance,
      ...(frequency && { frequency }),
      ...(budgetId && { budgetId }),
      ...(affectsBalance && incomeId && { incomeId })
    };
    

    const expense = new Expense(expenseData);
    
    await expense.save();
    
    // If expense affects balance and has incomeId, reduce the income amount
    if (affectsBalance && incomeId) {
      const Income = (await import('@/models/Income')).default;
      await Income.findByIdAndUpdate(
        incomeId,
        { $inc: { amount: -sanitizedAmount } },
        { new: true }
      );
  
    }
    
    const savedExpense = await Expense.findById(expense._id).lean();
    
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
    const budgetId = searchParams.get('budgetId');
    const isRecurring = searchParams.get('isRecurring');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

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

    // Budget filter
    if (budgetId) {
      query.budgetId = budgetId;
    }

    // Recurring filter
    if (isRecurring !== null && isRecurring !== '') {
      query.isRecurring = isRecurring === 'true';
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
    
    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    let expenses;
    if (type === 'budget') {
      // For budget expenses, populate budget name
      expenses = await Expense.aggregate([
        { $match: query },
        {
          $addFields: {
            budgetObjectId: {
              $cond: {
                if: { $ne: ['$budgetId', null] },
                then: { $toObjectId: '$budgetId' },
                else: null
              }
            }
          }
        },
        {
          $lookup: {
            from: 'budgets',
            localField: 'budgetObjectId',
            foreignField: '_id',
            as: 'budget'
          }
        },
        {
          $addFields: {
            budgetName: { $arrayElemAt: ['$budget.name', 0] }
          }
        },
        { $unset: 'budgetObjectId' },
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limit }
      ]);
    } else {
      expenses = await Expense.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit);
    }

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