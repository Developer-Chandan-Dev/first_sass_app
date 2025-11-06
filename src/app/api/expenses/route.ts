import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Expense from '@/models/Expense';
import User from '@/models/User';
import Income from '@/models/Income';
import {
  sanitizeString,
  sanitizeCategoryName,
  isValidObjectId,
  sanitizeForLog,
} from '@/lib/input-sanitizer';
import {
  expenseValidationSchema,
  validateRequestBody,
} from '@/lib/security-validator';
import { ExpenseItem } from '@/types/dashboard';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          details: 'User authentication required',
        },
        { status: 401 }
      );
    }

    await connectDB();

    let body;
    try {
      body = await request.json();
      console.log('Body: ', body, 29);
    } catch {
      return NextResponse.json(
        {
          error: 'Invalid JSON data',
          code: 'INVALID_JSON',
          details: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    // Server-side validation with comprehensive security checks
    let validatedData;
    try {
      validatedData = validateRequestBody(expenseValidationSchema, body);
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details:
            error instanceof Error ? error.message : 'Invalid data format',
        },
        { status: 400 }
      );
    }

    const {
      amount,
      category,
      reason,
      date,
      type = 'free',
      budgetId,
      incomeId,
      isRecurring = false,
      frequency,
      affectsBalance = false,
    } = validatedData;

    // Validate ObjectIds if provided
    if (budgetId && !isValidObjectId(budgetId)) {
      return NextResponse.json(
        {
          error: 'Invalid budget ID',
          code: 'INVALID_BUDGET_ID',
          details: 'Budget ID must be a valid ObjectId',
        },
        { status: 400 }
      );
    }
    if (incomeId && !isValidObjectId(incomeId)) {
      return NextResponse.json(
        {
          error: 'Invalid income ID',
          code: 'INVALID_INCOME_ID',
          details: 'Income ID must be a valid ObjectId',
        },
        { status: 400 }
      );
    }

    // Get user and check limits in parallel
    const [user, expenseCount] = await Promise.all([
      User.findOne({ clerkId: userId }),
      Expense.countDocuments({ userId }),
    ]);

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          details: 'User account not found in database',
        },
        { status: 404 }
      );
    }

    if (expenseCount >= user.limits.maxExpenses) {
      return NextResponse.json(
        {
          error: `Expense limit reached. Upgrade to add more than ${user.limits.maxExpenses} expenses.`,
          code: 'EXPENSE_LIMIT_REACHED',
          details: {
            currentCount: expenseCount,
            maxAllowed: user.limits.maxExpenses,
            userPlan: user.plan,
          },
        },
        { status: 403 }
      );
    }

    const expenseData = {
      userId,
      amount,
      category,
      reason,
      type,
      date: date ? new Date(date) : new Date(),
      isRecurring,
      affectsBalance,
      ...(frequency && { frequency }),
      ...(budgetId && { budgetId }),
      ...(affectsBalance && incomeId && { incomeId }),
    };

    const expense = new Expense(expenseData);

    await expense.save();

    // If expense affects balance and has incomeId, reduce the income amount
    if (affectsBalance && incomeId) {
      await Income.findByIdAndUpdate(
        incomeId,
        { $inc: { amount: -amount } },
        { new: true }
      );
    }

    const savedExpense = await Expense.findById(expense._id).lean();

    // If this is a budget expense, log for debugging - sanitize log output
    if (type === 'budget' && budgetId) {
      console.log('Budget expense created', {
        amount,
        budgetId: sanitizeForLog(budgetId),
      });
    }

    return NextResponse.json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);

    // Handle specific MongoDB errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'Database validation failed',
          code: 'DB_VALIDATION_ERROR',
          details: sanitizeString(error.message),
        },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      (error.name === 'MongoError' || error.name === 'MongoServerError')
    ) {
      return NextResponse.json(
        {
          error: 'Database operation failed',
          code: 'DATABASE_ERROR',
          details: 'Please try again later',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create expense',
        code: 'INTERNAL_ERROR',
        details: 'An unexpected error occurred',
      },
      { status: 500 }
    );
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

    // Build query based on type
    const query: Record<string, unknown> = { userId };

    if (type === 'budget') {
      query.type = 'budget';
    } else if (type === 'free') {
      query.type = 'free';
    }
    // For 'all' type, don't add type filter

    // Search filter - sanitize search input to prevent XSS
    if (search) {
      const sanitizedSearch = sanitizeString(search);
      if (sanitizedSearch) {
        query.$or = [
          { reason: { $regex: sanitizedSearch, $options: 'i' } },
          { category: { $regex: sanitizedSearch, $options: 'i' } },
        ];
      }
    }

    // Category filter - sanitize category input
    if (category) {
      query.category = sanitizeCategoryName(category);
    }

    // Budget filter - validate ObjectId
    if (budgetId) {
      if (!isValidObjectId(budgetId)) {
        return NextResponse.json(
          { error: 'Invalid budget ID' },
          { status: 400 }
        );
      }
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
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
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
        $lte: new Date(endDate),
      };
    } else if (from || to) {
      const dateQuery: Record<string, Date> = {};
      if (from) dateQuery.$gte = new Date(from);
      if (to) dateQuery.$lte = new Date(to);
      query.date = dateQuery;
    }

    const skip = (page - 1) * limit;

    // Validate and build sort object
    const allowedSortFields = [
      'date',
      'amount',
      'category',
      'reason',
      'createdAt',
    ];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'date';
    const validSortOrder = sortOrder === 'asc' ? 1 : -1;

    const sortObj: Record<string, 1 | -1> = {};
    sortObj[validSortBy] = validSortOrder;

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
                else: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: 'budgets',
            localField: 'budgetObjectId',
            foreignField: '_id',
            as: 'budget',
          },
        },
        {
          $addFields: {
            budgetName: { $arrayElemAt: ['$budget.name', 0] },
          },
        },
        { $unset: 'budgetObjectId' },
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limit },
      ]);
    } else if (type === 'free') {
      // For free expenses, simple query
      expenses = await Expense.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit);
    } else {
      // For all expenses, populate budget name for those that have it
      expenses = await Expense.aggregate([
        { $match: query },
        {
          $addFields: {
            budgetObjectId: {
              $cond: {
                if: { $ne: ['$budgetId', null] },
                then: { $toObjectId: '$budgetId' },
                else: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: 'budgets',
            localField: 'budgetObjectId',
            foreignField: '_id',
            as: 'budget',
          },
        },
        {
          $addFields: {
            budgetName: { $arrayElemAt: ['$budget.name', 0] },
          },
        },
        { $unset: 'budgetObjectId' },
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limit },
      ]);
    }

    const totalCount = await Expense.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Sanitize response data
    const sanitizedExpenses = expenses.map((expense: ExpenseItem) => ({
      _id: expense._id,
      userId: expense.userId,
      amount: Number(expense.amount),
      category: sanitizeCategoryName(expense.category || ''),
      reason: sanitizeString(expense.reason || ''),
      type: expense.type,
      date: expense.date,
      isRecurring: expense.isRecurring,
      affectsBalance: expense.affectsBalance,
      frequency: expense.frequency,
      budgetId: expense.budgetId,
      incomeId: expense.incomeId,
      budgetName: expense.budgetName
        ? sanitizeString(expense.budgetName)
        : undefined,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }));

    return NextResponse.json({
      expenses: sanitizedExpenses,
      totalCount: Number(totalCount),
      totalPages: Number(totalPages),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}
